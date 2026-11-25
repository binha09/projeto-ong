/**
 * Cria elementos DOM de forma segura (strings entram como textContent, evitando XSS).
 */
export function el(tag, attrs = {}, ...filhos) {
  const elemento = document.createElement(tag);

  for (const [chave, valor] of Object.entries(attrs)) {
    if (valor === null || valor === undefined || valor === false) continue;
    if (chave === "className") {
      elemento.className = valor;
    } else if (chave === "hidden") {
      elemento.hidden = true;
    } else if (chave.startsWith("on") && typeof valor === "function") {
      elemento.addEventListener(chave.slice(2).toLowerCase(), valor);
    } else {
      elemento.setAttribute(chave, String(valor));
    }
  }

  for (const filho of filhos.flat()) {
    if (filho === null || filho === undefined || filho === false) continue;
    if (typeof filho === "string" || typeof filho === "number") {
      elemento.append(document.createTextNode(String(filho)));
    } else {
      elemento.append(filho);
    }
  }

  return elemento;
}

/**
 * Converte data AAAA-MM-DD para DD/MM/AAAA sem sofrer deslocamento de fuso horário.
 */
export function formatarData(iso) {
  if (!iso || typeof iso !== "string") return "";
  const partes = iso.slice(0, 10).split("-");
  if (partes.length !== 3) return iso;
  const [ano, mes, dia] = partes;
  return `${dia}/${mes}/${ano}`;
}

export function dataHojeISO() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function mostrarStatus(caixa, tipo, mensagem) {
  caixa.className = `aviso ${tipo}`;
  caixa.textContent = mensagem;
  caixa.hidden = false;
}

export function limparStatus(caixa) {
  caixa.textContent = "";
  caixa.hidden = true;
}
