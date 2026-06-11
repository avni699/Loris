const express = require('express');
const { loadStore } = require('../utils/store');

const router = express.Router();

router.get('/', (req, res) => {
  const store = loadStore();
  res.json({ products: store.products || [] });
});

router.get('/:id', (req, res) => {
  const store = loadStore();
  const product = (store.products || []).find((item) => item.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json({ product });
});

module.exports = router;
