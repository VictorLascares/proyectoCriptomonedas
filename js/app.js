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



async function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'; 
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.log(error);
    }
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

async function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda]); 
    } catch (error) {
        console.log(error);
    }
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
}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    const bounce1 = document.createElement('div');
    bounce1.classList.add('bounce1');
    const bounce2 = document.createElement('div');
    bounce2.classList.add('bounce2');
    const bounce3 = document.createElement('div');
    bounce3.classList.add('bounce3');

    spinner.appendChild(bounce1);
    spinner.appendChild(bounce2);
    spinner.appendChild(bounce3);
    
    resultado.appendChild(spinner);
}
