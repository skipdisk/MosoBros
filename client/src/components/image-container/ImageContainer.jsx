import React, { useState, useRef, Fragment } from 'react';
import { connect } from 'react-redux';
import ImageUploader from 'react-images-upload';
import Typing from 'react-typing-animation';

//materialUI
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import UndoIcon from '@material-ui/icons/Replay';
import Typography from '@material-ui/core/Typography';
import Payments from '../payment/Payments';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';

//local
import logo from '../crown.png';
import ImageHistogram from '../image-histogram/ImageHistogram';
import ImageScatterPlot from '../image-scatterplot/ImageScatterPlot';
import { ImageContainerStyles } from './ImageContainerStyles';
import {
	imageBlurring,
	imageBrightness,
	imageContrast,
	imageGreyscale,
	imageInvert,
	imageNormalize,
	Sobel,
	getPixelData,
	imageQuantize
} from '../../functions/image-functions';

const ImageContainer = ({ auth }) => {
	const classes = ImageContainerStyles();
	const [pictures, setPictures] = useState([]);
	const [pixelData, setPixelData] = useState([]);
	const [pixelDataArray, setPixelDataArray] = useState([]);
	const [canvasSize, setCanvasSize] = useState([0, 0]);
	const [originalImage, setOriginalImage] = useState([]);
	const [originalCanvas, setOriginalCanvas] = useState([]);
	const [showBrightness, setShowBrightness] = useState(false);
	const [brightnessValue, setBrightnessValue] = useState(50);
	const [showContrast, setShowContrast] = useState(false);
	const [showPixelXY, setShowPixelXY] = useState(false);
	const [xValue, setXValue] = useState(0);
	const [yValue, setYValue] = useState(0);
	const [showGrid, setShowGrid] = useState(false);
	const [gridSize, setGridSize] = useState(10);
	const [contrastValue, setContrastValue] = useState(0);
	const [showHistogram, setShowHistoGram] = useState(false);
	const [showMSD, setShowMSD] = useState(false);
	const [showkMean, setShowkMean] = useState(false);
	const [kMeans, setKMeans] = useState(0);
	const pictureRef = useRef(null);
	const gridRef = useRef(null);

	const changeCanvasSize = imageUrl => {
		var img = new Image();
		img.onload = function() {
			console.log(img.width + ' ' + img.height);
			setCanvasSize([img.height, img.width]);
		};
		img.src = imageUrl;
	};

	const onDrop = (pictureFiles, pictureDataURLs) => {
		changeCanvasSize(pictureDataURLs);
		setPictures(pictures.concat(pictureDataURLs));
		if (pictures.length > 1) {
			setPictures(pictures.pop());
		}
	};

	const setImageData = myImageData => {
		const canvas = pictureRef.current;
		const ctx = canvas.getContext('2d');
		setPixelData(myImageData.data);
		setPixelDataArray([...pixelDataArray, myImageData]);
		ctx.putImageData(myImageData, 0, 0);
		setOriginalCanvas(canvas);
	};

	const blurring = () => {
		const myImageData = imageBlurring(pictureRef);
		setImageData(myImageData);
	};

	const invert = () => {
		const myImageData = imageInvert(pictureRef);
		setImageData(myImageData);
	};

	const handleBrightnessChange = (event, newValue) => {
		const myImageData = imageBrightness(pictureRef, newValue, brightnessValue);
		setImageData(myImageData);
		setBrightnessValue(newValue);
	};

	const handleContrastChange = (event, newValue) => {
		const myImageData = imageContrast(pictureRef, newValue);
		setImageData(myImageData);
		setContrastValue(newValue);
	};

	const greyscale = () => {
		const myImageData = imageGreyscale(pictureRef);
		setImageData(myImageData);
	};

	const edgeDetection = () => {
		const myImageData = Sobel(pictureRef);
		setImageData(myImageData);
	};

	const normalize = () => {
		const myImageData = imageNormalize(pictureRef);
		setImageData(myImageData);
	};

	const KMQuantize = kValue => {
		setKMeans(kValue);
		const myImageData = imageQuantize(pictureRef, kValue);
		// console.log(myImageData);
		setImageData(myImageData);
	};
	const pixelDataXY = (pictureRef, xValue, yValue) => {
		getPixelData(pictureRef, xValue, yValue);
	};

	const changeXValue = (event, newValue) => {
		setXValue(newValue);
	};

	const changeYValue = (event, newValue) => {
		setYValue(newValue);
	};

	// const imageToCanvas = file => {
	// 	const image = new Image();
	// 	let newBlob = file;
	// 	image.src = newBlob;
	// 	const canvas = pictureRef.current;
	// 	const ctx = canvas.getContext('2d');
	// 	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	// 	var myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	// };

	const imageToCanvas = file => {
		const image = new Image();
		let newBlob = file;
		image.src = newBlob;
		const canvas = pictureRef.current;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
		var myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		setOriginalImage(image);
		setOriginalCanvas(canvas);
		setPixelData(myImageData.data);
		setPixelDataArray([myImageData]);
	};

	const gridToCanvas = (event, newValue) => {
		const gridCanvas = gridRef.current;
		const gridCtx = gridCanvas.getContext('2d');
		gridCtx.clearRect(0, 0, canvasSize[1], canvasSize[0]);
		gridCtx.beginPath();
		for (var x = 0; x <= canvasSize[1]; x += newValue) {
			gridCtx.moveTo(0.2 + x + 0, 0);
			gridCtx.lineTo(0.2 + x + 0, canvasSize[0] + 0);
		}

		for (var x = 0; x <= canvasSize[0]; x += newValue) {
			gridCtx.moveTo(0, 0.2 + x + 0);
			gridCtx.lineTo(canvasSize[1] + 0, 0.2 + x + 0);
		}
		gridCtx.strokeStyle = 'black';
		gridCtx.stroke();
		setGridSize(newValue);
	};

	const undo = () => {
		const canvas = pictureRef.current;
		const ctx = canvas.getContext('2d');
		//replaces pixel array to the previous iteration with the latest changes popped
		let newPixelArray = pixelDataArray.length > 1 ? pixelDataArray.slice(0, -1) : pixelDataArray;
		setPixelDataArray(newPixelArray);
		setPixelData(newPixelArray[newPixelArray.length - 1].data);
		ctx.putImageData(newPixelArray[newPixelArray.length - 1], 0, 0);
	};

	// const uploadImages = () => {
	//   dispatch(imageUpload(pictureRef.current.toDataURL()))
	// }

	return (
		<div>
			<Grid className={classes.pictureContainer} container justify="space-between" alignItems="center" xs={12}>
				{pictures.length ? (
					<Fragment>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="flex-start"
							xs={2}
							style={{ background: '#000000' }}
						>
							<Drawer
								className={classes.drawer}
								variant="permanent"
								classes={{
									paper: classes.drawerPaper
								}}
								anchor="left"
							>
								<Grid container direction="column" justify="center" alignItems="center">
									<img src={logo} className={classes.logo} alt="fireeee" />
								</Grid>
								<Grid container direction="row" justify="center" alignItems="center">
									<span className={classes.firstTitle2}>Moso</span>
									<span className={classes.secondTitle2}>BROS</span>
								</Grid>
								<Button className={classes.menuButton} onClick={invert}>
									Invert
								</Button>
								<Button className={classes.menuButton} onClick={greyscale}>
									Grey Scale
								</Button>
								<Button className={classes.menuButton} onClick={blurring}>
									Blurring
								</Button>
								<Button className={classes.menuButton} onClick={edgeDetection}>
									Edge Detection
								</Button>
								<Button className={classes.menuButton} onClick={normalize}>
									Normalize
								</Button>
								<Button className={classes.menuButton} onClick={() => setShowBrightness(!showBrightness)}>
									Brightness
								</Button>
								<Button className={classes.menuButton} onClick={() => setShowkMean(!showkMean)}>
									KM-Quantize
								</Button>
								{showkMean ? (
									<Fragment>
										<Select style={{ margin: '0px 40px' }} value={kMeans} onChange={e => KMQuantize(e.target.value)}>
											{[2, 3, 4, 5, 6, 7, 8, 9].map(k => {
												return <MenuItem value={k}>{k}</MenuItem>;
											})}
										</Select>
										<FormHelperText style={{ textAlign: 'center' }}>k-means</FormHelperText>
									</Fragment>
								) : null}
								{showBrightness ? (
									<Slider
										value={brightnessValue}
										onChangeCommitted={handleBrightnessChange}
										min={0}
										step={1}
										max={100}
									/>
								) : null}
								<Button className={classes.menuButton} onClick={() => setShowContrast(!showContrast)}>
									Contrast
								</Button>
								{showContrast ? (
									<Slider value={contrastValue} onChangeCommitted={handleContrastChange} min={-50} step={1} max={50} />
								) : null}
								<Button
									className={classes.menuButton}
									onClick={() => {
										setShowGrid(!showGrid);
									}}
								>
									Grid
								</Button>
								{showGrid ? (
									<Grid container direction="column" justify="center" alignItems="center">
										<Slider
											value={gridSize}
											valueLabelDisplay={'auto'}
											onChange={gridToCanvas}
											min={2}
											step={2}
											max={canvasSize[1] / 2}
										/>
									</Grid>
								) : null}
								<Button className={classes.menuButton} onClick={() => setShowPixelXY(!showPixelXY)}>
									Pixel Data
								</Button>
								{showPixelXY ? (
									<Grid container direction="column" justify="center" alignItems="center">
										<Slider
											value={xValue}
											valueLabelDisplay={'auto'}
											onChange={changeXValue}
											min={0}
											step={1}
											max={canvasSize[1]}
										/>
										<div>X-Value</div>
										<Slider
											value={yValue}
											valueLabelDisplay={'auto'}
											onChange={changeYValue}
											min={0}
											step={1}
											max={canvasSize[0]}
										/>
										<div>Y-Value</div>
										<Button onClick={pixelDataXY(pictureRef, xValue, yValue)} />
									</Grid>
								) : null}
								<Button className={classes.menuButton} onClick={() => setShowHistoGram(!showHistogram)}>
									Histogram
								</Button>
								<Button className={classes.menuButton} onClick={() => setShowMSD(!showMSD)}>
									Mean & SD
								</Button>
								<div className={classes.credits}>
									<Payments />
									<Typography style={{ marginTop: '10px' }}>Credits: {auth.credits}</Typography>
								</div>
							</Drawer>
						</Grid>
						<Grid xs={10} container direction="column" justify="center" alignItems="center">
							<Grid xs={12}>
								{pictures.map((file, i) => (
									<Fragment>
										<img
											className="img"
											height={canvasSize[0]}
											width={canvasSize[1]}
											key={i}
											src={file}
											onLoad={() => {
												imageToCanvas(file);
											}}
											alt="preview"
										/>
									</Fragment>
								))}
							</Grid>
							<Grid xs={12}>
								<Button>
									<UndoIcon onClick={undo} className={classes.undoIcon} fontSize="large" />
								</Button>
							</Grid>
							<Grid xs={12}>
								<div position={'relative'} width={canvasSize[1]} height={canvasSize[0]}>
									<canvas
										ref={pictureRef}
										left={0}
										top={0}
										position={'absolute'}
										width={canvasSize[1]}
										height={canvasSize[0]}
									/>
									{showGrid ? (
										<div left={0} top={0} position={'absolute'} width={canvasSize[1]} height={canvasSize[0]}>
											<canvas ref={gridRef} opacity={0.5} width={canvasSize[1]} height={canvasSize[0]} />
										</div>
									) : null}
								</div>
							</Grid>
							{showHistogram ? (
								<Grid className={classes.histogram} xs={12}>
									<ImageHistogram imageData={pixelData} />
								</Grid>
							) : null}
							{showMSD ? (
								<Grid className={classes.histogram} xs={12}>
									<ImageScatterPlot canvas={originalCanvas} gridsize={gridSize} />
								</Grid>
							) : null}
						</Grid>
					</Fragment>
				) : (
					<Grid container spacing={1} justify="center" alignItems="center">
						<Grid container direction="row" justify="center" alignItems="center">
							<img src={logo} alt="fireeee" />
							<span className={classes.firstTitle}>Moso</span>
							<span className={classes.secondTitle}>BROS</span>
						</Grid>
						<Typing speed={100} loop={true}>
							<span className={classes.typingText}>Select an image to start editing!</span>
							<Typing.Delay ms={2000} />
							<Typing.Reset count={1} delay={1000} />
						</Typing>
						<ImageUploader
							className={classes.imageUploader}
							withIcon={true}
							buttonText="Choose images"
							onChange={onDrop}
							imgExtension={['.jpg', '.gif', '.png', '.gif', '.jpeg']}
							maxFileSize={5242880}
							singleImage={true}
							// withPreview={true}
						/>
					</Grid>
				)}
			</Grid>
		</div>
	);
};

const mapStateToProps = ({ auth }) => {
	return {
		auth: auth
	};
};

export default connect(mapStateToProps)(ImageContainer);
