import { useState } from 'react';
import styled from 'styled-components';
import IconButton from '../../../components/IconButton';
import InfoIcon from '../../../icons/InfoIcon';
import { getSessionStorage, setSessionStorage } from '../../../utils/sessionStorage';

interface InfoContainerProps {
  isOpened: boolean;
}

const InfoTooltip = () => {
  const [isOpened, setisOpened] = useState(getSessionStorage('isTooltipClosed') ? false : true);

  const handleInfoButtonClick = () => {
    setisOpened(true);
  };

  const handleCloseButtonClick = () => {
    const isTooltipClosed = getSessionStorage('isTooltipClosed');
    if (!isTooltipClosed) {
      setSessionStorage('isTooltipClosed', true);
    }
    setisOpened(false);
  };

  return (
    <Container>
      <IconButtonWrapper>
        <IconButton icon={<InfoIcon />} onClick={handleInfoButtonClick} aria-label="정보" />
      </IconButtonWrapper>
      <InfoContainer isOpened={isOpened}>
        <Title>그래프 사용법</Title>
        <InfoList>
          <li>• 그래프의 노드나 좌측의 레퍼런스 논문을 클릭하여 선택한 논문의 인용관계를 추가로 그릴 수 있습니다.</li>
          <li>• 마우스 휠을 이용해 그래프를 확대, 축소할 수 있습니다.</li>
          <li>• 마우스 드래그로 그래프의 위치를 옮길 수 있습니다.</li>
          <li>• 노드색이 불투명한 논문은 정보가 완전하지 않은 논문으로, 선택 및 추가 인터랙션이 불가능합니다.</li>
          <li>• 노드의 색상은 피인용수(citations)를 의미합니다. (오른쪽 아래 범례 참고)</li>
        </InfoList>
        <ButtonWrapper>
          <Button onClick={handleCloseButtonClick}>닫기</Button>
        </ButtonWrapper>
      </InfoContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
  align-items: flex-start;
  position: absolute;
  top: 20px;
  left: 320px;
`;

const IconButtonWrapper = styled.div`
  opacity: 0.3;
  :hover {
    opacity: 1;
  }
`;

const InfoContainer = styled.div<InfoContainerProps>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 400px;
  padding: 15px 15px 10px 20px;
  background-color: ${({ theme }) => theme.COLOR.gray1};
  border-radius: 10px;
  position: absolute;
  top: 0;
  left: 0;
  visibility: ${(props) => (props.isOpened ? 'visible' : 'hidden')};
`;

const Title = styled.h3`
  ${({ theme }) => theme.TYPO.body_h};
`;

const InfoList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;
  ${({ theme }) => theme.TYPO.body2};
  color: ${({ theme }) => theme.COLOR.primary4};
  line-height: 1rem;
  li {
    word-break: keep-all;
    text-align: justify;
    text-indent: -8px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  width: 80px;
  height: 30px;
  margin-top: 10px;
  ${({ theme }) => theme.TYPO.body2};
  color: ${({ theme }) => theme.COLOR.offWhite};
  background-color: ${({ theme }) => theme.COLOR.primary3};
  opacity: 0.9;
  border-radius: 3px;
  cursor: pointer;
  :hover {
    opacity: 1;
  }
`;

export default InfoTooltip;
