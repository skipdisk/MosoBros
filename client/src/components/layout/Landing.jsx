import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      textAlign: 'center'
    }
}));

const Landing = () => {
    const classes = useStyles();
    return (
        <div className={classes.root} >
            <h1>
                MosBros
            </h1>
        </div>
    )
}

export default Landing
