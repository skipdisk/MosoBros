import React, { useState, useRef, useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { imageUpload, imageHistogram } from '../../store/actions/imgAction'
import ImageUploader from 'react-images-upload'
import * as api from '../../functions/api.js'
import Slider from '@material-ui/core/Slider'
import Grid from '@material-ui/core/Grid'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow'
import Header from '../layout/Header'
import ImageHistogram from '../image-histogram/ImageHistogram'
import ImageScatterPlot from '../image-scatterplot/ImageScatterPlot'
import UndoIcon from '@material-ui/icons/Replay'

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  pictureContainer: {
    marginTop: '1rem'
  },
  histogram: {
    margin: '2rem'
  },
  sidebar: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    height: '100%'
  },
  drawer: {
    width: 150,
    flexGrow: 1
    // flexShrink: 0
  },
  drawerPaper: {
    width: 150
  },
  arrowIcon: {
    margin: 20
  },
  undoIcon: {
    color: 'red',
    margin: 20
  }
})

const ImageContainer = histograms => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [pictures, setPictures] = useState([])
  const [pixelData, setPixelData] = useState([])
  const [pixelDataArray, setPixelDataArray] = useState([])
  const [canvasSize, setCanvasSize] = useState([0, 0])
  const [originalImage, setOriginalImage] = useState([])
  const [originalCanvas, setOriginalCanvas] = useState([])
  const [showBrightness, setShowBrightness] = useState(false)
  const [brightnessValue, setBrightnessValue] = useState(50)
  const [showContrast, setShowContrast] = useState(false)
  const [contrastValue, setContrastValue] = useState(0)
  const [showHistogram, setShowHistoGram] = useState(false)
  const [showMSD, setShowMSD] = useState(false)
  const pictureRef = useRef(null)

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

    setPixelData(myImageData.data)
    setPixelDataArray([...pixelDataArray, myImageData])
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
    setPixelDataArray([...pixelDataArray, myImageData])
    ctx.putImageData(myImageData, 0, 0)
  }

  const handleBrightnessChange = (event, newValue) => {
    const canvas = pictureRef.current
    const ctx = canvas.getContext('2d')
    let myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    // let brightnessToAdd = brightnessValue > newValue ? -1 : 1
    let brightnessToAdd = newValue - brightnessValue

    for (var i = 0; i < myImageData.data.length; i += 4) {
      myImageData.data[i] += brightnessToAdd // red
      myImageData.data[i + 1] += brightnessToAdd // green
      myImageData.data[i + 2] += brightnessToAdd // blue
    }

    setPixelData(myImageData.data)
    ctx.putImageData(myImageData, 0, 0)
    setBrightnessValue(newValue)
  }

  function truncateColor (value) {
    if (value < 0) {
      value = 0
    } else if (value > 255) {
      value = 255
    }

    return value
  }
  const handleContrastChange = (event, newValue) => {
    const canvas = pictureRef.current
    const ctx = canvas.getContext('2d')
    let myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    var factor = (259.0 * (newValue + 255.0)) / (255.0 * (259.0 - newValue))

    for (var i = 0; i < myImageData.data.length; i += 4) {
      myImageData.data[i] = truncateColor(
        factor * (myImageData.data[i] - 128.0) + 128.0
      )
      myImageData.data[i + 1] = truncateColor(
        factor * (myImageData.data[i + 1] - 128.0) + 128.0
      )
      myImageData.data[i + 2] = truncateColor(
        factor * (myImageData.data[i + 2] - 128.0) + 128.0
      )
    }
    setPixelData(myImageData.data)
    setPixelDataArray([...pixelDataArray, myImageData])
    ctx.putImageData(myImageData, 0, 0)
    setContrastValue(newValue)
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
    setPixelDataArray([...pixelDataArray, myImageData])
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

    setOriginalImage(image)
    setOriginalCanvas(canvas)
    setPixelData(myImageData.data)
    setPixelDataArray([myImageData])
  }

  const undo = () => {
    const canvas = pictureRef.current
    const ctx = canvas.getContext('2d')
    //replaces pixel array to the previous iteration with the latest changes popped
    let newPixelArray =
      pixelDataArray.length > 1 ? pixelDataArray.slice(0, -1) : pixelDataArray
    setPixelDataArray(newPixelArray)
    setPixelData(newPixelArray[newPixelArray.length - 1].data)
    ctx.putImageData(newPixelArray[newPixelArray.length - 1], 0, 0)
  }

  return (
    <div>
      {pictures.length ? <Header /> : null}
      <Grid
        className={classes.pictureContainer}
        container
        justify='space-between'
        alignItems='center'
      >
        {pictures.length ? (
          <Fragment>
            <Grid
              container
              direction='column'
              justify='flex-start'
              alignItems='flex-start'
              xs={2}
            >
              <Drawer
                className={classes.drawer}
                variant='permanent'
                classes={{
                  paper: classes.drawerPaper
                }}
                anchor='left'
              >
                <Button onClick={invert}>Invert</Button>
                <Button onClick={greyscale}>Grey Scale</Button>
                <Button onClick={blurring}>Blurring</Button>
                <Button onClick={() => setShowBrightness(!showBrightness)}>
                  Brightness
                </Button>
                {showBrightness ? (
                  <Slider
                    value={brightnessValue}
                    onChangeCommitted={handleBrightnessChange}
                    min={0}
                    step={1}
                    max={100}
                  />
                ) : null}
                <Button onClick={() => setShowContrast(!showContrast)}>
                  Contrast
                </Button>
                {showContrast ? (
                  <Slider
                    value={contrastValue}
                    onChangeCommitted={handleContrastChange}
                    min={-50}
                    step={1}
                    max={50}
                  />
                ) : null}{' '}
                <Button onClick={() => setShowHistoGram(!showHistogram)}>
                  Histogram
                </Button>
                <Button onClick={() => setShowMSD(!showMSD)}>Mean & SD</Button>
              </Drawer>
            </Grid>
            <Grid xs={10} container justify='center' alignItems='center'>
              <Grid xs={5}>
                {pictures.map((file, i) => (
                  <Fragment>
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
                  </Fragment>
                ))}
              </Grid>
              <Grid
                container
                direction='column'
                justify='center'
                alignItems='center'
                xs={2}
              >
                <UndoIcon
                  onClick={undo}
                  className={classes.undoIcon}
                  fontSize='large'
                />
                <DoubleArrowIcon
                  className={classes.arrowIcon}
                  fontSize='large'
                />
              </Grid>
              <Grid xs={5}>
                <canvas
                  ref={pictureRef}
                  width={canvasSize[1]}
                  height={canvasSize[0]}
                />
              </Grid>
              {showHistogram ? (
                <Grid className={classes.histogram} xs={12}>
                  <ImageHistogram imageData={pixelData} />
                </Grid>
              ) : null}
              {showMSD ? (
                <Grid className={classes.histogram} xs={12}>
                  <ImageScatterPlot
                    imageData={pixelData}
                    canvas={originalCanvas}
                    image={originalImage}
                  />
                </Grid>
              ) : null}
            </Grid>
          </Fragment>
        ) : (
          <ImageUploader
            withIcon={true}
            buttonText='Choose images'
            onChange={onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif', '.jpeg']}
            maxFileSize={5242880}
            singleImage={true}
            // withPreview={true}
          />
        )}
      </Grid>
    </div>
  )
}

export default connect(null)(ImageContainer)
