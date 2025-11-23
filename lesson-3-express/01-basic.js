const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send(
    "<h1>Witaj w Express! </h1><p>To było łatwiejsze niż http.createServer, prawda?</p>"
  );
});

app.get("/api/info", (req, res) => {
  res.json({
    message: "Express robi wszystko za Ciebie!",
    version: "1.0.0",
    timestamp: new Date(),
  });
});

app.get("/o-mnie", (req, res) => {
  res.send("Uczę się Express.js - frameworka który ułatwia życie!");
});

app.use((req, res) => {
  res.status(404).json({ error: "Nie znaleziono strony" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n✅ Express działa na http://localhost:${PORT}`);
  console.log(
    `Porównaj ten kod z lesson-1/server.js - to samo w 3x mniej kodu!\n`
  );
});
