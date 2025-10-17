# SecondBite - Aplicación Móvil para Reducción de Desperdicios Alimenticios

![SecondBite](https://img.shields.io/badge/version-1.0.0-green)
![React Native](https://img.shields.io/badge/React%20Native-0.74-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)

## 📋 Descripción

SecondBite es una aplicación móvil innovadora que conecta comercios con consumidores para vender productos alimenticios próximos a caducar a precios reducidos, promoviendo la reducción del desperdicio alimentario y fomentando un consumo sostenible.

### Autores
- Christian Efrain Tapia Rodriguez
- Ernesto Vega Velasco
- Ulises Ramirez Tequianes

### Asesores
- D. en C. Flores Cortés Carlos Alberto
- D. en Ed. Armando Román Gallardo

**Universidad de Colima - Octubre 2025**

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐
│  Aplicación     │
│  Móvil          │  → React Native + Expo + TypeScript
│  (Frontend)     │
└────────┬────────┘
         │
         │ HTTP/HTTPS
         │
┌────────▼────────┐
│   API REST      │
│   (Backend)     │  → Node.js + Express
└────────┬────────┘
         │
         │ MySQL2
         │
┌────────▼────────┐
│  Base de Datos  │  → MySQL 8.0
│  Local          │
└─────────────────┘
```

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

## 🛠️ Instalación y Configuración

### 1. Clonar el Repositorio

```bash
cd "C:\Users\Efrain PC\Desktop\SecondBite"
```

### 2. Configurar la Base de Datos MySQL

#### 2.1. Iniciar MySQL

En Windows:
```powershell
# Iniciar el servicio de MySQL
net start MySQL80

# O abrir MySQL Workbench / phpMyAdmin
```

#### 2.2. Crear la Base de Datos

Opción 1 - Desde la línea de comandos:
```bash
# Conectarse a MySQL
mysql -u root -p

# En el prompt de MySQL, ejecutar:
source C:\Users\Efrain PC\Desktop\SecondBite\backend\database\init.sql
```

Opción 2 - Copiar y pegar el contenido:
```bash
mysql -u root -p < backend/database/init.sql
```

#### 2.3. Verificar la creación

```sql
USE secondbite_db;
SHOW TABLES;
SELECT * FROM users;
```

Deberías ver las siguientes tablas:
- users
- merchants
- products
- orders
- order_items
- reviews
- favorites
- notifications

### 3. Configurar el Backend

#### 3.1. Navegar a la carpeta del backend

```bash
cd backend
```

#### 3.2. Instalar dependencias

```bash
npm install
```

#### 3.3. Configurar variables de entorno

Crear archivo `.env` copiando `.env.example`:

```bash
copy .env.example .env
```

Editar `.env` con tus credenciales de MySQL:

```env
PORT=3000
NODE_ENV=development

# Configuración de MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=secondbite_db

# JWT Secret
JWT_SECRET=tu_clave_secreta_muy_segura_123456
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=*
```

#### 3.4. Iniciar el servidor

```bash
# Desarrollo con recarga automática
npm run dev

# O producción
npm start
```

Deberías ver:
```
╔═══════════════════════════════════════════════════════════╗
║              🍽️  SecondBite API Server  🍽️               ║
╚═══════════════════════════════════════════════════════════╝

🚀 Servidor ejecutándose en: http://localhost:3000
✅ Conexión exitosa a MySQL
```

#### 3.5. Verificar el servidor

Abrir en el navegador o Postman:
```
http://localhost:3000/health
```

Deberías ver:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-10-16T..."
}
```

### 4. Configurar el Frontend

#### 4.1. Abrir una nueva terminal y navegar al frontend

```bash
cd frontend
```

#### 4.2. Instalar dependencias

```bash
npm install
```

#### 4.3. Configurar la URL del API

Editar `src/utils/config.ts` y cambiar la URL del API si es necesario:

```typescript
// Si usas tu computadora como servidor
export const API_URL = 'http://TU_IP_LOCAL:3000/api';

// Ejemplo:
// export const API_URL = 'http://192.168.1.10:3000/api';
```

Para encontrar tu IP local:

**Windows:**
```bash
ipconfig
```
Busca "Dirección IPv4" en la sección de tu adaptador de red activo.

**macOS/Linux:**
```bash
ifconfig | grep "inet "
```

#### 4.4. Iniciar la aplicación

```bash
npm start
```

O específicamente:
```bash
# Android
npm run android

# iOS
npm run ios
```

#### 4.5. Escanear el código QR

1. Abre **Expo Go** en tu dispositivo móvil
2. Escanea el código QR que aparece en la terminal
3. Espera a que la aplicación se cargue

---

## 📱 Uso de la Aplicación

### Usuarios de Prueba

La base de datos incluye usuarios de ejemplo:

#### Consumidor
```
Email: consumer@example.com
Password: (necesitas definirla en el script SQL)
```

#### Comerciante
```
Email: merchant@example.com
Password: (necesitas definirla en el script SQL)
```

### Flujo de Uso

#### Como Consumidor:
1. **Registro**: Crear cuenta como consumidor
2. **Explorar**: Ver productos disponibles en el inicio
3. **Buscar**: Filtrar por categoría, precio, descuento
4. **Ubicación**: Encontrar productos cercanos
5. **Comprar**: Realizar pedido de productos
6. **Seguimiento**: Ver estado de pedidos

#### Como Comerciante:
1. **Registro**: Crear cuenta como comerciante
2. **Configurar**: Completar perfil del negocio
3. **Agregar**: Publicar productos próximos a caducar
4. **Gestionar**: Actualizar inventario y precios
5. **Pedidos**: Confirmar y procesar pedidos
6. **Estadísticas**: Ver ventas y rendimiento

---

## 🔌 API Endpoints

### Autenticación
```
POST   /api/auth/register      - Registrar usuario
POST   /api/auth/login         - Iniciar sesión
GET    /api/auth/profile       - Obtener perfil
PUT    /api/auth/profile       - Actualizar perfil
PUT    /api/auth/change-password - Cambiar contraseña
```

### Productos
```
GET    /api/products           - Listar productos
GET    /api/products/nearby    - Productos cercanos
GET    /api/products/:id       - Detalle de producto
POST   /api/products           - Crear producto (comerciante)
PUT    /api/products/:id       - Actualizar producto
DELETE /api/products/:id       - Eliminar producto
GET    /api/products/merchant/my-products - Mis productos
```

### Comercios
```
GET    /api/merchants          - Listar comercios
GET    /api/merchants/nearby   - Comercios cercanos
GET    /api/merchants/:id      - Detalle de comercio
GET    /api/merchants/:id/products - Productos del comercio
GET    /api/merchants/me/info  - Mi comercio
PUT    /api/merchants/me/info  - Actualizar mi comercio
```

### Pedidos
```
POST   /api/orders             - Crear pedido
GET    /api/orders/my-orders   - Mis pedidos (consumidor)
GET    /api/orders/:id         - Detalle de pedido
PUT    /api/orders/:id/cancel  - Cancelar pedido
GET    /api/orders/merchant/orders - Pedidos (comerciante)
PUT    /api/orders/:id/status  - Actualizar estado
GET    /api/orders/merchant/stats - Estadísticas
```

---

## 🗄️ Estructura de Base de Datos

### Tablas Principales

```sql
- users (usuarios: consumidores y comerciantes)
- merchants (información de comercios)
- products (productos)
- orders (pedidos)
- order_items (items de pedidos)
- reviews (reseñas y calificaciones)
- favorites (comercios favoritos)
- notifications (notificaciones)
```

### Diagrama de Relaciones

```
users (1) ──── (1) merchants
  │
  ├── (1) ──── (*) orders
  │
  └── (1) ──── (*) favorites

merchants (1) ──── (*) products
  │
  └── (1) ──── (*) orders

products (*) ──── (*) order_items ──── (1) orders

orders (1) ──── (*) reviews
```

---

## 🧪 Pruebas con Postman

### 1. Registro de Usuario

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "full_name": "Usuario de Prueba",
  "phone": "3121234567",
  "user_type": "consumer",
  "address": "Calle Principal 123",
  "latitude": 19.2433,
  "longitude": -103.7248
}
```

### 2. Login

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Guarda el `token` de la respuesta.

### 3. Obtener Productos

```http
GET http://localhost:3000/api/products
Authorization: Bearer TU_TOKEN_AQUI
```

### 4. Crear Producto (Comerciante)

```http
POST http://localhost:3000/api/products
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "name": "Pizza del día",
  "description": "Pizza familiar de pepperoni",
  "category": "prepared_food",
  "original_price": 150,
  "discounted_price": 90,
  "quantity_available": 3,
  "expiry_date": "2025-10-17"
}
```

---

## ⚠️ Solución de Problemas

### Error: No se puede conectar a MySQL

```bash
# Verificar si MySQL está corriendo
net start MySQL80

# O reiniciar el servicio
net stop MySQL80
net start MySQL80
```

### Error: Puerto 3000 ya está en uso

```bash
# Cambiar el puerto en backend/.env
PORT=3001
```

### Error: No se puede conectar al backend desde el móvil

1. Verifica que estés en la misma red WiFi
2. Usa tu IP local en lugar de `localhost`
3. Desactiva el firewall temporalmente para pruebas
4. En Windows, permite Node.js en el firewall

### Error: La aplicación no carga en Expo

```bash
# Limpiar caché
expo start -c

# O reinstalar dependencias
rm -rf node_modules
npm install
```

---

## 📚 Estructura del Proyecto

```
SecondBite/
├── backend/
│   ├── database/
│   │   └── init.sql              # Script de inicialización de BD
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js       # Configuración de MySQL
│   │   ├── controllers/          # Controladores de la API
│   │   ├── middleware/           # Middlewares (auth)
│   │   ├── models/               # Modelos de datos
│   │   ├── routes/               # Rutas de la API
│   │   └── server.js             # Servidor principal
│   ├── .env.example              # Ejemplo de variables de entorno
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/           # Componentes reutilizables
    │   ├── context/              # Context API (Auth)
    │   ├── navigation/           # Navegación de la app
    │   ├── screens/              # Pantallas
    │   ├── services/             # Servicios (API calls)
    │   ├── types/                # Tipos TypeScript
    │   └── utils/                # Utilidades y configuración
    ├── App.tsx                   # Componente principal
    ├── app.json                  # Configuración de Expo
    ├── tsconfig.json             # Configuración TypeScript
    └── package.json
```

---

## 🤝 Contribuciones

Este es un proyecto académico para la tesis de grado. Para contribuir:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

---

## 📞 Contacto

Para preguntas o soporte:

- **Autores**: Christian Efrain Tapia Rodriguez, Ernesto Vega Velasco, Ulises Ramirez Tequianes
- **Institución**: Universidad de Colima
- **Facultad**: Ingeniería de Software

---

## 🎯 Objetivos de Desarrollo Sostenible

Este proyecto contribuye a los siguientes ODS de las Naciones Unidas:

- **ODS 2**: Hambre Cero
- **ODS 12**: Producción y Consumo Responsables
- **ODS 13**: Acción por el Clima

---

## 📊 Estado del Proyecto

- [x] Diseño de arquitectura
- [x] Base de datos MySQL
- [x] API Backend completa
- [x] Autenticación JWT
- [x] Sistema de productos
- [x] Sistema de pedidos
- [x] Frontend React Native básico
- [ ] Integración completa de mapas
- [ ] Sistema de notificaciones push
- [ ] Pasarela de pagos
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Documentación API (Swagger)
- [ ] Deploy a producción

---

**¡Gracias por usar SecondBite! Juntos reducimos el desperdicio alimentario. 🍽️♻️**
