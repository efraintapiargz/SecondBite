const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Merchant = require('../models/Merchant');

// Generar JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret_key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone, user_type, address, latitude, longitude } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const userId = await User.create({
      email,
      password: hashedPassword,
      full_name,
      phone,
      user_type: user_type || 'consumer',
      address,
      latitude,
      longitude
    });

    // Si es comerciante, crear registro en merchants
    if (user_type === 'merchant' && req.body.business_name) {
      await Merchant.create({
        user_id: userId,
        business_name: req.body.business_name,
        business_type: req.body.business_type || 'other',
        description: req.body.description || '',
        business_hours: req.body.business_hours || {}
      });
    }

    // Generar token
    const token = generateToken(userId);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: userId,
        email,
        full_name,
        user_type: user_type || 'consumer'
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario', details: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar si está activo
    if (!user.is_active) {
      return res.status(403).json({ error: 'Usuario desactivado' });
    }

    // Generar token
    const token = generateToken(user.id);

    // Si es comerciante, obtener info del negocio
    let merchantInfo = null;
    if (user.user_type === 'merchant') {
      merchantInfo = await Merchant.findByUserId(user.id);
    }

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        user_type: user.user_type,
        profile_image: user.profile_image,
        address: user.address,
        latitude: user.latitude,
        longitude: user.longitude,
        merchant: merchantInfo
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
  }
};

// Obtener perfil
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si es comerciante, obtener info del negocio
    let merchantInfo = null;
    if (user.user_type === 'merchant') {
      merchantInfo = await Merchant.findByUserId(user.id);
    }

    res.json({
      user: {
        ...user,
        merchant: merchantInfo
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil', details: error.message });
  }
};

// Actualizar perfil
exports.updateProfile = async (req, res) => {
  try {
    const { full_name, phone, address, latitude, longitude, profile_image } = req.body;

    const updated = await User.update(req.userId, {
      full_name,
      phone,
      address,
      latitude,
      longitude,
      profile_image
    });

    if (!updated) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = await User.findById(req.userId);
    res.json({
      message: 'Perfil actualizado exitosamente',
      user
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil', details: error.message });
  }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    const user = await User.findByEmail(req.userEmail);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(current_password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Actualizar contraseña
    const { pool } = require('../config/database');
    await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.userId]);

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña', details: error.message });
  }
};
