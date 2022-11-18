import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SearchApi from '../api/searchApi';
import { DROPDOWN_TYPE } from '../constants/main';
import { PATH_SEARCH_LIST } from '../constants/path';
import MaginifyingGlassIcon from '../icons/MagnifyingGlassIcon';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';
import AutoCompletedList from './AutoCompletedList';
import MoonLoader from './MoonLoader';
import RecentKeywordsList from './RecentKeywordsList';

export interface IAutoCompletedData {
  authors?: string[];
  doi: string;
  title: string;
}

const searchApi = new SearchApi();

const Search = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hoverdIndex, setHoveredIndex] = useState<number>(-1);
  const [autoCompletedDatas, setAutoCompletedDatas] = useState<IAutoCompletedData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // keyword 검색
  const goToSearchList = useCallback(
    (keyword: string) => {
      const params = { keyword, page: '1', isDoiExist: 'false' };
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

  const handleInputChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setKeyword(target.value);
  };

  // localStorage에서 가져온 recent keywords를 최근에 검색한 순서대로 set
  const handleInputFocus = useCallback(() => {
    const recentKeywords = getRecentKeywordsFromLocalStorage();
    setRecentKeywords(recentKeywords.reverse());
    setIsFocused(true);
  }, [getRecentKeywordsFromLocalStorage]);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setHoveredIndex(-1);
  }, []);

  // localStorage에 최근 검색어를 중복없이 최대 5개까지 저장 후 search-list로 이동
  const handleSearchButtonClick = (keyword: string) => {
    if (!keyword) return;
    const recentKeywords = getRecentKeywordsFromLocalStorage();
    const recentSet = new Set(recentKeywords);
    recentSet.delete(keyword);
    recentSet.add(keyword);
    setLocalStorage('recentKeywords', Array.from(recentSet).slice(-5));
    goToSearchList(keyword);
  };

  const handleEnterKeyPress = () => {
    // hover된 항목이 없는경우
    if (hoverdIndex < 0) {
      handleSearchButtonClick(keyword);
      return;
    }
    // hover된 항목이 있는경우
    switch (getDropdownType()) {
      case DROPDOWN_TYPE.AUTO_COMPLETE:
        // Todo : 상세정보 api 호출
        console.log('상세정보', autoCompletedDatas[hoverdIndex].doi);
        break;
      case DROPDOWN_TYPE.RECENT_KEYWORDS:
        handleSearchButtonClick(recentKeywords[hoverdIndex]);
        break;
    }
  };

  // 방향키, enter키 입력 이벤트 핸들러
  const handleInputKeyPress = (e: KeyboardEvent) => {
    const length =
      getDropdownType() === DROPDOWN_TYPE.AUTO_COMPLETE ? autoCompletedDatas.length : recentKeywords.length;
    switch (e.code) {
      case 'ArrowDown':
        setHoveredIndex((prev) => (prev + 1) % length);
        break;
      case 'ArrowUp':
        setHoveredIndex((prev) => (prev - 1 < 0 ? length - 1 : (prev - 1) % length));
        break;
      case 'Enter':
        handleEnterKeyPress();
        break;
    }
  };

  const getDropdownType = () => {
    return keyword.length >= 2 ? DROPDOWN_TYPE.AUTO_COMPLETE : DROPDOWN_TYPE.RECENT_KEYWORDS;
  };

  useEffect(() => {
    if (keyword.length < 2) return;
    setIsLoading(true);
    const timer = setTimeout(() => {
      searchApi
        .getAutoComplete({ keyword })
        .then(({ data }) => {
          const { papers, keyword: _keyword } = data;
          if (_keyword.trim() === keyword.trim()) {
            setIsLoading(false);
            setAutoCompletedDatas(papers);
          }
        })
        .catch((err) => {
          switch (err.response.status) {
            case 400:
              console.debug('bad request');
              break;
            default:
              console.debug(err);
          }
        });
    }, 150);
    return () => {
      clearTimeout(timer);
    };
  }, [keyword]);

  return (
    <Container>
      <SearchBox isFocused={isFocused}>
        <SearchBar>
          <SearchInput
            placeholder="저자, 제목, 키워드"
            value={keyword}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyPress}
          />
          <SearchButton type="button" onClick={() => handleSearchButtonClick(keyword)}>
            <MaginifyingGlassIcon />
          </SearchButton>
        </SearchBar>
        {isFocused && (
          <>
            <Hr />
            <DropdownContainer>
              {getDropdownType() === DROPDOWN_TYPE.RECENT_KEYWORDS && (
                <RecentKeywordsList
                  recentKeywords={recentKeywords}
                  hoverdIndex={hoverdIndex}
                  handleMouseDwon={handleSearchButtonClick}
                  setHoveredIndex={setHoveredIndex}
                />
              )}
              {getDropdownType() === DROPDOWN_TYPE.AUTO_COMPLETE &&
                (isLoading ? (
                  <MoonLoader />
                ) : (
                  <AutoCompletedList
                    autoCompletedDatas={autoCompletedDatas}
                    keyword={keyword}
                    hoverdIndex={hoverdIndex}
                    setHoveredIndex={setHoveredIndex}
                  />
                ))}
            </DropdownContainer>
          </>
        )}
      </SearchBox>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  flex: 1;
  overflow-y: auto;
  z-index: 3;
  margin-top: 20px;
`;

const SearchBox = styled.div<{ isFocused: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  max-height: 100%;
  background-color: ${({ theme }) => theme.COLOR.offWhite};
  border-radius: 25px;
  padding-bottom: ${({ isFocused }) => (isFocused ? '25px' : 0)};
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

const Hr = styled.hr`
  margin: 0;
  width: 90%;
  border-top: 1px solid ${({ theme }) => theme.COLOR.gray1};
  border-bottom: none;
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

const SearchButton = styled.button`
  background-color: transparent;
  cursor: pointer;
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
`;

export default Search;
