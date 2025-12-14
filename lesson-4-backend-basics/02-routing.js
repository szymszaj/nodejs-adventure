const http = require("http");
const url = require("url");

const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (pathname === "/" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Strona główna</h1><p>Witaj na stronie głównej!</p>");
  } else if (pathname === "/about" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>O nas</h1><p>To jest strona o nas.</p>");
  } else if (pathname === "/api/users" && method === "GET") {
    const users = [
      { id: 1, name: "Jan Kowalski" },
      { id: 2, name: "Anna Nowak" },
    ];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } else if (pathname === "/api/data" && method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Dane odebrane", data }));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Nieprawidłowe dane JSON" }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>404 - Nie znaleziono</h1>");
  }
});

server.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
  console.log("Dostępne endpointy:");
  console.log("  GET  http://localhost:3000/");
  console.log("  GET  http://localhost:3000/about");
  console.log("  GET  http://localhost:3000/api/users");
  console.log("  POST http://localhost:3000/api/data");
});
