let razasGlobal = []; // Lista de todas las razas
let caracteristicasRaza = {}; // Datos del JSON de características
let razaActiva = "";

// ---------------- Cargar lista de razas y JSON ----------------
async function iniciarApp() {
  try {
    // 1. Obtener razas de la API Dog CEO
    const res = await fetch("https://dog.ceo/api/breeds/list/all");
    const data = await res.json();
    razasGlobal = Object.keys(data.message);

    // 2. Obtener JSON de características
    const resJson = await fetch("/imagenes/CaracteristicasRaza.JSON");
    caracteristicasRaza = await resJson.json();

    // 3. Crear el buscador una vez que todo esté listo
    crearBuscador();
  } catch (err) {
    console.error("Error cargando datos:", err);
  }
}

iniciarApp();

// ---------------- Crear buscador ----------------
function crearBuscador() {
  const contenedor = document.getElementById("perrichou");
  contenedor.innerHTML = `
    <input type="text" placeholder="Buscar raza de perro..." id="buscadorRaza"/>
    <button id="buscador">Buscar</button>
    <div id="contenedorTarjetas"></div>
  `;
  document.getElementById("buscador").addEventListener("click", filtrarRazas);
}

// ---------------- Filtrar raza ----------------
function filtrarRazas() {
  const buscador = document.getElementById("buscadorRaza").value.toLowerCase();
  const razaEncontrada = razasGlobal.find(r => r.toLowerCase().includes(buscador));
  if (razaEncontrada) {
    crearTarjetaUnica(razaEncontrada);
  } else {
    document.getElementById("contenedorTarjetas").innerHTML = "";
  }
}

// ---------------- Crear tarjeta única ----------------
function crearTarjetaUnica(raza) {
  razaActiva = raza;
  const contenedorTarjetas = document.getElementById("contenedorTarjetas");
  contenedorTarjetas.innerHTML = "";

  fetch(`https://dog.ceo/api/breed/${raza}/images/random`)
    .then(res => res.json())
    .then(info => {
      contenedorTarjetas.innerHTML = `
        <div class="contenedorbuscador">
          <img src="${info.message}" alt="${raza}">
          <h2>${raza.charAt(0).toUpperCase() + raza.slice(1)}</h2>
          <div class="boton-caracteristicas">
            <button data-categoria="alimentacion">Alimentación</button>
            <button data-categoria="cuidado">Cuidado</button>
            <button data-categoria="comportamiento">Comportamiento</button>
            <button data-categoria="historia">Historia</button>
            <h1 id="contenedorInfo"></h1>
          </div>
        </div>
      `;

      // -------------- Eventos de botones --------------
      const contenedorBotones = document.querySelector(".boton-caracteristicas");
      contenedorBotones.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", manejarClickBoton);
        btn.addEventListener("touchstart", manejarClickBoton); // Para móviles
      });
    })
    .catch(err => console.error("Error al obtener imagen:", err));
}

// ---------------- Manejar click en categoría ----------------
function manejarClickBoton(event) {
  const categoria = event.target.dataset.categoria;
  if (!categoria || !caracteristicasRaza[razaActiva]) return;

  const textoMostrar = caracteristicasRaza[razaActiva][categoria] || "Información no disponible.";
  const contenedorInfo = document.getElementById("contenedorInfo");
  if (contenedorInfo) {
    contenedorInfo.innerHTML = textoMostrar;
  }
}
