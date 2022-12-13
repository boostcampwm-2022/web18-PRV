import styled from 'styled-components';

interface IProps {
  icon: JSX.Element;
  onClick?: React.MouseEventHandler;
  onMouseDown?: React.MouseEventHandler;
  'aria-label': string;
}

const IconButton = ({ icon, ...rest }: IProps) => {
  return (
    <Button type="button" {...rest}>
      {icon}
    </Button>
  );
};

const Button = styled.button`
  background-color: transparent;
  cursor: pointer;
`;

export default IconButton;
