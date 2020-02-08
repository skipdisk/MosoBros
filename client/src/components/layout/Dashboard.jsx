import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageContainer from '../image-container/ImageContainer';



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
            <ImageContainer />
        </div>
    )
}


export default Dashboard
