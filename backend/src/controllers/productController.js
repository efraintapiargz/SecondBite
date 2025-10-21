const Product = require('../models/Product');

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      max_price: req.query.max_price,
      min_discount: req.query.min_discount,
      search: req.query.search,
      sort_by: req.query.sort_by,
      limit: req.query.limit
    };

    const products = await Product.getAll(filters);
    res.json({ products, count: products.length });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos', details: error.message });
  }
};

// Obtener producto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ product });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto', details: error.message });
  }
};

// Buscar productos cercanos
exports.getNearbyProducts = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Se requiere latitud y longitud' });
    }

    const filters = {
      category: req.query.category,
      max_price: req.query.max_price,
      limit: req.query.limit
    };

    const products = await Product.findNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      radius ? parseFloat(radius) : 10,
      filters
    );

    res.json({ products, count: products.length });
  } catch (error) {
    console.error('Error al buscar productos cercanos:', error);
    res.status(500).json({ error: 'Error al buscar productos cercanos', details: error.message });
  }
};

// Crear producto (solo comerciantes)
exports.createProduct = async (req, res) => {
  try {
    console.log('➕ createProduct called - User ID:', req.userId);
    console.log('📦 Product data:', req.body);
    
  const Merchant = require('../models/Merchant');
  let merchant = await Merchant.findByUserId(req.userId);
    
    console.log('🏪 Merchant found:', merchant ? `ID: ${merchant.id}, Name: ${merchant.business_name}` : 'NOT FOUND');
    
    if (!merchant) {
      console.error('⚠️ No merchant found for user ID, creating default merchant:', req.userId);
      const User = require('../models/User');
      const user = await User.findById(req.userId);
      const createdId = await Merchant.create({
        user_id: req.userId,
        business_name: (user?.full_name ? `Negocio de ${user.full_name}` : 'Mi Negocio'),
        business_type: 'other',
        description: '',
        business_hours: {},
        logo_image: null,
        banner_image: null,
      });
      merchant = await Merchant.findById(createdId);
    }

    const {
      name, description, category, original_price, discounted_price,
      quantity_available, expiry_date, image_url
    } = req.body;

    // Si viene archivo, construir URL pública
    let finalImageUrl = image_url;
    if (req.file) {
      finalImageUrl = `/uploads/products/${req.file.filename}`;
    }

    console.log('💾 Creating product with merchant ID:', merchant.id);
    const productId = await Product.create({
      merchant_id: merchant.id,
      name,
      description,
      category,
      original_price,
      discounted_price,
      quantity_available,
      expiry_date,
      image_url: finalImageUrl
    });

    console.log('✅ Product created with ID:', productId);
    const product = await Product.findById(productId);
    res.status(201).json({
      message: 'Producto creado exitosamente',
      product
    });
  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Error al crear producto', details: error.message });
  }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar que el producto pertenece al comerciante
    const Merchant = require('../models/Merchant');
    const merchant = await Merchant.findByUserId(req.userId);
    if (!merchant || product.merchant_id !== merchant.id) {
      return res.status(403).json({ error: 'No tienes permiso para actualizar este producto' });
    }

    const {
      name, description, category, original_price, discounted_price,
      quantity_available, expiry_date, image_url, status
    } = req.body;

    // Si se sube nueva imagen, usarla
    let finalImageUrl = image_url || product.image_url;
    if (req.file) {
      finalImageUrl = `/uploads/products/${req.file.filename}`;
    }

    const updated = await Product.update(req.params.id, {
      name: name || product.name,
      description: description || product.description,
      category: category || product.category,
      original_price: original_price || product.original_price,
      discounted_price: discounted_price || product.discounted_price,
      quantity_available: quantity_available !== undefined ? quantity_available : product.quantity_available,
      expiry_date: expiry_date || product.expiry_date,
      image_url: finalImageUrl,
      status: status || product.status
    });

    if (!updated) {
      return res.status(500).json({ error: 'Error al actualizar producto' });
    }

    const updatedProduct = await Product.findById(req.params.id);
    res.json({
      message: 'Producto actualizado exitosamente',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto', details: error.message });
  }
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar que el producto pertenece al comerciante
    const Merchant = require('../models/Merchant');
    const merchant = await Merchant.findByUserId(req.userId);
    if (!merchant || product.merchant_id !== merchant.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este producto' });
    }

    const deleted = await Product.delete(req.params.id);
    if (!deleted) {
      return res.status(500).json({ error: 'Error al eliminar producto' });
    }

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto', details: error.message });
  }
};

// Obtener productos del comerciante actual
exports.getMyProducts = async (req, res) => {
  try {
    console.log('📦 getMyProducts called - User ID:', req.userId);
    const Merchant = require('../models/Merchant');
    const merchant = await Merchant.findByUserId(req.userId);
    
    console.log('🏪 Merchant found:', merchant ? `ID: ${merchant.id}, Name: ${merchant.business_name}` : 'NOT FOUND');
    
    if (!merchant) {
      console.error('❌ No merchant found for user ID:', req.userId);
      return res.status(403).json({ error: 'No tienes permisos de comerciante' });
    }

    const includeAll = req.query.include_all === 'true';
    console.log('📋 Getting products for merchant ID:', merchant.id, 'includeAll:', includeAll);
    const products = await Product.getByMerchant(merchant.id, includeAll);
    
    console.log('✅ Products found:', products.length);
    res.json({ products, count: products.length });
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Error al obtener productos', details: error.message });
  }
};
