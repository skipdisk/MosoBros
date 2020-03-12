import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import { imageUpload, imageHistogram } from '../../store/actions/imgAction'
import ImageUploader from 'react-images-upload'
import * as api from '../../functions/api.js'
import Histogram from 'react-chart-histogram'
import { Row } from 'react-bootstrap'
import ImageGalleryContainer from '../image-gallery/ImageGalleryContainer'

import Sketch from 'react-p5'

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
})

const ImageContainer = histograms => {
  const dispatch = useDispatch()
  const [pictures, setPictures] = useState([])
  const [histogram, setHistogram] = useState([])
  const [blurringValues, setBlurringValues] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9])


  var bin = []
  var data = []
  var isGraph = false
  var options = {
    fillColor: '#FFFFFF',
    strokeColor: '#0000FF',
    fontSize: 'small'
  }
  const pictureRef = useRef(null)
  const [canvasSize, setCanvasSize] = useState([0, 0])

  useEffect(() => {
    console.log(histograms.histograms.length)
  })

  const changeCanvasSize = imageUrl => {
    var img = new Image()
    img.onload = function () {
      console.log(img.width + ' ' + img.height)
      setCanvasSize([img.height, img.width])
    }

    img.src = imageUrl
  }

  const onDrop = (pictureFiles, pictureDataURLs) => {
    changeCanvasSize(pictureDataURLs)
    setPictures(pictures.concat(pictureDataURLs))
    if (pictures.length > 1) {
      setPictures(pictures.pop())
    }
  }

  const getHistogram = async () => {
    const histogram = await dispatch(
      imageHistogram(pictureRef.current.toDataURL())
    )
    setHistogram(histogram)
  }

  const uploadImages = () => {
    dispatch(imageUpload(pictureRef.current.toDataURL()))
  }

  const drawGraph = () => {
    isGraph = true
    data = api.getData()
    bin = Array.from(Array(256).keys())
  }

  console.log(histogram)
  return (
    <div>
      <p>
        Standard Deviation: <span id='standardDeviation' />
      </p>
      <p>
        Mean: <span id='mean' />
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '1rem'
        }}
      >
        <canvas
          ref={pictureRef}
          className='canvas'
          height={canvasSize[0]}
          width={canvasSize[1]}
        ></canvas>
      </div>
      {pictures.length > 0 && Array.isArray(pictures) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {pictures.map((file, i) => (
              <li key={i}>
                <img
                  className='img'
                  height={canvasSize[0]}
                  width={canvasSize[1]}
                  key={i}
                  src={file}
                  onLoad={() => {
                    api.blobToCanvas(file)
                  }}
                  alt='preview'
                />
                <p>{file.name}</p>
              </li>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <input id='smoothbtn' value='Smooth' type='button' />
              <input id='grayscalebtn' value='Grayscale' type='button' />
              <input id='invertbtn' value='Invert' type='button' />
              <button id='blurringbtn' name='Blurring' value={blurringValues} type='button'>Blurring</button>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <p>Brightness</p>
              <p>Contrast</p>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <input
                type='range'
                id='brightnessRange'
                min='-100'
                max='100'
                step='1'
                value='0'
              />

              <input
                type='range'
                id='contrastRange'
                min='-100'
                max='100'
                step='1'
                value='0'
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <p>
                Value: <span id='brightnessOutput' />
              </p>
              <p>
                Value: <span id='contrastOutput' />
              </p>
            </div>
            <Button onClick={drawGraph}>Graph</Button>
          </ul>
        </div>
      )}
      {isGraph && (
        <div>
          <Histogram
            xLabels={bin}
            yValues={data}
            height='200'
            width='800'
            options={options}
          />
        </div>
      )}
      <Button onClick={uploadImages}>Submit</Button>
      <Button onClick={getHistogram}>Histogram</Button>
      <ImageUploader
        withIcon={true}
        buttonText='Choose images'
        onChange={onDrop}
        imgExtension={['.jpg', '.gif', '.png', '.gif', '.jpeg']}
        maxFileSize={5242880}
        singleImage={true}
      // withPreview={true}
      />
      <ImageGalleryContainer />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    histograms: state.img.histograms
  }
}

export default connect(mapStateToProps)(ImageContainer)
