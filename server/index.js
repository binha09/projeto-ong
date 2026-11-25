import "dotenv/config";
import express from "express";

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const APP_NAME = process.env.APP_NAME || "Projeto ONG";

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: APP_NAME,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
