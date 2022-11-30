import styled from 'styled-components';

interface IProps {
  icon: JSX.Element;
  onClick: React.MouseEventHandler;
}

const IconButton = ({ icon, onClick }: IProps) => {
  return (
    <Button type="button" onClick={onClick}>
      {icon}
    </Button>
  );
};

const Button = styled.button`
  background-color: transparent;
  cursor: pointer;
`;

export default IconButton;
