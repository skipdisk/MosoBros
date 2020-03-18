import React, { useState } from 'react'
import { Chart } from 'react-charts'
import { Button } from '@material-ui/core'

const MyChart = ({ imageData }) => {
  const [histogramData, setHistogramData] = useState([
    {
      label: 'Blue',
      data: [{ x: 1, y: 10 }]
    },
    {
      label: 'Red',
      data: [{ x: 1, y: 10 }]
    },
    {
      label: 'Green',
      data: [{ x: 1, y: 10 }]
    }
  ])

  const updateData = () => {
    const redData = {}
    const greenData = {}
    const blueData = {}
    for (var i = 0; i < imageData.length; i += 4) {
      const redPixel = imageData[i] // red
      const greenPixel = imageData[i + 1] // green
      const bluePixel = imageData[i + 2] // blue
      redData[redPixel] = redData[redPixel] + 1 || 1
      greenData[greenPixel] = greenData[greenPixel] + 1 || 1
      blueData[bluePixel] = blueData[bluePixel] + 1 || 1
    }

    const redHistogram = Object.entries(redData).map(r => {
      return {
        x: r[0],
        y: r[1]
      }
    })
    const greenHistogram = Object.entries(greenData).map(r => {
      return {
        x: r[0],
        y: r[1]
      }
    })
    const blueHistogram = Object.entries(blueData).map(r => {
      return {
        x: r[0],
        y: r[1]
      }
    })

    setHistogramData([
      {
        label: 'Blue',
        data: [...blueHistogram]
      },
      {
        label: 'Red',
        data: [...redHistogram]
      },
      {
        label: 'Green',
        data: [...greenHistogram]
      }
    ])
    console.log(histogramData)
  }

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  return (
    <div
      style={{
        width: '75vw',
        height: '300px'
      }}
    >
      <Button onClick={updateData}>Histogram</Button>
      <Chart data={histogramData} axes={axes} tooltip />
    </div>
  )
}

export default MyChart
