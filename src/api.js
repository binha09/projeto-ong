const BASE = "/api";

async function requisicao(caminho, opcoes = {}) {
  const cabecalhos = opcoes.body
    ? { "Content-Type": "application/json", ...opcoes.headers }
    : opcoes.headers;

  let resposta;
  try {
    resposta = await fetch(`${BASE}${caminho}`, { ...opcoes, headers: cabecalhos });
  } catch {
    throw new Error("Sem conexão com o servidor. Verifique se a API está rodando.");
  }

  if (resposta.status === 204) {
    return null;
  }

  let dados = null;
  try {
    dados = await resposta.json();
  } catch {
    dados = null;
  }

  if (!resposta.ok) {
    throw new Error(dados?.erro || `Erro inesperado (${resposta.status})`);
  }

  return dados;
}

export function obterSaude() {
  return requisicao("/health");
}

export function listarDoadores() {
  return requisicao("/doadores");
}

export function cadastrarDoador(dados) {
  return requisicao("/doadores", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function atualizarDoador(id, dados) {
  return requisicao(`/doadores/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

export function excluirDoador(id) {
  return requisicao(`/doadores/${id}`, {
    method: "DELETE",
  });
}

export function listarItens() {
  return requisicao("/itens");
}

export function listarDoacoes() {
  return requisicao("/doacoes");
}

export function registrarDoacao(dados) {
  return requisicao("/doacoes", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}
