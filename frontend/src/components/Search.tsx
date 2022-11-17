import { isEmpty } from 'lodash-es';
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SearchApi from '../api/searchApi';
import { DROPDOWN_TYPE } from '../constants/main';
import { PATH_SEARCH_LIST } from '../constants/path';
import ClockIcon from '../icons/ClockIcon';
import MaginifyingGlassIcon from '../icons/MagnifyingGlassIcon';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';

interface IAutoCompletedData {
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
  }, []);

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
      case DROPDOWN_TYPE.AUTO_COMPLETE_KEYWORDS:
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
      getDropdownType() === DROPDOWN_TYPE.AUTO_COMPLETE_KEYWORDS ? autoCompletedDatas.length : recentKeywords.length;
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

  const handleAutoCompletedDown = (index: number) => {
    // Todo : 상세정보 api 호출
    console.log('상세정보', autoCompletedDatas[index].doi);
  };

  const getDropdownType = () => {
    if (keyword.length >= 2 && !isEmpty(autoCompletedDatas)) return DROPDOWN_TYPE.AUTO_COMPLETE_KEYWORDS;
    else return DROPDOWN_TYPE.RECENT_KEYWORDS;
  };

  // keyword 강조
  const highlightKeyword = (text: string) => {
    if (keyword !== '' && text.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())) {
      const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
      return (
        <>
          {parts.map((part, index) =>
            part.toLowerCase() === keyword.toLowerCase() ? <Emphasize key={index}>{part}</Emphasize> : part,
          )}
        </>
      );
    }
    return text;
  };

  // keyword와 매치되는 첫번째 author 찾기
  const findMatchedAuthor = (authors: string[]) => {
    return authors
      .concat()
      .filter((v, i, arr: string[]) => v.toLowerCase().includes(keyword.toLowerCase()) && arr.splice(i))[0];
  };

  useEffect(() => {
    if (keyword.length < 2) return;
    const timer = setTimeout(() => {
      searchApi
        .getAutoComplete({ keyword })
        .then(({ data }) => {
          const { papers, keyword: _keyword } = data;
          if (_keyword.trim() === keyword.trim()) setAutoCompletedDatas(papers);
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
    }, 500);
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
              {getDropdownType() === DROPDOWN_TYPE.AUTO_COMPLETE_KEYWORDS ? (
                <>
                  {autoCompletedDatas.map((data, i) => (
                    <AutoCompleted
                      key={data.doi}
                      hovered={i === hoverdIndex}
                      onMouseOver={() => setHoveredIndex(i)}
                      onMouseDown={() => handleAutoCompletedDown(i)}
                    >
                      <Title>{highlightKeyword(data.title)}</Title>
                      {data.authors && (
                        <Author>
                          authors :{' '}
                          {data.authors.every((author) => !author.toLowerCase().includes(keyword.toLowerCase()))
                            ? data.authors[0]
                            : highlightKeyword(findMatchedAuthor(data.authors))}
                          {data.authors.length > 1 && <span>외 {data.authors.length - 1}명</span>}
                        </Author>
                      )}
                    </AutoCompleted>
                  ))}
                </>
              ) : (
                <>
                  {!isEmpty(recentKeywords) ? (
                    recentKeywords.map((keyword, i) => (
                      <RecentKeyword
                        key={keyword}
                        hovered={i === hoverdIndex}
                        onMouseOver={() => setHoveredIndex(i)}
                        onMouseDown={() => handleSearchButtonClick(keyword)}
                      >
                        <ClockIcon />
                        {keyword}
                      </RecentKeyword>
                    ))
                  ) : (
                    <NoneRecentKeywords>최근 검색어가 없습니다.</NoneRecentKeywords>
                  )}
                </>
              )}
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

const AutoCompleted = styled.li<{ hovered: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px 30px;
  gap: 4px;
  color: ${({ theme }) => theme.COLOR.black};
  cursor: pointer;
  background-color: ${({ theme, hovered }) => (hovered ? theme.COLOR.gray1 : 'auto')};
`;

const Title = styled.div`
  ${({ theme }) => theme.TYPO.body1}
`;

const Author = styled.div`
  ${({ theme }) => theme.TYPO.caption}
  color: ${({ theme }) => theme.COLOR.gray3};
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

const RecentKeyword = styled.li<{ hovered: boolean }>`
  display: flex;
  gap: 20px;
  width: 100%;
  padding: 8px 16px;
  color: ${({ theme }) => theme.COLOR.black};
  cursor: pointer;
  background-color: ${({ theme, hovered }) => (hovered ? theme.COLOR.gray1 : 'auto')};
`;

const NoneRecentKeywords = styled.div`
  padding-top: 25px;
  text-align: center;
`;

const Emphasize = styled.span`
  color: #3244ff;
  font-weight: 700;
`;

export default Search;
