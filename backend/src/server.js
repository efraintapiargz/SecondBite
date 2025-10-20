const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const merchantRoutes = require('./routes/merchants');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));

// Configurar headers UTF-8 para todas las respuestas
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'SecondBite API - Reduciendo el desperdicio alimenticio',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      merchants: '/api/merchants',
      orders: '/api/orders'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/orders', orderRoutes);

// Ruta para verificar salud del servidor
app.get('/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: 'ok',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Manejador de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Verificar conexión a base de datos
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('⚠️  Advertencia: No se pudo conectar a la base de datos');
      console.error('   Verifica que MySQL esté ejecutándose y las credenciales sean correctas');
    }

    app.listen(PORT, () => {
      console.log('');
      console.log('╔═══════════════════════════════════════════════════════════╗');
      console.log('║                                                           ║');
      console.log('║              🍽️  SecondBite API Server  🍽️               ║');
      console.log('║                                                           ║');
      console.log('╚═══════════════════════════════════════════════════════════╝');
      console.log('');
      console.log(`🚀 Servidor ejecutándose en: http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
      console.log(`🛒 Products: http://localhost:${PORT}/api/products`);
      console.log(`🏪 Merchants: http://localhost:${PORT}/api/merchants`);
      console.log(`📦 Orders: http://localhost:${PORT}/api/orders`);
      console.log('');
      console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
