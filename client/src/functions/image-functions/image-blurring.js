function blurringHelper(canvas, callback) {
    const ctx = canvas.getContext('2d')
    let myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    for (var i = 0; i < myImageData.data.length; i += 4) {
        var r = myImageData.data[i]//red
        var g = myImageData.data[i + 1]//green
        var b = myImageData.data[i + 2]//blue
        var a = myImageData.data[i + 3]//alpha

        var channels = callback(r, g, b, a, myImageData.data, i)

        myImageData.data[i] = channels.r
        myImageData.data[i + 1] = channels.g
        myImageData.data[i + 2] = channels.b
        myImageData.data[i + 3] = channels.a

    }

    return myImageData
}

//Uses the gaussian blur on the pictures on a 3x3 area
export const imageBlurring = (pictureRef) => {
    const canvas = pictureRef.current
    const ctx = canvas.getContext('2d')
    let myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    const w = canvas.width * 4
    // the offset index for each pixel excluding the center pixel
    const grid = [-w - 4, -w, -w + 4, -4, 4, w - 4, w, w + 4]

    return blurringHelper(canvas, (r, g, b, a, dat, i) => {
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