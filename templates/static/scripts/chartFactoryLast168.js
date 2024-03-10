/*  Desenvolvido por: BrainStorm Tecnologia 
    Desenvolvedor: Fernando Mendes
    todos os direitos reservados 2024 © BrainStorm Tecnologia
*/

let configTempDvStd168 = graphConfigFactory('°C')
let configHUmiDvStd168 = graphConfigFactory('%')
let configPressDvStd168 = graphConfigFactory('hPa')

const chartDvStdTemperatureDoc168 = document.getElementById('tempDvStdLast168').getContext('2d')
const chartDvStdHumidityDoc168 = document.getElementById('humiDvStdLast168').getContext('2d')
const chartDvStdPressureDoc168 = document.getElementById('pressDvStdLast168').getContext('2d')
const chartTempDvStdLast168 = new Chart(chartDvStdTemperatureDoc168, configTempDvStd168)
const chartHumiDvStdLast168 = new Chart(chartDvStdHumidityDoc168, configHUmiDvStd168)
const chartPressDvStdLast168 = new Chart(chartDvStdPressureDoc168, configPressDvStd168)

function engineAPI168Hrs(urlGraphs, urlStats) {
  const updateStatsTemperature = (aver, stdD, max, min) => {
    const elementTempMax = document.getElementById('temperatureMax168')
    const elementTempMin = document.getElementById('temperatureMin168')
    const elementTempAverage = document.getElementById('temperatureAverage168')
    const elementTempStdDv = document.getElementById('temperatureStdDeviation168')

    elementTempAverage.innerHTML = `${aver} °C`
    elementTempStdDv.innerHTML = `${stdD} °C`
    elementTempMax.innerHTML = `${max} °C`
    elementTempMin.innerHTML = `${min} °C`
  };

  const updateStatsHumidity = (aver, stdD, max, min) => {
    const elementHumiMax = document.getElementById('humidityMax168')
    const elementHumiMin = document.getElementById('humidityMin168')
    const elementHumiAverage = document.getElementById('humidityAverage168')
    const elementHumiStdDv = document.getElementById('humidityStdDeviation168')

    elementHumiAverage.innerHTML = `${aver} %`
    elementHumiStdDv.innerHTML = `${stdD} %`
    elementHumiMax.innerHTML = `${max} %`
    elementHumiMin.innerHTML = `${min} %`
  };

  const updateStatsPressure = (aver, stdD, max, min) => {
    const elementPressMax = document.getElementById('pressureMax168')
    const elementPressMin = document.getElementById('pressureMin168')
    const elementPressAverage = document.getElementById('pressureAverage168')
    const elementPressStdDv = document.getElementById('pressureStdDeviation168')

    elementPressAverage.innerHTML = `${aver} hPa`
    elementPressStdDv.innerHTML = `${stdD} hPa`
    elementPressMax.innerHTML = `${max} hPa`
    elementPressMin.innerHTML = `${min} hPa`
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

  const chartAPIEngine = (urlGraphs, urlStats) => {
    const stats = {
      temperature: {},
      humidity: {},
      pressure: {}
    }
    fetch(urlStats)
      .then(responseStats => {
        if (responseStats.status !== 200) throw new Error(
          'Dados não encontrados: ' + responseStats.statusText
        )
        return responseStats.json()
      })
      .then(dataStats => {
        stats.temperature = dataStats[0]
        stats.humidity = dataStats[1]
        stats.pressure = dataStats[2]
        console.log(stats)
        return fetch(urlGraphs)
      })
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

        updateChartStdDeviation(
          configTempDvStd168,
          chartTempDvStdLast168,
          'Temperatura',
          date,
          temperature,
          stats.temperature.average,
          stats.temperature.stdDV
        )
        updateChartStdDeviation(
          configHUmiDvStd168,
          chartHumiDvStdLast168,
          'Umidade',
          date,
          humidity,
          stats.humidity.average,
          stats.humidity.stdDV
        )
        updateChartStdDeviation(
          configPressDvStd168,
          chartPressDvStdLast168,
          'Pressão',
          date,
          pressure,
          stats.pressure.average,
          stats.pressure.stdDV
        )

        updateStatsTemperature(
          stats.temperature.average,
          stats.temperature.stdDV,
          stats.temperature._max,
          stats.temperature._min
        )
        updateStatsHumidity(
          stats.humidity.average,
          stats.humidity.stdDV,
          stats.humidity._max,
          stats.humidity._min
        )
        updateStatsPressure(
          stats.pressure.average,
          stats.pressure.stdDV,
          stats.pressure._max,
          stats.pressure._min
        )
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
  chartAPIEngine(urlGraphs, urlStats)
};
