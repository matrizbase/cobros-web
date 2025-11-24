// ===============================================
//  BUSCAR CLIENTE
// ===============================================
async function buscarCliente() {
    const nombre = document.getElementById("nombre").value.trim();
    const dpi = document.getElementById("dpi").value.trim();
    const nit = document.getElementById("nit").value.trim();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debe iniciar sesión primero");
        return;
    }

    try {
        document.getElementById("spinner").style.display = "inline-block";

        const resp = await fetch(`${BACKEND_URL}/buscar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": token
            },
            body: JSON.stringify({ nombre, dpi, nit })
        });

        const data = await resp.json();
        console.log("Respuesta backend:", data); // para depurar

        const area = document.getElementById("result-area");
        area.style.display = "block";

        const internoDiv = document.getElementById("internal-result");
        internoDiv.innerHTML = "";

        if (!data.resultados || data.resultados.length === 0) {
            internoDiv.innerHTML = `<p>No se encontraron registros.</p>`;
            return;
        }

        // ===============================================
        //  IMPRIMIR RESULTADOS
        // ===============================================
        data.resultados.forEach((item) => {
            const card = document.createElement("div");
            card.className = "result-card";

            const tels = item.Telefonos.length > 0
                ? item.Telefonos.join(", ")
                : "No tiene teléfonos registrados";

            card.innerHTML = `
                <p><strong>Nombre:</strong> ${item.Nombre}</p>
                <p><strong>DPI:</strong> ${item.DPI}</p>
                <p><strong>NIT:</strong> ${item.NIT}</p>
                <p><strong>Email:</strong> ${item.Email ?? ""}</p>
                <p><strong>Teléfonos:</strong> ${tels}</p>
            `;

            internoDiv.appendChild(card);
        });

    } catch (e) {
        console.error("Error en buscarCliente()", e);
        alert("Error al buscar. Revise la consola.");
    } finally {
        document.getElementById("spinner").style.display = "none";
    }
}
