const Order = require('../models/Order');
const Product = require('../models/Product');

// Crear pedido
exports.createOrder = async (req, res) => {
  try {
    const { merchant_id, payment_method, pickup_time, notes, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'El pedido debe tener al menos un producto' });
    }

    // Calcular total y validar productos
    let total_amount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      
      if (!product) {
        return res.status(404).json({ error: `Producto ${item.product_id} no encontrado` });
      }

      if (product.status !== 'available') {
        return res.status(400).json({ error: `Producto ${product.name} no está disponible` });
      }

      if (product.quantity_available < item.quantity) {
        return res.status(400).json({ 
          error: `Cantidad insuficiente de ${product.name}. Disponible: ${product.quantity_available}` 
        });
      }

      const subtotal = product.discounted_price * item.quantity;
      total_amount += subtotal;

      validatedItems.push({
        product_id: product.id,
        quantity: item.quantity,
        unit_price: product.discounted_price,
        subtotal: subtotal
      });
    }

    // Crear orden
    const orderId = await Order.create({
      consumer_id: req.userId,
      merchant_id,
      total_amount,
      payment_method: payment_method || 'cash',
      pickup_time,
      notes,
      items: validatedItems
    });

    const order = await Order.findById(orderId);
    res.status(201).json({
      message: 'Pedido creado exitosamente',
      order
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error al crear pedido', details: error.message });
  }
};

// Obtener pedido por ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Verificar que el usuario tenga acceso al pedido
    const Merchant = require('../models/Merchant');
    const merchant = await Merchant.findByUserId(req.userId);
    
    const isConsumer = order.consumer_id === req.userId;
    const isMerchant = merchant && order.merchant_id === merchant.id;

    if (!isConsumer && !isMerchant) {
      return res.status(403).json({ error: 'No tienes permiso para ver este pedido' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ error: 'Error al obtener pedido', details: error.message });
  }
};

// Obtener mis pedidos (como consumidor)
exports.getMyOrders = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      limit: req.query.limit
    };

    const orders = await Order.getByConsumer(req.userId, filters);
    res.json({ orders, count: orders.length });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos', details: error.message });
  }
};

// Obtener pedidos de mi comercio
exports.getMerchantOrders = async (req, res) => {
  try {
    const Merchant = require('../models/Merchant');
    const merchant = await Merchant.findByUserId(req.userId);
    
    if (!merchant) {
      return res.status(403).json({ error: 'No tienes permisos de comerciante' });
    }

    const filters = {
      status: req.query.status,
      limit: req.query.limit
    };

    const orders = await Order.getByMerchant(merchant.id, filters);
    res.json({ orders, count: orders.length });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos', details: error.message });
  }
};

// Actualizar estado del pedido (solo comerciantes)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'ready', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Verificar que el usuario sea el comerciante del pedido
    const Merchant = require('../models/Merchant');
    const merchant = await Merchant.findByUserId(req.userId);
    
    if (!merchant || order.merchant_id !== merchant.id) {
      return res.status(403).json({ error: 'No tienes permiso para actualizar este pedido' });
    }

    const updated = await Order.updateStatus(req.params.id, status);
    if (!updated) {
      return res.status(500).json({ error: 'Error al actualizar pedido' });
    }

    const updatedOrder = await Order.findById(req.params.id);
    res.json({
      message: 'Estado del pedido actualizado',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    res.status(500).json({ error: 'Error al actualizar estado del pedido', details: error.message });
  }
};

// Cancelar pedido
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Verificar que el usuario sea el consumidor del pedido
    if (order.consumer_id !== req.userId) {
      return res.status(403).json({ error: 'No tienes permiso para cancelar este pedido' });
    }

    // Solo se puede cancelar si está en pending o confirmed
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ error: 'No se puede cancelar un pedido en este estado' });
    }

    const updated = await Order.updateStatus(req.params.id, 'cancelled');
    if (!updated) {
      return res.status(500).json({ error: 'Error al cancelar pedido' });
    }

    // Restaurar cantidades de productos
    for (const item of order.items) {
      await Product.updateQuantity(
        item.product_id, 
        item.quantity_available + item.quantity
      );
      await Product.updateStatus(item.product_id, 'available');
    }

    const updatedOrder = await Order.findById(req.params.id);
    res.json({
      message: 'Pedido cancelado exitosamente',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error al cancelar pedido:', error);
    res.status(500).json({ error: 'Error al cancelar pedido', details: error.message });
  }
};

// Obtener estadísticas de pedidos (solo comerciantes)
exports.getOrderStats = async (req, res) => {
  try {
    const Merchant = require('../models/Merchant');
    const merchant = await Merchant.findByUserId(req.userId);
    
    if (!merchant) {
      return res.status(403).json({ error: 'No tienes permisos de comerciante' });
    }

    const startDate = req.query.start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = req.query.end_date || new Date().toISOString().split('T')[0];

    const stats = await Order.getStats(merchant.id, startDate, endDate);
    res.json({ stats });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas', details: error.message });
  }
};
