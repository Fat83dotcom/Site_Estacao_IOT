/*  Desenvolvido por: BrainStorm Tecnologia 
    Desenvolvedor: Fernando Mendes
    todos os direitos reservados 2024 © BrainStorm Tecnologia
*/

const graphConfigFactory = (ticks) => {
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

let config1DvStd = graphConfigFactory('°C')
let config2DvStd = graphConfigFactory('%')
let config3DvStd = graphConfigFactory('hPa')

const chartDvStdTemperatureDoc = document.getElementById('tempDvStdLast24').getContext('2d')
const chartDvStdHumidityDoc = document.getElementById('humiDvStdLast24').getContext('2d')
const chartDvStdPressureDoc = document.getElementById('pressDvStdLast24').getContext('2d')
const chartTempDvStdLast24 = new Chart(chartDvStdTemperatureDoc, config1DvStd)
const chartHumiDvStdLast24 = new Chart(chartDvStdHumidityDoc, config2DvStd)
const chartPressDvStdLast24 = new Chart(chartDvStdPressureDoc, config3DvStd)

const engineAPI24Hrs = (url) => {
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

    if (config1DvStd.data.datasets.length > 0) {
      config1DvStd.data.datasets.length = 0
    }
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

    if (config2DvStd.data.datasets.length > 0) {
      config2DvStd.data.datasets.length = 0
    }
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

    if (config3DvStd.data.datasets.length > 0) {
      config3DvStd.data.datasets.length = 0
    }
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

  const updateStatsTemperature = temperature => {
    const elementTempMax = document.getElementById('temperatureMax24')
    const elementTempMin = document.getElementById('temperatureMin24')
    const elementTempAverage = document.getElementById('temperatureAverage24')
    const elementTempStdDv = document.getElementById('temperatureStdDeviation24')

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
    const elementHumiMax = document.getElementById('humidityMax24')
    const elementHumiMin = document.getElementById('humidityMin24')
    const elementHumiAverage = document.getElementById('humidityAverage24')
    const elementHumiStdDv = document.getElementById('humidityStdDeviation24')

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
    const elementPressMax = document.getElementById('pressureMax24')
    const elementPressMin = document.getElementById('pressureMin24')
    const elementPressAverage = document.getElementById('pressureAverage24')
    const elementPressStdDv = document.getElementById('pressureStdDeviation24')

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
    const contentA = document.getElementById('fade-sensor24')
    const spinner = document.getElementById('spinner-end24')
    contentA.style.display = 'block'
    spinner.style.display = 'none'
    setTimeout(()=>{
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
      .catch((e) =>{
        const elementSensor = document.getElementById('fade-sensor24')
        const elementSpin = document.getElementById('spinner-end24')
        elementSensor.style.opacity = 1
        elementSpin.style.display = 'none'
        elementSensor.innerHTML = `Recarregue a página ou busque outro sensor... ${e}`
      })
  };
  chartAPIEngine(url)
};
