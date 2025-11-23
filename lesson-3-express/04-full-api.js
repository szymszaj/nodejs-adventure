const express = require("express");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

let products = [
  { id: 1, name: "Laptop", price: 3500, category: "Elektronika" },
  { id: 2, name: "Mysz", price: 89, category: "Akcesoria" },
  { id: 3, name: "Klawiatura", price: 250, category: "Akcesoria" },
];
let nextId = 4;

const validateProduct = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({
      success: false,
      error: "Brak wymaganych pól: name, price",
    });
  }
  if (price < 0) {
    return res.status(400).json({
      success: false,
      error: "Cena nie może być ujemna",
    });
  }
  next();
};

app.get("/api/products", (req, res) => {
  let result = [...products];

  if (req.query.category) {
    result = result.filter(
      (p) => p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }

  if (req.query.search) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(req.query.search.toLowerCase())
    );
  }

  res.json({
    success: true,
    count: result.length,
    data: result,
  });
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({
      success: false,
      error: "Produkt nie znaleziony",
    });
  }

  res.json({ success: true, data: product });
});

app.post("/api/products", validateProduct, (req, res) => {
  const newProduct = {
    id: nextId++,
    name: req.body.name,
    price: req.body.price,
    category: req.body.category || "Inne",
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: "Produkt dodany",
    data: newProduct,
  });
});

app.put("/api/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: "Produkt nie znaleziony",
    });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    id,
  };

  res.json({
    success: true,
    message: "Produkt zaktualizowany",
    data: products[index],
  });
});

app.delete("/api/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: "Produkt nie znaleziony",
    });
  }

  const deleted = products.splice(index, 1)[0];

  res.json({
    success: true,
    message: "Produkt usunięty",
    data: deleted,
  });
});

app.get("/api/stats", (req, res) => {
  const stats = {
    totalProducts: products.length,
    categories: [...new Set(products.map((p) => p.category))],
    averagePrice:
      products.reduce((sum, p) => sum + p.price, 0) / products.length || 0,
    mostExpensive: products.reduce(
      (max, p) => (p.price > max.price ? p : max),
      products[0] || { price: 0 }
    ),
  };

  res.json({ success: true, data: stats });
});

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Express REST API</title>
        <style>
          body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
          h1 { color: #2c3e50; }
          code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
          .endpoint { background: #ecf0f1; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>🚀 Express REST API</h1>
        <p>To samo co lesson-2, ale w Express - dużo krócej!</p>
        
        <h2>Endpointy:</h2>
        <div class="endpoint">GET <code>/api/products</code> - Wszystkie produkty</div>
        <div class="endpoint">GET <code>/api/products/:id</code> - Jeden produkt</div>
        <div class="endpoint">POST <code>/api/products</code> - Dodaj produkt</div>
        <div class="endpoint">PUT <code>/api/products/:id</code> - Aktualizuj</div>
        <div class="endpoint">DELETE <code>/api/products/:id</code> - Usuń</div>
        <div class="endpoint">GET <code>/api/stats</code> - Statystyki</div>
        
        <h3>Testuj:</h3>
        <a href="/api/products">Pobierz produkty</a> | 
        <a href="/api/stats">Statystyki</a>
      </body>
    </html>
  `);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: "Błąd serwera" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Nie znaleziono" });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`\n✅ Express REST API: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api/products`);
  console.log(`\n📊 PORÓWNANIE Z LESSON-2:`);
  console.log(`  lesson-2/api-server.js: ~260 linii`);
  console.log(`  lesson-3/04-full-api.js: ~180 linii`);
  console.log(`  Oszczędność: 30% kodu! + dużo czytelniej\n`);
});

/*
  TESTOWANIE:

  # Pobierz wszystkie
  curl http://localhost:3003/api/products

  # Filtruj
  curl "http://localhost:3003/api/products?category=Elektronika"

  # Dodaj nowy
  curl -X POST http://localhost:3003/api/products \
    -H "Content-Type: application/json" \
    -d '{"name":"Monitor","price":1200,"category":"Elektronika"}'

  # Aktualizuj
  curl -X PUT http://localhost:3003/api/products/1 \
    -H "Content-Type: application/json" \
    -d '{"price":3200}'

  # Usuń
  curl -X DELETE http://localhost:3003/api/products/2

  # Statystyki
  curl http://localhost:3003/api/stats
*/
