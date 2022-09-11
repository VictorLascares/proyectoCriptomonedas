const criptomonedaSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');


const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

// Crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
}) 


window.onload = function() {
    consultarCriptomonedas();
    formulario.addEventListener('submit', validarFormulario);
    criptomonedaSelect.addEventListener('change',leerValor);
    monedaSelect.addEventListener('change',leerValor);
}



function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'; 
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
        .catch(error => console.log(error));
}


function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedaSelect.appendChild(option);
    })
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function validarFormulario(e) {
    e.preventDefault();
    const { moneda, criptomoneda } = objBusqueda;
    if (!moneda || !criptomoneda) {
        mostrarAlerta('Todos los campos son obligatorios');
        return;
    }

    consultarAPI();
}

function mostrarAlerta(msg) {
    const alerta = document.querySelector('.error');
    if(!alerta) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
        divMensaje.textContent = msg;
        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda]))
        .catch(error => console.log(error));
}

function mostrarCotizacionHTML(cotizacion) {
    limpiarHTML();
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE, IMAGEURL } = cotizacion;

    const divCotizacion = document.createElement('div');

    // PRECIO
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.textContent = 'El precio es: ';

    const precioTexto = document.createElement('span');
    precioTexto.textContent = PRICE;
    
    precio.appendChild(precioTexto);
    // PRECIO MAS ALTO DEL DIA
    const precioAlto = document.createElement('p');
    precioAlto.textContent = 'Precio mas alto del dia ';

    const precioAltoTexto = document.createElement('span');
    precioAltoTexto.textContent = HIGHDAY;

    precioAlto.appendChild(precioAltoTexto);

    // PRECIO MAS BAJO DEL DIA
    const precioBajo = document.createElement('p');
    precioBajo.textContent = 'Precio mas bajo del dia ';

    const precioBajoTexto = document.createElement('span');
    precioBajoTexto.textContent = LOWDAY;

    precioBajo.appendChild(precioBajoTexto);

    // CAMBIO ULTIMAS 24 HORAS
    const ultimasHoras = document.createElement('p');
    ultimasHoras.textContent = 'Variacion ultimas 24hrs ';

    const ultimasHorasTexto = document.createElement('span');
    ultimasHorasTexto.textContent = CHANGEPCT24HOUR;

    ultimasHoras.appendChild(ultimasHorasTexto);
    // ULTIMA ACTUALIZACION
    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.textContent = 'Ultima actualizacion ';

    const ultimaActualizacionTexto = document.createElement('span');
    ultimaActualizacionTexto.textContent = LASTUPDATE;

    ultimaActualizacion.appendChild(ultimaActualizacionTexto);
    
    // IMAGEN
    const imagen = document.createElement('img');
    imagen.src = `https://www.cryptocompare.com/${IMAGEURL}`;
    imagen.alt = 'Imagen criptomoneda';


    divCotizacion.appendChild(precio);
    divCotizacion.appendChild(precioAlto);
    divCotizacion.appendChild(precioBajo);
    divCotizacion.appendChild(ultimasHoras)
    divCotizacion.appendChild(ultimaActualizacion);
    resultado.appendChild(imagen);
    resultado.appendChild(divCotizacion);
    console.log(`https://www.cryptocompare.com${IMAGEURL}`);
}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}
