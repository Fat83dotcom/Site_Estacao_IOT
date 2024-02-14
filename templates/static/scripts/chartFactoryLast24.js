const ctx1 = document.getElementById('tempLast24')

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
        beginAtZero: true,
        ticks: {
          callback: value => `${value} %`
        }
      }
    }
  }
};
let chartTemperature = new Chart(ctx1, config1)

const ctx2 = document.getElementById('tempDvStdLast24')

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
          callback: value => `${value} %`
        }
      }
    }
  }
};
let chartTempDvStdLast24 = new Chart(ctx1, config1)

const updateCharts = (date, temperature) => {
    chartTemperature.data.labels = date
    chartTemperature.data.datasets.forEach(element => {
      element.data = temperature
    });
    chartTemperature.update()
  
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

