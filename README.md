# README - Projeto Integrador Extensionista II · ativd. 1 - Analise e desenvolvimento de sistemas

**ONG Esperança Viva** — Esqueleto da aplicação web da ONG criado com **Vite+** (modelo Vanilla JavaScript), integrado a uma API **Express** com verificação de saúde (`GET /api/health`) via proxy `/api`.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v20+ recomendado)
- [Vite+ (`vp`)](https://viteplus.dev/)

## Configuração do ambiente

1. Instale as dependências do projeto:

   ```bash
   npm install
   ```

2. Crie o arquivo `.env` a partir do `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Variáveis disponíveis no `.env`:

   - `PORT`: porta da API Express (padrão: `3001`)
   - `APP_NAME`: nome exibido na resposta da rota de saúde

## Como rodar o projeto

Abra **dois terminais** na pasta do projeto:

1. **Terminal 1 — Iniciar a API Express:**

   ```bash
   npm run api
   ```

   A API ficará disponível em `http://localhost:3001` (rota `GET /api/health`).

2. **Terminal 2 — Iniciar o frontend com Vite+:**

   ```bash
   npm run dev
   ```

   O Vite+ iniciará o servidor em `http://localhost:5173` com proxy automático de `/api` para a API Express.

3. Acesse `http://localhost:5173` no navegador para visualizar o **Status da API: ok** com data e hora.

## Scripts disponíveis

- `npm run dev` — inicia o servidor de desenvolvimento Vite+ (`vp dev`)
- `npm run api` — inicia o servidor Express (`node server/index.js`)
- `npm run build` — gera a build de produção (`vp build`)
- `npm run preview` — visualiza a build de produção (`vp preview`)

## Estrutura do projeto

```text
├── .env.example        # Modelo de variáveis de ambiente
├── .gitignore          # Ignora .env, node_modules e arquivos de build
├── index.html          # Página HTML principal
├── package.json        # Dependências e scripts (dev, api, build, preview)
├── vite.config.ts      # Configuração do Vite+ e proxy /api -> localhost:3001
├── server/
│   └── index.js        # API Express com rota GET /api/health
└── src/
    ├── main.js         # Lógica da página inicial que consulta /api/health
    └── style.css       # Estilização da página
```
