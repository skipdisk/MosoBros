import React from 'react'
import { makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      textAlign: 'center'
    }
}));

const Dashboard = props => {
    const classes = useStyles();
    return (
        <div className={classes.root} >
            <h1>This is the Dashboard</h1>
        </div>
    )
}


export default Dashboard
