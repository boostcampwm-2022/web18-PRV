import { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react';
import styled from 'styled-components';
import Clockicon from '../icons/ClockIcon';
import MaginifyingGlassIcon from '../icons/MagnifyingGlassIcon';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';

const PrvSearch = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hoverdIndex, setHoveredIndex] = useState<number>(-1);

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
  };

  const handleEnterKeyPress = () => {
    if (hoverdIndex < 0) {
      handleSearchButtonClick();
      return;
    }
    setHoveredIndex((prev) => {
      setKeyword(recentKeywords[prev]);
      return -1;
    });
  };

  // 방향키, enter 키 입력 이벤트 핸들러
  const handleInputKeyPress = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowDown':
        setHoveredIndex((prev) => (prev + 1) % recentKeywords.length);
        break;
      case 'ArrowUp':
        setHoveredIndex((prev) => (prev - 1 < 0 ? recentKeywords.length - 1 : (prev - 1) % recentKeywords.length));
        break;
      case 'Enter':
        handleEnterKeyPress();
        break;
    }
  };

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
            {keyword ? null : (
              <RecentKeywords>
                {recentKeywords.length > 0 ? (
                  recentKeywords.map((keyword, i) => (
                    <RecentKeyword
                      key={i}
                      hovered={i === hoverdIndex}
                      onMouseOver={() => setHoveredIndex(i)}
                      onMouseDown={() => setKeyword(keyword)}
                    >
                      <Clockicon />
                      {keyword}
                    </RecentKeyword>
                  ))
                ) : (
                  <NoneRecentKeywords>최근 검색어가 없습니다.</NoneRecentKeywords>
                )}
              </RecentKeywords>
            )}
          </>
        )}
      </SearchBox>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const SearchBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  transform: translate(-50%);
  width: 500px;
  background-color: ${({ theme }) => theme.COLOR.offWhite};
  border-radius: 25px;
  margin-top: 20px;
`;

const SearchBar = styled.div`
  width: 100%;
  height: 50px;
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

const RecentKeywords = styled.div`
  width: 100%;
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
