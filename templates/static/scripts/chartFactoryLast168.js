/*  Desenvolvido por: BrainStorm Tecnologia 
    Desenvolvedor: Fernando Mendes
    todos os direitos reservados 2024 © BrainStorm Tecnologia
*/

const graphConfigFactory168 = (ticks) => {
  return {
    type: 'line',
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: '',
          }
        },
        y: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: '',
          },
          beginAtZero: false,
          ticks: {
            callback: value => `${value} ${ticks}`,
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
};

let config1DvStd168 = graphConfigFactory168('°C')
let config2DvStd168 = graphConfigFactory168('%')
let config3DvStd168 = graphConfigFactory168('hPa')

const chartDvStdTemperatureDoc168 = document.getElementById('tempDvStdLast168').getContext('2d')
const chartDvStdHumidityDoc168 = document.getElementById('humiDvStdLast168').getContext('2d')
const chartDvStdPressureDoc168 = document.getElementById('pressDvStdLast168').getContext('2d')
const chartTempDvStdLast168 = new Chart(chartDvStdTemperatureDoc168, config1DvStd168)
const chartHumiDvStdLast168 = new Chart(chartDvStdHumidityDoc168, config2DvStd168)
const chartPressDvStdLast168 = new Chart(chartDvStdPressureDoc168, config3DvStd168)

async function engineAPI168Hrs(url) {
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
  };

  const max = dataArray => {
    if (dataArray.length === 0) {
      return undefined
    }
    let max
    dataArray.forEach((element, index) => {
      if (index === 0) max = element
      if (element > max) max = element
    });
    return max
  };

  const min = dataArray => {
    if (dataArray.length === 0) {
      return undefined
    }
    let min
    dataArray.forEach((element, index) => {
      if (index === 0) min = element
      if (element < min) min = element
    });
    return min
  };

  const average = dataArray => {
    return (dataArray.reduce((a, b) => a + b, 0) / dataArray.length)
  };

  const stdDeviation = dataArray => {
    return Math.sqrt(
      dataArray.reduce((acc, val) => acc + Math.pow(val - average(dataArray), 2), 0
      ) / dataArray.length)
  };

  const updateChartsTempStdDeviation = (date, temperature) => {
    let aver = average(temperature)
    let stdD = stdDeviation(temperature)

    if (config1DvStd168.data.datasets.length > 0) {
      config1DvStd168.data.datasets.length = 0
    }
    config1DvStd168.data.labels = date
    config1DvStd168.data.datasets.push(
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
    fillerStdAverange(config1DvStd168, date, aver, stdD)
    chartTempDvStdLast168.update()
  };

  const updateChartsHumiStdDeviation = (date, humidity) => {
    let aver = average(humidity)
    let stdD = stdDeviation(humidity)

    if (config2DvStd168.data.datasets.length > 0) {
      config2DvStd168.data.datasets.length = 0
    }
    config2DvStd168.data.labels = date
    config2DvStd168.data.datasets.push(
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
    fillerStdAverange(config2DvStd168, date, aver, stdD)
    chartHumiDvStdLast168.update()
  };

  const updateChartsPressStdDeviation = (date, pressure) => {
    let aver = average(pressure)
    let stdD = stdDeviation(pressure)

    if (config3DvStd168.data.datasets.length > 0) {
      config3DvStd168.data.datasets.length = 0
    }
    config3DvStd168.data.labels = date
    config3DvStd168.data.datasets.push(
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
    fillerStdAverange(config3DvStd168, date, aver, stdD)
    chartPressDvStdLast168.update()
  };

  const updateStatsTemperature = temperature => {
    const elementTempMax = document.getElementById('temperatureMax168')
    const elementTempMin = document.getElementById('temperatureMin168')
    const elementTempAverage = document.getElementById('temperatureAverage168')
    const elementTempStdDv = document.getElementById('temperatureStdDeviation168')

    let temperatureMax = max(temperature).toFixed(2)
    let temperatureMin = min(temperature).toFixed(2)
    let temperatureAverage = average(temperature).toFixed(2)
    let temperatureStdDeviation = stdDeviation(temperature).toFixed(2)

    elementTempMax.innerHTML = `${temperatureMax} °C`
    elementTempMin.innerHTML = `${temperatureMin} °C`
    elementTempAverage.innerHTML = `${temperatureAverage} °C`
    elementTempStdDv.innerHTML = `${temperatureStdDeviation} °C`
  };

  const updateStatsHumidity = humidity => {
    const elementHumiMax = document.getElementById('humidityMax168')
    const elementHumiMin = document.getElementById('humidityMin168')
    const elementHumiAverage = document.getElementById('humidityAverage168')
    const elementHumiStdDv = document.getElementById('humidityStdDeviation168')

    let humidityMax = max(humidity).toFixed(2)
    let humidityMin = min(humidity).toFixed(2)
    let humidityAverage = average(humidity).toFixed(2)
    let humidityStdDeviation = stdDeviation(humidity).toFixed(2)

    elementHumiMax.innerHTML = `${humidityMax} %`
    elementHumiMin.innerHTML = `${humidityMin} %`
    elementHumiAverage.innerHTML = `${humidityAverage} %`
    elementHumiStdDv.innerHTML = `${humidityStdDeviation} %`
  };

  const updateStatsPressure = pressure => {
    const elementPressMax = document.getElementById('pressureMax168')
    const elementPressMin = document.getElementById('pressureMin168')
    const elementPressAverage = document.getElementById('pressureAverage168')
    const elementPressStdDv = document.getElementById('pressureStdDeviation168')

    let pressureMax = max(pressure).toFixed(2)
    let pressureMin = min(pressure).toFixed(2)
    let pressureAverage = average(pressure).toFixed(2)
    let pressureStdDeviation = stdDeviation(pressure).toFixed(2)

    elementPressMax.innerHTML = `${pressureMax} hPa`
    elementPressMin.innerHTML = `${pressureMin} hPa`
    elementPressAverage.innerHTML = `${pressureAverage} hPa`
    elementPressStdDv.innerHTML = `${pressureStdDeviation} hPa`
  };

  const updateSpinner = () => {
    const contentA = document.getElementById('fade-sensor168')
    const spinner = document.getElementById('spinner-end168')
    contentA.style.display = 'block'
    spinner.style.display = 'none'
    setTimeout(() => {
      contentA.style.opacity = 1
    }, 30)
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

        updateStatsTemperature(temperature)
        updateStatsHumidity(humidity)
        updateStatsPressure(pressure)

        updateSpinner()
      })
      .catch((e) => {
        const elementSensor = document.getElementById('fade-sensor168')
        const elementSpin = document.getElementById('spinner-end168')
        elementSensor.style.opacity = 1
        elementSpin.style.display = 'none'
        elementSensor.innerHTML = 'Recarregue a página ou busque outro sensor...'
        console.log(e)
      })
  };
  chartAPIEngine(url)
};
