export const getPixelData = (pictureRef, x, y) => {
  const canvas = pictureRef.current;
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  var xCoord = x;
  var yCoord = y;
  var canvasWidth = canvas.width;

  function getColorIndicesForCoord(x, y, width) {
    var red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }

  var colorIndices = getColorIndicesForCoord(xCoord, yCoord, canvasWidth);

  var redIndex = colorIndices[0];
  var greenIndex = colorIndices[1];
  var blueIndex = colorIndices[2];
  var alphaIndex = colorIndices[3];

  var redForCoord = imageData.data[redIndex];
  var greenForCoord = imageData.data[greenIndex];
  var blueForCoord = imageData.data[blueIndex];
  var alphaForCoord = imageData.data[alphaIndex];

  console.log("Red: " + redForCoord);
  console.log("Green: " + greenForCoord);
  console.log("Blue: " + blueForCoord);
  console.log("Aplha: " + alphaForCoord);
};
