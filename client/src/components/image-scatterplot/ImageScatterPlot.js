import React, { useState } from "react";
import { Chart } from "react-charts";
import { Button } from "@material-ui/core";

const MyScatterChart = ({ imageData, canvas, image }) => {
  const [pieceMeanAndSd, setPieceMeanAndSd] = useState([]);
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
    var numColsToCut = 10;
    var numRowsToCut = 10;
    var widthOfOnePiece = canvas.width / numColsToCut;
    var heightOfOnePiece = canvas.height / numRowsToCut;
    for (var x = 0; x < numColsToCut; ++x) {
      for (var y = 0; y < numRowsToCut; ++y) {
        var piececanvas = document.createElement("canvas");
        var pieceData;
        piececanvas.width = widthOfOnePiece;
        piececanvas.height = heightOfOnePiece;
        var context = piececanvas.getContext("2d");
        context.drawImage(
          image,
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
        setPieceMeanAndSd(
          pieceMeanAndSd.push([getMean(pieceData.data), getSD(pieceData.data)])
        );
        imagePieces.push(canvas.toDataURL());
      }
    }
    var imagePiecesFiltered = imagePieces.filter(function(x) {
      return x !== undefined;
    });
  };

  const updateData = () => {
    cutImageUp();
    setScatterData([
      {
        label: "Blue",
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
