import React from 'react'
import { useDispatch } from 'react-redux'
import StripeCheckout from 'react-stripe-checkout'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import { handlePaymentToken } from '../../store/actions/authActions'

const useStyles = makeStyles(theme => ({
  navButton: {
    textDecoration: 'none',
    textTransform: 'none'
  },
  addButton: {
    margin: theme.spacing(3)
  }
}))

const Payments = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  return (
    <StripeCheckout
      name='MosBros'
      description='$5 for 5 images'
      amount={500}
      token={token => dispatch(handlePaymentToken(token))}
      stripeKey={process.env.REACT_APP_STRIPE_KEY}
    >
      <Fab
        classname={classes.addButton}
        size='small'
        color='secondary'
        aria-label='add'
        style={{ backgroundColor: '#641eed' }}
      >
        <AddIcon />
      </Fab>
    </StripeCheckout>
  )
}

export default Payments
