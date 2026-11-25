const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Valida os dados de entrada de um doador e retorna a mensagem de erro ou null.
 */
export function validarDoador(dados = {}) {
  const { nome, email, telefone } = dados;

  if (typeof nome !== "string" || nome.trim() === "") {
    return "Nome é obrigatório";
  }
  if (nome.trim().length > 150) {
    return "Nome deve ter no máximo 150 caracteres";
  }
  if (email && (typeof email !== "string" || !FORMATO_EMAIL.test(email.trim()))) {
    return "E-mail inválido";
  }
  if (email && email.trim().length > 100) {
    return "E-mail deve ter no máximo 100 caracteres";
  }
  if (telefone && String(telefone).trim().length > 20) {
    return "Telefone deve ter no máximo 20 caracteres";
  }

  return null;
}

/**
 * Valida os dados de entrada de uma doação e sua lista de itens.
 */
export function validarDoacao(dados = {}) {
  const { id_doador, data_doacao, itens, observacao } = dados;

  if (!Number.isInteger(id_doador) || id_doador < 1) {
    return "id_doador é obrigatório e deve ser um número inteiro";
  }
  if (!FORMATO_DATA.test(data_doacao ?? "")) {
    return "data_doacao deve estar no formato AAAA-MM-DD";
  }
  if (observacao && String(observacao).length > 255) {
    return "Observação deve ter no máximo 255 caracteres";
  }
  if (!Array.isArray(itens) || itens.length === 0) {
    return "Informe pelo menos um item";
  }

  for (const item of itens) {
    if (!Number.isInteger(item?.id_item) || item.id_item < 1) {
      return "Cada item precisa de um id_item inteiro";
    }
    if (!Number.isInteger(item?.quantidade) || item.quantidade < 1) {
      return "A quantidade de cada item deve ser um inteiro maior que zero";
    }
  }

  const ids = itens.map((item) => item.id_item);
  if (new Set(ids).size !== ids.length) {
    return "O mesmo item aparece mais de uma vez";
  }

  return null;
}
