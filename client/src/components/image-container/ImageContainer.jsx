import React, { useState } from 'react';
import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { imageUpload } from '../../store/actions/imgAction'

import './image.css'

const icona = require("tui-image-editor/dist/svg/icon-a.svg");
const iconb = require("tui-image-editor/dist/svg/icon-b.svg");
const iconc = require("tui-image-editor/dist/svg/icon-c.svg");
const icond = require("tui-image-editor/dist/svg/icon-d.svg");

const download = require("downloadjs");

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

const myTheme = {
    "menu.backgroundColor": "white",
    "common.backgroundColor": "white",
    "downloadButton.backgroundColor": "white",
    "downloadButton.borderColor": "white",
    "downloadButton.color": "black",
    "menu.normalIcon.path": icond,
    "menu.activeIcon.path": iconb,
    "menu.disabledIcon.path": icona,
    "menu.hoverIcon.path": iconc,
};


const ImageContainer = () => {
    const [imageSrc, setImageSrc] = useState("");
    const imageEditor = React.createRef();
    const classes = useStyles();
    const dispatch = useDispatch();


    const downloadImage = () => {
        const imageEditorInst = imageEditor.current.imageEditorInst;
        const data = imageEditorInst.toDataURL();
        // if (data) {
        //     const mimeType = data.split(";")[0];
        //     const extension = data.split(";")[0].split("/")[1];
        //     download(data, `image.${extension}`, mimeType);
        // }
        dispatch(imageUpload(data))

    };

    return (
        <div className={classes.root}>
            <div className="center">
                <h1>Photo Editor</h1>
                <Button className='button' onClick={downloadImage}>Download Image</Button>
            </div>
            <ImageEditor
                includeUI={{
                    loadImage: {
                        path: imageSrc,
                        name: "image",
                    },
                    theme: myTheme,
                    // menu: ["crop", "flip", "rotate", "draw", "shape", "text", "filter"],
                    menu: ["filter"],
                    initMenu: "",
                    uiSize: {
                        height: `calc(100vh - 160px)`,
                    },
                    menuBarPosition: "bottom",
                }}
                cssMaxHeight={window.innerHeight}
                cssMaxWidth={window.innerWidth}
                selectionStyle={{
                    cornerSize: 20,
                    rotatingPointOffset: 70,
                }}
                usageStatistics={true}
                ref={imageEditor}
            />
        </div>
    )
}

export default ImageContainer

