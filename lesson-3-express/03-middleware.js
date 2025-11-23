const express = require("express");
const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(` Request trwał: ${duration}ms`);
  });

  next();
});

app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "Szymon's Express API");
  next();
});

app.use("/admin", (req, res, next) => {
  console.log(" Wejście do admin panel");

  next();
});

const validateProduct = (req, res, next) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      error: "Brak wymaganych pól: name, price",
    });
  }

  if (price < 0) {
    return res.status(400).json({
      error: "Cena nie może być ujemna",
    });
  }

  next();
};

app.get("/", (req, res) => {
  res.json({ message: "Middleware działa w tle!" });
});

app.get("/admin/dashboard", (req, res) => {
  res.json({ message: "Admin panel - middleware /admin zadziałał" });
});

app.post("/api/products", validateProduct, (req, res) => {
  res.status(201).json({
    message: "Produkt dodany",
    product: req.body,
  });
});

app.use((err, req, res, next) => {
  console.error(" Error:", err);
  res.status(500).json({
    error: "Coś poszło nie tak!",
    message: err.message,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Nie znaleziono" });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`\n Middleware demo: http://localhost:${PORT}`);
  console.log(`Testuj POST z body:\n`);
  console.log(`curl -X POST http://localhost:${PORT}/api/products \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"name":"Test","price":100}'\n`);
});
