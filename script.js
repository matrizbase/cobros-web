// ========================================
//  CONFIG
// ========================================
const BACKEND = "https://cobros-backend-shcg.onrender.com";

// ========================================
//  LOGIN
// ========================================
const pinInput = document.getElementById("pin-input");
const pinBtn   = document.getElementById("pin-btn");
const pinMsg   = document.getElementById("pin-msg");
const asesorNameEl = document.getElementById("asesor-name");
const logoutBtn = document.getElementById("logout-btn");

let token = null;
let asesor = "";

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
        if (!resp.ok) {
            pinMsg.innerText = data.detail || "PIN inválido";
            return;
        }

        token = data.token;
        asesor = data.asesor;

        asesorNameEl.innerText = asesor;
        pinMsg.innerText = "Conectado ✔";
        pinInput.value = "";
        pinBtn.disabled = true;

    } catch (err) {
        console.error(err);
        pinMsg.innerText = "Error al conectar con el backend.";
    }
}

logoutBtn.onclick = () => {
    token = null;
    asesor = "";
    asesorNameEl.innerText = "No conectado";
    pinMsg.innerText = "Sesión cerrada";
    pinBtn.disabled = false;
};

// ========================================
//  BÚSQUEDA PRINCIPAL
// ========================================
const nombreInput = document.getElementById("nombre");
const dpiInput = document.getElementById("dpi");
const nitInput = document.getElementById("nit");
const buscarBtn = document.getElementById("buscar-btn");
const spinner = document.getElementById("spinner");

const resultArea = document.getElementById("result-area");
const internalEl = document.getElementById("internal-result");

async function buscar() {
    if (!token) {
        alert("Debes iniciar sesión antes de buscar.");
        return;
    }

    const nombre = nombreInput.value.trim();
    const dpi    = dpiInput.value.trim();
    const nit    = nitInput.value.trim();

    if (!nombre && !dpi && !nit) {
        alert("Ingresa al menos un dato para buscar.");
        return;
    }

    spinner.style.display = "inline-block";

    try {
        const resp = await fetch(`${BACKEND}/buscar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": token
            },
            body: JSON.stringify({ nombre, dpi, nit })
        });

        const data = await resp.json();
        console.log("RESPUESTA BACKEND:", data);

        internalEl.innerHTML = "";
        resultArea.style.display = "block";

        if (!data.resultados || data.resultados.length === 0) {
            internalEl.innerHTML = "<p>No se encontraron datos.</p>";
            return;
        }

        data.resultados.forEach(item => {
            const tels = item.Telefonos?.length
                ? item.Telefonos.join(", ")
                : "No tiene teléfonos";

            const card = document.createElement("div");
            card.className = "result-card";
            card.innerHTML = `
                <p><strong>Nombre:</strong> ${item.Nombre}</p>
                <p><strong>DPI:</strong> ${item.DPI}</p>
                <p><strong>NIT:</strong> ${item.NIT}</p>
                <p><strong>Email:</strong> ${item.Email}</p>
                <p><strong>Teléfonos:</strong> ${tels}</p>
            `;

            internalEl.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        alert("Error de conexión.");
    } finally {
        spinner.style.display = "none";
    }
}

// EVENTOS
pinBtn.onclick = loginPin;
buscarBtn.onclick = buscar;
