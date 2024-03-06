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

const stdDeviation = (dataArray, average) => {
    return Math.sqrt(
        dataArray.reduce((acc, val) => acc + Math.pow(val - average, 2), 0
        ) / dataArray.length)
};
