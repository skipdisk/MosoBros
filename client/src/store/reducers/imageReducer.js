const initialState = {
    histograms: []
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPLOAD_IMAGE':
            console.log("image upload successful")
            console.log(action)
            return state
        case 'IMAGE_HISTOGRAM':
            console.log("histogram created")
            return {
                histograms: action.histograms
            };
        default:
            return state
    }
}



export default authReducer;