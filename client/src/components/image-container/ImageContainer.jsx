import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import { imageUpload, imageHistogram } from '../../store/actions/imgAction'
import ImageUploader from 'react-images-upload'
import * as api from '../../functions/api.js'
import Histogram from 'react-chart-histogram'
import Slider from '@material-ui/core/Slider'

import ImageHistogram from '../image-histogram/ImageHistogram'
import Sketch from 'react-p5'

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
})

function usePrevious (value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const ImageContainer = histograms => {
  const dispatch = useDispatch()
  const [pictures, setPictures] = useState([])
  const [pixelData, setPixelData] = useState([])
  const [canvasSize, setCanvasSize] = useState([0, 0])
  const [brightnessValue, setBrightnessValue] = useState(50)
  const pictureRef = useRef(null)
  const prevBrightness = usePrevious(brightnessValue)

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

  const getHistogram = () => {
    // dispatch(imageHistogram(pictureRef.current.toDataURL()));
    console.log(pictureRef)
  }

  const uploadImages = () => {
    dispatch(imageUpload(pictureRef.current.toDataURL()))
  }

  function blurringHelper (imageData, callback) {
    const canvas = pictureRef.current
    const ctx = canvas.getContext('2d')
    let myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    for (var i = 0; i < myImageData.data.length; i += 4) {
      var r = myImageData.data[i]
      var g = myImageData.data[i + 1]
      var b = myImageData.data[i + 2]
      var a = myImageData.data[i + 3]

      var channels = callback(r, g, b, a, myImageData.data, i)

      myImageData.data[i] = channels.r
      myImageData.data[i + 1] = channels.g
      myImageData.data[i + 2] = channels.b
      myImageData.data[i + 3] = channels.a
      //
    }

    ctx.putImageData(myImageData, 0, 0)
  }

  //Uses the gaussian blur on the pictures on a 3x3 area
  function blurring () {
    const canvas = pictureRef.current
    const ctx = canvas.getContext('2d')
    let myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    const w = canvas.width * 4
    // the offset index for each pixel excluding the center pixel
    const grid = [-w - 4, -w, -w + 4, -4, 4, w - 4, w, w + 4]

    blurringHelper(myImageData, (r, g, b, a, dat, i) => {
      var idx, count
      r *= r
      g *= g
      b *= b
      count = 1
      for (idx = 0; idx < grid.length; idx++) {
        const off = grid[idx]
        if (i + off >= 0 && i + off < w * canvas.height) {
          r += dat[i + off] * dat[i + off]
          g += dat[i + 1 + off] * dat[i + 1 + off]
          b += dat[i + 2 + off] * dat[i + 2 + off]
          a += dat[i + 3 + off]
          count++
        }
      }
      r = Math.sqrt(r / count)
      g = Math.sqrt(g / count)
      b = Math.sqrt(b / count)
      a = a / count
      return {
        r,
        g,
        b,
        a
      }
    })
  }

  const invert = () => {
    const canvas = pictureRef.current
    const ctx = canvas.getContext('2d')
    let myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    for (var i = 0; i < myImageData.data.length; i += 4) {
      myImageData.data[i] = 255 - myImageData.data[i] // red
      myImageData.data[i + 1] = 255 - myImageData.data[i + 1] // green
      myImageData.data[i + 2] = 255 - myImageData.data[i + 2] // blue
    }
    setPixelData(myImageData.data)
    ctx.putImageData(myImageData, 0, 0)
  }

  const handleBrightnessChange = () => {
    const canvas = pictureRef.current
    const ctx = canvas.getContext('2d')
    let myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let brightnessToAdd = brightnessValue > prevBrightness ? 1 : -1

    for (var i = 0; i < myImageData.data.length; i += 4) {
      myImageData.data[i] += brightnessToAdd // red
      myImageData.data[i + 1] += brightnessToAdd // green
      myImageData.data[i + 2] += brightnessToAdd // blue
    }
    ctx.putImageData(myImageData, 0, 0)
    setBrightnessValue(brightnessValue + brightnessToAdd)
  }

  const greyscale = () => {
    const canvas = pictureRef.current
    const ctx = canvas.getContext('2d')
    let myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    for (var i = 0; i < myImageData.data.length; i += 4) {
      let avg =
        (myImageData.data[i] +
          myImageData.data[i + 1] +
          myImageData.data[i + 2]) /
        3
      myImageData.data[i] = avg // red
      myImageData.data[i + 1] = avg // green
      myImageData.data[i + 2] = avg // blue
    }
    setPixelData(myImageData.data)
    ctx.putImageData(myImageData, 0, 0)
  }

  const imageToCanvas = file => {
    const image = new Image()
    let newBlob = file
    image.src = newBlob
    const canvas = pictureRef.current
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    var myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    setPixelData(myImageData.data)
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <canvas ref={pictureRef} width={canvasSize[1]} height={canvasSize[0]} />
        {pictures.map((file, i) => (
          <div>
            <img
              className='img'
              height={canvasSize[0]}
              width={canvasSize[1]}
              key={i}
              src={file}
              onLoad={() => {
                imageToCanvas(file)
              }}
              alt='preview'
            />
            <p>{file.name}</p>
          </div>
        ))}
      </div>
      <Button onClick={uploadImages}>Submit</Button>
      <Button onClick={invert}>Invert</Button>
      <Button onClick={greyscale}>Grey Scale</Button>
      <Button onClick={blurring}>Blurring</Button>

      <Slider
        value={brightnessValue}
        onChange={handleBrightnessChange}
        min={0}
        step={1}
        max={100}
      />
      <ImageUploader
        withIcon={true}
        buttonText='Choose images'
        onChange={onDrop}
        imgExtension={['.jpg', '.gif', '.png', '.gif', '.jpeg']}
        maxFileSize={5242880}
        singleImage={true}
        // withPreview={true}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10vh'
        }}
      >
        <ImageHistogram imageData={pixelData} />
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    histograms: state.img.histograms
  }
}

export default connect(mapStateToProps)(ImageContainer)
