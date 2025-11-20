// script.js funcional para tu diseño

async function realizarBusqueda() {
  const pin = document.getElementById("pin").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const dpi = document.getElementById("dpi").value.trim();
  const nit = document.getElementById("nit").value.trim();

  const resultado = document.getElementById("resultado");

  if (!pin) {
    resultado.innerHTML = "<div class='card error'>Ingresa tu PIN.</div>";
    return;
  }

  // Primero validamos el PIN
  let token = null;

  try {
    const loginResp = await fetch(BACKEND + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin })
    });

    const loginData = await loginResp.json();

    if (!loginResp.ok) {
      resultado.innerHTML = `<div class='card error'>PIN inválido: ${loginData.detail}</div>`;
      return;
    }

    token = loginData.token;

  } catch (err) {
    resultado.innerHTML = `<div class='card error'>Error al conectar con el backend.</div>`;
    return;
  }

  // Ahora hacemos la búsqueda
  const qs = new URLSearchParams();
  if (nombre) qs.append("nombre", nombre);
  if (dpi) qs.append("dpi", dpi);
  if (nit) qs.append("nit", nit);

  try {
    const resp = await fetch(BACKEND + "/buscar?" + qs.toString(), {
      headers: {
        "x-api-key": token
      }
    });

    const data = await resp.json();

    if (!resp.ok) {
      resultado.innerHTML = `<div class='card error'>Error en la búsqueda: ${data.detail}</div>`;
      return;
    }

    resultado.innerHTML =
      `<pre class="card">${JSON.stringify(data, null, 2)}</pre>`;

  } catch (err) {
    resultado.innerHTML = `<div class='card error'>Error de conexión al buscar.</div>`;
  }
}
