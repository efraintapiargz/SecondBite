const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchantController');
const { authenticate, requireMerchant } = require('../middleware/auth');

// Rutas públicas
router.get('/', merchantController.getAllMerchants);
router.get('/nearby', merchantController.getNearbyMerchants);
router.get('/:id', merchantController.getMerchantById);
router.get('/:id/products', merchantController.getMerchantProducts);

// Rutas protegidas - Comerciantes
router.get('/me/info', authenticate, requireMerchant, merchantController.getMyMerchant);
router.put('/me/info', authenticate, requireMerchant, merchantController.updateMyMerchant);

module.exports = router;
