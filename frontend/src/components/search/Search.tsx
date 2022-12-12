import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IPaperDetail } from '../../api/api';
import { PATH_SEARCH_LIST } from '../../constants/path';
import useDebounceValue from '../../hooks/useDebouncedValue';
import MaginifyingGlassIcon from '../../icons/MagnifyingGlassIcon';
import { useAutoCompleteQuery } from '../../queries/queries';
import { createDetailQuery } from '../../utils/createQueryString';
import { getDoiKey, isDoiFormat } from '../../utils/format';
import { getLocalStorage, setLocalStorage } from '../../utils/localStorage';
import IconButton from '../IconButton';
import MoonLoader from '../loader/MoonLoader';
import AutoCompletedList from './AutoCompletedList';
import RecentKeywordsList from './RecentKeywordsList';

enum DROPDOWN_TYPE {
  AUTO_COMPLETE = 'AUTO_COMPLETE',
  RECENT_KEYWORDS = 'RECENT_KEYWORDS',
  HIDDEN = 'HIDDEN',
  LOADING = 'LOADING',
}

interface SearchProps {
  initialKeyword?: string;
}

const Search = ({ initialKeyword = '' }: SearchProps) => {
  const [keyword, setKeyword] = useState<string>(initialKeyword);
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hoverdIndex, setHoveredIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedValue = useDebounceValue(keyword, 150);

  const { isLoading, data: autoCompletedItems } = useAutoCompleteQuery(debouncedValue, {
    enabled: !!(debouncedValue && debouncedValue.length >= 2 && isFocused),
  });

  const navigate = useNavigate();

  const dropdownType = useMemo<DROPDOWN_TYPE>(() => {
    // 포커스 되지 않거나 doi포맷으로 입력하는 경우에는 드랍다운을 숨긴다
    if (!isFocused || isDoiFormat(debouncedValue)) {
      return DROPDOWN_TYPE.HIDDEN;
    }
    if (isLoading) {
      return DROPDOWN_TYPE.LOADING;
    }
    if (debouncedValue.length >= 2) {
      return DROPDOWN_TYPE.AUTO_COMPLETE;
    }
    return DROPDOWN_TYPE.RECENT_KEYWORDS;
  }, [isFocused, isLoading, debouncedValue]);

  // keyword 검색
  const goToSearchList = useCallback(
    (keyword: string) => {
      const params = { keyword, page: '1', rows: '20' };
      navigate({
        pathname: PATH_SEARCH_LIST,
        search: createSearchParams(params).toString(),
      });
    },
    [navigate],
  );

  const getRecentKeywordsFromLocalStorage = useCallback(() => {
    const result = getLocalStorage('recentKeywords');
    if (!Array.isArray(result)) {
      return [];
    }
    return result;
  }, []);

  // 논문 상세정보 페이지로 이동
  const goToDetailPage = (doi: string, state?: { initialData: IPaperDetail }) => {
    navigate(createDetailQuery(doi), { state });
  };

  const handleInputChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setKeyword(target.value);
  };

  // localStorage에서 가져온 recent keywords를 최근에 검색한 순서대로 set
  const handleInputFocus = () => {
    const recentKeywords = getRecentKeywordsFromLocalStorage();
    setRecentKeywords(recentKeywords.reverse());
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  // localStorage에 최근 검색어를 중복없이 최대 5개까지 저장 후 search-list로 이동
  const handleSearchButtonClick = async (newKeyword: string) => {
    if (!newKeyword) return;
    setKeyword(newKeyword);
    const recentKeywords = getRecentKeywordsFromLocalStorage();
    const recentSet = new Set(recentKeywords);
    recentSet.delete(newKeyword);
    recentSet.add(newKeyword);
    setLocalStorage('recentKeywords', Array.from(recentSet).slice(-5));

    // DOI 형식의 input이 들어온 경우
    if (isDoiFormat(newKeyword)) {
      goToDetailPage(getDoiKey(newKeyword));
      return;
    }
    goToSearchList(newKeyword);
  };

  const handleEnterKeyDown = () => {
    if (!inputRef.current) return;
    inputRef?.current?.blur();
    // hover된 항목이 없는경우
    if (hoverdIndex < 0) {
      handleSearchButtonClick(keyword);
      return;
    }
    // hover된 항목으로 검색
    switch (dropdownType) {
      case DROPDOWN_TYPE.AUTO_COMPLETE:
        autoCompletedItems && goToDetailPage(autoCompletedItems?.[hoverdIndex].doi);
        break;
      case DROPDOWN_TYPE.RECENT_KEYWORDS:
        handleSearchButtonClick(recentKeywords[hoverdIndex]);
        break;
    }
  };

  // 방향키, enter키 입력 이벤트 핸들러
  const handleInputKeyDown = (e: KeyboardEvent) => {
    const length = dropdownType === DROPDOWN_TYPE.AUTO_COMPLETE ? autoCompletedItems?.length : recentKeywords.length;

    if (length === undefined) return;

    switch (e.code) {
      case 'ArrowDown':
        setHoveredIndex((prev) => (prev + 1) % length);
        break;
      case 'ArrowUp':
        setHoveredIndex((prev) => (prev - 1 < 0 ? length - 1 : (prev - 1) % length));
        break;
      case 'Enter':
        handleEnterKeyDown();
        break;
    }
  };

  const renderDropdownContent = (type: DROPDOWN_TYPE) => {
    return {
      [DROPDOWN_TYPE.AUTO_COMPLETE]: (
        <AutoCompletedList
          autoCompletedItems={autoCompletedItems}
          keyword={keyword}
          hoverdIndex={hoverdIndex}
          setHoveredIndex={setHoveredIndex}
          handleMouseDown={goToDetailPage}
        />
      ),
      [DROPDOWN_TYPE.RECENT_KEYWORDS]: (
        <RecentKeywordsList
          recentKeywords={recentKeywords}
          hoverdIndex={hoverdIndex}
          handleMouseDown={handleSearchButtonClick}
          setHoveredIndex={setHoveredIndex}
        />
      ),
      [DROPDOWN_TYPE.LOADING]: <MoonLoader />,
      [DROPDOWN_TYPE.HIDDEN]: <></>,
    }[type];
  };

  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  return (
    <Container>
      <SearchBox>
        <SearchBar>
          <SearchInput
            ref={inputRef}
            placeholder="저자, 제목, 키워드, DOI"
            value={keyword}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
          />
          <IconButton
            icon={<MaginifyingGlassIcon />}
            onClick={() => handleSearchButtonClick(keyword)}
            aria-label="검색"
          />
        </SearchBar>
        <DropdownContainer>{renderDropdownContent(dropdownType)}</DropdownContainer>
      </SearchBox>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  flex: 1;
  overflow-y: auto;
  z-index: 3;
  margin-bottom: 45px;
  padding-bottom: 15px;
`;

const SearchBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  max-height: 100%;
  background-color: ${({ theme }) => theme.COLOR.offWhite};
  border-radius: 25px;
  overflow-y: auto;
  margin: auto;
  -webkit-box-shadow: 0px 4px 11px -1px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 4px 11px -1px rgba(0, 0, 0, 0.15);
`;

const SearchBar = styled.div`
  width: 100%;
  height: 50px;
  min-height: 50px;
  padding: 0 16px;
  gap: 16px;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  background-color: transparent;
  text-align: center;
  ${({ theme }) => theme.TYPO.body1}
  ::placeholder {
    color: ${({ theme }) => theme.COLOR.gray2};
  }
`;

const DropdownContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${({ theme }) => theme.TYPO.body1}
  color: ${({ theme }) => theme.COLOR.gray2};
  padding-bottom: 25px;
  ::before {
    content: '';
    width: 90%;
    margin: 0 auto;
    border-top: 1px solid ${({ theme }) => theme.COLOR.gray1};
  }
  :empty {
    padding-bottom: 0;
    ::before {
      content: none;
    }
  }
`;

export default Search;
