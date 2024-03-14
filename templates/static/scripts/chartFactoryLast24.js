/*  Desenvolvido por: BrainStorm Tecnologia 
    Desenvolvedor: Fernando Mendes
    todos os direitos reservados 2024 © BrainStorm Tecnologia
*/



let configTempDvStd24 = graphConfigFactory('°C', 'Temperatura')
let configHumiDvStd24 = graphConfigFactory('%', 'Umidade')
let configPressDvStd24 = graphConfigFactory('hPa', 'Pressão')

const chartDvStdTemperatureDoc = document.getElementById('tempDvStdLast24').getContext('2d')
const chartDvStdHumidityDoc = document.getElementById('humiDvStdLast24').getContext('2d')
const chartDvStdPressureDoc = document.getElementById('pressDvStdLast24').getContext('2d')
const chartTempDvStdLast24 = new Chart(chartDvStdTemperatureDoc, configTempDvStd24)
const chartHumiDvStdLast24 = new Chart(chartDvStdHumidityDoc, configHumiDvStd24)
const chartPressDvStdLast24 = new Chart(chartDvStdPressureDoc, configPressDvStd24)

function engineAPI24Hrs(urlGraph, urlStats) {
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
          configTempDvStd24,
          chartTempDvStdLast24,
          'Temperatura',
          date,
          temperature,
          stats.temperature.average,
          stats.temperature.stdDV
        )
        updateChartStdDeviation(
          configHumiDvStd24,
          chartHumiDvStdLast24,
          'Umidade',
          date,
          humidity,
          stats.humidity.average,
          stats.humidity.stdDV
        )
        updateChartStdDeviation(
          configPressDvStd24,
          chartPressDvStdLast24,
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
        const elementSensor = document.getElementById('fade-sensor24')
        const elementSpin = document.getElementById('spinner-end24')
        elementSensor.style.opacity = 1
        elementSpin.style.display = 'none'
        elementSensor.innerHTML = 'Recarregue a página ou busque outro sensor...'
        console.log(e)
      })
  };

  chartAPIEngine(urlGraph, urlStats)
};
