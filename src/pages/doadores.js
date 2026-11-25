import { atualizarDoador, cadastrarDoador, excluirDoador, listarDoadores } from "../api.js";
import { el, limparStatus, mostrarStatus } from "../ui.js";

export async function renderDoadores(container) {
  let idEmEdicao = null;
  let listaAtual = [];

  const avisoForm = el("p", { className: "aviso", role: "status", hidden: true });
  const avisoLista = el("p", { className: "aviso", role: "status", hidden: true });
  const tituloForm = el("h2", {}, "Cadastrar doador");

  const inputNome = el("input", {
    type: "text",
    name: "nome",
    required: true,
    maxlength: "150",
    autocomplete: "name",
    placeholder: "Ex.: Beatriz Ramos",
  });
  const inputEmail = el("input", {
    type: "email",
    name: "email",
    maxlength: "100",
    autocomplete: "email",
    placeholder: "Ex.: beatriz@exemplo.com",
  });
  const inputTelefone = el("input", {
    type: "tel",
    name: "telefone",
    maxlength: "20",
    autocomplete: "tel",
    placeholder: "Ex.: (11) 98888-1001",
  });

  const btnSalvar = el("button", { type: "submit", className: "btn-primario" }, "Salvar doador");
  const btnCancelar = el(
    "button",
    {
      type: "button",
      className: "btn-secundario",
      hidden: true,
      onClick: () => sairDaEdicao(),
    },
    "Cancelar edição",
  );

  const form = el(
    "form",
    { className: "painel formulario", onSubmit: aoEnviar },
    tituloForm,
    el("label", {}, "Nome *", inputNome),
    el("label", {}, "E-mail", inputEmail),
    el("label", {}, "Telefone", inputTelefone),
    avisoForm,
    el("div", { className: "acoes-form" }, btnSalvar, btnCancelar),
  );

  const listaEl = el("ul", { className: "grade-cartoes" });
  const secaoLista = el(
    "section",
    { className: "painel" },
    el("div", { className: "topo-secao" }, el("h2", {}, "Doadores cadastrados")),
    avisoLista,
    listaEl,
  );

  container.replaceChildren(el("div", { className: "layout-duas-colunas" }, form, secaoLista));

  function entrarEmEdicao(doador) {
    idEmEdicao = doador.id_doador;
    tituloForm.textContent = `Editar doador #${doador.id_doador}`;
    inputNome.value = doador.nome;
    inputEmail.value = doador.email ?? "";
    inputTelefone.value = doador.telefone ?? "";
    btnSalvar.textContent = "Salvar alterações";
    btnCancelar.hidden = false;
    limparStatus(avisoForm);
    inputNome.focus();
  }

  function sairDaEdicao() {
    idEmEdicao = null;
    tituloForm.textContent = "Cadastrar doador";
    form.reset();
    btnSalvar.textContent = "Salvar doador";
    btnCancelar.hidden = true;
  }

  function desenharLista(doadores) {
    listaAtual = doadores;
    if (doadores.length === 0) {
      listaEl.replaceChildren();
      mostrarStatus(avisoLista, "vazio", "Nenhum doador cadastrado ainda.");
      return;
    }

    limparStatus(avisoLista);
    const cartoes = doadores.map((doador) =>
      el(
        "li",
        { className: "cartao" },
        el("h3", { className: "cartao-titulo" }, doador.nome),
        el("p", { className: "cartao-detalhe" }, doador.email || "sem e-mail"),
        el("p", { className: "cartao-detalhe" }, doador.telefone || "sem telefone"),
        el(
          "div",
          { className: "cartao-acoes" },
          el(
            "button",
            {
              type: "button",
              className: "btn-secundario",
              onClick: () => entrarEmEdicao(doador),
            },
            "Editar",
          ),
          el(
            "button",
            {
              type: "button",
              className: "btn-perigo",
              onClick: () => {
                void aoExcluir(doador);
              },
            },
            "Excluir",
          ),
        ),
      ),
    );
    listaEl.replaceChildren(...cartoes);
  }

  async function carregar() {
    mostrarStatus(avisoLista, "carregando", "Carregando doadores...");
    try {
      const doadores = await listarDoadores();
      desenharLista(doadores);
    } catch (erro) {
      listaEl.replaceChildren();
      mostrarStatus(avisoLista, "erro", erro.message);
    }
  }

  async function aoEnviar(evento) {
    evento.preventDefault();
    const dadosForm = Object.fromEntries(new FormData(form));
    const payload = {
      nome: dadosForm.nome,
      email: dadosForm.email,
      telefone: dadosForm.telefone,
    };

    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";
    limparStatus(avisoForm);

    try {
      if (idEmEdicao) {
        const atualizado = await atualizarDoador(idEmEdicao, payload);
        sairDaEdicao();
        mostrarStatus(avisoForm, "sucesso", `${atualizado.nome} foi atualizado.`);
      } else {
        const criado = await cadastrarDoador(payload);
        form.reset();
        mostrarStatus(avisoForm, "sucesso", `${criado.nome} foi cadastrado.`);
      }
      await carregar();
    } catch (erro) {
      mostrarStatus(avisoForm, "erro", erro.message);
    } finally {
      btnSalvar.disabled = false;
      btnSalvar.textContent = idEmEdicao ? "Salvar alterações" : "Salvar doador";
    }
  }

  async function aoExcluir(doador) {
    const confirmou = window.confirm(`Deseja realmente excluir o doador "${doador.nome}"?`);
    if (!confirmou) return;

    limparStatus(avisoForm);
    try {
      await excluirDoador(doador.id_doador);
      if (idEmEdicao === doador.id_doador) {
        sairDaEdicao();
      }
      mostrarStatus(avisoForm, "sucesso", `${doador.nome} foi excluído.`);
      await carregar();
    } catch (erro) {
      mostrarStatus(avisoLista, "erro", erro.message);
      if (listaAtual.length > 0) {
        avisoLista.hidden = false;
      }
    }
  }

  await carregar();
}
