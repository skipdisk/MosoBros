class Piece {
  constructor(mn, std) {
    this.sd = std;
    this.mean = mn;
  }
}

var data;
var meanAndStdOfPieces = [];

const getData = () => {
  return data
}

function blobToCanvas (blob) {
  var newBlob = blob
  var stdDev = document.getElementById('standardDeviation')
  var mean = document.getElementById('mean')
  var canvas = document.getElementsByClassName('canvas')
  var img = document.getElementsByClassName('img')
  var oldBrightnessvalue = 0
  var oldContrastvalue = 0
  const image = new Image()
  for (var i = 0; i < canvas.length; i++) {
    var pctx = canvas[i];
    var ctx = pctx.getContext("2d");
    image.src = newBlob;
    image.onload = function() {
      ctx.drawImage(image, 0, 0, pctx.wiwdth, pctx.height);
      var imageData = ctx.getImageData(0, 0, pctx.width, pctx.height);
      data = imageData.data;
      // for (var i = 0; i < img.length; i++) {
      //   var imgclear = img[i];
      //   imgclear.style.display = "none";
      // }
      // console.log(data);

      function cutImageUp() {
        var imagePieces = [];
        var numColsToCut = 10;
        var numRowsToCut = 10;
        var widthOfOnePiece = pctx.width / numColsToCut;
        var heightOfOnePiece = pctx.height / numRowsToCut;
        for (var x = 0; x < numColsToCut; ++x) {
          for (var y = 0; y < numRowsToCut; ++y) {
            var canvas = document.createElement("canvas");
            var pieceData;
            canvas.width = widthOfOnePiece;
            canvas.height = heightOfOnePiece;
            var context = canvas.getContext("2d");
            context.drawImage(
              image,
              x * widthOfOnePiece,
              y * heightOfOnePiece,
              widthOfOnePiece,
              heightOfOnePiece,
              0,
              0,
              canvas.width,
              canvas.height
            );
            pieceData = context.getImageData(
              0,
              0,
              widthOfOnePiece,
              heightOfOnePiece
            );
            meanAndStdOfPieces.push(
              new Piece(getMean(pieceData.data), getSD(pieceData.data))
            );
            imagePieces.push(canvas.toDataURL());
          }
        }
        var imagePiecesFiltered = imagePieces.filter(function(x) {
          return x !== undefined;
        });
        return imagePiecesFiltered;
      }

      var getHistogram = () => {
        var histogram = document.createElement('Histogram')
        console.log(histogram)
        var bin = Array.from(Array(256).keys())
        histogram.yValues = data
        histogram.xLabels = bin
      }

      // Arithmetic mean
      let getMean = function(data) {
        return (
          data.reduce(function(a, b) {
            return Number(a) + Number(b);
          }) / data.length
        )
      }

      // Standard deviation
      let getSD = function(data) {
        let m = getMean(data);
        return Math.sqrt(
          data.reduce(function(sq, n) {
            return sq + Math.pow(n - m, 2);
          }, 0) /
            (data.length - 1)
        );
      };

      mean.innerHTML = getMean(data);
      stdDev.innerHTML = getSD(data);

      console.log(cutImageUp());

      //INVERT COLORS OF PICTURE
      var invert = function() {
        for (var i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i] // red
          data[i + 1] = 255 - data[i + 1] // green
          data[i + 2] = 255 - data[i + 2] // blue
        }
        ctx.putImageData(imageData, 0, 0)
      }

      //NORMALIZE IMAGE
      var normalize = function() {
        var imin = 255;
        var imax = 1;

        for (var i = 0; i < data.length; i++) {
          imin = Math.min(i, imin);
          imax = Math.max(i, imax);
        }

        for (var i = 0; i < data.length; i += 4) {
          var val = (data[i] + data[i + 1] + data[i + 2]) / 3;
          var ip = 255 * (val - imin) / (imax - imin);
          data[i] = (data[i] * ip) / (i || 1);
          data[i + 1] = (data[i + 1] * ip) / (i || 1);
          data[i + 2] = (data[i + 2] * ip) / (i || 1);
        }
        ctx.putImageData(imageData, 0, 0);
      };

      //GRAYSCALE COLORS OF PICTURE
      var grayscale = function() {
        for (var i = 0; i < data.length; i += 4) {
          var avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          data[i] = avg // red
          data[i + 1] = avg // green
          data[i + 2] = avg // blue
        }
        ctx.putImageData(imageData, 0, 0)
      }

      function blurringHelper (imageData, callback) {
        for (var i = 0; i < data.length; i += 4) {
          var r = data[i]
          var g = data[i + 1]
          var b = data[i + 2]
          var a = data[i + 3]

          var channels = callback(r, g, b, a, imageData.data, i)

          imageData.data[i] = channels.r
          imageData.data[i + 1] = channels.g
          imageData.data[i + 2] = channels.b
          imageData.data[i + 3] = channels.a
        }

        ctx.putImageData(imageData, 0, 0)
      }

      //Uses the gaussian blur on the pictures on a 3x3 area
      function blurring (e) {
        const inputEdgeArray = e.target.value.split(',')
        const w = pctx.width * 4
        // the offset index for each pixel excluding the center pixel
        const grid = [-w - 4, -w, -w + 4, -4, 4, w - 4, w, w + 4]

        blurringHelper(imageData, (r, g, b, a, dat, i) => {
          var idx, count
          r *= r
          g *= g
          b *= b
          count = 1
          for (idx = 0; idx < grid.length; idx++) {
            const off = grid[idx]
            if (i + off >= 0 && i + off < w * pctx.height) {
              r += dat[i + off] * dat[i + off] * 2
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
          };
        });

        return 'hahahaha'
      }

      //BRIGHTNESS OF PICTURE
      var applyBrightness = function(data, brightness) {
        for (var i = 0; i < data.length; i += 4) {
          if (
            !(data[i] >= 255) ||
            !(data[i] <= 0) ||
            !(data[i + 1] >= 255) ||
            !(data[i + 1] <= 0) ||
            !(data[i + 2] >= 255) ||
            !(data[i + 2] <= 0)
          ) {
            data[i] = data[i] += brightness;
            data[i + 1] = data[i + 1] += brightness;
            data[i + 2] = data[i + 2] += brightness;
          } else {
            console.log(data[i]);
            console.log(data[i + 1]);
            console.log(data[i + 2]);
          }
        }
      }

      //CONTRAST OF PICTURE
      function truncateColor (value) {
        if (value < 0) {
          value = 0
        } else if (value > 255) {
          value = 255
        }

        return value
      }
      var applyContrast = function(data, contrast) {
        var factor =
          (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));

        for (var i = 0; i < data.length; i += 4) {
          data[i] = truncateColor(factor * (data[i] - 128.0) + 128.0)
          data[i + 1] = truncateColor(factor * (data[i + 1] - 128.0) + 128.0)
          data[i + 2] = truncateColor(factor * (data[i + 2] - 128.0) + 128.0)
        }
        return
      }

      //DECREASE CONTRAST OF PICTURE
      var dcontrast = function() {
        var contrast = 10;
        contrast = contrast / 100 + 1;
        var intercept = 128 * (1 - contrast);
        for (var i = 0; i < data.length; i += 4) {
          data[i] = data[i] / contrast - intercept
          data[i + 1] = data[i + 1] / contrast - intercept
          data[i + 2] = data[i + 2] / contrast - intercept
        }
        ctx.putImageData(imageData, 0, 0)
      }

      //CONTRAST SLIDER
      var contrastSlider = document.getElementById("contrastRange");
      var contrastOutput = document.getElementById("contrastOutput");
      contrastOutput.innerHTML = contrastSlider.value;
      contrastSlider.addEventListener("input", function() {
        contrastSlider.value = this.value;
        oldContrastvalue =
          this.value > oldContrastvalue
            ? parseInt(this.value) - 1
            : parseInt(this.value) + 1;
        // console.log(oldContrastvalue);
        contrastOutput.innerHTML = this.value
        // ctx.drawImage(image, 0, 0, pctx.width, pctx.height);
        // imageData = ctx.getImageData(0, 0, pctx.width, pctx.height);
        applyContrast(
          imageData.data,
          parseInt(contrastSlider.value - oldContrastvalue, 10)
        )
        ctx.putImageData(imageData, 0, 0)
        data = imageData.data
      })

      //BRIGHTNESS SLIDER
      var brightnessSlider = document.getElementById("brightnessRange");
      var brightnessOutput = document.getElementById("brightnessOutput");
      brightnessOutput.innerHTML = brightnessSlider.value;
      brightnessSlider.addEventListener("input", function() {
        brightnessSlider.value = this.value;
        if (this.value > 0) {
          if (this.value > oldBrightnessvalue) {
            console.log("up");
            brightnessOutput.innerHTML = this.value;
            applyBrightness(imageData.data, this.value - oldBrightnessvalue);
            oldBrightnessvalue = this.value;
          } else if (this.value < oldBrightnessvalue) {
            console.log("down");
            brightnessOutput.innerHTML = this.value;
            applyBrightness(imageData.data, this.value - oldBrightnessvalue);
            oldBrightnessvalue = this.value;
          } else {
            console.log("yeet");
            oldBrightnessvalue = this.value;
          }
        } else {
          if (this.value < oldBrightnessvalue) {
            console.log("up");
            brightnessOutput.innerHTML = this.value;
            applyBrightness(imageData.data, this.value - oldBrightnessvalue);
            oldBrightnessvalue = this.value;
          } else if (this.value > oldBrightnessvalue) {
            console.log("down");
            brightnessOutput.innerHTML = this.value;
            applyBrightness(imageData.data, this.value - oldBrightnessvalue);
            oldBrightnessvalue = this.value;
          } else {
            console.log("yeet");
            oldBrightnessvalue = this.value;
          }
        }
        ctx.putImageData(imageData, 0, 0);
        data = imageData.data;
      });

      //INVERT AND GRASCALE BUTTONS
      var invertbtn = document.getElementById("invertbtn");
      invertbtn.addEventListener("click", invert);
      var grayscalebtn = document.getElementById("grayscalebtn");
      grayscalebtn.addEventListener("click", grayscale);
      var blurringbtn = document.getElementById("blurringbtn");
      blurringbtn.addEventListener("click", blurring);
      var normalizebtn = document.getElementById("normalizebtn");
      // normalizebtn.addEventListener("click", normalize);
    };
  }
}

export { blobToCanvas, getData };
