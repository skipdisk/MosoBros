import React, { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ImageContainer from '../image-container/ImageContainer'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Payments from '../payment/Payments'
import { connect } from 'react-redux'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    textAlign: 'center'
  },
  credits: {
    position: 'absolute',
    right: 10,
    bottom: 10
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  navButton: {
    textDecoration: 'none',
    textTransform: 'none'
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
              Login With Google
            </a>
          </Button>
        )
      default:
        return (
          <Fragment>
            <Button>
              <a className={classes.navButton} href='/api/logout'>
                Logout
              </a>
            </Button>
          </Fragment>
        )
    }
  }
  return (
    <div className={classes.root}>
      <ImageContainer />
      <div className={classes.credits}>
        <Payments />
        <Typography style={{ marginTop: '10px' }}>
          Credits: {auth.credits}
        </Typography>
      </div>
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
