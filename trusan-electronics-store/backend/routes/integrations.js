const express = require('express');
const { loadStore } = require('../utils/store');

const router = express.Router();

router.get('/uganda', (req, res) => {
  const store = loadStore();
  res.json({ integrations: store.integrations || [] });
});

module.exports = router;
