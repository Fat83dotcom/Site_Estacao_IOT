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
