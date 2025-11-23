// Moduł z danymi i logiką biznesową
let products = [
  { id: 1, name: "Laptop", price: 3500, category: "Elektronika" },
  { id: 2, name: "Mysz", price: 89, category: "Akcesoria" },
  { id: 3, name: "Klawiatura", price: 250, category: "Akcesoria" },
];

let nextId = 4;

const productService = {
  getAll: (filters = {}) => {
    let result = [...products];
    if (filters.category) {
      result = result.filter(
        (p) => p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    if (filters.search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    return result;
  },

  getById: (id) => {
    return products.find((p) => p.id === parseInt(id));
  },

  create: (productData) => {
    if (!productData.name || !productData.price) {
      throw new Error("Brak wymaganych pól: name, price");
    }
    const newProduct = {
      id: nextId++,
      name: productData.name,
      price: productData.price,
      category: productData.category || "Inne",
    };
    products.push(newProduct);
    return newProduct;
  },

  update: (id, updates) => {
    const index = products.findIndex((p) => p.id === parseInt(id));
    if (index === -1) return null;
    products[index] = {
      ...products[index],
      ...updates,
      id: products[index].id,
    };
    return products[index];
  },

  delete: (id) => {
    const index = products.findIndex((p) => p.id === parseInt(id));
    if (index === -1) return null;
    const deleted = products.splice(index, 1)[0];
    return deleted;
  },

  getStats: () => {
    return {
      totalProducts: products.length,
      categories: [...new Set(products.map((p) => p.category))],
      averagePrice:
        products.reduce((sum, p) => sum + p.price, 0) / products.length || 0,
      mostExpensive: products.reduce(
        (max, p) => (p.price > max.price ? p : max),
        products[0] || { price: 0 }
      ),
    };
  },
};

module.exports = productService;
