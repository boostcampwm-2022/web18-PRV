import styled from 'styled-components';

const ReferenceGragh = () => {
  return <Container></Container>;
};

const Container = styled.div`
  flex-grow: 1;
  background-color: ${({ theme }) => theme.COLOR.primary4};
`;

export default ReferenceGragh;
