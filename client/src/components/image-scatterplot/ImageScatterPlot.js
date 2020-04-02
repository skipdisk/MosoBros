import React, { useState } from "react";
import { Chart } from "react-charts";
import { Button } from "@material-ui/core";

const MyScatterChart = ({ canvas, gridsize }) => {
  var img = new Image();
  img.src = canvas.toDataURL();

  var pieceMeanAndSd = [];
  const [scatterData, setScatterData] = useState([
    {
      label: "Blue",
      data: [[0, 0]]
    }
  ]);

  // Arithmetic mean
  let getMean = function(data) {
    return (
      data.reduce(function(a, b) {
        return Number(a) + Number(b);
      }) / data.length
    );
  };

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

  const cutImageUp = () => {
    var imagePieces = [];
    var numColsToCut = gridsize;
    var numRowsToCut = gridsize;
    var widthOfOnePiece = canvas.width / numColsToCut;
    var heightOfOnePiece = canvas.height / numRowsToCut;

    pieceMeanAndSd.length = 0;
    for (var x = 0; x < widthOfOnePiece; ++x) {
      for (var y = 0; y < heightOfOnePiece; ++y) {
        var piececanvas = document.createElement("canvas");
        var pieceData;
        piececanvas.width = widthOfOnePiece;
        piececanvas.height = heightOfOnePiece;
        var context = piececanvas.getContext("2d");
        context.drawImage(
          img,
          x * widthOfOnePiece,
          y * heightOfOnePiece,
          widthOfOnePiece,
          heightOfOnePiece,
          0,
          0,
          piececanvas.width,
          piececanvas.height
        );
        pieceData = context.getImageData(
          0,
          0,
          widthOfOnePiece,
          heightOfOnePiece
        );
        pieceMeanAndSd.push([getMean(pieceData.data), getSD(pieceData.data)]);
        imagePieces.push(piececanvas.toDataURL());
      }
    }
    console.log(pieceMeanAndSd);
    console.log(imagePieces);
    var imagePiecesFiltered = imagePieces.filter(function(x) {
      return x !== undefined;
    });
  };

  const updateData = () => {
    cutImageUp();
    setScatterData([
      {
        label: "Mean/SD",
        data: [...pieceMeanAndSd]
      }
    ]);
  };

  const series = React.useMemo(
    () => ({
      type: "bubble",
      showPoints: true
    }),
    []
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: "linear", position: "bottom" },
      { type: "linear", position: "left" }
    ],
    []
  );

  return (
    <div
      style={{
        width: "75vw",
        height: "300px"
      }}
    >
      <Button onClick={updateData}>Cut Image Up</Button>
      <Chart
        data={scatterData}
        axes={axes}
        series={series}
        grouping="single"
        tooltip
      />
    </div>
  );
};

export default MyScatterChart;
