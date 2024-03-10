/*  Desenvolvido por: BrainStorm Tecnologia 
    Desenvolvedor: Fernando Mendes
    todos os direitos reservados 2024 © BrainStorm Tecnologia
*/

function execStdDvAPIGraphs() {
    engineAPI24Hrs(urlAPIGRAPH24, urlAPISTATS24)
    engineAPI168Hrs(urlAPI168, urlAPISTATS168)
}

window.addEventListener('load', () => {
    execStdDvAPIGraphs()
})

const refresh = () =>{
    execStdDvAPIGraphs()
}

