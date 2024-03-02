/*  Desenvolvido por: BrainStorm Tecnologia 
    Desenvolvedor: Fernando Mendes
    todos os direitos reservados 2024 © BrainStorm Tecnologia
*/

window.addEventListener('load', () => {
    engineAPI24Hrs(urlAPI24)  
})
window.addEventListener('load', () => {
    engineAPI168Hrs(urlAPI168)  
})

setInterval(() => {
    engineAPI24Hrs(urlAPI24)
}, 60000)
setInterval(() => {
    engineAPI168Hrs(urlAPI168)
}, 60000)
