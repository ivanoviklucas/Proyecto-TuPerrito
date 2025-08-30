let razasGlobal = []; // Lista de todas las razas
let caracteristicasRaza = {}; // Datos del JSON de características
let razaActiva = "";
let jsonListo = false; // Controla si el JSON ya se cargó

// ---------------- Crear buscador e info ----------------
function crearBuscador() {
  const contenedor = document.getElementById("perrichou");
  contenedor.innerHTML = `
    <input type="text" placeholder="Buscar raza de perro..." id="buscadorRaza"/>
    <button id="buscador">Buscar</button>
    <div id="contenedorTarjetas"></div>
    <h1 id="contenedorInfo">Selecciona una categoría</h1> <!-- Siempre visible -->
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
    document.getElementById("contenedorInfo").innerHTML = "Raza no encontrada";
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
          </div>
        </div>
      `;

      // Agregar eventos a los botones
      const contenedorBotones = contenedorTarjetas.querySelectorAll(".boton-caracteristicas button");
      contenedorBotones.forEach(btn => {
        btn.addEventListener("click", manejarClickBoton);
        btn.addEventListener("touchstart", manejarClickBoton);
      });
    })
    .catch(err => console.error("Error al obtener imagen:", err));
}

// ---------------- Manejar click en categoría ----------------
function manejarClickBoton(event) {
  const categoria = event.target.dataset.categoria;
  if (!categoria || !razaActiva || !jsonListo) return;

  const textoMostrar = caracteristicasRaza[razaActiva]?.[categoria] || "Información no disponible.";
  const contenedorInfo = document.getElementById("contenedorInfo");
  if (contenedorInfo) {
    contenedorInfo.innerHTML = textoMostrar;
  }
}

// ---------------- Iniciar App ----------------
async function iniciarApp() {
  try {
    // 1. Crear buscador e info visibles de inmediato
    crearBuscador();

    // 2. Cargar lista de razas
    const res = await fetch("https://dog.ceo/api/breeds/list/all");
    const data = await res.json();
    razasGlobal = Object.keys(data.message);

    // 3. Cargar JSON de características
    const resJson = await fetch("imagenes/CaracteristicasRaza.JSON");
    caracteristicasRaza = await resJson.json();
    jsonListo = true; // JSON listo, los botones ya pueden mostrar info

  } catch (err) {
    console.error("Error cargando datos:", err);
  }
}

iniciarApp();
