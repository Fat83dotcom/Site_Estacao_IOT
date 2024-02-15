
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
    maintainAspectRatio: false,
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
    }
  },

  labels: [],
    datasets: [{
      label: 'Dados',
      data: [],
      borderColor: 'blue',
      borderWidth: 2,
      fill: false
    },
    {
      label: 'Média',
      dataM: [],
      borderColor: 'red',
      borderWidth: 2,
      fill: false
    },
    {
      label: 'Desvio Padrão',
      dataDUp: [],
      borderColor: 'green',
      borderWidth: 2,
      fill: true,
      borderDash: [5, 5]  // Adiciona um traço à linha
    },
    {
      label: 'Desvio Padrão',
      dataDDown: [],
      borderColor: 'green',
      borderWidth: 2,
      fill: true,
      borderDash: [5, 5]  // Adiciona um traço à linha
    }
  ]
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
        beginAtZero: true,
        ticks: {
          callback: value => `${value} °C`
        }
      }
    }
  }
};


const chartTemperatureDoc = document.getElementById('tempLast24')
const chartDvStdTemperatureDoc = document.getElementById('tempDvStdLast24')
const chartTemperature = new Chart(chartTemperatureDoc, config1)
const chartTempDvStdLast24 = new Chart(chartDvStdTemperatureDoc, config1DvStd)



const updateCharts = (date, temperature) => {
  // Calcula a média dos dados
  let average = temperature.reduce((a, b) => a + b, 0) / temperature.length;

  // Calcula o desvio padrão dos dados
  let stdDeviation = Math.sqrt(
    temperature.reduce((acc, val) => acc + Math.pow(val - average, 2), 0
  ) / temperature.length)

  console.log(average);
  console.log(stdDeviation);

  chartTemperature.data.labels = date
  chartTemperature.data.datasets.forEach(element => {
    element.data = temperature
  });
  chartTemperature.update()

  chartTempDvStdLast24.data.labels = date
  chartTempDvStdLast24.data.datasets.forEach(element => {
    element.data = temperature
  })

  chartTempDvStdLast24.data.datasets.forEach(element => {
    element.dataM = Array(temperature.length).fill(average)
  })
  chartTempDvStdLast24.data.datasets.forEach(element => {
    element.dataDUp = Array(data.labels.length).fill(average + stdDeviation)
  })
  chartTempDvStdLast24.data.datasets.forEach(element => {
    element.dataDDown = Array(data.labels.length).fill(average - stdDeviation)
  })

  chartTempDvStdLast24.update()

  // chartPress.data.labels = date
  // chartPress.data.datasets.forEach(element => {
  //   element.data = press
  // });
  // chartPress.update()

  // chartTemp1.data.labels = date
  // chartTemp1.data.datasets.forEach(element => {
  //   element.data = temp1
  // });
  // chartTemp1.update()

  // chartTemp2.data.labels = date
  // chartTemp2.data.datasets.forEach(element => {
  //   element.data = temp2
  // });
  // chartTemp2.update()
}
 

// Cria o gráfico
