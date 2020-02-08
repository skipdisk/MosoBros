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
    return new File([u8arr], 'newimage', { type: mime })
}


export const imageUpload = (image) => async dispatch => {

    // generate file from base64 string
    const file = dataURLtoFile(image)

    // put file into form data
    const data = new FormData()
    data.append('file', file, file.name)


    // now upload
    const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
    }
    const response = await axios.post('/api/image-upload', data, config)

    dispatch({
        type: 'UPLOAD_IMAGE',
        payload: response.data
    })
};
