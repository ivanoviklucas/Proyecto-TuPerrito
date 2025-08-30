let razasGlobal = []; // Guarda la lista original de razas

async function llamarPerrito() {
  try {
    const res = await fetch(`https://dog.ceo/api/breeds/list/all`);
    const data = await res.json();
    razasGlobal = Object.keys(data.message); // Guardamos las razas

    crearBuscador(); // Creamos el input y botón
  } catch (error) {
    console.error("Error:", error);
  }
}

llamarPerrito();
async function crearBuscador() {
  fetch("/imagenes/CaracteristicasRaza.JSON")
  .then(res => res.json())
  .then(data => {
    caracteristicasRaza = data;
  })
  .catch(err => console.error("Error cargando CaracteristicasRaza.JSON:", err));
  const contenedor = document.getElementById("perrichou");

  // Creamos el buscador (input + botón) una sola vez
  contenedor.innerHTML = `
    <input type="text" placeholder="Buscar raza de perro..." id="buscadorRaza"/>
    <button id="buscador">Buscar</button>
    <div id="contenedorTarjetas"></div>
  `;

  // Cuando se hace click en "Buscar", se ejecuta filtrarRazas
  document.getElementById("buscador").addEventListener("click", filtrarRazas);
}

function manejarClickBoton(event) {
  if (event.target.tagName === "BUTTON") {
    const categoria = event.target.dataset.categoria;
    const contenedorBotones = document.querySelector(".boton-caracteristicas");
 console.log(categoria)
 let textoMostrar = caracteristicasRaza[razaActiva][categoria];
 let contenedorInfo = document.getElementById("contenedorInfo");
  contenedorInfo.innerHTML = textoMostrar
  }
}

function ActivaBoton() {
  contenedorTarjetas.addEventListener("click");
}
let razaActiva = "";
function crearTarjetaUnica(raza) {
  razaActiva = raza;
  const contenedorTarjetas = document.getElementById("contenedorTarjetas");
  contenedorTarjetas.innerHTML = ""; // Limpiamos lo anterior

  fetch(`https://dog.ceo/api/breed/${raza}/images/random`)
    .then((res) => res.json())
    .then((info) => {
      // Mostramos solo una tarjeta
      contenedorTarjetas.innerHTML = `
        <div class="contenedorbuscador">
          <img src="${info.message}" alt="${raza}">
          <h2>${raza.charAt(0).toUpperCase() + raza.slice(1)}</h2>
          <div class= "boton-caracteristicas">
      <button data-categoria="alimentacion">Alimentación</button>
      <button data-categoria="cuidado">Cuidado</button>
      <button data-categoria="comportamiento">Comportamiento</button>
      <button data-categoria="historia">Historia</button>
      <h1 id = "contenedorInfo"></h1>
          </div>
        </div>
      `;
        const contenedorBotones = document.querySelector(".boton-caracteristicas");
      contenedorBotones.addEventListener("click", manejarClickBoton);
    })
    .catch((error) => console.error("Error al obtener imagen:", error));
    
}

function filtrarRazas() {
  const buscador = document.getElementById("buscadorRaza").value.toLowerCase();

  // Filtramos la raza buscada (una sola)
  const razaEncontrada = razasGlobal.find((raza) =>
    raza.toLowerCase().includes(buscador)
  );

  if (razaEncontrada) {
    crearTarjetaUnica(razaEncontrada); // Mostramos solo una tarjeta
  } else {
    // Si no se encuentra, limpiamos el contenedor
    document.getElementById("contenedorTarjetas").innerHTML = "";
  }
}
