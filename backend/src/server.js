const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const merchantRoutes = require('./routes/merchants');
const orderRoutes = require('./routes/orders');
const notificationRoutes = require('./routes/notifications');

const app = express();
let PORT = parseInt(process.env.PORT, 10) || 3000;
const path = require('path');
const fs = require('fs');

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

// Servir archivos estáticos (uploads)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

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
      orders: '/api/orders',
      notifications: '/api/notifications',
      uploads: '/uploads'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);

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

// Helper: intentar escuchar en puerto y reintentar si está ocupado
const listenWithRetry = (port, retries = 5) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve({ server, port }));
    server.on('error', async (err) => {
      if (err && err.code === 'EADDRINUSE' && retries > 0) {
        const nextPort = port + 1;
        console.warn(`⚠️  Puerto ${port} en uso. Intentando con ${nextPort}...`);
        try {
          const result = await listenWithRetry(nextPort, retries - 1);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      } else {
        reject(err);
      }
    });
  });
};

// Iniciar servidor
const startServer = async () => {
  try {
    // Verificar conexión a base de datos
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('⚠️  Advertencia: No se pudo conectar a la base de datos');
      console.error('   Verifica que MySQL esté ejecutándose y las credenciales sean correctas');
    }

    const { port: boundPort } = await listenWithRetry(PORT, 10);
    PORT = boundPort;
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
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
