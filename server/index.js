import "dotenv/config";
import express from "express";
import db from "./db.js";
import doadores from "./routes/doadores.js";
import itens from "./routes/itens.js";
import doacoes from "./routes/doacoes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const APP_NAME = process.env.APP_NAME || "ONG Esperanca Viva";

app.use(express.json());

app.get("/api/health", async (_req, res) => {
  let banco = "ok";
  try {
    await db.query("SELECT 1");
  } catch {
    banco = "sem conexão";
  }

  const agora = new Date().toISOString();
  res.json({
    status: "ok",
    banco,
    app: APP_NAME,
    timestamp: agora,
    hora: agora,
  });
});

app.use("/api/doadores", doadores);
app.use("/api/itens", itens);
app.use("/api/doacoes", doacoes);

// Tratamento final de erros do Express 5 (4 parâmetros obrigatórios).
app.use((erro, _req, res, _next) => {
  if (erro.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido no corpo da requisição" });
  }
  console.error(erro);
  res.status(500).json({ erro: "Erro interno no servidor" });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
