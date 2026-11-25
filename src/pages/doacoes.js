import { listarDoacoes, listarDoadores, listarItens, registrarDoacao } from "../api.js";
import { dataHojeISO, el, formatarData, limparStatus, mostrarStatus } from "../ui.js";

export async function renderDoacoes(container) {
  let catalogoItens = [];

  const avisoForm = el("p", { className: "aviso", role: "status", hidden: true });
  const avisoLista = el("p", { className: "aviso", role: "status", hidden: true });

  const selectDoador = el("select", { name: "id_doador", required: true });
  const inputData = el("input", {
    type: "date",
    name: "data_doacao",
    required: true,
    value: dataHojeISO(),
  });
  const inputObservacao = el("input", {
    type: "text",
    name: "observacao",
    maxlength: "255",
    placeholder: "Ex.: Arrecadação mensal",
  });

  const linhasItensEl = el("div", { className: "lista-linhas-itens" });
  const btnAdicionarItem = el(
    "button",
    {
      type: "button",
      className: "btn-secundario",
      onClick: () => adicionarLinhaItem(),
    },
    "+ Adicionar item",
  );

  const fieldsetItens = el(
    "fieldset",
    { className: "grupo-itens" },
    el("legend", {}, "Itens da doação *"),
    linhasItensEl,
    btnAdicionarItem,
  );

  const btnSalvar = el("button", { type: "submit", className: "btn-primario" }, "Registrar doação");

  const form = el(
    "form",
    { className: "painel formulario", onSubmit: aoEnviar },
    el("h2", {}, "Registrar doação"),
    el("label", {}, "Doador *", selectDoador),
    el("label", {}, "Data da doação *", inputData),
    el("label", {}, "Observação", inputObservacao),
    fieldsetItens,
    avisoForm,
    el("div", { className: "acoes-form" }, btnSalvar),
  );

  const listaEl = el("ul", { className: "grade-cartoes" });
  const secaoLista = el(
    "section",
    { className: "painel" },
    el("div", { className: "topo-secao" }, el("h2", {}, "Histórico de doações")),
    avisoLista,
    listaEl,
  );

  container.replaceChildren(el("div", { className: "layout-duas-colunas" }, form, secaoLista));

  function criarSelectItem() {
    const select = el("select", { className: "select-item", required: true });
    select.append(el("option", { value: "" }, "Selecione um item..."));
    for (const item of catalogoItens) {
      select.append(
        el(
          "option",
          { value: String(item.id_item) },
          `${item.nome} (${item.unidade}) — ${item.categoria}`,
        ),
      );
    }
    return select;
  }

  function adicionarLinhaItem() {
    const select = criarSelectItem();
    const inputQtd = el("input", {
      type: "number",
      className: "input-qtd",
      min: "1",
      step: "1",
      value: "1",
      required: true,
    });

    const linha = el(
      "div",
      { className: "linha-item" },
      el("label", {}, "Item", select),
      el("label", {}, "Quantidade", inputQtd),
      el(
        "button",
        {
          type: "button",
          className: "btn-perigo btn-remover-item",
          onClick: () => {
            if (linhasItensEl.children.length > 1) {
              linha.remove();
            }
          },
        },
        "Remover",
      ),
    );
    linhasItensEl.append(linha);
  }

  function preencherDoadores(doadores) {
    selectDoador.replaceChildren();
    if (doadores.length === 0) {
      selectDoador.append(el("option", { value: "" }, "Nenhum doador cadastrado"));
      selectDoador.disabled = true;
      btnSalvar.disabled = true;
      mostrarStatus(avisoForm, "erro", "Cadastre um doador antes de registrar uma doação.");
      return;
    }

    selectDoador.disabled = false;
    btnSalvar.disabled = false;
    selectDoador.append(el("option", { value: "" }, "Selecione o doador..."));
    for (const doador of doadores) {
      selectDoador.append(el("option", { value: String(doador.id_doador) }, doador.nome));
    }
  }

  function desenharDoacoes(doacoes) {
    if (doacoes.length === 0) {
      listaEl.replaceChildren();
      mostrarStatus(avisoLista, "vazio", "Nenhuma doação registrada ainda.");
      return;
    }

    limparStatus(avisoLista);
    const cartoes = doacoes.map((doacao) =>
      el(
        "li",
        { className: "cartao" },
        el(
          "div",
          { className: "cartao-topo" },
          el("h3", { className: "cartao-titulo" }, doacao.doador.nome),
          el(
            "time",
            { className: "tag-data", datetime: doacao.data_doacao },
            formatarData(doacao.data_doacao),
          ),
        ),
        doacao.observacao
          ? el("p", { className: "cartao-detalhe" }, doacao.observacao)
          : el("p", { className: "cartao-detalhe texto-suave" }, "Sem observações"),
        el(
          "ul",
          { className: "lista-itens-doacao" },
          doacao.itens.map((item) =>
            el("li", {}, `${item.quantidade} ${item.unidade}(s) de ${item.nome}`),
          ),
        ),
      ),
    );
    listaEl.replaceChildren(...cartoes);
  }

  async function carregarTudo() {
    mostrarStatus(avisoLista, "carregando", "Carregando doações...");
    try {
      const [doacoes, doadores, itens] = await Promise.all([
        listarDoacoes(),
        listarDoadores(),
        listarItens(),
      ]);
      catalogoItens = itens;
      preencherDoadores(doadores);
      if (linhasItensEl.children.length === 0) {
        adicionarLinhaItem();
      }
      desenharDoacoes(doacoes);
    } catch (erro) {
      listaEl.replaceChildren();
      mostrarStatus(avisoLista, "erro", erro.message);
    }
  }

  async function aoEnviar(evento) {
    evento.preventDefault();
    limparStatus(avisoForm);

    const itens = [...linhasItensEl.querySelectorAll(".linha-item")].map((linha) => ({
      id_item: Number(linha.querySelector(".select-item").value),
      quantidade: Number(linha.querySelector(".input-qtd").value),
    }));

    const payload = {
      id_doador: Number(selectDoador.value),
      data_doacao: inputData.value,
      observacao: inputObservacao.value,
      itens,
    };

    btnSalvar.disabled = true;
    btnSalvar.textContent = "Registrando...";

    try {
      await registrarDoacao(payload);
      form.reset();
      inputData.value = dataHojeISO();
      linhasItensEl.replaceChildren();
      adicionarLinhaItem();
      mostrarStatus(avisoForm, "sucesso", "Doação registrada com sucesso!");
      const doacoes = await listarDoacoes();
      desenharDoacoes(doacoes);
    } catch (erro) {
      mostrarStatus(avisoForm, "erro", erro.message);
    } finally {
      btnSalvar.disabled = false;
      btnSalvar.textContent = "Registrar doação";
    }
  }

  await carregarTudo();
}
