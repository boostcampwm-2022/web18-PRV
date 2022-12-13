import styled from 'styled-components';

interface IProps {
  icon: JSX.Element;
  onClick?: React.MouseEventHandler;
  'aria-label': string;
}

const IconButton = ({ icon, onClick, ...rest }: IProps) => {
  return (
    <Button type="button" onClick={onClick} {...rest}>
      {icon}
    </Button>
  );
};

const Button = styled.button`
  background-color: transparent;
  cursor: pointer;
`;

export default IconButton;
