const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res) => {
  try {
    const onlyUnread = req.query.only_unread === 'true';
    const limit = req.query.limit;
    const notifications = await Notification.getByUser(req.userId, { onlyUnread, limit });
    const unread = await Notification.countUnread(req.userId);
    res.json({ notifications, unread });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones', details: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const updated = await Notification.markAsRead(req.params.id, req.userId);
    if (!updated) return res.status(404).json({ error: 'Notificación no encontrada' });
    const unread = await Notification.countUnread(req.userId);
    res.json({ message: 'Notificación marcada como leída', unread });
  } catch (error) {
    console.error('Error al marcar notificación:', error);
    res.status(500).json({ error: 'Error al marcar notificación', details: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const updatedCount = await Notification.markAllAsRead(req.userId);
    const unread = await Notification.countUnread(req.userId);
    res.json({ message: `Marcadas ${updatedCount} notificaciones como leídas`, unread });
  } catch (error) {
    console.error('Error al marcar todas como leídas:', error);
    res.status(500).json({ error: 'Error al marcar todas como leídas', details: error.message });
  }
};
