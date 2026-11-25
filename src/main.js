import "./style.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <section class="card">
    <header class="header">
      <span class="badge">Projeto Integrador Extensionista II</span>
      <h1>ONG Esperança Viva</h1>
      <p class="subtitle">
        Plataforma web conectada à API Express com Vite+
      </p>
    </header>

    <div class="status-panel" id="status-panel">
      <div class="status-row">
        <span class="indicator loading" id="status-indicator"></span>
        <strong class="status-text" id="status-text">Consultando API...</strong>
      </div>
      <p class="timestamp" id="status-time">Aguardando resposta de <code>GET /api/health</code></p>
      <p class="app-meta" id="status-meta"></p>
    </div>

    <div class="actions">
      <button id="refresh-btn" type="button">Verificar novamente</button>
      <span class="endpoint-tag">Proxy: <code>/api/health</code></span>
    </div>
  </section>
`;

const statusPanel = document.querySelector("#status-panel");
const statusIndicator = document.querySelector("#status-indicator");
const statusText = document.querySelector("#status-text");
const statusTime = document.querySelector("#status-time");
const statusMeta = document.querySelector("#status-meta");
const refreshBtn = document.querySelector("#refresh-btn");

async function loadApiHealth() {
  statusIndicator.className = "indicator loading";
  statusText.textContent = "Consultando API...";
  refreshBtn.disabled = true;

  try {
    const response = await fetch("/api/health");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const formattedDate = new Date(data.timestamp).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "medium",
    });

    statusPanel.classList.remove("error");
    statusPanel.classList.add("ok");
    statusIndicator.className = "indicator ok";
    statusText.textContent = `Status da API: ${data.status}`;
    statusTime.textContent = `Data e hora: ${formattedDate}`;
    statusMeta.textContent = data.app ? `Aplicação: ${data.app}` : "";
  } catch (error) {
    statusPanel.classList.remove("ok");
    statusPanel.classList.add("error");
    statusIndicator.className = "indicator error";
    statusText.textContent = "Status da API: indisponível";
    statusTime.textContent = `Erro ao consultar /api/health (${error.message})`;
    statusMeta.textContent = "Verifique se o servidor da API está rodando com npm run api.";
  } finally {
    refreshBtn.disabled = false;
  }
}

refreshBtn.addEventListener("click", () => {
  void loadApiHealth();
});
void loadApiHealth();
