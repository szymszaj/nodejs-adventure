const express = require("express");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

const products = [
  {
    id: 1,
    name: "Laptop",
    price: 3500,
    category: "Elektronika",
    inStock: true,
  },
  { id: 2, name: "Mysz", price: 89, category: "Akcesoria", inStock: true },
  {
    id: 3,
    name: "Klawiatura",
    price: 250,
    category: "Akcesoria",
    inStock: false,
  },
  {
    id: 4,
    name: "Monitor",
    price: 1200,
    category: "Elektronika",
    inStock: true,
  },
];

app.get("/", (req, res) => {
  res.render("index", {
    title: "Sklep Express",
    products: products,
    totalProducts: products.length,
  });
});

app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).render("404", { title: "Nie znaleziono" });
  }

  res.render("product", {
    title: product.name,
    product: product,
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "O nas",
    author: "Szymon",
    description: "Uczę się Node.js i Express!",
  });
});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`\n Express + EJS: http://localhost:${PORT}`);
  console.log(`\n  Aby to działało, stwórz pliki:`);
  console.log(`  1. npm install ejs`);
  console.log(`  2. Stwórz folder 'views' z plikami .ejs`);
  console.log(`  3. (opcjonalnie) Folder 'public' dla CSS/JS\n`);
  console.log(` Zobacz lesson-3-express/views-example/ dla przykładów\n`);
});
