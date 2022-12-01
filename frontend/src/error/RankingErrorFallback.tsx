import styled from 'styled-components';

const RankingErrorFallback = () => {
  return <ErrorMessage>오류 발생으로 인기검색어 사용이 불가합니다.</ErrorMessage>;
};

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0px;
  padding: 5px 20px;
`;

export default RankingErrorFallback;
