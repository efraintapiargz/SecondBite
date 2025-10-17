const { pool } = require('../config/database');

class Product {
  // Crear producto
  static async create(productData) {
    const { 
      merchant_id, name, description, category, original_price, 
      discounted_price, quantity_available, expiry_date, image_url 
    } = productData;
    
    const discount_percentage = Math.round(((original_price - discounted_price) / original_price) * 100);
    
    const query = `
      INSERT INTO products (merchant_id, name, description, category, original_price, 
                           discounted_price, discount_percentage, quantity_available, 
                           expiry_date, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      merchant_id, name, description, category, original_price, 
      discounted_price, discount_percentage, quantity_available, 
      expiry_date, image_url
    ]);
    return result.insertId;
  }

  // Obtener producto por ID
  static async findById(id) {
    const query = `
      SELECT p.*, m.business_name, m.business_type, m.rating as merchant_rating,
             u.address, u.latitude, u.longitude, u.phone
      FROM products p
      INNER JOIN merchants m ON p.merchant_id = m.id
      INNER JOIN users u ON m.user_id = u.id
      WHERE p.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  // Obtener todos los productos con filtros
  static async getAll(filters = {}) {
    let query = `
      SELECT p.*, m.business_name, m.business_type, m.rating as merchant_rating,
             u.latitude, u.longitude
      FROM products p
      INNER JOIN merchants m ON p.merchant_id = m.id
      INNER JOIN users u ON m.user_id = u.id
      WHERE p.status = 'available' AND p.expiry_date >= CURDATE()
    `;
    const params = [];

    if (filters.merchant_id) {
      query += ' AND p.merchant_id = ?';
      params.push(filters.merchant_id);
    }

    if (filters.category) {
      query += ' AND p.category = ?';
      params.push(filters.category);
    }

    if (filters.max_price) {
      query += ' AND p.discounted_price <= ?';
      params.push(filters.max_price);
    }

    if (filters.min_discount) {
      query += ' AND p.discount_percentage >= ?';
      params.push(filters.min_discount);
    }

    if (filters.search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Ordenamiento
    if (filters.sort_by === 'price_asc') {
      query += ' ORDER BY p.discounted_price ASC';
    } else if (filters.sort_by === 'price_desc') {
      query += ' ORDER BY p.discounted_price DESC';
    } else if (filters.sort_by === 'discount') {
      query += ' ORDER BY p.discount_percentage DESC';
    } else if (filters.sort_by === 'expiry') {
      query += ' ORDER BY p.expiry_date ASC';
    } else {
      query += ' ORDER BY p.created_at DESC';
    }

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Obtener productos por comerciante
  static async getByMerchant(merchant_id, includeAll = false) {
    let query = `
      SELECT p.*
      FROM products p
      WHERE p.merchant_id = ?
    `;
    
    if (!includeAll) {
      query += ' AND p.status = "available" AND p.expiry_date >= CURDATE()';
    }
    
    query += ' ORDER BY p.created_at DESC';
    
    const [rows] = await pool.execute(query, [merchant_id]);
    return rows;
  }

  // Buscar productos cercanos
  static async findNearby(latitude, longitude, radiusKm = 10, filters = {}) {
    let query = `
      SELECT p.*, m.business_name, m.business_type, m.rating as merchant_rating,
             u.address, u.latitude, u.longitude,
             (6371 * acos(cos(radians(?)) * cos(radians(u.latitude)) * 
             cos(radians(u.longitude) - radians(?)) + sin(radians(?)) * 
             sin(radians(u.latitude)))) AS distance
      FROM products p
      INNER JOIN merchants m ON p.merchant_id = m.id
      INNER JOIN users u ON m.user_id = u.id
      WHERE p.status = 'available' AND p.expiry_date >= CURDATE()
    `;
    const params = [latitude, longitude, latitude];

    if (filters.category) {
      query += ' AND p.category = ?';
      params.push(filters.category);
    }

    if (filters.max_price) {
      query += ' AND p.discounted_price <= ?';
      params.push(filters.max_price);
    }

    query += ' HAVING distance < ? ORDER BY distance, p.discount_percentage DESC';
    params.push(radiusKm);

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Actualizar producto
  static async update(id, productData) {
    const { 
      name, description, category, original_price, discounted_price, 
      quantity_available, expiry_date, image_url, status 
    } = productData;
    
    const discount_percentage = Math.round(((original_price - discounted_price) / original_price) * 100);
    
    const query = `
      UPDATE products 
      SET name = ?, description = ?, category = ?, original_price = ?, 
          discounted_price = ?, discount_percentage = ?, quantity_available = ?, 
          expiry_date = ?, image_url = ?, status = ?
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [
      name, description, category, original_price, discounted_price, 
      discount_percentage, quantity_available, expiry_date, image_url, status, id
    ]);
    return result.affectedRows > 0;
  }

  // Actualizar cantidad disponible
  static async updateQuantity(id, quantity) {
    const query = 'UPDATE products SET quantity_available = ? WHERE id = ?';
    const [result] = await pool.execute(query, [quantity, id]);
    return result.affectedRows > 0;
  }

  // Actualizar estado
  static async updateStatus(id, status) {
    const query = 'UPDATE products SET status = ? WHERE id = ?';
    const [result] = await pool.execute(query, [status, id]);
    return result.affectedRows > 0;
  }

  // Eliminar producto
  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Obtener productos próximos a expirar
  static async getExpiringSoon(days = 3) {
    const query = `
      SELECT p.*, m.business_name, m.user_id
      FROM products p
      INNER JOIN merchants m ON p.merchant_id = m.id
      WHERE p.status = 'available' 
        AND p.expiry_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
        AND p.expiry_date >= CURDATE()
      ORDER BY p.expiry_date ASC
    `;
    const [rows] = await pool.execute(query, [days]);
    return rows;
  }

  // Marcar productos expirados
  static async markExpired() {
    const query = `
      UPDATE products 
      SET status = 'expired' 
      WHERE expiry_date < CURDATE() AND status != 'expired'
    `;
    const [result] = await pool.execute(query);
    return result.affectedRows;
  }
}

module.exports = Product;
