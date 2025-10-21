const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, requireMerchant } = require('../middleware/auth');
const { uploadProductImage, resizeProductImage } = require('../middleware/upload');

// Rutas públicas
router.get('/', productController.getAllProducts);
router.get('/nearby', productController.getNearbyProducts);
// Rutas protegidas - Comerciantes
router.post('/', authenticate, requireMerchant, uploadProductImage, resizeProductImage, productController.createProduct);
router.get('/merchant/my-products', authenticate, requireMerchant, productController.getMyProducts);
router.put('/:id', authenticate, requireMerchant, uploadProductImage, resizeProductImage, productController.updateProduct);
router.delete('/:id', authenticate, requireMerchant, productController.deleteProduct);

// Rutas públicas con parámetro al final para no interferir con rutas anteriores
router.get('/:id', productController.getProductById);

module.exports = router;
