import axios from 'axios'
import FormData from 'form-data'


const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n) {
        u8arr[n] = bstr.charCodeAt(n)
        n -= 1 // to make eslint happy
    }
    return new File([u8arr], 'newimage', {
        type: mime
    })
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {
        type: mimeString
    });
}


export const imageUpload = (imgURL) => async dispatch => {

    // generate file from base64 string
    // const image = dataURLtoFile(img)
    var image = dataURItoBlob(imgURL);

    // put file into form data
    const data = new FormData(document.forms[0])
    data.append('file', image, image.name)


    // now upload
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    const response = await axios.post('/api/image-upload', data, config)

    dispatch({
        type: 'UPLOAD_IMAGE',
        payload: response.data
    })
};

export const imageHistogram = (imgURL) => async dispatch => {

    // generate file from base64 string
    // const image = dataURLtoFile(img)
    var image = dataURItoBlob(imgURL);

    const data = new FormData(document.forms[0])
    data.append('file', image, image.name)


    // const histograms = createHistograms('http://localhost:5000/services/uploads/test.png')


    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    const response = await axios.post('/api/histogram', data, config)

    // dispatch({
    //     type: 'IMAGE_HISTOGRAM',
    //     histograms: histograms
    // })

};


// const dataURLtoFile = (dataurl, filename) => {
//     const arr = dataurl.split(',')
//     const mime = arr[0].match(/:(.*?);/)[1]
//     const bstr = atob(arr[1])
//     let n = bstr.length
//     const u8arr = new Uint8Array(n)
//     while (n) {
//         u8arr[n] = bstr.charCodeAt(n)
//         n -= 1 // to make eslint happy
//     }
//     return new File([u8arr], 'newimage', { type: mime })
// }