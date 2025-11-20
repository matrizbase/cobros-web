const BACKEND = "https://cobros-backend-shcg.onrender.com";

async function realizarBusqueda() {
  const pin = document.getElementById("pin").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const dpi = document.getElementById("dpi").value.trim();
  const nit = document.getElementById("nit").value.trim();

  const resultado = document.getElementById("resultado");

  // Mostrar mensaje mientras consulta
  resultado.innerHTML = "Buscando...";

  // Construir querystring
  const params = new URLSearchParams();

  if (pin) params.append("pin", pin);
  if (nombre) params.append("nombre", nombre);
  if (dpi) params.append("dpi", dpi);
  if (nit) params.append("nit", nit);

  try {
    const resp = await fetch(`${BACKEND}/buscar?${params.toString()}`, {
      method: "GET"
    });

    const data = await resp.json();

    resultado.innerHTML = `
      <div class="card">
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;
  } catch (err) {
    resultado.innerHTML = `
      <div class="card error">
        Error al conectar con el servidor:<br>${err}
      </div>
    `;
  }
}
