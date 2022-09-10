const criptomonedaSelect = document.querySelector('#criptomonedas');

// Crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
}) 


window.onload = function() {
    consultarCriptomonedas();
}



function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'; 
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => console.log(criptomonedas))
        .catch(error => console.log(error));
}
