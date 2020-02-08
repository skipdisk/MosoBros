import { combineReducers } from 'redux';
import authReducer from './authReducer';
import imgReducer from './imageReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    img: imgReducer
});

export default rootReducer