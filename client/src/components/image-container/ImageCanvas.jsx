import React, {useRef} from 'react'
import { imageUpload, imageHistogram } from "../../store/actions/imgAction";

function ImageCanvas() {
    const pictureRef = useRef(null);
    

    const getHistogram = () => {
        dispatch(imageHistogram(pictureRef.current.toDataURL()));
        console.log(histograms);
      };
    
      const uploadImages = () => {
        dispatch(imageUpload(pictureRef.current.toDataURL()));
      };
    
    return (
        <div>
            <canvas
            ref={pictureRef}
            className="canvas"
            height={canvasSize[0]}
            width={canvasSize[1]}
        ></canvas>
        </div>
    )
}

export default ImageCanvas
