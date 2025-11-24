// ========================================
//  script.js — Versión corregida para tu backend actual
// ========================================

// Tu backend en Render
const BACKEND = "https://cobros-backend-shcg.onrender.com";

// ------------------ DOM ------------------
const pinInput      = document.getElementById("pin-input");
const pinBtn        = document.getElementById("pin-btn");
const pinMsg        = document.getElementById("pin-msg");
const asesorNameEl  = document.getElementById("asesor-name");
const logoutBtn     = document.getElementById("logout-btn");

const nombreInput   = document.getElementById("nombre");
const dpiInput      = document.getElementById("dpi");
const nitInput      = document.getElementById("nit");

const buscarBtn         = document.getElementById("buscar-btn");
const buscarValorBtn    = document.getElementById("buscar-valor-btn");
const spinner           = document.getElementById("spinner");

const resultArea    = document.getElementById("result-area");
const internalEl    = document.getElementById("internal-result");
const externalEl    = document.getElementById("external-result");

const menuBuscar    = document.getElementById("menu-buscar");
const menuHist      = document.getElementById("menu-historial");
const menuNums      = document.getElementById("menu-numeros");

// Estado
let token = null;


// ========================================
//  LOGIN — se valida el PIN en frontend
// ========================================
async function loginPin() {
  const pin = pinInput.value.trim();

  const PINS_VALIDOS = [
    "482911","583022","694133","705244","816355",
    "927466","190577","201688","312799","423800",
    "534911","645022","756133","867244","978355"
  ];

  if (!PINS_VALIDOS.includes(pin)) {
    pinMsg.innerText = "PIN inválido";
    return;
  }

  token = pin;  
  asesorNameEl.innerText = "Asesor conectado";
  pinMsg.innerText = "Conexión exitosa";
  pinBtn.disabled = true;
}


// ========================================
//  BÚSQUEDA — GET /buscar?nombre=...&dpi=...&nit=...
// ========================================
async function buscar() {
  if (!token) {
    alert("Debes iniciar sesión primero.");
    return;
  }

  const nombre = nombreInput.value.trim();
  const dpi    = dpiInput.value.trim();
  const nit    = nitInput.value.trim();

  const params = new URLSearchParams();

  if (nombre) params.append("nombre", nombre);
  if (dpi)    params.append("dpi", dpi);
  if (nit)    params.append("nit", nit);

  if (!params.toString()) {
    alert("Ingrese al menos un campo.");
    return;
  }

  spinner.style.display = "inline-block";

  try {
    const resp = await fetch(`${BACKEND}/buscar?${params.toString()}`);
    const data = await resp.json();

    spinner.style.display = "none";

    renderResultados(data);

  } catch (err) {
    spinner.style.display = "none";
    alert("Error al conectar con backend");
    console.error(err);
  }
}


// ========================================
//  Render de resultados internos
// ========================================
function renderResultados(data) {
  resultArea.style.display = "block";

  const lista = data.internal || data.resultados || [];

  if (!lista.length) {
    internalEl.innerHTML = "<div class='muted'>No se encontraron registros.</div>";
    return;
  }

  let html = "<table><thead><tr>";
  html += "<th>Nombre</th><th>DPI</th><th>NIT</th><th>Teléfonos</th><th>Email</th>";
  html += "</tr></thead><tbody>";

  lista.forEach(r => {
    html += `
      <tr>
        <td>${r.Nombre || ""}</td>
        <td>${r.DPI || ""}</td>
        <td>${r.NIT || ""}</td>
        <td>${(r.TelBase || []).join(" | ")}</td>
        <td>${r.Email || ""}</td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  internalEl.innerHTML = html;
}


// ========================================
//  Eventos
// ========================================
pinBtn.onclick = loginPin;
logoutBtn.onclick = () => { token = null; asesorNameEl.innerText = "No conectado"; pinMsg.innerText = ""; pinBtn.disabled = false; };
buscarBtn.onclick = buscar;

buscarValorBtn.onclick = () => {
  alert("Búsqueda por valor aún no implementada.");
};

// Inicio
resultArea.style.display = "none";
