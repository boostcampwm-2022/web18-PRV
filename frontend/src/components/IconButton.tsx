import styled from 'styled-components';

interface IProps {
  icon: JSX.Element;
  onClick?: React.MouseEventHandler;
  onMouseDown?: React.MouseEventHandler;
  type?: 'button' | 'submit' | 'reset' | undefined;
  'aria-label': string;
}

const IconButton = ({ icon, type = 'button', ...rest }: IProps) => {
  return (
    <Button type={type} {...rest}>
      {icon}
    </Button>
  );
};

const Button = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  cursor: pointer;
`;

export default IconButton;
