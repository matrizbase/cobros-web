// script.js - lógica del dashboard
(() => {
  const BACKEND = window.BACKEND || (typeof BACKEND!=="undefined" ? BACKEND : "");
  const pinInput = document.getElementById("pin-input");
  const pinBtn = document.getElementById("pin-btn");
  const pinMsg = document.getElementById("pin-msg");
  const asesorNameEl = document.getElementById("asesor-name");
  const logoutBtn = document.getElementById("logout-btn");

  const buscarBtn = document.getElementById("buscar-btn");
  const buscarValorBtn = document.getElementById("buscar-valor-btn");
  const reloadBtn = document.getElementById("reload-btn");
  const exportBtn = document.getElementById("export-btn");
  const spinner = document.getElementById("spinner");

  const nombreInput = document.getElementById("nombre");
  const dpiInput = document.getElementById("dpi");
  const nitInput = document.getElementById("nit");

  const resultArea = document.getElementById("result-area");
  const internalEl = document.getElementById("internal-result");
  const externalEl = document.getElementById("external-result");
  const numerosArea = document.getElementById("numeros-area");
  const numerosList = document.getElementById("numeros-list");
  const historialArea = document.getElementById("historial-area");
  const historialJson = document.getElementById("historial-json");

  const menuBuscar = document.getElementById("menu-buscar");
  const menuHist = document.getElementById("menu-historial");
  const menuNums = document.getElementById("menu-numeros");
  const backendUrlEl = document.getElementById("backend-url");

  backendUrlEl.innerText = BACKEND;

  let token = null;
  let asesor = null;

  function showSpinner(show=true){
    spinner.style.display = show ? "inline-block" : "none";
  }

  async function loginPin(){
    const pin = pinInput.value.trim();
    if(!pin){ pinMsg.innerText = "Ingresa PIN"; return; }
    pinMsg.innerText = "Conectando...";
    try{
      const res = await fetch(BACKEND + "/login", {
        method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({pin})
      });
      const j = await res.json();
      if(!res.ok){ pinMsg.innerText = j.detail || "PIN inválido"; return; }
      token = j.token; asesor = j.asesor;
      pinMsg.innerText = "Conectado como " + asesor;
      asesorNameEl.innerText = asesor;
      pinInput.value = "";
      document.getElementById("pin-btn").disabled = true;
    }catch(e){
      pinMsg.innerText = "Error de conexión";
    }
  }

  async function logout(){
    token = null; asesor = null;
    asesorNameEl.innerText = "No conectado";
    document.getElementById("pin-btn").disabled = false;
  }

  async function buscar(){
    if(!token){ alert("Debes iniciar sesión con PIN"); return; }
    const nombre = nombreInput.value.trim();
    const dpi = dpiInput.value.trim();
    const nit = nitInput.value.trim();
    if(!nombre && !dpi && !nit){ alert("Ingresa al menos un campo"); return; }
    const qs = new URLSearchParams();
    if(nombre) qs.append("nombre", nombre);
    if(dpi) qs.append("dpi", dpi);
    if(nit) qs.append("nit", nit);
    showSpinner(true);
    try{
      const res = await fetch(BACKEND + "/buscar?" + qs.toString(), { headers: {"x-api-key": token} });
      const j = await res.json();
      showSpinner(false);
      if(!res.ok){ alert(j.detail || "Error en búsqueda"); return; }
      renderResult(j);
    }catch(e){
      showSpinner(false);
      alert("Error al conectar con el backend");
    }
  }

  async function buscarValor(){
    if(!token){ alert("Debes iniciar sesión con PIN"); return; }
    const valor = prompt("Ingrese valor para búsqueda parcial (ej: apellido, parte DPI, teléfono):");
    if(!valor) return;
    showSpinner(true);
    try{
      const res = await fetch(BACKEND + "/buscar?valor=" + encodeURIComponent(valor), { headers: {"x-api-key": token} });
      const j = await res.json();
      showSpinner(false);
      if(!res.ok){ alert(j.detail || "Error en búsqueda"); return; }
      renderResult(j);
    }catch(e){
      showSpinner(false);
      alert("Error al conectar con el backend");
    }
  }

  function renderResult(j){
    resultArea.style.display = "block";
    // interno
    if(j.internal && j.internal.length){
      let html = "<table><thead><tr><th>Nombre</th><th>DPI</th><th>NIT</th><th>Teléfonos</th><th>Email</th></tr></thead><tbody>";
      j.internal.forEach(r=>{
        html += `<tr>
          <td>${escapeHtml(r.Nombre||"")}</td>
          <td>${escapeHtml(r.DPI||"")}</td>
          <td>${escapeHtml(r.NIT||"")}</td>
          <td>${(r.TelBase||[]).map(t=>escapeHtml(t)).join(" | ")}</td>
          <td>${escapeHtml(r.Email||"")}</td>
        </tr>`;
      });
      html += "</tbody></table>";
      internalEl.innerHTML = html;
    } else {
      internalEl.innerHTML = "<div class='muted'>No encontrado en base interna</div>";
    }

    // externo
    if(j.external){
      let ext = "<div>";
      if(j.external.links && j.external.links.length){
        ext += "<div><strong>Links:</strong><ul>";
        j.external.links.forEach(u=>{
          ext += `<li><a class='link' href='${u}' target='_blank'>${u}</a></li>`;
        });
        ext += "</ul></div>";
      }
      if(j.external.phones && j.external.phones.length){
        ext += `<div><strong>Teléfonos:</strong> ${j.external.phones.join(" | ")}</div>`;
      }
      if(j.external.emails && j.external.emails.length){
        ext += `<div><strong>Emails:</strong> ${j.external.emails.join(" | ")}</div>`;
      }
      ext += "</div>";
      externalEl.innerHTML = ext;
    } else {
      externalEl.innerHTML = "<div class='muted'>Sin resultados externos</div>";
    }
  }

  function escapeHtml(s){ return String(s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }

  async function verNumeros(){
    numerosArea.style.display = "block";
    try{
      const res = await fetch(BACKEND + "/numeros/full?limit=200");
      const j = await res.json();
      if(j.status === "ok"){
        const rows = j.rows || [];
        let html = "<table><thead><tr>";
        if(rows.length){
          Object.keys(rows[0]).forEach(c=> html += `<th>${c}</th>`);
          html += "</tr></thead><tbody>";
          rows.forEach(r=>{
            html += "<tr>";
            Object.values(r).forEach(v=> html += `<td>${escapeHtml(v)}</td>`);
            html += "</tr>";
          });
          html += "</tbody></table>";
        } else {
          html = "<div>No hay registros</div>";
        }
        numerosList.innerHTML = html;
      } else {
        numerosList.innerHTML = "<div>Error al leer base</div>";
      }
    }catch(e){
      numerosList.innerHTML = "<div>Error de conexión</div>";
    }
  }

  async function verHistorial(){
    if(!token){ alert("Debes iniciar sesión"); return; }
    try{
      const res = await fetch(BACKEND + "/history", { headers: {"x-api-key": token} });
      const j = await res.json();
      historialArea.style.display = "block";
      historialJson.textContent = JSON.stringify(j.history || [], null, 2);
    }catch(e){
      alert("Error al cargar historial");
    }
  }

  async function doReload(){
    if(!token){ alert("Debes iniciar sesión"); return; }
    if(!confirm("Recargar la base desde el archivo Excel en el servidor?")) return;
    try{
      const res = await fetch(BACKEND + "/reload", { headers: {"x-api-key": token} });
      const j = await res.json();
      alert("Recarga: " + (j.status || JSON.stringify(j)));
    }catch(e){
      alert("Error en reload");
    }
  }

  async function exportLatest(){
    if(!token){ alert("Debes iniciar sesión"); return; }
    try{
      const res = await fetch(BACKEND + "/export", { headers: {"x-api-key": token} });
      const j = await res.json();
      if(j.csv){
        // descargar CSV
        const blob = new Blob([j.csv], {type:"text/csv"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "export.csv"; a.click();
        URL.revokeObjectURL(url);
      } else alert("No hay datos para exportar");
    }catch(e){
      alert("Error al exportar");
    }
  }

  // menu handlers
  menuBuscar.onclick = (e)=>{ e.preventDefault(); showArea("buscar"); };
  menuHist.onclick = (e)=>{ e.preventDefault(); showArea("historial"); verHistorial(); };
  menuNums.onclick = (e)=>{ e.preventDefault(); showArea("numeros"); verNumeros(); };

  function showArea(name){
    resultArea.style.display = name==="buscar" ? (resultArea.style.display||"none") : "none";
    numerosArea.style.display = name==="numeros" ? "block" : "none";
    historialArea.style.display = name==="historial" ? "block" : "none";
  }

  // events
  pinBtn.onclick = loginPin;
  logoutBtn.onclick = logout;
  buscarBtn.onclick = buscar;
  buscarValorBtn.onclick = buscarValor;
  reloadBtn.onclick = doReload;
  exportBtn.onclick = exportLatest;

  // quick UX: press Enter in DPI or NIT -> search
  dpiInput.addEventListener("keydown", (e)=>{ if(e.key==="Enter") buscar(); });
  nitInput.addEventListener("keydown", (e)=>{ if(e.key==="Enter") buscar(); });

  // initial
  showArea("buscar");
})();
