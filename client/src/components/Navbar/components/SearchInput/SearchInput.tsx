import React, { useContext } from 'react';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

import { FirebaseContext } from 'src/components/Firebase';
import { useStyles } from './SearchInput.styles';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

const SearchInput: React.FC<Props> = ({ value, onChange, onSubmit }) => {
  const classes = useStyles();
  const firebase = useContext(FirebaseContext);

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            firebase.analytics.logEvent('search', { search_term: value });
            onSubmit(value);
          }
        }}
      />
    </div>
  );
};

export default SearchInput;