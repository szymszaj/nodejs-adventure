const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Product {
    id: ID!
    name: String!
    price: Float!
    category: String!
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
    productsByCategory(category: String!): [Product]
  }

  type Mutation {
    createProduct(name: String!, price: Float!, category: String!): Product
    updateProduct(id: ID!, name: String, price: Float, category: String): Product
    deleteProduct(id: ID!): Product
  }
`);

let products = [
  { id: "1", name: "Laptop", price: 3500, category: "Elektronika" },
  { id: "2", name: "Mysz", price: 89, category: "Akcesoria" },
  { id: "3", name: "Klawiatura", price: 250, category: "Akcesoria" },
];

let nextId = 4;

const root = {
  products: () => products,

  product: ({ id }) => {
    return products.find((p) => p.id === id);
  },

  productsByCategory: ({ category }) => {
    return products.filter((p) => p.category === category);
  },

  createProduct: ({ name, price, category }) => {
    const newProduct = {
      id: String(nextId++),
      name,
      price,
      category,
    };
    products.push(newProduct);
    return newProduct;
  },

  updateProduct: ({ id, name, price, category }) => {
    const product = products.find((p) => p.id === id);
    if (!product) return null;

    if (name) product.name = name;
    if (price) product.price = price;
    if (category) product.category = category;

    return product;
  },

  deleteProduct: ({ id }) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const deleted = products[index];
    products.splice(index, 1);
    return deleted;
  },
};

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, //
  })
);

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>GraphQL API</title>
        <style>
          body { font-family: Arial; max-width: 900px; margin: 50px auto; padding: 20px; }
          h1 { color: #e10098; }
          pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
          code { color: #e10098; }
          .tip { background: #e8f5e9; padding: 10px; border-left: 4px solid #4caf50; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>GraphQL API</h1>
        <p><strong>GraphQL</strong> to alternatywa dla REST - klient sam wybiera jakie dane chce pobrać!</p>
        
        <div class="tip">
          <strong>💡 Otwórz GraphiQL:</strong> 
          <a href="/graphql">http://localhost:4000/graphql</a> - interaktywny edytor zapytań
        </div>

        <h2>Przykładowe zapytania (Queries):</h2>
        
        <h3>1. Pobierz wszystkie produkty:</h3>
        <pre>
query {
  products {
    id
    name
    price
    category
  }
}
        </pre>

        <h3>2. Pobierz konkretny produkt:</h3>
        <pre>
query {
  product(id: "1") {
    name
    price
  }
}
        </pre>

        <h3>3. Filtruj po kategorii:</h3>
        <pre>
query {
  productsByCategory(category: "Elektronika") {
    id
    name
    price
  }
}
        </pre>

        <h2>Mutacje (Mutations) - Modyfikacja danych:</h2>
        
        <h3>1. Dodaj nowy produkt:</h3>
        <pre>
mutation {
  createProduct(
    name: "Monitor 4K"
    price: 1500
    category: "Elektronika"
  ) {
    id
    name
    price
  }
}
        </pre>

        <h3>2. Aktualizuj produkt:</h3>
        <pre>
mutation {
  updateProduct(
    id: "1"
    price: 3200
  ) {
    id
    name
    price
  }
}
        </pre>

        <h3>3. Usuń produkt:</h3>
        <pre>
mutation {
  deleteProduct(id: "2") {
    id
    name
  }
}
        </pre>

        <h2>Zalety GraphQL vs REST:</h2>
        <ul>
          <li>✅ Jeden endpoint <code>/graphql</code></li>
          <li>✅ Klient wybiera jakie pola chce (no over-fetching)</li>
          <li>✅ Można pobrać wiele zasobów w jednym zapytaniu</li>
          <li>✅ Silne typowanie - schema jako kontrakt</li>
          <li>✅ GraphiQL - świetne narzędzie do testowania</li>
        </ul>

        <h2>Testowanie z curl:</h2>
        <pre>
curl -X POST http://localhost:4000/graphql \\
  -H "Content-Type: application/json" \\
  -d '{"query":"{ products { id name price } }"}'
        </pre>
      </body>
    </html>
  `);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`\n GraphQL API działa na http://localhost:${PORT}`);
  console.log(`GraphiQL: http://localhost:${PORT}/graphql`);
  console.log(` Dokumentacja: http://localhost:${PORT}/\n`);
});
