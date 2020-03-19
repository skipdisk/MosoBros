export const imageBrightness = (pictureRef, newValue, brightnessValue) => {
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
    return myImageData
}