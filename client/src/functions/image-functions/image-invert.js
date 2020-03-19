export const imageInvert = (pictureRef) => {
    const canvas = pictureRef.current
    const ctx = canvas.getContext('2d')
    let myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    for (var i = 0; i < myImageData.data.length; i += 4) {
        myImageData.data[i] = 255 - myImageData.data[i] // red
        myImageData.data[i + 1] = 255 - myImageData.data[i + 1] // green
        myImageData.data[i + 2] = 255 - myImageData.data[i + 2] // blue
    }

    return myImageData
}