const createHistograms = (imagePath) => {
    const Jimp = require("jimp");
    const imghist = require('./histogram.js');
    const testArray = []

    Jimp.read(imagePath, function (err, photo) {
        if (err) {
            console.error(err);
        } else {
            const histred = imghist.histogramRGB(imghist.colorChannels.Red, photo);
            // saveHistogram(histred, "histred.svg");
            testArray.push(histred.toString())

            const histgreen = imghist.histogramRGB(imghist.colorChannels.Green, photo);
            // saveHistogram(histgreen, "histgreen.svg");

            let histblue = imghist.histogramRGB(imghist.colorChannels.Blue, photo);
            // saveHistogram(histblue, "histblue.svg");
            // console.log('hi', testArray)
        }
    });
    return testArray
}


function saveHistogram(histogramstring, filename) {
    const fs = require("fs");

    fs.writeFile(filename, histogramstring, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log(filename + ' saved');
        }
    });
}

module.exports = {
    createHistograms
}