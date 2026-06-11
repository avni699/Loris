const { loadStore } = require('../utils/store');

function getProducts() {
  const store = loadStore();
  return store.products || [];
}

function getProductById(id) {
  const products = getProducts();
  return products.find((item) => item.id === id);
}

module.exports = {
  getProducts,
  getProductById
};
