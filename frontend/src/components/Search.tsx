import { isEmpty } from 'lodash-es';
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import SearchApi from '../api/searchApi';
import { TYPE_AUTO_COMPLETE_KEYWORDS, TYPE_RECENT_KEYWORDS } from '../constants/main';
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

  const handleInputChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setKeyword(target.value);
  };

  const getRecentKeywordsFromLocalStorage = useCallback(() => {
    const result = getLocalStorage('recentKeywords');
    if (!Array.isArray(result)) {
      return [];
    }
    return result;
  }, []);

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

  // localStorage에 최근 검색어를 중복없이 최대 5개까지 저장
  const handleSearchButtonClick = () => {
    if (!keyword) return;
    const recentKeywords = getRecentKeywordsFromLocalStorage();
    const recentSet = new Set(recentKeywords);
    recentSet.delete(keyword);
    recentSet.add(keyword);
    setLocalStorage('recentKeywords', Array.from(recentSet).slice(-5));
    // Todo : 검색 api 호출
    console.log('검색', keyword);
  };

  const handleEnterKeyPress = () => {
    if (hoverdIndex < 0) {
      handleSearchButtonClick();
      return;
    }
    switch (getDropdownType()) {
      case TYPE_AUTO_COMPLETE_KEYWORDS:
        // Todo : 상세정보 api 호출
        console.log('상세정보', autoCompletedDatas[hoverdIndex].doi);
        break;
      case TYPE_RECENT_KEYWORDS:
        // Todo : 검색 api 호출
        console.log('검색', recentKeywords[hoverdIndex]);
        break;
    }
  };

  // 방향키, enter 키 입력 이벤트 핸들러
  const handleInputKeyPress = (e: KeyboardEvent) => {
    const length =
      getDropdownType() === TYPE_AUTO_COMPLETE_KEYWORDS ? autoCompletedDatas.length : recentKeywords.length;
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
    if (keyword.length >= 2 && !isEmpty(autoCompletedDatas)) return TYPE_AUTO_COMPLETE_KEYWORDS;
    else return TYPE_RECENT_KEYWORDS;
  };

  const handleRecentKeywordMouseDown = (keyword: string) => {
    // Todo : 검색 api 호출
    console.log('검색', keyword);
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

  useEffect(() => {
    if (keyword.length < 2) return;
    const timer = setTimeout(() => {
      searchApi
        .getAutoComplete(keyword)
        .then(({ data }) => setAutoCompletedDatas(data))
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
          <SearchButton type="button" onClick={handleSearchButtonClick}>
            <MaginifyingGlassIcon />
          </SearchButton>
        </SearchBar>
        {isFocused && (
          <>
            <Hr />
            <DropdownContainer>
              {getDropdownType() === 'AUTO_COMPLETE_KEYWORDS' ? (
                <>
                  {autoCompletedDatas.map((data, i) => (
                    <AutoCompleted
                      key={i}
                      hovered={i === hoverdIndex}
                      onMouseOver={() => setHoveredIndex(i)}
                      onMouseDown={() => handleAutoCompletedDown(i)}
                    >
                      <Title>{highlightKeyword(data.title)}</Title>
                      {data.authors && (
                        <Author>
                          authors :{' '}
                          {data.authors.map((author, i) => (
                            <span key={i}>{highlightKeyword(author)}</span>
                          ))}
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
                        key={i}
                        hovered={i === hoverdIndex}
                        onMouseOver={() => setHoveredIndex(i)}
                        onMouseDown={() => handleRecentKeywordMouseDown(keyword)}
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
  color: ${({ theme }) => theme.COLOR.black};
  cursor: pointer;
  background-color: ${({ theme, hovered }) => (hovered ? theme.COLOR.gray1 : 'auto')};
`;

const Title = styled.div`
  ${({ theme }) => theme.TYPO.body1}
`;

const Author = styled.div`
  ${({ theme }) => theme.TYPO.caption}
  >span:not(:last-of-type)::after {
    content: ', ';
  }
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
`;

export default Search;
