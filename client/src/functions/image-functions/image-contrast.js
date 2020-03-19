export const imageContrast = (pictureRef, newValue) => {
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
    return myImageData
}

function truncateColor(value) {
    if (value < 0) {
        value = 0
    } else if (value > 255) {
        value = 255
    }

    return value
}