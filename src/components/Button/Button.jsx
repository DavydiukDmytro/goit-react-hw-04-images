import PropTypes from 'prop-types';
import { Btn } from './Button.styled';

export const Button = ({ onClickLoad }) => {
  return (
    <Btn onClick={onClickLoad} type="button">
      Load more
    </Btn>
  );
};

Button.propTypes = {
  onClickLoad: PropTypes.func,
};
