const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });

  // Wysyłanie odpowiedzi
  res.end("Witaj w Node.js! 🚀\n");
});

server.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
