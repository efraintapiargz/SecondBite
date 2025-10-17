const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, requireMerchant } = require('../middleware/auth');

// Rutas protegidas - Consumidores
router.post('/', authenticate, orderController.createOrder);
router.get('/my-orders', authenticate, orderController.getMyOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.put('/:id/cancel', authenticate, orderController.cancelOrder);

// Rutas protegidas - Comerciantes
router.get('/merchant/orders', authenticate, requireMerchant, orderController.getMerchantOrders);
router.put('/:id/status', authenticate, requireMerchant, orderController.updateOrderStatus);
router.get('/merchant/stats', authenticate, requireMerchant, orderController.getOrderStats);

module.exports = router;
