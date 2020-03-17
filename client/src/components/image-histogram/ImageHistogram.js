import React, { useState } from 'react'
import { Chart } from 'react-charts'
import { Button } from '@material-ui/core'

const MyChart = ({ imageData }) => {
  const [histogramData, setHistogramData] = useState([
    {
      label: 'Red',
      data: [{ x: 1, y: 10 }]
    },
    {
      label: 'Green',
      data: [{ x: 1, y: 10 }]
    },
    {
      label: 'Blue',
      data: [{ x: 1, y: 10 }]
    }
  ])

  const updateData = () => {
    const redData = []
    const greenData = []
    const blueData = []
    for (var i = 0; i < 1000; i += 4) {
      const redPixel = imageData[i] // red
      const greenPixel = imageData[i + 1] // green
      const bluePixel = imageData[i + 2] // blue
      redData.push({ x: i, y: redPixel })
      greenData.push({ x: i, y: greenPixel })
      blueData.push({ x: i, y: bluePixel })
    }

    setHistogramData([
      {
        label: 'Series 1',
        data: [...redData]
      },
      {
        label: 'Series 2',
        data: [...greenData]
      },
      {
        label: 'Series 3',
        data: [...blueData]
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
        width: '70vw',
        height: '300px'
      }}
    >
      <Button onClick={updateData}>Histogram</Button>
      <Chart data={histogramData} axes={axes} tooltip />
    </div>
  )
}

export default MyChart
