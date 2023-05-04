import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  SearchbarHeader,
  SearchForm,
  SearchButton,
  SearchButtonLabel,
  SearchInput,
} from './Searchbar.styled';
import { AiOutlineSearch } from 'react-icons/ai';

export const Searchbar = ({ onSubmit }) => {
  const handleSubmit = ({ searchWord }, s) => {
    onSubmit(searchWord);
  };
  return (
    <SearchbarHeader>
      <Formik initialValues={{ searchWord: '' }} onSubmit={handleSubmit}>
        <SearchForm autoComplete="off">
          <SearchButton type="submit">
            <AiOutlineSearch
              className="img"
              style={{ width: '80%', height: 'auto' }}
            />
            <SearchButtonLabel>Search</SearchButtonLabel>
          </SearchButton>
          <SearchInput
            type="text"
            name="searchWord"
            placeholder="Search images and photos"
          />
        </SearchForm>
      </Formik>
    </SearchbarHeader>
  );
};

Searchbar.propTypes = { onSubmit: PropTypes.func.isRequired };
