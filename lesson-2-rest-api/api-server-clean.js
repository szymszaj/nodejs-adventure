const http = require("http");
const path = require("path");
const fs = require("fs");
const { setCORS } = require("./utils/httpHelpers");
const apiRouter = require("./routes/api");

const server = http.createServer(async (req, res) => {
  setCORS(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(`
      <h1>🚀 REST API - Modułowa Struktura</h1>
      <p>API działa na: <a href="/api/products">/api/products</a></p>
      <h3>Endpointy:</h3>
      <ul>
        <li>GET /api/products - Wszystkie produkty</li>
        <li>GET /api/products/:id - Jeden produkt</li>
        <li>POST /api/products - Dodaj produkt</li>
        <li>PUT /api/products/:id - Aktualizuj produkt</li>
        <li>DELETE /api/products/:id - Usuń produkt</li>
        <li>GET /api/stats - Statystyki</li>
      </ul>
    `);
    return;
  }

  if (req.url.startsWith("/api")) {
    await apiRouter(req, res);
    return;
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: "Strona nie znaleziona" }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`\n✅ REST API działa na http://localhost:${PORT}`);
  console.log(`🔗 Testuj: http://localhost:${PORT}/api/products\n`);
});
