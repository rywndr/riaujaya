const express = require('express');
const router = express.Router();
const { testConnection } = require('../config/db');

// import route modules
const cashierRoutes = require('./cashiers');
const productRoutes = require('./products');
const customerRoutes = require('./customers');
const transactionRoutes = require('./transactions');

// health check endpoint
router.get('/health', async (req, res) => {
  try {
    const result = await testConnection();
    if (result.status === 'ok') {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  }
  catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// register route modules
router.use('/cashiers', cashierRoutes);
router.use('/products', productRoutes);
router.use('/customers', customerRoutes);
router.use('/transactions', transactionRoutes);

module.exports = router;
