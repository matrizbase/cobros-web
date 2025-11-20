async function realizarBusqueda() {
  const pin = document.getElementById("pin").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const dpi = document.getElementById("dpi").value.trim();
  const nit = document.getElementById("nit").value.trim();

  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "<p>Buscando información...</p>";

  // Validación del PIN
  if (!pin) {
    resultado.innerHTML = "<div class='card error'>Debes ingresar tu PIN.</div>";
    return;
  }

  try {
    // 1️⃣ Verificar PIN
    const loginResp = await fetch(`${BACKEND}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin })
    });

    const loginData = await loginResp.json();

    if (!loginData.ok) {
      resultado.innerHTML = "<div class='card error'>PIN incorrecto.</div>";
      return;
    }

    // 2️⃣ Buscar información
    const searchResp = await fetch(`${BACKEND}/buscar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, dpi, nit })
    });

    const data = await searchResp.json();

    // 3️⃣ Mostrar resultado
    resultado.innerHTML = `
      <div class="card">
        <h3>Resultado de la Búsqueda</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;
  } catch (err) {
    resultado.innerHTML = `<div class='card error'>Error: ${err}</div>`;
  }
}
