const Merchant = require('../models/Merchant');
const User = require('../models/User');

// Obtener todos los comercios
exports.getAllMerchants = async (req, res) => {
  try {
    const filters = {
      business_type: req.query.business_type,
      min_rating: req.query.min_rating,
      limit: req.query.limit
    };

    const merchants = await Merchant.getAll(filters);
    res.json({ merchants, count: merchants.length });
  } catch (error) {
    console.error('Error al obtener comercios:', error);
    res.status(500).json({ error: 'Error al obtener comercios', details: error.message });
  }
};

// Obtener comercio por ID
exports.getMerchantById = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) {
      return res.status(404).json({ error: 'Comercio no encontrado' });
    }
    res.json({ merchant });
  } catch (error) {
    console.error('Error al obtener comercio:', error);
    res.status(500).json({ error: 'Error al obtener comercio', details: error.message });
  }
};

// Buscar comercios cercanos
exports.getNearbyMerchants = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Se requiere latitud y longitud' });
    }

    const filters = {
      business_type: req.query.business_type
    };

    const merchants = await Merchant.findNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      radius ? parseFloat(radius) : 10,
      filters
    );

    res.json({ merchants, count: merchants.length });
  } catch (error) {
    console.error('Error al buscar comercios cercanos:', error);
    res.status(500).json({ error: 'Error al buscar comercios cercanos', details: error.message });
  }
};

// Obtener mi comercio
exports.getMyMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.findByUserId(req.userId);
    if (!merchant) {
      return res.status(404).json({ error: 'No tienes un comercio registrado' });
    }
    res.json({ merchant });
  } catch (error) {
    console.error('Error al obtener comercio:', error);
    res.status(500).json({ error: 'Error al obtener comercio', details: error.message });
  }
};

// Actualizar mi comercio
exports.updateMyMerchant = async (req, res) => {
  try {
    let merchant = await Merchant.findByUserId(req.userId);

    const {
      business_name, business_type, description, business_hours,
      logo_image, banner_image
    } = req.body;

    // Si no existe, crear un registro básico y luego actualizar
    if (!merchant) {
      const User = require('../models/User');
      const user = await User.findById(req.userId);
      const createdId = await Merchant.create({
        user_id: req.userId,
        business_name: req.body.business_name || (user?.full_name ? `Negocio de ${user.full_name}` : 'Mi Negocio'),
        business_type: req.body.business_type || 'other',
        description: req.body.description || '',
        business_hours: req.body.business_hours || {},
        logo_image: req.body.logo_image || null,
        banner_image: req.body.banner_image || null,
      });
      merchant = await Merchant.findById(createdId);
    }

    const updated = await Merchant.update(merchant.id, {
      business_name: business_name || merchant.business_name,
      business_type: business_type || merchant.business_type,
      description: description !== undefined ? description : merchant.description,
      business_hours: business_hours || merchant.business_hours,
      logo_image: logo_image || merchant.logo_image,
      banner_image: banner_image || merchant.banner_image
    });

    if (!updated) {
      return res.status(500).json({ error: 'Error al actualizar comercio' });
    }

    const updatedMerchant = await Merchant.findById(merchant.id);
    res.json({
      message: 'Comercio actualizado exitosamente',
      merchant: updatedMerchant
    });
  } catch (error) {
    console.error('Error al actualizar comercio:', error);
    res.status(500).json({ error: 'Error al actualizar comercio', details: error.message });
  }
};

// Dashboard del comerciante
exports.getMyDashboard = async (req, res) => {
  try {
    const Merchant = require('../models/Merchant');
    const { pool } = require('../config/database');
    const merchant = await Merchant.findByUserId(req.userId);
    if (!merchant) {
      return res.status(404).json({ error: 'No tienes un comercio registrado' });
    }

    const [[{ totalProducts }]] = await pool.query(
      'SELECT COUNT(*) as totalProducts FROM products WHERE merchant_id = ?',[merchant.id]
    );

    const [[{ activeProducts }]] = await pool.query(
      "SELECT COUNT(*) as activeProducts FROM products WHERE merchant_id = ? AND status = 'available' AND expiry_date >= CURDATE() AND quantity_available > 0",
      [merchant.id]
    );

    const [[{ pendingOrders }]] = await pool.query(
      "SELECT COUNT(*) as pendingOrders FROM orders WHERE merchant_id = ? AND status = 'pending'",
      [merchant.id]
    );

    const [[{ todayRevenue }]] = await pool.query(
      "SELECT IFNULL(SUM(total_amount),0) as todayRevenue FROM orders WHERE merchant_id = ? AND status = 'completed' AND DATE(created_at) = CURDATE()",
      [merchant.id]
    );

    return res.json({
      stats: {
        totalProducts: Number(totalProducts) || 0,
        activeProducts: Number(activeProducts) || 0,
        pendingOrders: Number(pendingOrders) || 0,
        todayRevenue: Number(todayRevenue) || 0,
      },
    });
  } catch (error) {
    console.error('Error al obtener dashboard:', error);
    res.status(500).json({ error: 'Error al obtener dashboard', details: error.message });
  }
};

// Obtener productos de un comercio
exports.getMerchantProducts = async (req, res) => {
  try {
    const Product = require('../models/Product');
    const merchant = await Merchant.findById(req.params.id);
    
    if (!merchant) {
      return res.status(404).json({ error: 'Comercio no encontrado' });
    }

    const products = await Product.getByMerchant(merchant.id);
    res.json({ products, count: products.length });
  } catch (error) {
    console.error('Error al obtener productos del comercio:', error);
    res.status(500).json({ error: 'Error al obtener productos del comercio', details: error.message });
  }
};
