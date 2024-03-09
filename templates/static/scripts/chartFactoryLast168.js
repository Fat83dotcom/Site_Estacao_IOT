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

async function engineAPI168Hrs(url) {
  const fillerStdAverange = (object, arrayTarget, average, stdDeviation) => {
    let stdUp = parseFloat(average) + parseFloat(stdDeviation)
    let stdDown = parseFloat(average) - parseFloat(stdDeviation)

    const configStdAverange = [
      {
        label: 'Desvio Padrão Superior',
        data: Array(arrayTarget.length).fill(stdUp),
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
        data: Array(arrayTarget.length).fill(stdDown),
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

  const updateChartStdDeviation = (config, chart, _label, date, humidity, aver, stdD) => {
    if (config.data.datasets.length > 0) {
      config.data.datasets.length = 0
    }
    config.data.labels = date
    config.data.datasets.push(
      {
        label: _label,
        data: humidity,
        borderWidth: 0.5,
        pointRadius: 1.5,
        fill: false,
        cubicInterpolationMode: 'monotone',
        backgroundColor: 'rgb(35, 35, 35)',
        radius: 1,
      }
    )
    fillerStdAverange(config, date, aver, stdD)
    chart.update()
  };

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

        updateChartStdDeviation(
          configTempDvStd168,
          chartTempDvStdLast168,
          'Temperatura',
          date,
          temperature,
          averageTemp,
          stdDeviationTemp
        )
        updateChartStdDeviation(
          configHUmiDvStd168,
          chartHumiDvStdLast168,
          'Umidade',
          date,
          humidity,
          averageHumi,
          stdDeviationHumi
        )
        updateChartStdDeviation(
          configPressDvStd168,
          chartPressDvStdLast168,
          'Pressão',
          date,
          pressure,
          averagePress,
          stdDeviationPress
        )

        updateStatsTemperature(
          averageTemp, stdDeviationTemp, maxTemp, minTemp
        )
        updateStatsHumidity(
          averageHumi, stdDeviationHumi, maxHumi, minHumi
        )
        updateStatsPressure(
          averagePress, stdDeviationPress, maxPress, minPress
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
  chartAPIEngine(url)
};
