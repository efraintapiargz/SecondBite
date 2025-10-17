# 🧪 Ejemplos de API con Postman - SecondBite

Esta guía contiene ejemplos de todas las llamadas API que puedes hacer con Postman o cualquier cliente HTTP.

---

## 🔧 Configuración Inicial

### URL Base
```
http://localhost:3000/api
```

### Headers Comunes
```
Content-Type: application/json
Authorization: Bearer {TOKEN}
```

---

## 🔐 Autenticación

### 1. Registro de Usuario Consumidor

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123",
  "full_name": "Juan Pérez García",
  "phone": "3121234567",
  "user_type": "consumer",
  "address": "Av. Universidad 123, Colima, Col.",
  "latitude": 19.2433,
  "longitude": -103.7248
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "email": "juan@example.com",
    "full_name": "Juan Pérez García",
    "user_type": "consumer"
  }
}
```

### 2. Registro de Usuario Comerciante

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "tacos@example.com",
  "password": "password123",
  "full_name": "Tacos El Güero",
  "phone": "3129876543",
  "user_type": "merchant",
  "address": "Calle Hidalgo 456, Colima, Col.",
  "latitude": 19.2445,
  "longitude": -103.7256,
  "business_name": "Tacos El Güero",
  "business_type": "restaurant",
  "description": "Tacos al pastor y comida mexicana tradicional"
}
```

### 3. Login

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "email": "juan@example.com",
    "full_name": "Juan Pérez García",
    "phone": "3121234567",
    "user_type": "consumer",
    "address": "Av. Universidad 123, Colima, Col.",
    "latitude": 19.2433,
    "longitude": -103.7248
  }
}
```

⚠️ **Guarda el token para las siguientes peticiones**

### 4. Obtener Perfil

```http
GET http://localhost:3000/api/auth/profile
Authorization: Bearer {TOKEN}
```

### 5. Actualizar Perfil

```http
PUT http://localhost:3000/api/auth/profile
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "full_name": "Juan Pérez García Jr.",
  "phone": "3129999999",
  "address": "Nueva dirección 789"
}
```

### 6. Cambiar Contraseña

```http
PUT http://localhost:3000/api/auth/change-password
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "current_password": "password123",
  "new_password": "nuevaPassword456"
}
```

---

## 🛒 Productos

### 1. Listar Todos los Productos

```http
GET http://localhost:3000/api/products
```

**Con filtros:**
```http
GET http://localhost:3000/api/products?category=prepared_food&max_price=100&sort_by=discount
```

Parámetros disponibles:
- `category`: fruits, vegetables, bakery, dairy, meat, prepared_food, beverages, other
- `max_price`: Precio máximo
- `min_discount`: Descuento mínimo (%)
- `search`: Buscar en nombre/descripción
- `sort_by`: price_asc, price_desc, discount, expiry
- `limit`: Número máximo de resultados

### 2. Obtener Producto por ID

```http
GET http://localhost:3000/api/products/1
```

### 3. Buscar Productos Cercanos

```http
GET http://localhost:3000/api/products/nearby?latitude=19.2433&longitude=-103.7248&radius=10
```

Parámetros:
- `latitude`: Latitud actual (requerido)
- `longitude`: Longitud actual (requerido)
- `radius`: Radio en km (default: 10)
- Además acepta los mismos filtros que listar productos

### 4. Crear Producto (Solo Comerciantes)

```http
POST http://localhost:3000/api/products
Authorization: Bearer {TOKEN_COMERCIANTE}
Content-Type: application/json

{
  "name": "Pizza Familiar Pepperoni",
  "description": "Pizza grande de pepperoni del día",
  "category": "prepared_food",
  "original_price": 150,
  "discounted_price": 90,
  "quantity_available": 3,
  "expiry_date": "2025-10-17",
  "image_url": "https://example.com/pizza.jpg"
}
```

### 5. Actualizar Producto

```http
PUT http://localhost:3000/api/products/1
Authorization: Bearer {TOKEN_COMERCIANTE}
Content-Type: application/json

{
  "name": "Pizza Familiar Pepperoni - NUEVA OFERTA",
  "discounted_price": 80,
  "quantity_available": 2
}
```

### 6. Eliminar Producto

```http
DELETE http://localhost:3000/api/products/1
Authorization: Bearer {TOKEN_COMERCIANTE}
```

### 7. Obtener Mis Productos (Comerciante)

```http
GET http://localhost:3000/api/products/merchant/my-products
Authorization: Bearer {TOKEN_COMERCIANTE}
```

**Incluir todos (incluso vendidos/expirados):**
```http
GET http://localhost:3000/api/products/merchant/my-products?include_all=true
Authorization: Bearer {TOKEN_COMERCIANTE}
```

---

## 🏪 Comercios

### 1. Listar Todos los Comercios

```http
GET http://localhost:3000/api/merchants
```

**Con filtros:**
```http
GET http://localhost:3000/api/merchants?business_type=restaurant&min_rating=4.0&limit=10
```

### 2. Obtener Comercio por ID

```http
GET http://localhost:3000/api/merchants/1
```

### 3. Buscar Comercios Cercanos

```http
GET http://localhost:3000/api/merchants/nearby?latitude=19.2433&longitude=-103.7248&radius=5
```

### 4. Obtener Productos de un Comercio

```http
GET http://localhost:3000/api/merchants/1/products
```

### 5. Obtener Mi Comercio (Comerciante)

```http
GET http://localhost:3000/api/merchants/me/info
Authorization: Bearer {TOKEN_COMERCIANTE}
```

### 6. Actualizar Mi Comercio

```http
PUT http://localhost:3000/api/merchants/me/info
Authorization: Bearer {TOKEN_COMERCIANTE}
Content-Type: application/json

{
  "business_name": "Tacos El Güero - Sucursal Centro",
  "description": "Los mejores tacos de Colima",
  "business_hours": {
    "monday": "10:00-22:00",
    "tuesday": "10:00-22:00",
    "wednesday": "10:00-22:00",
    "thursday": "10:00-22:00",
    "friday": "10:00-23:00",
    "saturday": "10:00-23:00",
    "sunday": "10:00-20:00"
  }
}
```

---

## 📦 Pedidos

### 1. Crear Pedido (Consumidor)

```http
POST http://localhost:3000/api/orders
Authorization: Bearer {TOKEN_CONSUMIDOR}
Content-Type: application/json

{
  "merchant_id": 1,
  "payment_method": "cash",
  "pickup_time": "2025-10-16T18:00:00",
  "notes": "Sin cebolla por favor",
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 1
    }
  ]
}
```

**Respuesta:**
```json
{
  "message": "Pedido creado exitosamente",
  "order": {
    "id": 5,
    "consumer_id": 1,
    "merchant_id": 1,
    "total_amount": 230.00,
    "status": "pending",
    "payment_method": "cash",
    "pickup_time": "2025-10-16T18:00:00",
    "items": [...]
  }
}
```

### 2. Obtener Mis Pedidos (Consumidor)

```http
GET http://localhost:3000/api/orders/my-orders
Authorization: Bearer {TOKEN_CONSUMIDOR}
```

**Con filtros:**
```http
GET http://localhost:3000/api/orders/my-orders?status=pending&limit=10
Authorization: Bearer {TOKEN_CONSUMIDOR}
```

### 3. Obtener Detalle de Pedido

```http
GET http://localhost:3000/api/orders/5
Authorization: Bearer {TOKEN}
```

### 4. Cancelar Pedido (Consumidor)

```http
PUT http://localhost:3000/api/orders/5/cancel
Authorization: Bearer {TOKEN_CONSUMIDOR}
```

⚠️ Solo se puede cancelar si está en estado "pending" o "confirmed"

### 5. Obtener Pedidos del Comercio (Comerciante)

```http
GET http://localhost:3000/api/orders/merchant/orders
Authorization: Bearer {TOKEN_COMERCIANTE}
```

**Con filtros:**
```http
GET http://localhost:3000/api/orders/merchant/orders?status=pending
Authorization: Bearer {TOKEN_COMERCIANTE}
```

### 6. Actualizar Estado de Pedido (Comerciante)

```http
PUT http://localhost:3000/api/orders/5/status
Authorization: Bearer {TOKEN_COMERCIANTE}
Content-Type: application/json

{
  "status": "confirmed"
}
```

Estados disponibles:
- `pending`: Pendiente
- `confirmed`: Confirmado
- `ready`: Listo para recoger
- `completed`: Completado
- `cancelled`: Cancelado

### 7. Obtener Estadísticas (Comerciante)

```http
GET http://localhost:3000/api/orders/merchant/stats
Authorization: Bearer {TOKEN_COMERCIANTE}
```

**Con rango de fechas:**
```http
GET http://localhost:3000/api/orders/merchant/stats?start_date=2025-10-01&end_date=2025-10-31
Authorization: Bearer {TOKEN_COMERCIANTE}
```

---

## 🔍 Ejemplos de Flujos Completos

### Flujo 1: Registro y Compra (Consumidor)

```http
# 1. Registro
POST http://localhost:3000/api/auth/register
{
  "email": "maria@example.com",
  "password": "password123",
  "full_name": "María López",
  "user_type": "consumer",
  ...
}
# Guardar TOKEN

# 2. Buscar productos cercanos
GET http://localhost:3000/api/products/nearby?latitude=19.2433&longitude=-103.7248
Authorization: Bearer {TOKEN}

# 3. Ver detalle de producto
GET http://localhost:3000/api/products/1
Authorization: Bearer {TOKEN}

# 4. Crear pedido
POST http://localhost:3000/api/orders
Authorization: Bearer {TOKEN}
{
  "merchant_id": 1,
  "items": [{"product_id": 1, "quantity": 2}],
  ...
}

# 5. Ver mis pedidos
GET http://localhost:3000/api/orders/my-orders
Authorization: Bearer {TOKEN}
```

### Flujo 2: Gestión de Productos (Comerciante)

```http
# 1. Login
POST http://localhost:3000/api/auth/login
{
  "email": "merchant@example.com",
  "password": "password123"
}
# Guardar TOKEN

# 2. Ver mi perfil de comercio
GET http://localhost:3000/api/merchants/me/info
Authorization: Bearer {TOKEN}

# 3. Crear producto
POST http://localhost:3000/api/products
Authorization: Bearer {TOKEN}
{
  "name": "Torta de jamón",
  "category": "prepared_food",
  "original_price": 40,
  "discounted_price": 25,
  ...
}

# 4. Ver mis productos
GET http://localhost:3000/api/products/merchant/my-products
Authorization: Bearer {TOKEN}

# 5. Actualizar producto
PUT http://localhost:3000/api/products/1
Authorization: Bearer {TOKEN}
{
  "discounted_price": 20,
  "quantity_available": 1
}

# 6. Ver pedidos recibidos
GET http://localhost:3000/api/orders/merchant/orders
Authorization: Bearer {TOKEN}

# 7. Confirmar pedido
PUT http://localhost:3000/api/orders/5/status
Authorization: Bearer {TOKEN}
{
  "status": "confirmed"
}

# 8. Ver estadísticas
GET http://localhost:3000/api/orders/merchant/stats
Authorization: Bearer {TOKEN}
```

---

## 📊 Colección de Postman

Puedes importar esta colección JSON en Postman:

```json
{
  "info": {
    "name": "SecondBite API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## ⚠️ Errores Comunes

### 401 Unauthorized
```json
{
  "error": "No se proporcionó token de autenticación"
}
```
**Solución:** Agrega el header `Authorization: Bearer {TOKEN}`

### 403 Forbidden
```json
{
  "error": "Se requieren permisos de comerciante"
}
```
**Solución:** Esa ruta solo es accesible para comerciantes

### 404 Not Found
```json
{
  "error": "Producto no encontrado"
}
```
**Solución:** Verifica que el ID existe

### 400 Bad Request
```json
{
  "error": "Cantidad insuficiente de Pizza. Disponible: 1"
}
```
**Solución:** Revisa los datos enviados

---

## 🧪 Tips para Testing

1. **Usa Variables de Entorno en Postman:**
   - `{{base_url}}` = `http://localhost:3000/api`
   - `{{token}}` = Token actual

2. **Guarda el Token Automáticamente:**
   En la pestaña "Tests" del login:
   ```javascript
   pm.environment.set("token", pm.response.json().token);
   ```

3. **Prueba Diferentes Roles:**
   - Crea un token de consumidor y uno de comerciante
   - Usa variables para cambiar rápidamente

4. **Verifica Códigos de Estado:**
   - 200: OK
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Server Error

---

**¡Listo para probar tu API! 🚀**
