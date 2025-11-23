const express = require("express");
const app = express();

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  res.json({
    message: `Użytkownik o ID: ${userId}`,
    params: req.params,
  });
});

app.get("/products/:category/:id", (req, res) => {
  res.json({
    category: req.params.category,
    id: req.params.id,
  });
});

app.get("/search", (req, res) => {
  const { search, sort, limit } = req.query;

  res.json({
    search: search || "brak",
    sort: sort || "brak",
    limit: limit || 10,
    fullQuery: req.query,
  });
});

app.get("/api/products", (req, res) => {
  res.json({ message: "GET - Pobierz wszystkie produkty" });
});

app.post("/api/products", (req, res) => {
  res.json({ message: "POST - Dodaj nowy produkt" });
});

app.put("/api/products/:id", (req, res) => {
  res.json({ message: `PUT - Aktualizuj produkt ${req.params.id}` });
});

app.delete("/api/products/:id", (req, res) => {
  res.json({ message: `DELETE - Usuń produkt ${req.params.id}` });
});

app
  .route("/api/users")
  .get((req, res) => res.json({ message: "GET users" }))
  .post((req, res) => res.json({ message: "POST user" }));

app.get(/.*test$/, (req, res) => {
  res.send('Ta ścieżka kończy się na "test"');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n Express routing: http://localhost:${PORT}`);
  console.log(`Testuj:`);
  console.log(`  http://localhost:${PORT}/users/123`);
  console.log(`  http://localhost:${PORT}/products/elektronika/456`);
  console.log(`  http://localhost:${PORT}/search?search=laptop&sort=price`);
  console.log(`  http://localhost:${PORT}/mytest\n`);
});

/*
  TESTOWANIE Z CURL:

  # Route params
  curl http://localhost:3001/users/123

  # Query params
  curl "http://localhost:3001/search?search=laptop&sort=price&limit=20"

  # Różne metody
  curl http://localhost:3001/api/products
  curl -X POST http://localhost:3001/api/products
  curl -X PUT http://localhost:3001/api/products/5
  curl -X DELETE http://localhost:3001/api/products/5
*/
