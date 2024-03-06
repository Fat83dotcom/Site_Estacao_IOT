/*  Desenvolvido por: BrainStorm Tecnologia 
    Desenvolvedor: Fernando Mendes
    todos os direitos reservados 2024 © BrainStorm Tecnologia
*/

async function execStdDvAPIGraphs() {
    await engineAPI24Hrs(urlAPI24)
    await engineAPI168Hrs(urlAPI168)
}

window.addEventListener('load', () => {
    execStdDvAPIGraphs()
})

const refresh = () =>{
    execStdDvAPIGraphs()
}

