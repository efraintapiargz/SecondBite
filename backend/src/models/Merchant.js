const { pool } = require('../config/database');

class Merchant {
  // Crear información de comercio
  static async create(merchantData) {
    const { user_id, business_name, business_type, description, business_hours, logo_image, banner_image } = merchantData;
    const query = `
      INSERT INTO merchants (user_id, business_name, business_type, description, business_hours, logo_image, banner_image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      user_id, 
      business_name, 
      business_type, 
      description, 
      JSON.stringify(business_hours), 
      logo_image, 
      banner_image
    ]);
    return result.insertId;
  }

  // Obtener comercio por user_id
  static async findByUserId(user_id) {
    const query = `
      SELECT m.*, u.email, u.full_name, u.phone, u.address, u.latitude, u.longitude
      FROM merchants m
      INNER JOIN users u ON m.user_id = u.id
      WHERE m.user_id = ?
    `;
    const [rows] = await pool.execute(query, [user_id]);
    if (rows[0] && rows[0].business_hours) {
      rows[0].business_hours = JSON.parse(rows[0].business_hours);
    }
    return rows[0];
  }

  // Obtener comercio por ID
  static async findById(id) {
    const query = `
      SELECT m.*, u.email, u.full_name, u.phone, u.address, u.latitude, u.longitude
      FROM merchants m
      INNER JOIN users u ON m.user_id = u.id
      WHERE m.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    if (rows[0] && rows[0].business_hours) {
      rows[0].business_hours = JSON.parse(rows[0].business_hours);
    }
    return rows[0];
  }

  // Actualizar comercio
  static async update(id, merchantData) {
    const { business_name, business_type, description, business_hours, logo_image, banner_image } = merchantData;
    const query = `
      UPDATE merchants 
      SET business_name = ?, business_type = ?, description = ?, business_hours = ?, 
          logo_image = ?, banner_image = ?
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [
      business_name, 
      business_type, 
      description, 
      JSON.stringify(business_hours), 
      logo_image, 
      banner_image, 
      id
    ]);
    return result.affectedRows > 0;
  }

  // Obtener todos los comercios
  static async getAll(filters = {}) {
    let query = `
      SELECT m.*, u.address, u.latitude, u.longitude,
             (SELECT COUNT(*) FROM products p WHERE p.merchant_id = m.id AND p.status = 'available') as available_products
      FROM merchants m
      INNER JOIN users u ON m.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.business_type) {
      query += ' AND m.business_type = ?';
      params.push(filters.business_type);
    }

    if (filters.min_rating) {
      query += ' AND m.rating >= ?';
      params.push(filters.min_rating);
    }

    query += ' ORDER BY m.rating DESC, m.total_reviews DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const [rows] = await pool.execute(query, params);
    return rows.map(row => {
      if (row.business_hours) {
        row.business_hours = JSON.parse(row.business_hours);
      }
      return row;
    });
  }

  // Actualizar estadísticas del comercio
  static async updateStats(id) {
    const query = `
      UPDATE merchants m
      SET 
        rating = (SELECT AVG(rating) FROM reviews WHERE merchant_id = m.id),
        total_reviews = (SELECT COUNT(*) FROM reviews WHERE merchant_id = m.id),
        total_products_sold = (
          SELECT COUNT(*) FROM order_items oi
          INNER JOIN products p ON oi.product_id = p.id
          WHERE p.merchant_id = m.id
        )
      WHERE m.id = ?
    `;
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Buscar comercios por proximidad
  static async findNearby(latitude, longitude, radiusKm = 10, filters = {}) {
    let query = `
      SELECT m.*, u.address, u.latitude, u.longitude,
             (6371 * acos(cos(radians(?)) * cos(radians(u.latitude)) * 
             cos(radians(u.longitude) - radians(?)) + sin(radians(?)) * 
             sin(radians(u.latitude)))) AS distance,
             (SELECT COUNT(*) FROM products p WHERE p.merchant_id = m.id AND p.status = 'available') as available_products
      FROM merchants m
      INNER JOIN users u ON m.user_id = u.id
      WHERE u.is_active = TRUE
    `;
    const params = [latitude, longitude, latitude];

    if (filters.business_type) {
      query += ' AND m.business_type = ?';
      params.push(filters.business_type);
    }

    query += ' HAVING distance < ? ORDER BY distance';
    params.push(radiusKm);

    const [rows] = await pool.execute(query, params);
    return rows.map(row => {
      if (row.business_hours) {
        row.business_hours = JSON.parse(row.business_hours);
      }
      return row;
    });
  }
}

module.exports = Merchant;
