// ========================================
//  script.js - Dashboard Cobros (simple)
//  Usa backend en Render: /login y /buscar
// ========================================

// Cambia esto solo si Render cambia URL:
const BACKEND = "https://cobros-backend-shcg.onrender.com";

// -------- Referencias al DOM --------
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
const reloadBtn         = document.getElementById("reload-btn");
const exportBtn         = document.getElementById("export-btn");
const spinner           = document.getElementById("spinner");

const resultArea    = document.getElementById("result-area");
const internalEl    = document.getElementById("internal-result");
const externalEl    = document.getElementById("external-result");

const numerosArea   = document.getElementById("numeros-area");
const numerosList   = document.getElementById("numeros-list");
const historialArea = document.getElementById("historial-area");
const historialJson = document.getElementById("historial-json");

const menuBuscar    = document.getElementById("menu-buscar");
const menuHist      = document.getElementById("menu-historial");
const menuNums      = document.getElementById("menu-numeros");

// -------- Estado de sesión --------
let token  = null;
let asesor = null;

// -------- Utilidades --------
function showSpinner(show = true) {
  if (!spinner) return;
  spinner.style.display = show ? "inline-block" : "none";
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ========================================
//  LOGIN
// ========================================
async function loginPin() {
  const pin = pinInput.value.trim();
  if (!pin) {
    pinMsg.innerText = "Ingresa tu PIN.";
    return;
  }

  pinMsg.innerText = "Conectando...";

  try {
    const resp = await fetch(`${BACKEND}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin })
    });

    const data = await resp.json();
    console.log("LOGIN RESP:", data);

    if (!resp.ok) {
      pinMsg.innerText = data.detail || "PIN inválido";
      return;
    }

    token  = data.token;
    asesor = data.asesor;

    pinMsg.innerText = "Conectado como " + asesor;
    asesorNameEl.innerText = asesor;
    pinInput.value = "";
    pinBtn.disabled = true;

  } catch (err) {
    console.error("Error login:", err);
    pinMsg.innerText = "Error de conexión al backend";
  }
}

function logout() {
  token  = null;
  asesor = null;
  asesorNameEl.innerText = "No conectado";
  pinMsg.innerText = "Sesión cerrada";
  pinBtn.disabled = false;
}

// ========================================
//  BÚSQUEDA PRINCIPAL (usa /buscar)
// ========================================
async function doBuscar(nombre, dpi, nit) {
  if (!token) {
    alert("Debes iniciar sesión con PIN antes de buscar.");
    return;
  }

  const body = {
    nombre: nombre || "",
    dpi: dpi || "",
    nit: nit || ""
  };

  if (!body.nombre && !body.dpi && !body.nit) {
    alert("Ingresa al menos un campo para buscar.");
    return;
  }

  showSpinner(true);
  try {
    const resp = await fetch(`${BACKEND}/buscar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token
      },
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    showSpinner(false);

    if (!resp.ok) {
      alert(data.detail || "Error en búsqueda");
      return;
    }

    renderResultados(data);

  } catch (err) {
    showSpinner(false);
    console.error("Error búsqueda:", err);
    alert("No se pudo conectar con el backend");
  }
}

async function buscar() {
  const nombre = nombreInput.value.trim();
  const dpi    = dpiInput.value.trim();
  const nit    = nitInput.value.trim();
  await doBuscar(nombre, dpi, nit);
}

// Búsqueda por valor genérico: mandamos todo en "nombre"
async function buscarPorValor() {
  const valor = prompt("Valor a buscar (nombre, DPI o NIT):");
  if (!valor) return;
  await doBuscar(valor.trim(), "", "");
}

// ========================================
//  Render de resultados internos
// ========================================
function renderResultados(data) {
  resultArea.style.display = "block";

  const lista = data.resultados || [];

  if (!lista.length) {
    internalEl.innerHTML = "<div class='muted'>No se encontraron registros en la base interna.</div>";
  } else {
    let html = "<table><thead><tr>";
    html += "<th>Nombre</th><th>DPI</th><th>NIT</th><th>Email</th><th>Teléfonos</th>";
    html += "</tr></thead><tbody>";

    lista.forEach(reg => {
      const tels = (reg.Telefonos || []).filter(t => t && t.trim()).join(" | ");
      html += `
        <tr>
          <td>${escapeHtml(reg.Nombre)}</td>
          <td>${escapeHtml(reg.DPI)}</td>
          <td>${escapeHtml(reg.NIT)}</td>
          <td>${escapeHtml(reg.Email)}</td>
          <td>${escapeHtml(tels)}</td>
        </tr>
      `;
    });

    html += "</tbody></table>";
    internalEl.innerHTML = html;
  }

  // Por ahora no hay búsqueda externa
  externalEl.innerHTML = "<div class='muted'>Búsqueda externa (web) aún no implementada.</div>";
}

// ========================================
//  Menú lateral (por ahora básico)
// ========================================
function showArea(name) {
  if (name === "buscar") {
    resultArea.style.display   = resultArea.innerHTML ? "block" : "none";
    numerosArea.style.display  = "none";
    historialArea.style.display = "none";
  } else if (name === "numeros") {
    numerosArea.style.display   = "block";
    historialArea.style.display = "none";
    resultArea.style.display    = "none";
    numerosList.innerHTML = "<div class='muted'>Vista de base aún no implementada.</div>";
  } else if (name === "historial") {
    historialArea.style.display = "block";
    numerosArea.style.display   = "none";
    resultArea.style.display    = "none";
    historialJson.textContent   = "Historial aún no implementado en esta versión.";
  }
}

// ========================================
//  Eventos
// ========================================
pinBtn.onclick        = loginPin;
logoutBtn.onclick     = logout;
buscarBtn.onclick     = buscar;
buscarValorBtn.onclick = buscarPorValor;
reloadBtn.onclick     = () => alert("Reload de base aún no implementado.");
exportBtn.onclick     = () => alert("Exportar CSV aún no implementado.");

menuBuscar.onclick = (e) => { e.preventDefault(); showArea("buscar"); };
menuNums.onclick   = (e) => { e.preventDefault(); showArea("numeros"); };
menuHist.onclick   = (e) => { e.preventDefault(); showArea("historial"); };

// Tecla Enter en DPI / NIT lanza búsqueda
dpiInput.addEventListener("keydown", (e) => { if (e.key === "Enter") buscar(); });
nitInput.addEventListener("keydown", (e) => { if (e.key === "Enter") buscar(); });

// Vista inicial
showArea("buscar");
