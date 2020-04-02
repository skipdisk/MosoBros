const createHistograms = (imagePath) => {
    const Jimp = require("jimp");
    const imghist = require('./histogram.js');

    Jimp.read(imagePath, function (err, photo) {
        if (err) {
            console.error(err);
        } else {
            const histred = imghist.histogramRGB(imghist.colorChannels.Red, photo);
            saveHistogram(histred, "histred.svg")

            const histgreen = imghist.histogramRGB(imghist.colorChannels.Green, photo);
            saveHistogram(histgreen, "histgreen.svg");

            const histblue = imghist.histogramRGB(imghist.colorChannels.Blue, photo);
            saveHistogram(histblue, "histblue.svg");
        }
    });
}


function saveHistogram(histogramstring, filename) {
    const fs = require("fs");
    var open = require('open');


    fs.writeFile(filename, histogramstring, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log(filename + ' saved');
        }
    });

    open(`http://127.0.0.1:5000/${filename}`);

}

module.exports = {
    createHistograms
}