const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');

// product routes
router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.put('/:id/restore', productController.restoreProduct);

module.exports = router;
