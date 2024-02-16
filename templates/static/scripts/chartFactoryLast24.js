
let config1 = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: "Temperatura",
      data: [],
      borderWidth: 0.5,
      fill: 'origin',
      pointRadius: 1,
      cubicInterpolationMode: 'monotone',
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    }]
  },

  options: {
    scales: {
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Temperatura'
        },
        beginAtZero: true,
        ticks: {
          callback: value => `${value} °C`
        }
      }
    }
  }
};

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
          labelString: 'Últimas 24 horas'
        }
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Temperatura'
        },
        beginAtZero: true,
        ticks: {
          callback: value => `${value} °C`
        }
      }
    },
    plugins: {
        filler: {
        propagate: true,
      }
    }
  },
  data: {
    labels: [],
    datasets: [],
  }
};

let config2 = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: "Temperatura",
      data: [],
      borderWidth: 0.5,
      fill: 'origin',
      pointRadius: 1,
      cubicInterpolationMode: 'monotone',
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    }]
  },

  options: {
    scales: {
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Temperatura'
        },
        beginAtZero: true,
        ticks: {
          callback: value => `${value} °C`
        }
      }
    }
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
          labelString: 'Últimas 24 horas'
        }
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Humidade'
        },
        beginAtZero: true,
        ticks: {
          callback: value => `${value} %`
        }
      }
    },
    plugins: {
        filler: {
        propagate: true,
      }
    }
  },
  data: {
    labels: [],
    datasets: [],
  }
};

let config3 = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: "Temperatura",
      data: [],
      borderWidth: 0.5,
      fill: 'origin',
      pointRadius: 1,
      cubicInterpolationMode: 'monotone',
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    }]
  },

  options: {
    scales: {
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Temperatura'
        },
        beginAtZero: true,
        ticks: {
          callback: value => `${value} °C`
        }
      }
    }
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
          labelString: 'Últimas 24 horas'
        }
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Pressão'
        },
        beginAtZero: true,
        ticks: {
          callback: value => `${value} hPa`
        }
      }
    },
    plugins: {
        filler: {
        propagate: true,
      }
    }
  },
  data: {
    labels: [],
    datasets: [],
  }
};

const chartTemperatureDoc = document.getElementById('tempLast24')
const chartDvStdTemperatureDoc = document.getElementById('tempDvStdLast24').getContext('2d')
const chartTemperature = new Chart(chartTemperatureDoc, config1)
const chartTempDvStdLast24 = new Chart(chartDvStdTemperatureDoc, config1DvStd)

const chartHumidityDoc = document.getElementById('humiLast24')
const chartDvStdHumidityDoc = document.getElementById('humiDvStdLast24').getContext('2d')
const chartHumidity = new Chart(chartHumidityDoc, config2)
const chartHumiDvStdLast24 = new Chart(chartDvStdHumidityDoc, config2DvStd)

const chartPressureDoc = document.getElementById('pressLast24')
const chartDvStdPressureDoc = document.getElementById('pressDvStdLast24').getContext('2d')
const chartPressure = new Chart(chartPressureDoc, config3)
const chartPressDvStdLast24 = new Chart(chartDvStdPressureDoc, config3DvStd)

const average = (dataArray) => {
  return (dataArray.reduce((a, b) => a + b, 0) / dataArray.length).toFixed(2)
}

const stdDeviation = (dataArray) => {
  return Math.sqrt(
    dataArray.reduce((acc, val) => acc + Math.pow(val - average(dataArray), 2), 0
  ) / dataArray.length).toFixed(2)
}


const updateChartsTemp = (date, temperature) => {
  config1.data.labels = date
  config1.data.datasets.forEach(element => {
    element.data = temperature
  });
  chartTemperature.update()
};

const updateChartsTempStdDeviation = (date, temperature) => {
  let aver = average(temperature)
  let stdD = stdDeviation(temperature)

  config1DvStd.data.labels = date
  config1DvStd.data.datasets.push(
    {
      label: 'Temperatura',
      data: [...temperature],
      borderWidth: 0.5,
      pointRadius: 1,
      fill: false,
      cubicInterpolationMode: 'monotone',
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    }
  )
  config1DvStd.data.datasets.push(
    {
      label: 'Desvio PadrãoSuperior',
      data: Array(date.length).fill(aver + stdD),
      borderColor: 'green',
      borderWidth: 1,
      fill: {
        target: '2',
      },
      backgroundColor: 'rgb(79, 232, 95, 0.4)',
      borderDash: [5, 5],
      pointStyle: 'dash',
    }
  )
  config1DvStd.data.datasets.push(
    {
      label: 'Média',
      data: Array(date.length).fill(aver),
      borderColor: 'red',
      borderWidth: 1,
      fill: false
    }
  )
  config1DvStd.data.datasets.push(
    {
      label: 'Desvio Padrão Inferior',
      data: Array(date.length).fill(aver - stdD),
      borderColor: 'green',
      borderWidth: 1,
      fill: {
        target: '-1',
      },
      borderDash: [5, 5],
      backgroundColor: 'rgb(79, 232, 95, 0.4)',
      pointStyle: 'dash',
    }
  )
  chartTempDvStdLast24.update()
};

const updateChartsHumi = (date, humidity) => {
  config2.data.labels = date
  config2.data.datasets.forEach(element => {
    element.data = humidity
  });
  chartHumidity.update()
};

const updateChartsHumiStdDeviation = (date, humidity) => {
  let aver = average(humidity)
  let stdD = stdDeviation(humidity)

  config2DvStd.data.labels = date
  config2DvStd.data.datasets.push(
    {
      label: 'Humidade',
      data: [...humidity],
      borderWidth: 0.5,
      pointRadius: 1,
      fill: false,
      cubicInterpolationMode: 'monotone',
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    }
  )
  config2DvStd.data.datasets.push(
    {
      label: 'Desvio PadrãoSuperior',
      data: Array(date.length).fill(aver + stdD),
      borderColor: 'green',
      borderWidth: 1,
      fill: {
        target: '2',
      },
      backgroundColor: 'rgb(79, 232, 95, 0.4)',
      borderDash: [5, 5],
      pointStyle: 'dash',
    }
  )
  config2DvStd.data.datasets.push(
    {
      label: 'Média',
      data: Array(date.length).fill(aver),
      borderColor: 'red',
      borderWidth: 1,
      fill: false
    }
  )
  config2DvStd.data.datasets.push(
    {
      label: 'Desvio Padrão Inferior',
      data: Array(date.length).fill(aver - stdD),
      borderColor: 'green',
      borderWidth: 1,
      fill: {
        target: '-1',
      },
      borderDash: [5, 5],
      backgroundColor: 'rgb(79, 232, 95, 0.4)',
      pointStyle: 'dash',
    }
  )
  chartHumiDvStdLast24.update()
};

const updateChartsPress = (date, pressure) => {
  config3.data.labels = date
  config3.data.datasets.forEach(element => {
    element.data = pressure
  });
  chartPressure.update()
};

const updateChartsPressStdDeviation = (date, pressure) => {
  let aver = average(pressure)
  let stdD = stdDeviation(pressure)

  config3DvStd.data.labels = date
  config3DvStd.data.datasets.push(
    {
      label: 'Pressão',
      data: [...pressure],
      borderWidth: 0.5,
      pointRadius: 1,
      fill: false,
      cubicInterpolationMode: 'monotone',
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    }
  )
  config3DvStd.data.datasets.push(
    {
      label: 'Desvio PadrãoSuperior',
      data: Array(date.length).fill(aver + stdD),
      borderColor: 'green',
      borderWidth: 1,
      fill: {
        target: '2',
      },
      backgroundColor: 'rgb(79, 232, 95, 0.4)',
      borderDash: [5, 5],
      pointStyle: 'dash',
    }
  )
  config3DvStd.data.datasets.push(
    {
      label: 'Média',
      data: Array(date.length).fill(aver),
      borderColor: 'red',
      borderWidth: 1,
      fill: false
    }
  )
  config3DvStd.data.datasets.push(
    {
      label: 'Desvio Padrão Inferior',
      data: Array(date.length).fill(aver - stdD),
      borderColor: 'green',
      borderWidth: 1,
      fill: {
        target: '-1',
      },
      borderDash: [5, 5],
      backgroundColor: 'rgb(79, 232, 95, 0.4)',
      pointStyle: 'dash',
    }
  )
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
      updateChartsTemp(date, temperature)
      updateChartsTempStdDeviation(date, temperature)
      updateChartsHumi(date, humidity)
      updateChartsHumiStdDeviation(date, humidity)
      updateChartsPress(date, pressure)
      updateChartsPressStdDeviation(date, pressure)
    })
}
