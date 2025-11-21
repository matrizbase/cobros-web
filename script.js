const BACKEND = "https://cobros-backend-shcg.onrender.com"
async function realizarBusqueda() {
    const nombre = document.getElementById("nombre-input").value.trim();
    const dpi = document.getElementById("dpi-input").value.trim();
    const nit = document.getElementById("nit-input").value.trim();

    if (!nombre && !dpi && !nit) {
        alert("Ingrese al menos un campo para buscar.");
        return;
    }

    const params = new URLSearchParams({
        nombre: nombre,
        dpi: dpi,
        nit: nit,
        modo: "buscar"
    });

    try {
        const response = await fetch(`${BACKEND}?${params.toString()}`);
        const data = await response.json();

        if (!data || data.length === 0) {
            alert("No se encontraron resultados.");
            return;
        }

        mostrarResultados(data);

    } catch (error) {
        console.error("Error en la búsqueda:", error);
        alert("Error al conectar con el servidor.");
    }
}

function mostrarResultados(lista) {
    const contenedor = document.getElementById("resultados");
    contenedor.innerHTML = "";

    lista.forEach(item => {
        const div = document.createElement("div");
        div.className = "resultado-item";
        div.innerHTML = `
            <strong>Nombre:</strong> ${item.Nombre}<br>
            <strong>DPI:</strong> ${item.DPI}<br>
            <strong>NIT:</strong> ${item.NIT}<br>
            <strong>Producto:</strong> ${item.Producto}<br>
            <hr>
        `;
        contenedor.appendChild(div);
    });
}
