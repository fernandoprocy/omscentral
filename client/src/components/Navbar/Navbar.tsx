import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { paths } from 'src/constants';
import useQueryParams from 'src/core/hooks/useQueryParams';
import { AuthContext } from '../Auth';
import { FirebaseContext } from '../Firebase';
import Grow from '../Grow';
import NavbarButton from './components/NavbarButton';
import SearchInput from './components/SearchInput';
import UserMenu from './components/UserMenu';
import { useStyles } from './Navbar.styles';

const Navbar: React.FC = () => {
  const classes = useStyles();
  const xs = useMediaQuery<Theme>((theme) => theme.breakpoints.down('xs'));
  const firebase = useContext(FirebaseContext);
  const auth = useContext(AuthContext);
  const history = useHistory();
  const params = useQueryParams<{ query: string }>();
  const [query, setQuery] = useState(params.query || '');

  React.useEffect(() => {
    setQuery(params.query || '');
  }, [params.query]);

  const handleLogoutClick = async () => {
    await firebase.auth.signOut();
    firebase.analytics.logEvent('logout');
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          {!xs && (
            <Typography variant="h6" className={classes.title}>
              OMSCentral
            </Typography>
          )}
          <NavbarButton path={paths.courses}>Courses</NavbarButton>
          <NavbarButton path={paths.reviews()}>Reviews</NavbarButton>
          {!xs && (
            <SearchInput
              value={query}
              onChange={setQuery}
              onSubmit={() => history.push(paths.reviews(query))}
            />
          )}
          <Grow />
          {auth.initializing ? null : auth.authenticated ? (
            <NavbarButton onClick={handleLogoutClick} path={paths.login}>
              {xs ? <LogoutIcon /> : 'Logout'}
            </NavbarButton>
          ) : (
            <NavbarButton path={paths.login}>Login</NavbarButton>
          )}
          {auth.initializing ? null : auth.authenticated && <UserMenu />}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
