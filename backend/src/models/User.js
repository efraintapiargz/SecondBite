const { pool } = require('../config/database');

class User {
  // Crear un nuevo usuario
  static async create(userData) {
    const { email, password, full_name, phone, user_type, address, latitude, longitude } = userData;
    const query = `
      INSERT INTO users (email, password, full_name, phone, user_type, address, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [email, password, full_name, phone, user_type, address, latitude, longitude]);
    return result.insertId;
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);
    return rows[0];
  }

  // Buscar usuario por ID
  static async findById(id) {
    const query = 'SELECT id, email, full_name, phone, user_type, profile_image, address, latitude, longitude, is_active, is_verified, created_at FROM users WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  // Actualizar usuario
  static async update(id, userData) {
    const { full_name, phone, address, latitude, longitude, profile_image } = userData;
    const query = `
      UPDATE users 
      SET full_name = ?, phone = ?, address = ?, latitude = ?, longitude = ?, profile_image = ?
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [full_name, phone, address, latitude, longitude, profile_image, id]);
    return result.affectedRows > 0;
  }

  // Obtener todos los consumidores
  static async getAllConsumers() {
    const query = 'SELECT id, email, full_name, phone, created_at FROM users WHERE user_type = "consumer" AND is_active = TRUE';
    const [rows] = await pool.execute(query);
    return rows;
  }

  // Obtener todos los comerciantes con su información de negocio
  static async getAllMerchants() {
    const query = `
      SELECT u.id, u.email, u.full_name, u.phone, u.address, u.latitude, u.longitude,
             m.business_name, m.business_type, m.rating, m.total_reviews
      FROM users u
      INNER JOIN merchants m ON u.id = m.user_id
      WHERE u.user_type = 'merchant' AND u.is_active = TRUE
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  // Buscar comerciantes cercanos
  static async findNearbyMerchants(latitude, longitude, radiusKm = 10) {
    // Fórmula de Haversine para calcular distancia
    const query = `
      SELECT u.id, u.full_name, u.address, u.latitude, u.longitude,
             m.business_name, m.business_type, m.logo_image, m.rating, m.total_reviews,
             (6371 * acos(cos(radians(?)) * cos(radians(u.latitude)) * 
             cos(radians(u.longitude) - radians(?)) + sin(radians(?)) * 
             sin(radians(u.latitude)))) AS distance
      FROM users u
      INNER JOIN merchants m ON u.id = m.user_id
      WHERE u.user_type = 'merchant' AND u.is_active = TRUE
      HAVING distance < ?
      ORDER BY distance
      LIMIT 50
    `;
    const [rows] = await pool.execute(query, [latitude, longitude, latitude, radiusKm]);
    return rows;
  }

  // Eliminar usuario (soft delete)
  static async delete(id) {
    const query = 'UPDATE users SET is_active = FALSE WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = User;
