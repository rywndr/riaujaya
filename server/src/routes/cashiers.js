const express = require('express');
const router = express.Router();
const cashierController = require('../controllers/cashiers');

// cashier routes
router.get('/', cashierController.getAllCashiers);
router.post('/', cashierController.createCashier);
router.put('/:id', cashierController.updateCashier);
router.delete('/:id', cashierController.deleteCashier);
router.put('/:id/restore', cashierController.restoreCashier);

module.exports = router;
