const url = require("url");
const productService = require("../services/productService");
const { parseBody, sendJSON } = require("../utils/httpHelpers");

const router = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`${req.method} ${pathname}`);

  try {
    if (req.method === "GET" && pathname === "/api/products") {
      const products = productService.getAll({
        category: query.category,
        search: query.search,
      });
      sendJSON(res, 200, {
        success: true,
        count: products.length,
        data: products,
      });
    } else if (req.method === "GET" && pathname.startsWith("/api/products/")) {
      const id = pathname.split("/")[3];
      const product = productService.getById(id);
      if (product) {
        sendJSON(res, 200, { success: true, data: product });
      } else {
        sendJSON(res, 404, { success: false, error: "Produkt nie znaleziony" });
      }
    } else if (req.method === "POST" && pathname === "/api/products") {
      const body = await parseBody(req);
      try {
        const newProduct = productService.create(body);
        sendJSON(res, 201, {
          success: true,
          message: "Produkt dodany",
          data: newProduct,
        });
      } catch (error) {
        sendJSON(res, 400, { success: false, error: error.message });
      }
    } else if (req.method === "PUT" && pathname.startsWith("/api/products/")) {
      const id = pathname.split("/")[3];
      const body = await parseBody(req);
      const updated = productService.update(id, body);
      if (updated) {
        sendJSON(res, 200, {
          success: true,
          message: "Produkt zaktualizowany",
          data: updated,
        });
      } else {
        sendJSON(res, 404, { success: false, error: "Produkt nie znaleziony" });
      }
    } else if (
      req.method === "DELETE" &&
      pathname.startsWith("/api/products/")
    ) {
      const id = pathname.split("/")[3];
      const deleted = productService.delete(id);
      if (deleted) {
        sendJSON(res, 200, {
          success: true,
          message: "Produkt usunięty",
          data: deleted,
        });
      } else {
        sendJSON(res, 404, { success: false, error: "Produkt nie znaleziony" });
      }
    } else if (req.method === "GET" && pathname === "/api/stats") {
      const stats = productService.getStats();
      sendJSON(res, 200, { success: true, data: stats });
    } else {
      sendJSON(res, 404, { success: false, error: "Endpoint nie istnieje" });
    }
  } catch (error) {
    console.error("❌ Błąd:", error);
    sendJSON(res, 500, { success: false, error: "Wewnętrzny błąd serwera" });
  }
};

module.exports = router;
