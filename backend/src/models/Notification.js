const { pool } = require('../config/database');

class Notification {
  static async create({ user_id, title, message, type = 'system' }) {
    const query = `
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [user_id, title, message, type]);
    return result.insertId;
  }

  static async getByUser(user_id, { onlyUnread = false, limit } = {}) {
    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [user_id];
    if (onlyUnread) query += ' AND is_read = FALSE';
    query += ' ORDER BY created_at DESC';
    if (limit) { query += ' LIMIT ?'; params.push(parseInt(limit)); }
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async markAsRead(id, user_id) {
    const query = 'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?';
    const [result] = await pool.execute(query, [id, user_id]);
    return result.affectedRows > 0;
  }

  static async countUnread(user_id) {
    const query = 'SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = FALSE';
    const [[row]] = await pool.execute(query, [user_id]);
    return row.unread || 0;
  }

  static async markAllAsRead(user_id) {
    const query = 'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE';
    const [result] = await pool.execute(query, [user_id]);
    return result.affectedRows || 0;
  }
}

module.exports = Notification;
