const fs = require("fs");
const http = require("http");
const path = require("path");

console.log("=== Readable Stream ===");
const readableStream = fs.createReadStream(__filename, {
  encoding: "utf-8",
  highWaterMark: 64,
});

let chunkCount = 0;
readableStream.on("data", (chunk) => {
  chunkCount++;
  console.log(`Chunk ${chunkCount}, rozmiar: ${chunk.length} bajtów`);
});

readableStream.on("end", () => {
  console.log(`Odczyt zakończony. Łącznie chunków: ${chunkCount}\n`);
});

readableStream.on("error", (error) => {
  console.error("Błąd odczytu:", error.message);
});

console.log("=== Writable Stream ===");
const writableStream = fs.createWriteStream(path.join(__dirname, "output.txt"));

writableStream.write("Pierwsza linia\n");
writableStream.write("Druga linia\n");
writableStream.write("Trzecia linia\n");
writableStream.end("Ostatnia linia\n");

writableStream.on("finish", () => {
  console.log("Zapis zakończony\n");
});

console.log("=== Pipe ===");
const source = fs.createReadStream(__filename);
const destination = fs.createWriteStream(path.join(__dirname, "copy.js"));

source.pipe(destination);

destination.on("finish", () => {
  console.log("Plik skopiowany przez pipe\n");
});

const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/file") {
    const filePath = __filename;
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Content-Length": stat.size,
    });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else if (req.url === "/slow") {
    res.writeHead(200, { "Content-Type": "text/plain" });

    let counter = 0;
    const interval = setInterval(() => {
      res.write(`Chunk ${counter}\n`);
      counter++;

      if (counter === 10) {
        clearInterval(interval);
        res.end("Koniec strumienia\n");
      }
    }, 500);
  } else {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <h1>Przykłady ze strumieniami</h1>
      <ul>
        <li><a href="/file">Pobierz plik (streaming)</a></li>
        <li><a href="/slow">Powolny stream</a></li>
      </ul>
    `);
  }
});

server.listen(PORT, () => {
  console.log("=== Serwer HTTP ===");
  console.log(`http://localhost:${PORT}`);
});
