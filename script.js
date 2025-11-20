// URL del backend
const BACKEND = "https://cobros-backend-shcg.onrender.com";

// Botón Login
async function realizarLogin() {
    const pin = document.getElementById("pin").value.trim();
    if (!pin) {
        alert("Debe ingresar un PIN.");
        return;
    }

    try {
        const response = await fetch(`${BACKEND}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pin })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "PIN incorrecto");
            return;
        }

        document.getElementById("login").style.display = "none";
        document.getElementById("buscador").style.display = "block";

    } catch (error) {
        alert("Error al conectar con el servidor.");
        console.error(error);
    }
}

// BUSCADOR
async function realizarBusqueda() {
    let valor = document.getElementById("consulta").value.trim();
    if (!valor) {
        alert("Debe ingresar un valor para buscar.");
        return;
    }

    try {
        const url = `${BACKEND}/buscar?valor=${encodeURIComponent(valor)}`;
        console.log("Llamando API:", url);

        const response = await fetch(url);
        const data = await response.json();

        const contenedor = document.getElementById("resultado");
        contenedor.innerHTML = "";

        if (!data || data.length === 0) {
            contenedor.innerHTML = "<p>No se encontraron resultados.</p>";
            return;
        }

        data.forEach(item => {
            const div = document.createElement("div");
            div.className = "resultado-item";
            div.innerHTML = `
                <p><strong>Cliente:</strong> ${item.CLIENTE || ""}</p>
                <p><strong>NIT:</strong> ${item.NIT || ""}</p>
                <p><strong>DPI:</strong> ${item.DPI || ""}</p>
                <p><strong>Teléfonos:</strong> ${item.TELEFONOS || ""}</p>
                <hr>
            `;
            contenedor.appendChild(div);
        });

    } catch (error) {
        console.error(error);
        alert("Error al realizar la búsqueda.");
    }
}
