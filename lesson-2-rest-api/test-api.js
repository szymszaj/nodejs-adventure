const http = require("http");

const API_URL = "http://localhost:3000";

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(url, options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body,
          });
        }
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testAPI() {
  console.log("🧪 Testowanie REST API...\n");

  try {
    console.log(" GET /api/products");
    let result = await makeRequest("GET", "/api/products");
    console.log(`Status: ${result.status}`);
    console.log(`Produkty: ${result.data.count}`);
    console.log(JSON.stringify(result.data.data, null, 2));
    console.log("\n---\n");

    console.log("POST /api/products");
    const newProduct = {
      name: "Słuchawki",
      price: 299,
      category: "Elektronika",
    };
    result = await makeRequest("POST", "/api/products", newProduct);
    console.log(`Status: ${result.status}`);
    console.log(JSON.stringify(result.data, null, 2));
    const newId = result.data.data.id;
    console.log("\n---\n");

    console.log(` GET /api/products/${newId}`);
    result = await makeRequest("GET", `/api/products/${newId}`);
    console.log(`Status: ${result.status}`);
    console.log(JSON.stringify(result.data, null, 2));
    console.log("\n---\n");

    console.log(`PUT /api/products/${newId}`);
    result = await makeRequest("PUT", `/api/products/${newId}`, {
      price: 349,
    });
    console.log(`Status: ${result.status}`);
    console.log(JSON.stringify(result.data, null, 2));
    console.log("\n---\n");

    console.log("GET /api/products?category=Elektronika");
    result = await makeRequest("GET", "/api/products?category=Elektronika");
    console.log(`Status: ${result.status}`);
    console.log(`Znaleziono: ${result.data.count}`);
    console.log(JSON.stringify(result.data.data, null, 2));
    console.log("\n---\n");

    console.log("GET /api/stats");
    result = await makeRequest("GET", "/api/stats");
    console.log(`Status: ${result.status}`);
    console.log(JSON.stringify(result.data, null, 2));
    console.log("\n---\n");

    console.log(` DELETE /api/products/${newId}`);
    result = await makeRequest("DELETE", `/api/products/${newId}`);
    console.log(`Status: ${result.status}`);
    console.log(JSON.stringify(result.data, null, 2));
    console.log("\n---\n");

    console.log("✅ Wszystkie testy zakończone!");
  } catch (error) {
    console.error(" Błąd:", error.message);
    console.log("\n Czy serwer działa? Uruchom: node api-server.js");
  }
}

testAPI();
