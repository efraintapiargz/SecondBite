const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, requireMerchant } = require('../middleware/auth');

// Rutas públicas
router.get('/', productController.getAllProducts);
router.get('/nearby', productController.getNearbyProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas - Comerciantes
router.post('/', authenticate, requireMerchant, productController.createProduct);
router.get('/merchant/my-products', authenticate, requireMerchant, productController.getMyProducts);
router.put('/:id', authenticate, requireMerchant, productController.updateProduct);
router.delete('/:id', authenticate, requireMerchant, productController.deleteProduct);

module.exports = router;
