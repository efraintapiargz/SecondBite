# SecondBite 🍽️♻️# SecondBite 🍽️♻️



> Plataforma para reducir el desperdicio alimentario conectando comercios con consumidores> Aplicación móvil para reducir el desperdicio alimentario conectando comercios con consumidores



[![Version](https://img.shields.io/badge/version-1.0.0-green)](https://github.com/efraintapiargz/SecondBite)[![Version](https://img.shields.io/badge/version-1.0.0-green)](https://github.com/efraintapiargz/SecondBite)

[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue)](https://reactnative.dev/)[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue)](https://reactnative.dev/)

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)

[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)](https://www.mysql.com/)[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)](https://www.mysql.com/)

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**Universidad de Colima** | Ingeniería de Software | Octubre 2025

**Universidad de Colima** | Ingeniería de Software | Octubre 2025

---

---

## 📖 Descripción

## 📋 Tabla de Contenidos

**SecondBite** conecta comercios que tienen productos alimenticios próximos a caducar con consumidores que buscan ofertas, reduciendo el desperdicio y promoviendo la sostenibilidad.

- [Descripción](#-descripción)

### ✨ Características Implementadas- [Inicio Rápido](#-inicio-rápido)

- [Tecnologías](#-tecnologías)

**Para Consumidores:**- [Configuración](#-configuración)

- ✅ Registro e inicio de sesión  - [1. MySQL](#1-configurar-mysql)

- ✅ Catálogo de productos con descuentos  - [2. Backend](#2-configurar-backend)

- ✅ Carrito de compras (restricción: un solo comercio por pedido)  - [3. Frontend](#3-configurar-frontend)

- ✅ Checkout simplificado (pago solo en tienda)- [Estructura del Proyecto](#-estructura-del-proyecto)

- ✅ Historial de pedidos- [API REST](#-api-rest)

- ✅ Vista de detalles de productos- [Testing](#-testing)

- [Contribuir](#-contribuir)

**Para Comerciantes:**

- ✅ Registro e inicio de sesión---

- ✅ Gestión de productos (crear, editar, eliminar)

- ✅ Vista de pedidos recibidos## 📖 Descripción

- ✅ Actualización de estados de pedidos

- ✅ Dashboard básico**SecondBite** conecta comercios que tienen productos alimenticios próximos a caducar con consumidores que buscan ofertas, reduciendo el desperdicio y promoviendo la sostenibilidad.



### 🎯 Alineación ODS### Características Principales

- **ODS 2**: Hambre Cero

- **ODS 12**: Producción y Consumo Responsables**Para Consumidores:**

- **ODS 13**: Acción por el Clima- 🔍 Buscar productos con descuento por proximidad

- 📍 Geolocalización de comercios cercanos

---- 🛒 Sistema de pedidos

- ⭐ Reseñas y calificaciones

## 🚀 Inicio Rápido- ❤️ Comercios favoritos



### Requisitos Previos**Para Comerciantes:**

- 📦 Gestión de productos e inventario

- [Node.js](https://nodejs.org/) 18 o superior- 💰 Control de precios y descuentos

- [MySQL](https://www.mysql.com/) 8.0 o superior- 📊 Dashboard con estadísticas

- [Git](https://git-scm.com/)- 🔔 Sistema de notificaciones

- 📈 Reportes de ventas

### Instalación

### Alineación ODS (Objetivos de Desarrollo Sostenible)

```bash- **ODS 2**: Hambre Cero

# 1. Clonar el repositorio- **ODS 12**: Producción y Consumo Responsables

git clone https://github.com/efraintapiargz/SecondBite.git- **ODS 13**: Acción por el Clima

cd SecondBite

---

# 2. Configurar base de datos

# Ver sección "Configuración de MySQL" más abajo## 🚀 Inicio Rápido



# 3. Instalar dependencias del backend### Requisitos Previos

cd backend

npm install- [Node.js](https://nodejs.org/) 18 o superior

- [MySQL](https://www.mysql.com/) 8.0 o superior

# 4. Configurar variables de entorno- [Git](https://git-scm.com/)

cp .env.example .env- [Expo Go](https://expo.dev/client) (app móvil para testing)

# Editar .env con tus credenciales de MySQL

### Instalación Rápida

# 5. Iniciar backend

npm run dev```bash

# 1. Clonar el repositorio

# 6. En otra terminal, instalar dependencias del frontendgit clone https://github.com/efraintapiargz/SecondBite.git

cd ../frontendcd SecondBite

npm install

# 2. Instalar dependencias

# 7. Iniciar frontendcd backend && npm install

npm startcd ../frontend && npm install

```

# 3. Configurar MySQL (ver sección de configuración abajo)

---

# 4. Iniciar backend

## 🛠️ Tecnologíascd backend

npm run dev

### Backend

- **Node.js** + **Express.js** - API REST# 5. Iniciar frontend (en otra terminal)

- **MySQL2** - Base de datoscd frontend

- **JWT** - Autenticaciónnpm start

- **bcryptjs** - Hash de contraseñas```

- **Nodemon** - Hot reload

---

### Frontend

- **React Native** + **Expo** v54## 🛠️ Tecnologías

- **TypeScript** - Type safety

- **Axios** - HTTP client### Backend

- **AsyncStorage** - Persistencia local- **Node.js** + **Express.js** - Servidor API REST

- **React Navigation** - Navegación- **MySQL2** - Driver de base de datos con soporte para Promises

- **JWT** - Autenticación y autorización

---- **bcryptjs** - Hash de contraseñas

- **Multer** - Manejo de archivos

## ⚙️ Configuración

### Frontend

### 1. Configurar MySQL- **React Native** 0.74 - Framework móvil

- **Expo** 51 - Toolchain de desarrollo

```sql- **TypeScript** - Tipado estático

-- Crear base de datos- **React Navigation** 6 - Navegación

CREATE DATABASE secondbite_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;- **Axios** - Cliente HTTP

- **AsyncStorage** - Almacenamiento local

-- Ejecutar script de inicialización

USE secondbite_db;### Base de Datos

SOURCE backend/database/init.sql;- **MySQL** 8.0 - Base de datos relacional

```- 8 tablas: users, merchants, products, orders, order_items, reviews, favorites, notifications



### 2. Configurar Backend---



Crear archivo `.env` en `/backend`:## 🚀 Características Principales



```env### Para Consumidores 👥

# Servidor- ✅ Registro y autenticación de usuarios

PORT=3000- ✅ Búsqueda de productos próximos a caducar con descuentos

NODE_ENV=development- ✅ Geolocalización para encontrar productos cercanos

- ✅ Sistema de pedidos y reservas

# Base de datos- ✅ Historial de compras

DB_HOST=localhost- ✅ Perfil de usuario personalizado

DB_USER=root

DB_PASSWORD=tu_password_mysql### Para Comerciantes 🏪

DB_NAME=secondbite_db- ✅ Registro como comercio

DB_PORT=3306- ✅ Gestión completa de productos (CRUD)

- ✅ Dashboard con estadísticas de ventas

# JWT- ✅ Gestión de pedidos

JWT_SECRET=tu_secret_key_segura_aqui- ✅ Perfil de negocio

JWT_EXPIRES_IN=7d

```### Características Técnicas ⚙️

- 🔐 Autenticación JWT

### 3. Configurar Frontend- 📍 Geolocalización con cálculo de distancia (Haversine)

- 🔍 Búsqueda y filtrado avanzado de productos

El archivo `frontend/src/utils/config.ts` ya está configurado para desarrollo:- 📊 Sistema de calificaciones y reseñas

- 💾 Base de datos relacional MySQL

```typescript- 🌐 API RESTful bien estructurada

API_URL: 'http://192.168.100.22:3000/api'

```---



Cambia la IP si es necesario para tu red local.## 📦 Tecnologías Utilizadas



---### Backend

- **Node.js** 18+

## 📱 Usuarios de Prueba- **Express** 4.18 - Framework web

- **MySQL2** 3.6 - Driver de MySQL

### Consumidor- **JWT** (jsonwebtoken) - Autenticación

- **Email:** `efrain@gmail.com`- **bcryptjs** - Hash de contraseñas

- **Contraseña:** (la que registraste)- **dotenv** - Variables de entorno

- **cors** - Control de acceso

### Comerciante- **multer** - Manejo de archivos

- **Email:** `merchant@example.com`

- **Contraseña:** Necesita configuración inicial### Frontend

- **Nota:** Registra un nuevo comerciante o usa el script `backend/create-merchant-for-user.js`- **React Native** 0.74 - Framework móvil

- **Expo** ~51.0 - Toolchain y SDK

---- **TypeScript** 5.1 - Tipado estático

- **React Navigation** 6.x - Navegación

## 🏗️ Estructura del Proyecto- **Axios** - Cliente HTTP

- **AsyncStorage** - Almacenamiento local

```- **Expo Location** - Geolocalización

SecondBite/- **React Native Maps** - Mapas

├── backend/

│   ├── src/---

│   │   ├── config/          # Configuración de DB

│   │   ├── controllers/     # Lógica de negocio## 📋 Requisitos Previos

│   │   ├── middleware/      # Auth, validaciones

│   │   ├── models/          # Modelos de datosAntes de comenzar, asegúrate de tener instalado:

│   │   ├── routes/          # Rutas de API

│   │   └── server.js        # Entrada principal1. **Node.js** (v18 o superior)

│   ├── database/   ```bash

│   │   └── init.sql         # Schema inicial   node --version

│   └── package.json   ```

├── frontend/

│   ├── src/2. **MySQL** (v8.0 o superior)

│   │   ├── components/      # Componentes reutilizables   ```bash

│   │   ├── context/         # Context API (Cart, Auth)   mysql --version

│   │   ├── navigation/      # Configuración de navegación   ```

│   │   ├── screens/         # Pantallas de la app

│   │   │   ├── consumer/    # Pantallas de consumidor3. **npm** o **yarn**

│   │   │   └── merchant/    # Pantallas de comerciante   ```bash

│   │   ├── services/        # API calls   npm --version

│   │   ├── types/           # TypeScript types   ```

│   │   └── utils/           # Utilidades

│   └── package.json4. **Expo CLI**

├── EJEMPLOS_API.md          # Ejemplos de uso de API   ```bash

├── PROGRESS.md              # Estado del proyecto   npm install -g expo-cli

├── QUICK_START.md           # Guía rápida   ```

├── TROUBLESHOOTING.md       # Solución de problemas

└── README.md                # Este archivo5. **Expo Go** (en tu dispositivo móvil)

```   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

   - [iOS](https://apps.apple.com/app/expo-go/id982107779)

---

---

## 🔌 API Endpoints

## ⚙️ Configuración

### Autenticación

- `POST /api/auth/register` - Registro de usuario### 1. Configurar MySQL

- `POST /api/auth/login` - Inicio de sesión

- `GET /api/auth/me` - Obtener usuario actual (🔒)#### Instalación MySQL (si no lo tienes)



### Productos**Windows:**

- `GET /api/products` - Listar productos```powershell

- `GET /api/products/:id` - Detalle de producto# Descargar de: https://dev.mysql.com/downloads/installer/

- `POST /api/products` - Crear producto (🔒 Merchant)# Instalar MySQL Server y configurar contraseña root

- `PUT /api/products/:id` - Actualizar producto (🔒 Merchant)```

- `DELETE /api/products/:id` - Eliminar producto (🔒 Merchant)

- `GET /api/products/merchant/my-products` - Mis productos (🔒 Merchant)**macOS:**

```bash

### Pedidosbrew install mysql

- `POST /api/orders` - Crear pedido (🔒 Consumer)brew services start mysql

- `GET /api/orders/my-orders` - Mis pedidos (🔒 Consumer)mysql_secure_installation

- `GET /api/orders/merchant/orders` - Pedidos recibidos (🔒 Merchant)```

- `PUT /api/orders/:id/status` - Actualizar estado (🔒 Merchant)

**Linux (Ubuntu):**

### Comercios```bash

- `GET /api/merchants` - Listar comerciossudo apt update && sudo apt install mysql-server

- `GET /api/merchants/:id` - Detalle de comerciosudo systemctl start mysql

sudo mysql_secure_installation

🔒 = Requiere autenticación (Bearer Token)```



---#### Crear la Base de Datos



## 🚧 Estado del Proyecto```bash

# Conectar a MySQL

**MVP Completado: ~80%**mysql -u root -p



### ✅ Completado# Ejecutar el script de inicialización

- Sistema de autenticación completosource backend/database/init.sql

- CRUD de productos

- Carrito de compras con validaciones# O desde la línea de comandos:

- Sistema de pedidos end-to-endmysql -u root -p < backend/database/init.sql

- Vista de pedidos para consumidor y comerciante```

- Gestión de estados de pedidos

- Restricción de un solo merchant por pedido#### Verificar la Base de Datos

- Pago únicamente en tienda

```sql

### 🔨 PendienteUSE secondbite_db;

- Geolocalización y búsqueda por cercaníaSHOW TABLES;

- Filtros avanzados y búsquedaSELECT * FROM users;

- Sistema de notificaciones```

- Dashboard con estadísticas

- Favoritos### 2. Configurar Backend

- Reseñas y calificaciones

- Upload de imágenes```bash

# Navegar al backend

Ver [PROGRESS.md](PROGRESS.md) para más detalles.cd backend



---# Instalar dependencias

npm install

## 🐛 Solución de Problemas

# Configurar variables de entorno

Ver [TROUBLESHOOTING.md](TROUBLESHOOTING.md) para problemas comunes.cp .env.example .env

# Editar .env con tus credenciales

### Problemas Frecuentes```



**Backend no inicia:****Contenido de `.env`:**

```bash

# Verificar que MySQL esté corriendo```env

# Verificar credenciales en .envPORT=3000

# Verificar que la base de datos existaDB_HOST=localhost

```DB_PORT=3306

DB_USER=root

**Frontend no conecta al backend:**DB_PASSWORD=tu_password_mysql

```bashDB_NAME=secondbite_db

# Verificar IP en frontend/src/utils/config.tsJWT_SECRET=clave_secreta_muy_segura_cambiar_en_produccion

# Verificar que backend esté corriendo en puerto 3000JWT_EXPIRES_IN=7d

# Verificar firewallCORS_ORIGIN=*

``````



**Usuario merchant sin permisos:****Iniciar el servidor:**

```bash

# Ejecutar script para crear merchant```bash

cd backendnpm run dev

node create-merchant-for-user.js```

```

Deberías ver: `✅ Conexión exitosa a MySQL`

---

### 3. Configurar Frontend

## 📚 Documentación Adicional

```bash

- [QUICK_START.md](QUICK_START.md) - Guía de inicio rápido# Navegar al frontend

- [EJEMPLOS_API.md](EJEMPLOS_API.md) - Ejemplos de uso de APIcd ../frontend

- [PROGRESS.md](PROGRESS.md) - Estado detallado del proyecto

- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Solución de problemas# Instalar dependencias

npm install

---

# Iniciar Expo

## 👥 Contribuirnpm start

```

Este es un proyecto académico de la Universidad de Colima. Las contribuciones son bienvenidas.

**Configurar IP para dispositivo físico:**

1. Fork el proyecto

2. Crea una rama (`git checkout -b feature/AmazingFeature`)Editar `frontend/src/utils/config.ts`:

3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)

4. Push a la rama (`git push origin feature/AmazingFeature`)```typescript

5. Abre un Pull Requestexport const CONFIG = {

  API_URL: 'http://192.168.X.X:3000/api', // Cambia por tu IP local

---  // ...

};

## 📄 Licencia```



Este proyecto es de código abierto bajo la licencia MIT.**Escanear QR con Expo Go** en tu teléfono móvil.



------



## 👨‍💻 Autor## 📁 Estructura del Proyecto



**Efrain Tapia**  ```

Universidad de Colima - Ingeniería de Software  SecondBite/

Octubre 2025├── backend/

│   ├── database/

---│   │   └── init.sql           # Script de inicialización SQL

│   ├── src/

## 🙏 Agradecimientos│   │   ├── config/

│   │   │   └── database.js    # Configuración MySQL

- Universidad de Colima│   │   ├── controllers/        # Lógica de negocio

- Profesores del curso de Ingeniería de Software│   │   │   ├── authController.js

- Comunidad de React Native y Node.js│   │   │   ├── productController.js

│   │   │   ├── merchantController.js

---│   │   │   └── orderController.js

│   │   ├── models/            # Acceso a datos

**¿Preguntas o sugerencias?** Abre un issue en GitHub.│   │   │   ├── User.js

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
