const BACKEND = "https://cobros-backend-shcg.onrender.com";

async function realizarBusqueda() {
  const pin = document.getElementById("pin").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const dpi = document.getElementById("dpi").value.trim();
  const nit = document.getElementById("nit").value.trim();

  const resultado = document.getElementById("resultado");
  resultado.innerHTML = `<div class="card">Buscando...</div>`;

  try {
    const resp = await fetch(`${BACKEND}/buscar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin, nombre, dpi, nit })
    });

    const data = await resp.json();

    resultado.innerHTML = `
      <div class="card">
      ${JSON.stringify(data, null, 2)}
      </div>`;
  } catch (err) {
    resultado.innerHTML = `
      <div class="card error">
        ❌ Error al conectar con el servidor<br><br>${err}
      </div>`;
  }
}
