export const imageNormalize = pictureRef => {
  const canvas = pictureRef.current;
  const ctx = canvas.getContext("2d");
  let imageDataData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let imageData = imageDataData.data;

  var minRed = 255;
  var minGreen = 255;
  var minBlue = 255;
  var minAlpha = 255;

  var maxRed = 0;
  var maxGreen = 0;
  var maxBlue = 0;
  var maxAlpha = 0;

  for (var i = 0; i < imageData.length; i += 4) {
    const redPixel = imageData[i]; // red
    const greenPixel = imageData[i + 1]; // green
    const bluePixel = imageData[i + 2]; // blue
    const alpha = imageData[i + 3]; //alpha

    //Set Min
    if (minRed > redPixel) {
      minRed = redPixel;
    }
    if (minGreen > greenPixel) {
      minGreen = greenPixel;
    }
    if (minBlue > bluePixel) {
      minBlue = bluePixel;
    }
    if (minAlpha > alpha) {
      minAlpha = alpha;
    }

    //Set Max
    if (maxRed < redPixel) {
      maxRed = redPixel;
    }
    if (maxGreen < greenPixel) {
      maxGreen = greenPixel;
    }
    if (maxBlue < bluePixel) {
      maxBlue = bluePixel;
    }
    if (maxAlpha < alpha) {
      maxAlpha = alpha;
    }
  }

  for (var idx = 0; idx < imageData.length; idx += 4) {
    const redPixelForNorm = imageData[idx]; // red
    const greenPixelForNorm = imageData[idx + 1]; // green
    const bluePixelForNorm = imageData[idx + 2]; // blue

    if (
      maxRed > minRed &&
      redPixelForNorm >= minRed &&
      redPixelForNorm <= maxRed
    ) {
      imageData[idx] = Math.floor(
        ((redPixelForNorm - minRed) / (maxRed - minRed)) * 255
      );
    }

    if (
      maxGreen > minGreen &&
      greenPixelForNorm >= minGreen &&
      greenPixelForNorm <= maxGreen
    ) {
      imageData[idx + 1] = Math.floor(
        ((greenPixelForNorm - minGreen) / (maxGreen - minGreen)) * 255
      );
    }

    if (
      maxBlue > minBlue &&
      bluePixelForNorm >= minBlue &&
      bluePixelForNorm <= maxBlue
    ) {
      imageData[idx + 2] = Math.floor(
        ((bluePixelForNorm - minBlue) / (maxBlue - minBlue)) * 255
      );
    }
  }

  return imageDataData;
};

export default imageNormalize;
