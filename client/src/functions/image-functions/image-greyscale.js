export const imageGreyscale = (pictureRef) => {
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
  return myImageData
}