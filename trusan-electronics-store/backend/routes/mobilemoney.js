const express = require('express');
const { loadStore, saveStore } = require('../utils/store');

const router = express.Router();

// Simulate mobile money transaction processing
router.post('/process', (req, res) => {
  const { provider, phoneNumber, amount, orderId } = req.body;

  if (!provider || !phoneNumber || !amount) {
    return res.status(400).json({ message: 'Provider, phone number, and amount are required' });
  }

  // Simulate transaction processing
  const transactionId = `MM-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  // Store transaction record
  const store = loadStore();
  store.mobileMoneyTransactions = store.mobileMoneyTransactions || [];
  store.mobileMoneyTransactions.push({
    id: transactionId,
    provider,
    phoneNumber,
    amount,
    orderId,
    status: 'completed',
    timestamp: new Date().toISOString()
  });
  saveStore(store);

  // Simulate processing delay
  setTimeout(() => {
    res.json({
      success: true,
      transactionId,
      status: 'completed',
      message: `Payment of UGX ${Math.round(amount * 3700).toLocaleString()} processed successfully via ${provider === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money'}`
    });
  }, 2000);
});

// Get transaction status
router.get('/status/:transactionId', (req, res) => {
  const store = loadStore();
  const transaction = (store.mobileMoneyTransactions || []).find(
    (t) => t.id === req.params.transactionId
  );

  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  res.json({ transaction });
});

// Get supported providers
router.get('/providers', (req, res) => {
  res.json({
    providers: [
      {
        id: 'mtn',
        name: 'MTN Mobile Money',
        description: 'Pay with MTN Mobile Money',
        logo: '📱',
        color: '#ffc107'
      },
      {
        id: 'airtel',
        name: 'Airtel Money',
        description: 'Pay with Airtel Money',
        logo: '📞',
        color: '#dc3545'
      }
    ]
  });
});

module.exports = router;