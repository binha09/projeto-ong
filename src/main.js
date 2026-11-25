import "./style.css";
import { obterSaude } from "./api.js";
import { renderDoacoes } from "./pages/doacoes.js";
import { renderDoadores } from "./pages/doadores.js";

const app = document.querySelector("#app");
const statusApiEl = document.querySelector("#status-api");
const linksMenu = [...document.querySelectorAll("nav.menu a")];

const rotas = {
  "#/doadores": renderDoadores,
  "#/doacoes": renderDoacoes,
};

function atualizarMenu(rotaAtual) {
  for (const link of linksMenu) {
    if (link.dataset.rota === rotaAtual) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

async function navegar() {
  const hash = window.location.hash;
  const rota = rotas[hash] ? hash : "#/doadores";
  atualizarMenu(rota);
  await rotas[rota](app);
}

async function atualizarSaude() {
  try {
    const dados = await obterSaude();
    const hora = new Date(dados.timestamp).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
    statusApiEl.className = dados.banco === "ok" ? "status-api ok" : "status-api erro";
    statusApiEl.textContent = `Status da API: ${dados.status} · Banco: ${dados.banco} · ${hora}`;
  } catch {
    statusApiEl.className = "status-api erro";
    statusApiEl.textContent = "Status da API: indisponível";
  }
}

window.addEventListener("hashchange", () => {
  void navegar();
});

void atualizarSaude();
void navegar();
