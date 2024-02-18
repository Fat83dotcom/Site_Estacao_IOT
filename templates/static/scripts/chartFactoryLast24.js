let config1DvStd = {
  type: 'line',
  options: {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Últimas 24 horas',
        }
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Temperatura',
        },
        beginAtZero: false,
        ticks: {
          callback: value => `${value} °C`,
        }
      }
    },
  },
  plugins: [
    {
      filler: {
        propagate: true,
      }

    }
  ],
  data: {
    labels: [],
    datasets: [],
  }
};

let config2DvStd = {
  type: 'line',
  options: {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Últimas 24 horas',
        }
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Humidade',
        },
        beginAtZero: false,
        ticks: {
          callback: value => `${value} %`,
        }
      }
    },
  },
  plugins: [
    {
      filler: {
        propagate: true,
      }

    }
  ],
  data: {
    labels: [],
    datasets: [],
  }
};

let config3DvStd = {
  type: 'line',
  options: {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Últimas 24 horas',
        }
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Pressão',
        },
        beginAtZero: false,
        ticks: {
          callback: value => `${value} hPa`,
        }
      }
    },
  },
  plugins: [
    {
      filler: {
        propagate: true,
      }

    }
  ],
  data: {
    labels: [],
    datasets: [],
  }
};

const chartDvStdTemperatureDoc = document.getElementById('tempDvStdLast24').getContext('2d')
const chartTempDvStdLast24 = new Chart(chartDvStdTemperatureDoc, config1DvStd)

const chartDvStdHumidityDoc = document.getElementById('humiDvStdLast24').getContext('2d')
const chartHumiDvStdLast24 = new Chart(chartDvStdHumidityDoc, config2DvStd)

const chartDvStdPressureDoc = document.getElementById('pressDvStdLast24').getContext('2d')
const chartPressDvStdLast24 = new Chart(chartDvStdPressureDoc, config3DvStd)

const average = (dataArray) => {
  return (dataArray.reduce((a, b) => a + b, 0) / dataArray.length)
}

const stdDeviation = (dataArray) => {
  return Math.sqrt(
    dataArray.reduce((acc, val) => acc + Math.pow(val - average(dataArray), 2), 0
  ) / dataArray.length)
}

const fillerStdAverange = (object, arrayTarget, average, stdDeviation) => {
  let stdUp = average + stdDeviation
  let stdDown = average - stdDeviation

  const configStdAverange = [
    {
      label: 'Desvio Padrão Superior',
      data: Array(arrayTarget.length).fill(stdUp.toFixed(2)),
      borderColor: 'green',
      borderWidth: 1,
      fill: {
        target: '2',
      },
      backgroundColor: 'rgb(79, 232, 95, 0.4)',
      borderDash: [5, 5],
      pointStyle: 'dash',
    },
    {
      label: 'Média',
      data: Array(arrayTarget.length).fill(average.toFixed(2)),
      borderColor: 'red',
      borderWidth: 1,
      fill: false,
      borderDash: [5, 5],
      pointStyle: 'dash',
    },
    {
      label: 'Desvio Padrão Inferior',
      data: Array(arrayTarget.length).fill(stdDown.toFixed(2)),
      borderColor: 'green',
      borderWidth: 1,
      fill: {
        target: '-1',
      },
      borderDash: [5, 5],
      backgroundColor: 'rgb(79, 232, 95, 0.4)',
      pointStyle: 'dash',
    }
  ]
  configStdAverange.forEach((element) => {
    object.data.datasets.push(element)
  })
}

const updateChartsTempStdDeviation = (date, temperature) => {
  let aver = average(temperature)
  let stdD = stdDeviation(temperature)

  config1DvStd.data.labels = date
  config1DvStd.data.datasets.push(
    {
      label: 'Temperatura',
      data: temperature,
      borderWidth: 1,
      pointRadius: 1.5,
      fill: false,
      cubicInterpolationMode: 'monotone',
      backgroundColor: 'rgb(35, 35, 35)',
    }
  )
  fillerStdAverange(config1DvStd, date, aver, stdD)
  chartTempDvStdLast24.update()
};

const updateChartsHumiStdDeviation = (date, humidity) => {
  let aver = average(humidity)
  let stdD = stdDeviation(humidity)

  config2DvStd.data.labels = date
  config2DvStd.data.datasets.push(
    {
      label: 'Humidade',
      data: humidity,
      borderWidth: 0.5,
      pointRadius: 1.5,
      fill: false,
      cubicInterpolationMode: 'monotone',
      backgroundColor: 'rgb(35, 35, 35)',
      radius: 1,
    }
  )
  fillerStdAverange(config2DvStd, date, aver, stdD)
  chartHumiDvStdLast24.update()
};

const updateChartsPressStdDeviation = (date, pressure) => {
  let aver = average(pressure)
  let stdD = stdDeviation(pressure)

  config3DvStd.data.labels = date
  config3DvStd.data.datasets.push(
    {
      label: 'Pressão',
      data: pressure,
      borderWidth: 0.5,
      pointRadius: 1.5,
      fill: false,
      cubicInterpolationMode: 'monotone',
      backgroundColor: 'rgb(35, 35, 35)',
    }
  )
  fillerStdAverange(config3DvStd, date, aver, stdD)
  chartPressDvStdLast24.update()
};

const chartAPIEngine = url => {
  fetch(url)
    .then(response => {
      if (response.status !== 200) throw new Error(
        'Dados não encontrados: ' + response.statusText
      )
      return response.json()
    })
    .then(data => {
      let date = []
      let temperature = []
      let humidity = []
      let pressure = []
      data.forEach(element => {
        date.push(element.date_hour)
        temperature.push(element.temperature)
        humidity.push(element.humidity)
        pressure.push(element.pressure)
      })
      updateChartsTempStdDeviation(date, temperature)
      updateChartsHumiStdDeviation(date, humidity)
      updateChartsPressStdDeviation(date, pressure)
    })
}




// let config1 = {
//   type: 'line',
//   data: {
//     labels: [],
//     datasets: [{
//       label: "Temperatura",
//       data: [],
//       borderWidth: 0.5,
//       fill: 'origin',
//       pointRadius: 1,
//       cubicInterpolationMode: 'monotone',
//       backgroundColor: 'rgba(153, 102, 255, 0.6)',
//     }]
//   },

//   options: {
//     scales: {
//       y: {
//         display: true,
//         scaleLabel: {
//           display: true,
//           labelString: 'Temperatura'
//         },
//         beginAtZero: true,
//         ticks: {
//           callback: value => `${value} °C`
//         }
//       }
//     }
//   }
// };



// const updateChartsTemp = (date, temperature) => {
//   config1.data.labels = date
//   config1.data.datasets.forEach(element => {
//     element.data = temperature
//   });
//   chartTemperature.update()
// };
