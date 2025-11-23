const http = require("http");
const url = require("url");

let products = [
  { id: 1, name: "Laptop", price: 3500, category: "Elektronika" },
  { id: 2, name: "Mysz", price: 89, category: "Akcesoria" },
  { id: 3, name: "Klawiatura", price: 250, category: "Akcesoria" },
];

let nextId = 4;

const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
    req.on("error", reject);
  });
};

const sendJSON = (res, statusCode, data) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data, null, 2));
};

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`${req.method} ${pathname}`);

  if (req.method === "GET" && pathname === "/api/products") {
    let filtered = [...products];

    if (query.category) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === query.category.toLowerCase()
      );
    }

    if (query.search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(query.search.toLowerCase())
      );
    }

    sendJSON(res, 200, {
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } else if (req.method === "GET" && pathname.startsWith("/api/products/")) {
    const id = parseInt(pathname.split("/")[3]);
    const product = products.find((p) => p.id === id);

    if (product) {
      sendJSON(res, 200, { success: true, data: product });
    } else {
      sendJSON(res, 404, {
        success: false,
        error: "Produkt nie znaleziony",
      });
    }
  } else if (req.method === "POST" && pathname === "/api/products") {
    const body = await parseBody(req);

    if (!body.name || !body.price) {
      sendJSON(res, 400, {
        success: false,
        error: "Brak wymaganych pól: name, price",
      });
      return;
    }

    const newProduct = {
      id: nextId++,
      name: body.name,
      price: body.price,
      category: body.category || "Inne",
    };

    products.push(newProduct);

    sendJSON(res, 201, {
      success: true,
      message: "Produkt dodany",
      data: newProduct,
    });
  } else if (req.method === "PUT" && pathname.startsWith("/api/products/")) {
    const id = parseInt(pathname.split("/")[3]);
    const body = await parseBody(req);
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      sendJSON(res, 404, {
        success: false,
        error: "Produkt nie znaleziony",
      });
      return;
    }

    products[index] = {
      ...products[index],
      ...body,
      id,
    };

    sendJSON(res, 200, {
      success: true,
      message: "Produkt zaktualizowany",
      data: products[index],
    });
  } else if (req.method === "DELETE" && pathname.startsWith("/api/products/")) {
    const id = parseInt(pathname.split("/")[3]);
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      sendJSON(res, 404, {
        success: false,
        error: "Produkt nie znaleziony",
      });
      return;
    }

    const deleted = products.splice(index, 1)[0];

    sendJSON(res, 200, {
      success: true,
      message: "Produkt usunięty",
      data: deleted,
    });
  } else if (req.method === "GET" && pathname === "/api/stats") {
    const stats = {
      totalProducts: products.length,
      categories: [...new Set(products.map((p) => p.category))],
      averagePrice:
        products.reduce((sum, p) => sum + p.price, 0) / products.length,
      mostExpensive: products.reduce(
        (max, p) => (p.price > max.price ? p : max),
        products[0]
      ),
    };

    sendJSON(res, 200, { success: true, data: stats });
  } else if (req.method === "GET" && pathname === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(`
      <html>
        <head>
          <title>Products API</title>
          <style>
            body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
            h1 { color: #2c3e50; }
            code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
            .endpoint { background: #ecf0f1; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { font-weight: bold; color: #27ae60; }
            .method.POST { color: #f39c12; }
            .method.PUT { color: #3498db; }
            .method.DELETE { color: #e74c3c; }
          </style>
        </head>
        <body>
          <h1>🚀 Products REST API</h1>
          <p>Backend Node.js z pełnym CRUD</p>
          
          <h2>Dostępne endpointy:</h2>
          
          <div class="endpoint">
            <span class="method">GET</span> <code>/api/products</code><br>
            Pobierz wszystkie produkty<br>
            Query params: <code>?category=Elektronika</code>, <code>?search=laptop</code>
          </div>
          
          <div class="endpoint">
            <span class="method">GET</span> <code>/api/products/:id</code><br>
            Pobierz konkretny produkt
          </div>
          
          <div class="endpoint">
            <span class="method POST">POST</span> <code>/api/products</code><br>
            Dodaj nowy produkt<br>
            Body: <code>{ "name": "Produkt", "price": 100, "category": "Kategoria" }</code>
          </div>
          
          <div class="endpoint">
            <span class="method PUT">PUT</span> <code>/api/products/:id</code><br>
            Aktualizuj produkt<br>
            Body: <code>{ "name": "Nowa nazwa", "price": 150 }</code>
          </div>
          
          <div class="endpoint">
            <span class="method DELETE">DELETE</span> <code>/api/products/:id</code><br>
            Usuń produkt
          </div>
          
          <div class="endpoint">
            <span class="method">GET</span> <code>/api/stats</code><br>
            Statystyki produktów
          </div>
          
          <h3>Testowanie API:</h3>
          <p>Użyj: <strong>Postman</strong>, <strong>Thunder Client</strong> (VS Code), <strong>curl</strong> lub <strong>fetch()</strong> w przeglądarce</p>
          
          <h3>Przykłady curl:</h3>
          <pre>
curl http://localhost:3000/api/products

curl http://localhost:3000/api/products/1

curl -X POST http://localhost:3000/api/products \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Monitor","price":1200,"category":"Elektronika"}'

curl -X PUT http://localhost:3000/api/products/1 \\
  -H "Content-Type: application/json" \\
  -d '{"price":3200}'

curl -X DELETE http://localhost:3000/api/products/2
          </pre>
        </body>
      </html>
    `);
  } else {
    sendJSON(res, 404, {
      success: false,
      error: "Endpoint nie istnieje",
    });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`\n REST API działa na http://localhost:${PORT}`);
  console.log(` Dokumentacja: http://localhost:${PORT}/`);
  console.log(` Testuj: http://localhost:${PORT}/api/products\n`);
});
