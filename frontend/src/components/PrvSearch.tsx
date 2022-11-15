import { isEmpty } from 'lodash-es';
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Clockicon from '../icons/ClockIcon';
import MaginifyingGlassIcon from '../icons/MagnifyingGlassIcon';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';

interface Author {
  family: string;
  given: string;
}
interface AutoCompletedPaperInfo {
  author?: Author;
  doi: string;
  title: string;
}

interface AutoCompletedData {
  author: AutoCompletedPaperInfo[];
  title: AutoCompletedPaperInfo[];
}

const PrvSearch = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hoverdIndex, setHoveredIndex] = useState<number>(-1);
  const [autoCompletedDatas, setAutoCompletedDatas] = useState<AutoCompletedData>({ author: [], title: [] });

  const handleInputChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setKeyword(target.value);
  };

  const getRecentKeywordsFromLocalStorage = useCallback(() => {
    let result = getLocalStorage('recentKeywords');
    if (!Array.isArray(result)) {
      result = [];
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
    console.log(keyword);
  };

  const handleEnterKeyPress = () => {
    if (hoverdIndex < 0) {
      handleSearchButtonClick();
      return;
    }
    switch (getDropdownType()) {
      case 'AUTO_COMPLETE_KEYWORDS':
        // Todo : 상세정보 api 호출
        console.log('상세정보', [...autoCompletedDatas.author, ...autoCompletedDatas.title][hoverdIndex].doi);
        break;
      case 'RECENT_KEYWORDS':
        // Todo : 검색 api 호출
        console.log('검색', recentKeywords[hoverdIndex]);
        break;
    }
  };

  // 방향키, enter 키 입력 이벤트 핸들러
  const handleInputKeyPress = (e: KeyboardEvent) => {
    const length =
      getDropdownType() === 'AUTO_COMPLETE_KEYWORDS'
        ? autoCompletedDatas.author.length + autoCompletedDatas.title.length
        : recentKeywords.length;
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
    console.log('상세정보', [...autoCompletedDatas.author, ...autoCompletedDatas.title][index].doi);
  };

  const getDropdownType = () => {
    if (keyword.length >= 2 && !isEmpty(autoCompletedDatas)) return 'AUTO_COMPLETE_KEYWORDS';
    else return 'RECENT_KEYWORDS';
  };

  const handleRecentKeywordMouseDown = (keyword: string) => {
    // Todo : 검색 api 호출
    console.log('검색', keyword);
  };

  useEffect(() => {
    if (keyword.length < 2) return;
    fetch('mock/autoCompleted.json')
      .then((data) => data.json())
      .then(setAutoCompletedDatas);
  }, [keyword]);

  return (
    <Container>
      <SearchBox>
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
                  <SectionLabel>제목</SectionLabel>
                  {autoCompletedDatas.title.map((data, i) => (
                    <AutoCompleted
                      key={i}
                      hovered={i === hoverdIndex}
                      onMouseOver={() => setHoveredIndex(i)}
                      onMouseDown={() => handleAutoCompletedDown(i)}
                    >
                      <Title>{data.title}</Title>
                      {data.author && (
                        <Author>
                          author : {data.author.given} {data.author.family}
                        </Author>
                      )}
                    </AutoCompleted>
                  ))}
                  <SectionLabel>저자</SectionLabel>
                  {autoCompletedDatas.author.map((data, i) => (
                    <AutoCompleted
                      key={autoCompletedDatas.title.length + i}
                      hovered={autoCompletedDatas.title.length + i === hoverdIndex}
                      onMouseOver={() => setHoveredIndex(autoCompletedDatas.title.length + i)}
                      onMouseDown={() => handleAutoCompletedDown(autoCompletedDatas.title.length + i)}
                    >
                      <Title>{data.title}</Title>
                      {data.author && (
                        <Author>
                          author : {data.author.given} {data.author.family}
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
                        <Clockicon />
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

const SearchBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  max-height: 100%;
  background-color: ${({ theme }) => theme.COLOR.offWhite};
  border-radius: 25px;
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
  :last-of-type {
    border-radius: 0 0 25px 25px;
  }
`;

const SectionLabel = styled.h3`
  ${({ theme }) => theme.TYPO.body_h}
  color: ${({ theme }) => theme.COLOR.black};
`;

const Title = styled.div`
  ${({ theme }) => theme.TYPO.body2}
`;

const Author = styled.div`
  ${({ theme }) => theme.TYPO.caption}
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
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
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
  :last-of-type {
    border-radius: 0 0 25px 25px;
  }
`;

const NoneRecentKeywords = styled.div`
  padding: 25px 0;
  text-align: center;
`;

export default PrvSearch;
