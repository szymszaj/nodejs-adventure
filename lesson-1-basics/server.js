const http = require("http");

const server = http.createServer((req, res) => {
  console.log(`Otrzymano żądanie: ${req.method} ${req.url}`);

  if (req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(
      "<h1>Witaj w Node.js! </h1><p>To Twój pierwszy serwer backend!</p>"
    );
  } else if (req.url === "/api/info") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        wiadomosc: "To jest API endpoint",
        data: new Date(),
        wersja: "1.0.0",
      })
    );
  } else if (req.url === "/o-mnie") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Uczę się Node.js! To jest backend napisany w JavaScript.");
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Nie znaleziono tej strony :(");
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(` Serwer działa na http://localhost:${PORT}`);
  console.log(`Otwórz w przeglądarce:`);
  console.log(`  - http://localhost:${PORT}/`);
  console.log(`  - http://localhost:${PORT}/api/info`);
  console.log(`  - http://localhost:${PORT}/o-mnie`);
  console.log(`\nAby zatrzymać serwer, naciśnij Ctrl+C`);
});
