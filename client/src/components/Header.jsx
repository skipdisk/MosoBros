import React , {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Payments from './Payments';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  navButton: {
    color: 'white',
    textDecoration: 'none',
    textTransform: 'none'
  },
  title: {
    flexGrow: 1,
  },
  brand: {
    textDecoration: 'none',
    color: 'white'
  }
}));

const Header = ({auth}) => {
  const classes = useStyles();

  const renderContent = () => {
    switch(auth) {
      case null:
        return;
      case false:
        return <Button><a className={classes.navButton} href="/auth/google">Login With Google</a></Button>
      default:
        return (
          <Fragment>
            <Payments/>
            <Typography>Credits: {auth.credits}</Typography>
            <Button><a className={classes.navButton} href="/api/logout">Logout</a></Button>
          </Fragment>
        )
    }
  }
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
              <Typography variant="h6" className={classes.title}>
                <Link to={auth ? '/dashboard' : '/'}className={classes.brand}>MosBros</Link>
              </Typography>
            {renderContent()}
        </Toolbar>
      </AppBar>
    </div>
  );
}

const mapStateToProps = ({auth}) => {
  console.log(auth)
  return {
    auth: auth
  };
}


export default connect(mapStateToProps)(Header);