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
    labels: date_hour,
    datasets: [
        {
            label: 'Temperatura',
            data: temperature,
            borderColor: "#000",
            borderWidth: 1.5,
            backgroundColor: 'rgb(79, 232, 95, 0.4)',
            yAxisID: 'y',
            pointRadius: 1.5,
        },
        {
            label: 'Umidade',
            data: humidity,
            borderColor: '#0ff',
            borderWidth: 1.5,
            backgroundColor: 'rgb(79, 232, 95, 0.4)',
            yAxisID: 'y1',
            pointRadius: 1.5,
        }
    ]
}


const config = {
    type: 'line',
    data: data,
    options: options,
}

const updateScatterChart24 = (date_hour, temperature, humidity, config) => {
    config.data.datasets.
    scatterGraph24.update()
    return data
}




const scatterGraph24Doc = document.getElementById('scatter')
const scatterGraph24 = new Chart(scatterGraph24Doc, config);

const updateSpinner = () => {
    const contentA = document.getElementById('fade-sensor24')
    const spinner = document.getElementById('spinner-end24')
    contentA.style.display = 'block'
    spinner.style.display = 'none'
    setTimeout(() => {
      contentA.style.opacity = 1
    }, 30)
  };


const engineChartAPIScatter = urlScatter => {
    fetch(urlScatter)
      .then(response => {
        if (responseStats.status !== 200) throw new Error(
          'Dados não encontrados: ' + responseStats.statusText
        )
        return responseStats.json()
      })
      .then(dataScatter => {
        let date = []
        let humidity = []
        let temperature = []
        dataScatter.array.forEach(element => {
            date.push(element.date_hour)
            date.push(element.temperature)
            date.push(element.humidity)
        })
        updateScatterChart24(date, temperature, humidity)
        
        updateSpinner()
    })
}
