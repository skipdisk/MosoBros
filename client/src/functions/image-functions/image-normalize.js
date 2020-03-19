export const imageNormalize = pictureRef => {
  const canvas = pictureRef.current;
  const ctx = canvas.getContext("2d");
  let myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let mean = getMean(myImageData.data);
  let sd = getSD(myImageData.data);

  console.log(myImageData.data.length);

  for (var i = 0; i < myImageData.data.length; i += 4) {
    let sum =
      myImageData.data[i] + myImageData.data[i + 1] + myImageData.data[i + 2];

    myImageData.data[i] = (myImageData.data[i] / sum) * 255;
    myImageData.data[i + 1] = (myImageData.data[i + 1] / sum) * 255;
    myImageData.data[i + 2] = (myImageData.data[i + 2] / sum) * 255;
  }
  return myImageData;
};

// Arithmetic mean
function getMean(data) {
  return (
    data.reduce(function(a, b) {
      return Number(a) + Number(b);
    }) / data.length
  );
}

// Standard deviation
function getSD(data) {
  let m = getMean(data);
  return Math.sqrt(
    data.reduce(function(sq, n) {
      return sq + Math.pow(n - m, 2);
    }, 0) /
      (data.length - 1)
  );
}

export default imageNormalize;
