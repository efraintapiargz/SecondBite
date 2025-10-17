const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar JWT
exports.authenticate = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No se proporcionó token de autenticación' });
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    
    // Verificar que el usuario existe
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Usuario desactivado' });
    }

    // Agregar userId al request
    req.userId = decoded.userId;
    req.userEmail = user.email;
    req.userType = user.user_type;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    console.error('Error en autenticación:', error);
    res.status(500).json({ error: 'Error en autenticación', details: error.message });
  }
};

// Middleware para verificar rol de comerciante
exports.requireMerchant = async (req, res, next) => {
  try {
    if (req.userType !== 'merchant') {
      return res.status(403).json({ error: 'Se requieren permisos de comerciante' });
    }
    next();
  } catch (error) {
    console.error('Error en verificación de rol:', error);
    res.status(500).json({ error: 'Error en verificación de rol', details: error.message });
  }
};

// Middleware para verificar rol de consumidor
exports.requireConsumer = async (req, res, next) => {
  try {
    if (req.userType !== 'consumer') {
      return res.status(403).json({ error: 'Se requieren permisos de consumidor' });
    }
    next();
  } catch (error) {
    console.error('Error en verificación de rol:', error);
    res.status(500).json({ error: 'Error en verificación de rol', details: error.message });
  }
};
