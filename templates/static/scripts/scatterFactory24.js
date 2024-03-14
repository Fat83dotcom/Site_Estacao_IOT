const options = {
    responsive: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    stacked: false,
    plugins: {
        title: {
            display: true,
            text: 'Dispersão Temperatura X Umidade'
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Data',
                color: 'rgba(0, 0, 0, 0.6)'
            },
        },
        y: {
            id: 'y',
            type: 'linear',
            display: true,
            position: 'left',
            title: {
                display: true,
                text: 'Temperatura',
                color: 'rgba(0, 0, 0, 0.6)'
            },
            ticks: {
                callback: (value) => {
                    return `${value} °C`;
                }
            },
        },
        y1: {
            id: 'y1',
            type: 'linear',
            display: true,
            position: 'right',
            title: {
                display: true,
                text: 'Umidade',
                color: 'rgba(0, 0, 0, 0.6)'
            },
            ticks: {
                callback: (value) => {
                    return `${value} %`;
                }
            },
            grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
        },
    }
}

const data = {
    labels: [],
    datasets: [
        {
            label: 'Temperatura',
            data: [],
            borderColor: "rgba(255, 0, 0, 0.8)",
            yAxisID: 'y',
            borderWidth: 1,
            pointRadius: 1,
            radius: 1,
            cubicInterpolationMode: 'monotone',
            fill: false,
        },
        {
            label: 'Umidade',
            data: [],
            borderColor: "rgba(0, 0, 0, 0.8)",
            yAxisID: 'y1',
            borderWidth: 1,
            pointRadius: 1,
            radius: 1,
            cubicInterpolationMode: 'monotone',
            fill: false,
        }
    ]
}

const config = {
    type: 'line',
    data: data,
    options: options,
}

const scatterGraph24Doc = document.getElementById('scatter')
const scatterGraph24 = new Chart(scatterGraph24Doc, config);

const updateScatterChart24 = (date_hour, temperature, humidity, configData) => {
    if (configData.datasets[0].data.length > 0) {
        configData.datasets[0].data.length = 0
    }
    if (configData.datasets[1].data.length > 0) {
        configData.datasets[1].data.length = 0
    }
    if (configData.labels.length > 0) {
        configData.labels.length = 0
    }
    temperature.forEach(element => {
        configData.datasets[0].data.push(element)
    })
    humidity.forEach(element => {
        configData.datasets[1].data.push(element)
    })
    date_hour.forEach(element => {
        configData.labels.push(element)
    })
    scatterGraph24.update()
}

const updateSpinner = () => {
    const contentA = document.getElementById('fade-scatter24')
    const spinner = document.getElementById('spinner-endScatter24')
    contentA.style.display = 'block'
    spinner.style.display = 'none'
    setTimeout(() => {
      contentA.style.opacity = 1
    }, 30)
  };


const engineChartAPIScatter = urlScatter => {
    fetch(urlScatter)
      .then(response => {
        if (response.status !== 200) throw new Error(
          'Dados não encontrados: ' + responseStats.statusText
        )
        return response.json()
      })
      .then(dataScatter => {
        let date = []
        let humidity = []
        let temperature = []
        dataScatter.forEach(element => {
            date.push(element.date_hour)
            temperature.push(element.temperature)
            humidity.push(element.humidity)
        })
    
        updateScatterChart24(date, temperature, humidity, data)    
        updateSpinner()
    })
}
