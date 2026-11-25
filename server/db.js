import mysql from "mysql2/promise";

// Pool de conexões reutilizadas pelo Express, mantendo datas como texto YYYY-MM-DD.
const db = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME || "ong_esperanca_viva",
  dateStrings: true,
});

export default db;
