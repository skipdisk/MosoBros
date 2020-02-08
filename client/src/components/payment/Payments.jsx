import React from 'react';
import { useDispatch } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { handlePaymentToken } from "../../store/actions/authActions";

const useStyles = makeStyles(theme => ({
  navButton: {
    color: 'white',
    textDecoration: 'none',
    textTransform: 'none'
  },
}));

const Payments = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <StripeCheckout
      name="MosBros"
      description="$5 for 5 images"
      amount={500}
      token={token => dispatch(handlePaymentToken(token))}
      stripeKey={process.env.REACT_APP_STRIPE_KEY}
    >
      <Button className={classes.navButton}>Add Credits</Button>
    </StripeCheckout>
  )
}

export default Payments


