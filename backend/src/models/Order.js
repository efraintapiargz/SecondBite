const { pool } = require('../config/database');

class Order {
  // Crear pedido
  static async create(orderData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { consumer_id, merchant_id, total_amount, payment_method, pickup_time, notes, items } = orderData;

      // Crear orden
      const orderQuery = `
        INSERT INTO orders (consumer_id, merchant_id, total_amount, payment_method, pickup_time, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const [orderResult] = await connection.execute(orderQuery, [
        consumer_id, merchant_id, total_amount, payment_method, pickup_time, notes
      ]);
      const orderId = orderResult.insertId;

      // Insertar items del pedido
      const itemQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      for (const item of items) {
        await connection.execute(itemQuery, [
          orderId, item.product_id, item.quantity, item.unit_price, item.subtotal
        ]);

        // Actualizar cantidad disponible del producto
        await connection.execute(
          'UPDATE products SET quantity_available = quantity_available - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );

        // Actualizar estado si se agotó
        await connection.execute(
          'UPDATE products SET status = "sold" WHERE id = ? AND quantity_available <= 0',
          [item.product_id]
        );
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Obtener pedido por ID
  static async findById(id) {
    const query = `
      SELECT o.*, 
             uc.full_name as consumer_name, uc.phone as consumer_phone,
             um.full_name as merchant_name, m.business_name, um.phone as merchant_phone, um.address
      FROM orders o
      INNER JOIN users uc ON o.consumer_id = uc.id
      INNER JOIN merchants m ON o.merchant_id = m.id
      INNER JOIN users um ON m.user_id = um.id
      WHERE o.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    
    if (rows.length > 0) {
      // Obtener items del pedido
      const itemsQuery = `
        SELECT oi.*, p.name as product_name, p.image_url
        FROM order_items oi
        INNER JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `;
      const [items] = await pool.execute(itemsQuery, [id]);
      rows[0].items = items;
    }
    
    return rows[0];
  }

  // Obtener pedidos por consumidor
  static async getByConsumer(consumer_id, filters = {}) {
    let query = `
      SELECT o.*, m.business_name, m.business_type, m.logo_image,
             u.address, u.phone as merchant_phone
      FROM orders o
      INNER JOIN merchants m ON o.merchant_id = m.id
      INNER JOIN users u ON m.user_id = u.id
      WHERE o.consumer_id = ?
    `;
    const params = [consumer_id];

    if (filters.status) {
      query += ' AND o.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY o.created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const [rows] = await pool.execute(query, params);
    
    // Obtener items para cada pedido
    for (const order of rows) {
      const [items] = await pool.execute(
        'SELECT oi.*, p.name as product_name FROM order_items oi INNER JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
        [order.id]
      );
      order.items = items;
    }
    
    return rows;
  }

  // Obtener pedidos por comerciante
  static async getByMerchant(merchant_id, filters = {}) {
    let query = `
      SELECT o.*, u.full_name as consumer_name, u.phone as consumer_phone, u.email as consumer_email
      FROM orders o
      INNER JOIN users u ON o.consumer_id = u.id
      WHERE o.merchant_id = ?
    `;
    const params = [merchant_id];

    if (filters.status) {
      query += ' AND o.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY o.created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const [rows] = await pool.execute(query, params);
    
    // Obtener items para cada pedido
    for (const order of rows) {
      const [items] = await pool.execute(
        'SELECT oi.*, p.name as product_name FROM order_items oi INNER JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
        [order.id]
      );
      order.items = items;
    }
    
    return rows;
  }

  // Actualizar estado del pedido
  static async updateStatus(id, status) {
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    const [result] = await pool.execute(query, [status, id]);
    return result.affectedRows > 0;
  }

  // Obtener estadísticas de pedidos
  static async getStats(merchant_id, startDate, endDate) {
    const query = `
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
      FROM orders
      WHERE merchant_id = ?
        AND created_at BETWEEN ? AND ?
    `;
    const [rows] = await pool.execute(query, [merchant_id, startDate, endDate]);
    return rows[0];
  }
}

module.exports = Order;
