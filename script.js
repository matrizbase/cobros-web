<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cobros Web</title>
  <style>
    body { font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:20px; }
    .container { max-width:600px; margin:auto; background:white; padding:20px; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.1); }
    input, button { width:100%; padding:10px; margin:10px 0; }
    button { background:#007bff; color:white; border:none; cursor:pointer; }
    button:hover { background:#0056b3; }
  </style>
</head>
<body>

<div class="container">
  <h2>Consulta de Cliente</h2>
  <input id="codigo" placeholder="Código de cliente" />
  <input id="nombre" placeholder="Nombre" />
  <input id="nit" placeholder="NIT" />
  <input id="dpi" placeholder="DPI" />
  <button onclick="buscar()">Buscar</button>
  <button onclick="location.reload()">Recargar</button>
  <pre id="resultado"></pre>
</div>

<script>
  const BACKEND = "https://cobros-backend-shcg.onrender.com";
</script>

<script>
async function buscar() {
  const codigo = document.getElementById("codigo").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const nit = document.getElementById("nit").value.trim();
  const dpi = document.getElementById("dpi").value.trim();

  const query = { codigo, nombre, nit, dpi };

  try {
    const resp = await fetch(`${BACKEND}/buscar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    });

    const data = await resp.json();
    document.getElementById("resultado").textContent = JSON.stringify(data, null, 2);

  } catch (err) {
    document.getElementById("resultado").textContent = "Error: " + err;
  }
}
</script>

</body>
</html>
