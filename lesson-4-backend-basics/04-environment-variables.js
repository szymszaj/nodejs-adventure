require("dotenv").config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/mydb";
const API_KEY = process.env.API_KEY || "default-api-key";

console.log("=== Zmienne środowiskowe ===");
console.log("PORT:", PORT);
console.log("NODE_ENV:", NODE_ENV);
console.log("DATABASE_URL:", DATABASE_URL);
console.log("API_KEY:", API_KEY);

console.log("\n=== Argumenty wiersza poleceń ===");
console.log("process.argv:", process.argv);

console.log("\n=== Informacje o procesie ===");
console.log("PID:", process.pid);
console.log("Platforma:", process.platform);
console.log("Wersja Node.js:", process.version);
console.log("Katalog roboczy:", process.cwd());
console.log("Użycie pamięci:", process.memoryUsage());

process.on("SIGINT", () => {
  console.log("\n\nOtrzymano SIGINT, zamykanie aplikacji...");
  process.exit(0);
});

const http = require("http");

const server = http.createServer((req, res) => {
  const config = {
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(config, null, 2));
});

server.listen(PORT, () => {
  console.log(`\n=== Serwer ===`);
  console.log(`Serwer działa na http://localhost:${PORT}`);
  console.log(`Środowisko: ${NODE_ENV}`);
  console.log("\nNaciśnij Ctrl+C aby zatrzymać");
});
