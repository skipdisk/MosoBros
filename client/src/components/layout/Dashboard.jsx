import React, { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ImageContainer from '../image-container/ImageContainer'
import Button from '@material-ui/core/Button'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { connect } from 'react-redux'
import 'font-awesome/css/font-awesome.min.css'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    textAlign: 'center'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  navButton: {
    textDecoration: 'none',
    textTransform: 'none',
    color: '#641eed'
  },
  buttonContainer: {
    position: 'absolute',
    right: 10,
    top: 10
  }
}))

const Dashboard = ({ auth }) => {
  const classes = useStyles()
  const renderContent = () => {
    switch (auth) {
      case null:
        return
      case false:
        return (
          <Button>
            <a className={classes.navButton} href='/auth/google'>
              SIGN IN <i class='fa fa-google fa-2x' aria-hidden='true'></i>
            </a>
          </Button>
        )
      default:
        return (
          <Fragment>
            <Button href='/api/logout'>
              <ExitToAppIcon style={{ color: '#641eed' }} />
            </Button>
          </Fragment>
        )
    }
  }
  return (
    <div className={classes.root}>
      <ImageContainer />
      <div className={classes.buttonContainer}>{renderContent()}</div>
    </div>
  )
}

const mapStateToProps = ({ auth }) => {
  return {
    auth: auth
  }
}

export default connect(mapStateToProps)(Dashboard)
