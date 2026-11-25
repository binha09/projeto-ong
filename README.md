# README - Projeto Integrador Extensionista II · ativd. 1 - Analise e desenvolvimento de sistemas

**ONG Esperança Viva** — Sistema web para gestão de doadores e doações da ONG, desenvolvido com **Vite+** (JavaScript Vanilla), API **Express** e banco de dados **MySQL/MariaDB** (`mysql2`).

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v20+ recomendado)
- [Vite+ (`vp`)](https://viteplus.dev/)
- [XAMPP](https://www.apachefriends.org/) ou servidor MySQL/MariaDB local

## Configuração do ambiente e banco de dados

1. Instale as dependências do projeto:

   ```bash
   npm install
   ```

2. Crie o arquivo `.env` a partir do `.env.example` e ajuste os dados do seu MySQL:

   ```bash
   cp .env.example .env
   ```

   Variáveis disponíveis no `.env`:

   - `PORT`: porta da API Express (padrão: `3000`)
   - `DB_HOST`: endereço do banco (`127.0.0.1`)
   - `DB_PORT`: porta do MySQL (`3306`)
   - `DB_USER`: usuário do MySQL (padrão no XAMPP: `root`)
   - `DB_PASSWORD`: senha do MySQL (vazia no XAMPP padrão)
   - `DB_NAME`: nome do banco (`ong_esperanca_viva`)
   - `APP_NAME`: nome exibido na resposta da rota de saúde

3. No painel do XAMPP, inicie o módulo **MySQL** (e o **Apache**, se for usar o phpMyAdmin) e importe os scripts na ordem abaixo:

   - `database/schema.sql` — cria o banco e todas as tabelas
   - `database/seed.sql` — insere categorias, itens, doadores e doações de exemplo

## Como rodar o projeto

Abra **dois terminais** na pasta do projeto:

1. **Terminal 1 — Iniciar a API Express:**

   ```bash
   npm run api
   ```

   A API ficará disponível em `http://localhost:3000`.

2. **Terminal 2 — Iniciar o frontend com Vite+:**

   ```bash
   npm run dev
   ```

   O Vite+ iniciará o servidor em `http://localhost:5173` com proxy automático de `/api` para a API Express.

3. Acesse `http://localhost:5173` no navegador para usar as telas de **Doadores** (`#/doadores`) e **Doações** (`#/doacoes`), além de conferir o **Status da API: ok · Banco: ok** no cabeçalho.

## Rotas da API e testes manuais

- `GET /api/health` — verifica a saúde da API e a conexão com o MySQL
- `GET /api/doadores`, `GET /api/doadores/:id`, `POST /api/doadores`, `PUT /api/doadores/:id`, `DELETE /api/doadores/:id`
- `GET /api/itens` — lista o catálogo de itens e categorias
- `GET /api/doacoes`, `POST /api/doacoes` — lista e registra doações com itens em transação

Os testes manuais de todas as rotas (incluindo erros 400, 404 e 409) estão no arquivo `api.http` (compatível com a extensão **REST Client** no VS Code).

## Scripts disponíveis

- `npm run dev` — inicia o servidor de desenvolvimento Vite+ (`vp dev`)
- `npm run api` — inicia o servidor Express em modo watch (`node --watch server/index.js`)
- `npm run build` — gera a build de produção (`vp build`)
- `npm run preview` — visualiza a build de produção (`vp preview`)

## Estrutura do projeto

```text
├── .env.example              # Modelo de variáveis de ambiente (API e MySQL)
├── .gitignore                # Ignora .env, node_modules e arquivos de build
├── api.http                  # Requisições de teste manual para a API
├── index.html                # Página HTML principal da SPA
├── package.json              # Dependências e scripts
├── vite.config.ts            # Configuração do Vite+ e proxy /api -> localhost:3000
├── database/
│   ├── schema.sql            # Criação do banco e tabelas no MySQL
│   └── seed.sql              # Dados iniciais de exemplo
├── server/
│   ├── index.js              # Entrada da API Express, /api/health e tratador de erros
│   ├── db.js                 # Pool de conexões mysql2/promise
│   ├── validacao.js          # Regras de validação de doadores e doações
│   └── routes/
│       ├── doadores.js       # CRUD de doadores
│       ├── itens.js          # Catálogo de itens
│       └── doacoes.js        # Listagem (JOIN) e registro transacional de doações
└── src/
    ├── main.js               # Roteador hash e status da API
    ├── api.js                # Camada de serviço (fetch para /api)
    ├── ui.js                 # Utilitários DOM seguros contra XSS e formatação
    ├── style.css             # Estilização mobile-first e acessível
    └── pages/
        ├── doadores.js       # Tela de cadastro, edição, listagem e exclusão de doadores
        └── doacoes.js        # Tela de registro e histórico de doações
```
