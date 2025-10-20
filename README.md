# SecondBite 🍽️♻️

> Aplicación móvil para reducir el desperdicio alimentario conectando comercios con consumidores

[![Version](https://img.shields.io/badge/version-1.0.0-green)](https://github.com/efraintapiargz/SecondBite)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**Universidad de Colima** | Ingeniería de Software | Octubre 2025

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Inicio Rápido](#-inicio-rápido)
- [Tecnologías](#-tecnologías)
- [Configuración](#-configuración)
  - [1. MySQL](#1-configurar-mysql)
  - [2. Backend](#2-configurar-backend)
  - [3. Frontend](#3-configurar-frontend)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API REST](#-api-rest)
- [Testing](#-testing)
- [Contribuir](#-contribuir)

---

## 📖 Descripción

**SecondBite** conecta comercios que tienen productos alimenticios próximos a caducar con consumidores que buscan ofertas, reduciendo el desperdicio y promoviendo la sostenibilidad.

### Características Principales

**Para Consumidores:**
- 🔍 Buscar productos con descuento por proximidad
- 📍 Geolocalización de comercios cercanos
- 🛒 Sistema de pedidos
- ⭐ Reseñas y calificaciones
- ❤️ Comercios favoritos

**Para Comerciantes:**
- 📦 Gestión de productos e inventario
- 💰 Control de precios y descuentos
- 📊 Dashboard con estadísticas
- 🔔 Sistema de notificaciones
- 📈 Reportes de ventas

### Alineación ODS (Objetivos de Desarrollo Sostenible)
- **ODS 2**: Hambre Cero
- **ODS 12**: Producción y Consumo Responsables
- **ODS 13**: Acción por el Clima

---

## 🚀 Inicio Rápido

### Requisitos Previos

- [Node.js](https://nodejs.org/) 18 o superior
- [MySQL](https://www.mysql.com/) 8.0 o superior
- [Git](https://git-scm.com/)
- [Expo Go](https://expo.dev/client) (app móvil para testing)

### Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/efraintapiargz/SecondBite.git
cd SecondBite

# 2. Instalar dependencias
cd backend && npm install
cd ../frontend && npm install

# 3. Configurar MySQL (ver sección de configuración abajo)

# 4. Iniciar backend
cd backend
npm run dev

# 5. Iniciar frontend (en otra terminal)
cd frontend
npm start
```

---

## 🛠️ Tecnologías

### Backend
- **Node.js** + **Express.js** - Servidor API REST
- **MySQL2** - Driver de base de datos con soporte para Promises
- **JWT** - Autenticación y autorización
- **bcryptjs** - Hash de contraseñas
- **Multer** - Manejo de archivos

### Frontend
- **React Native** 0.74 - Framework móvil
- **Expo** 51 - Toolchain de desarrollo
- **TypeScript** - Tipado estático
- **React Navigation** 6 - Navegación
- **Axios** - Cliente HTTP
- **AsyncStorage** - Almacenamiento local

### Base de Datos
- **MySQL** 8.0 - Base de datos relacional
- 8 tablas: users, merchants, products, orders, order_items, reviews, favorites, notifications

---

## 🚀 Características Principales

### Para Consumidores 👥
- ✅ Registro y autenticación de usuarios
- ✅ Búsqueda de productos próximos a caducar con descuentos
- ✅ Geolocalización para encontrar productos cercanos
- ✅ Sistema de pedidos y reservas
- ✅ Historial de compras
- ✅ Perfil de usuario personalizado

### Para Comerciantes 🏪
- ✅ Registro como comercio
- ✅ Gestión completa de productos (CRUD)
- ✅ Dashboard con estadísticas de ventas
- ✅ Gestión de pedidos
- ✅ Perfil de negocio

### Características Técnicas ⚙️
- 🔐 Autenticación JWT
- 📍 Geolocalización con cálculo de distancia (Haversine)
- 🔍 Búsqueda y filtrado avanzado de productos
- 📊 Sistema de calificaciones y reseñas
- 💾 Base de datos relacional MySQL
- 🌐 API RESTful bien estructurada

---

## 📦 Tecnologías Utilizadas

### Backend
- **Node.js** 18+
- **Express** 4.18 - Framework web
- **MySQL2** 3.6 - Driver de MySQL
- **JWT** (jsonwebtoken) - Autenticación
- **bcryptjs** - Hash de contraseñas
- **dotenv** - Variables de entorno
- **cors** - Control de acceso
- **multer** - Manejo de archivos

### Frontend
- **React Native** 0.74 - Framework móvil
- **Expo** ~51.0 - Toolchain y SDK
- **TypeScript** 5.1 - Tipado estático
- **React Navigation** 6.x - Navegación
- **Axios** - Cliente HTTP
- **AsyncStorage** - Almacenamiento local
- **Expo Location** - Geolocalización
- **React Native Maps** - Mapas

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js** (v18 o superior)
   ```bash
   node --version
   ```

2. **MySQL** (v8.0 o superior)
   ```bash
   mysql --version
   ```

3. **npm** o **yarn**
   ```bash
   npm --version
   ```

4. **Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

5. **Expo Go** (en tu dispositivo móvil)
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)

---

## ⚙️ Configuración

### 1. Configurar MySQL

#### Instalación MySQL (si no lo tienes)

**Windows:**
```powershell
# Descargar de: https://dev.mysql.com/downloads/installer/
# Instalar MySQL Server y configurar contraseña root
```

**macOS:**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

**Linux (Ubuntu):**
```bash
sudo apt update && sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

#### Crear la Base de Datos

```bash
# Conectar a MySQL
mysql -u root -p

# Ejecutar el script de inicialización
source backend/database/init.sql

# O desde la línea de comandos:
mysql -u root -p < backend/database/init.sql
```

#### Verificar la Base de Datos

```sql
USE secondbite_db;
SHOW TABLES;
SELECT * FROM users;
```

### 2. Configurar Backend

```bash
# Navegar al backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

**Contenido de `.env`:**

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=secondbite_db
JWT_SECRET=clave_secreta_muy_segura_cambiar_en_produccion
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
```

**Iniciar el servidor:**

```bash
npm run dev
```

Deberías ver: `✅ Conexión exitosa a MySQL`

### 3. Configurar Frontend

```bash
# Navegar al frontend
cd ../frontend

# Instalar dependencias
npm install

# Iniciar Expo
npm start
```

**Configurar IP para dispositivo físico:**

Editar `frontend/src/utils/config.ts`:

```typescript
export const CONFIG = {
  API_URL: 'http://192.168.X.X:3000/api', // Cambia por tu IP local
  // ...
};
```

**Escanear QR con Expo Go** en tu teléfono móvil.

---

## 📁 Estructura del Proyecto

```
SecondBite/
├── backend/
│   ├── database/
│   │   └── init.sql           # Script de inicialización SQL
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js    # Configuración MySQL
│   │   ├── controllers/        # Lógica de negocio
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── merchantController.js
│   │   │   └── orderController.js
│   │   ├── models/            # Acceso a datos
│   │   │   ├── User.js
│   │   │   ├── Merchant.js
│   │   │   ├── Product.js
│   │   │   └── Order.js
│   │   ├── middleware/
│   │   │   └── auth.js        # Autenticación JWT
│   │   ├── routes/            # Endpoints API
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── merchants.js
│   │   │   └── orders.js
│   │   └── server.js          # Punto de entrada
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/        # Componentes reutilizables
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── navigation/
    │   │   └── AppNavigator.tsx
    │   ├── screens/
    │   │   ├── LoginScreen.tsx
    │   │   ├── consumer/      # Pantallas de consumidor
    │   │   └── merchant/      # Pantallas de comerciante
    │   ├── services/          # Servicios API
    │   │   ├── api.ts
    │   │   ├── authService.ts
    │   │   └── productService.ts
    │   ├── types/
    │   │   └── index.ts       # Definiciones TypeScript
    │   └── utils/
    │       └── config.ts      # Configuración global
    ├── App.tsx
    ├── app.json
    └── package.json
```

---

## 🔌 API REST

### Base URL
```
http://localhost:3000/api
```

### Endpoints Principales

#### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `GET /auth/profile` - Obtener perfil (🔒)
- `PUT /auth/profile` - Actualizar perfil (🔒)
- `PUT /auth/change-password` - Cambiar contraseña (🔒)

#### Productos
- `GET /products` - Listar productos
- `GET /products/nearby` - Productos cercanos
- `GET /products/:id` - Detalle de producto
- `POST /products` - Crear producto (🔒 Merchant)
- `PUT /products/:id` - Actualizar producto (🔒 Merchant)
- `DELETE /products/:id` - Eliminar producto (🔒 Merchant)

#### Comercios
- `GET /merchants` - Listar comercios
- `GET /merchants/nearby` - Comercios cercanos
- `GET /merchants/:id` - Detalle de comercio
- `GET /merchants/me/info` - Mi comercio (🔒 Merchant)
- `PUT /merchants/me/info` - Actualizar comercio (🔒 Merchant)

#### Pedidos
- `POST /orders` - Crear pedido (🔒 Consumer)
- `GET /orders/my-orders` - Mis pedidos (🔒 Consumer)
- `GET /orders/:id` - Detalle de pedido (🔒)
- `PUT /orders/:id/cancel` - Cancelar pedido (🔒 Consumer)
- `GET /orders/merchant/orders` - Pedidos recibidos (🔒 Merchant)
- `PUT /orders/:id/status` - Actualizar estado (🔒 Merchant)
- `GET /orders/merchant/stats` - Estadísticas (🔒 Merchant)

� = Requiere autenticación JWT

**Ver ejemplos completos en:** [`EJEMPLOS_API.md`](EJEMPLOS_API.md)

---

## 🧪 Testing

### Usuarios de Prueba

```javascript
// Consumidor
{
  "email": "juan@example.com",
  "password": "password123"
}

// Comerciante
{
  "email": "maria@tienda.com",
  "password": "password123"
}
```

### Probar con Postman

1. Importar la colección desde `EJEMPLOS_API.md`
2. Configurar variable `baseUrl`: `http://localhost:3000/api`
3. Registrar/Login → Copiar token
4. Agregar header: `Authorization: Bearer {token}`

### Health Check

```bash
curl http://localhost:3000/health
```

---

## 🗄️ Base de Datos

### Esquema MySQL

**8 Tablas Principales:**

1. **users** - Usuarios del sistema
2. **merchants** - Perfiles de comercio
3. **products** - Catálogo de productos
4. **orders** - Pedidos
5. **order_items** - Items de pedidos
6. **reviews** - Reseñas
7. **favorites** - Favoritos
8. **notifications** - Notificaciones

### Diagrama ER Simplificado

```
users (1) ──< (N) merchants
merchants (1) ──< (N) products
users (1) ──< (N) orders
orders (1) ──< (N) order_items
products (N) ──< (N) order_items
users (1) ──< (N) reviews
users (1) ──< (N) favorites
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to MySQL"
```bash
# Verificar que MySQL está corriendo
net start MySQL80  # Windows
brew services start mysql  # macOS
sudo systemctl start mysql  # Linux

# Verificar credenciales en .env
```

### Error: "Module not found"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Frontend no conecta al backend
```typescript
// Cambiar localhost por tu IP en config.ts
API_URL: 'http://192.168.1.10:3000/api'
```

### TypeScript errors después de npm install
```bash
# Recargar VS Code
Ctrl + Shift + P → "Developer: Reload Window"
```

---

## 👥 Autores

- **Christian Efrain Tapia Rodriguez**
- **Ernesto Vega Velasco**
- **Ulises Ramirez Tequianes**

### Asesores
- D. en C. Flores Cortés Carlos Alberto
- D. en Ed. Armando Román Gallardo

**Universidad de Colima** - Facultad de Ingeniería de Software

---

## 📄 Licencia

Este proyecto es académico y fue desarrollado como parte de un proyecto de tesis.

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📞 Soporte

Para dudas o problemas:
- Revisar [`EJEMPLOS_API.md`](EJEMPLOS_API.md) para ejemplos de uso
- Verificar sección de [Troubleshooting](#-troubleshooting)
- Crear un [Issue](https://github.com/efraintapiargz/SecondBite/issues)

---
