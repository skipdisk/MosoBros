import React, { useState } from 'react';
import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { imageUpload } from '../../store/actions/imgAction'
import ImageUploader from 'react-images-upload';


import Sketch from "react-p5";


import './image.css'


const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});




const ImageContainer = () => {
    const dispatch = useDispatch()
    const [pictures, setPictures] = useState([])

    const onDrop = (pictureFiles, pictureDataURLs) => {
        setPictures(pictures.concat(pictureFiles))
        console.log(pictures)
    }

    const uploadImages = () => {
        pictures.forEach((pic) => {
            dispatch(imageUpload(pic))
        })
    }

    return (
        <div >
            <ImageUploader
                withIcon={true}
                buttonText='Choose images'
                onChange={onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                withPreview={true}
            />
            <Button onClick={uploadImages}>Submit</Button>
        </div>
    )
}

export default ImageContainer

