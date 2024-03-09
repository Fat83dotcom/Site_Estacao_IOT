/*  Desenvolvido por: BrainStorm Tecnologia 
    Desenvolvedor: Fernando Mendes
    todos os direitos reservados 2024 © BrainStorm Tecnologia
*/



let config1DvStd = graphConfigFactory('°C')
let config2DvStd = graphConfigFactory('%')
let config3DvStd = graphConfigFactory('hPa')

const chartDvStdTemperatureDoc = document.getElementById('tempDvStdLast24').getContext('2d')
const chartDvStdHumidityDoc = document.getElementById('humiDvStdLast24').getContext('2d')
const chartDvStdPressureDoc = document.getElementById('pressDvStdLast24').getContext('2d')
const chartTempDvStdLast24 = new Chart(chartDvStdTemperatureDoc, config1DvStd)
const chartHumiDvStdLast24 = new Chart(chartDvStdHumidityDoc, config2DvStd)
const chartPressDvStdLast24 = new Chart(chartDvStdPressureDoc, config3DvStd)

async function engineAPI24Hrs(url) {
  const fillerStdAverange = (object, arrayTarget, average, stdDeviation) => {
    const stdUp = parseFloat(average) + parseFloat(stdDeviation)
    const stdDown = parseFloat(average) - parseFloat(stdDeviation)

    console.log(stdUp);
    console.log(stdDown);

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
        data: Array(arrayTarget.length).fill(average),
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
  const updateChartsTempStdDeviation = (date, temperature, aver, stdD) => {
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

  const updateChartsHumiStdDeviation = (date, humidity, aver, stdD) => {
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

  const updateChartsPressStdDeviation = (date, pressure, aver, stdD) => {
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

  const updateStatsTemperature = (aver, stdD, max, min) => {
    const elementTempMax = document.getElementById('temperatureMax24')
    const elementTempMin = document.getElementById('temperatureMin24')
    const elementTempAverage = document.getElementById('temperatureAverage24')
    const elementTempStdDv = document.getElementById('temperatureStdDeviation24')

    elementTempAverage.innerHTML = `${aver} °C`
    elementTempStdDv.innerHTML = `${stdD} °C`
    elementTempMax.innerHTML = `${max} °C`
    elementTempMin.innerHTML = `${min} °C`
  };

  const updateStatsHumidity = (aver, stdD, max, min) => {
    const elementHumiMax = document.getElementById('humidityMax24')
    const elementHumiMin = document.getElementById('humidityMin24')
    const elementHumiAverage = document.getElementById('humidityAverage24')
    const elementHumiStdDv = document.getElementById('humidityStdDeviation24')

    elementHumiAverage.innerHTML = `${aver} %`
    elementHumiStdDv.innerHTML = `${stdD} %`
    elementHumiMax.innerHTML = `${max} %`
    elementHumiMin.innerHTML = `${min} %`
  };

  const updateStatsPressure = (aver, stdD, max, min) => {
    const elementPressMax = document.getElementById('pressureMax24')
    const elementPressMin = document.getElementById('pressureMin24')
    const elementPressAverage = document.getElementById('pressureAverage24')
    const elementPressStdDv = document.getElementById('pressureStdDeviation24')

    elementPressAverage.innerHTML = `${aver} hPa`
    elementPressStdDv.innerHTML = `${stdD} hPa`
    elementPressMax.innerHTML = `${max} hPa`
    elementPressMin.innerHTML = `${min} hPa`
  };

  const updateSpinner = () => {
    const contentA = document.getElementById('fade-sensor24')
    const spinner = document.getElementById('spinner-end24')
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

        let averageTemp = average(temperature).toFixed(2)
        let averageHumi = average(humidity).toFixed(2)
        let averagePress = average(pressure).toFixed(2)

        let stdDeviationTemp = stdDeviation(temperature, averageTemp).toFixed(2)
        let stdDeviationHumi = stdDeviation(humidity, averageHumi).toFixed(2)
        let stdDeviationPress = stdDeviation(pressure, averagePress).toFixed(2)

        let maxTemp = max(temperature)
        let minTemp = min(temperature)

        let maxHumi = max(humidity)
        let minHumi = min(humidity)
        
        let maxPress = max(pressure)
        let minPress = min(pressure)

        updateChartsTempStdDeviation(
          date, temperature, averageTemp, stdDeviationTemp
        )
        updateChartsHumiStdDeviation(
          date, humidity, averageHumi, stdDeviationHumi
        )
        updateChartsPressStdDeviation(
          date, pressure, averagePress, stdDeviationPress
        )

        updateStatsTemperature(
          averageTemp, stdDeviationTemp, maxTemp, minTemp
        )
        updateStatsHumidity(
          averageHumi,stdDeviationHumi, maxHumi, minHumi
        )
        updateStatsPressure(
          averagePress, stdDeviationPress, maxPress, minPress
        )

        updateSpinner()
      })
      .catch((e) => {
        const elementSensor = document.getElementById('fade-sensor24')
        const elementSpin = document.getElementById('spinner-end24')
        elementSensor.style.opacity = 1
        elementSpin.style.display = 'none'
        elementSensor.innerHTML = 'Recarregue a página ou busque outro sensor...'
        console.log(e)
      })
  };
  // new Promise()
  chartAPIEngine(url)
};
