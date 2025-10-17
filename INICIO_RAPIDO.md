# 🚀 Inicio Rápido - SecondBite

## ✅ Lo que YA está hecho

He creado toda la estructura del proyecto SecondBite con:

### Backend Completo ✅
- ✅ Servidor Express.js con estructura MVC
- ✅ Configuración de MySQL con pool de conexiones
- ✅ 4 Modelos: User, Merchant, Product, Order
- ✅ 4 Controladores completos
- ✅ Sistema de autenticación JWT
- ✅ Middleware de autenticación y autorización
- ✅ Rutas RESTful completas
- ✅ Script SQL de inicialización con datos de ejemplo
- ✅ Manejo de errores centralizado

### Frontend Completo ✅
- ✅ Proyecto React Native con Expo
- ✅ Configuración TypeScript
- ✅ Tipos completos para todo el proyecto
- ✅ Context API para autenticación
- ✅ Servicios para llamadas API
- ✅ Navegación con React Navigation
- ✅ Pantalla de Login diseñada
- ✅ Estructura de navegación por tabs (Consumer/Merchant)

### Documentación ✅
- ✅ README.md completo con guías paso a paso
- ✅ CONFIGURACION_MYSQL.md con guía detallada de MySQL
- ✅ Script de instalación automatizado (install.ps1)
- ✅ Variables de entorno de ejemplo

---

## ⚠️ Lo que DEBES hacer manualmente

### 1. Configurar MySQL (OBLIGATORIO)

**No puedo crear la base de datos automáticamente**, pero te he preparado todo:

```powershell
# 1. Inicia MySQL
mysql -u root -p

# 2. Ejecuta el script (dentro de MySQL o desde PowerShell)
source C:\Users\Efrain PC\Desktop\SecondBite\backend\database\init.sql

# O desde PowerShell:
mysql -u root -p < backend\database\init.sql
```

**Sigue la guía detallada en:** `CONFIGURACION_MYSQL.md`

### 2. Configurar Variables de Entorno

Edita `backend\.env` con tus credenciales:

```env
DB_USER=root
DB_PASSWORD=TU_PASSWORD_MYSQL
DB_NAME=secondbite_db
JWT_SECRET=una_clave_secreta_muy_segura_123456
```

### 3. Instalar Dependencias

**Opción A - Script Automático (Recomendado):**
```powershell
# Ejecuta el script de instalación
.\install.ps1
```

**Opción B - Manual:**
```powershell
# Backend
cd backend
npm install

# Frontend (en otra terminal)
cd frontend
npm install
```

### 4. Iniciar el Proyecto

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

Deberías ver:
```
╔═══════════════════════════════════════════════════════════╗
║              🍽️  SecondBite API Server  🍽️               ║
╚═══════════════════════════════════════════════════════════╝

🚀 Servidor ejecutándose en: http://localhost:3000
✅ Conexión exitosa a MySQL
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

Escanea el código QR con **Expo Go** en tu móvil.

---

## 📱 Probar la Aplicación

### Usuarios de Prueba (después de configurar passwords)

1. **Consumidor:**
   - Email: `consumer@example.com`
   - Password: (debes definirla en MySQL)

2. **Comerciante:**
   - Email: `merchant@example.com`
   - Password: (debes definirla en MySQL)

Para crear passwords hasheadas:
```javascript
// En Node.js (carpeta backend)
const bcrypt = require('bcryptjs');
bcrypt.hash('tupassword123', 10).then(hash => console.log(hash));
```

---

## 🔍 Verificar que Todo Funciona

### 1. Verificar Base de Datos
```sql
USE secondbite_db;
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM products;
```

### 2. Verificar Backend
```powershell
# En el navegador o Postman
http://localhost:3000/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

### 3. Verificar Productos
```powershell
# GET
http://localhost:3000/api/products
```

Deberías ver los productos de ejemplo.

---

## 📝 Pantallas que Faltan Crear

Aunque la estructura está lista, estas pantallas necesitan implementarse:

### Consumidor:
- [ ] `HomeScreen.tsx` - Pantalla principal con productos destacados
- [ ] `SearchScreen.tsx` - Búsqueda y filtros
- [ ] `OrdersScreen.tsx` - Historial de pedidos
- [ ] `ProductDetailScreen.tsx` - Detalle de producto
- [ ] `MerchantDetailScreen.tsx` - Detalle de comercio

### Comerciante:
- [ ] `DashboardScreen.tsx` - Panel de control
- [ ] `ProductsScreen.tsx` - Lista de productos
- [ ] `MerchantOrdersScreen.tsx` - Pedidos recibidos
- [ ] `CreateProductScreen.tsx` - Crear producto
- [ ] `EditProductScreen.tsx` - Editar producto

### Comunes:
- [ ] `ProfileScreen.tsx` - Perfil de usuario
- [ ] `RegisterScreen.tsx` - Registro de usuarios

**Plantilla básica para cada pantalla:**

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import CONFIG from '../utils/config';

export default function NombrePantallaScreen({ navigation }: any) {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nombre de la Pantalla</Text>
      {/* Tu contenido aquí */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: CONFIG.COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: CONFIG.COLORS.primary,
    marginBottom: 20,
  },
});
```

---

## 🎯 Funcionalidades Implementadas

### Backend API
- ✅ POST `/api/auth/register` - Registro
- ✅ POST `/api/auth/login` - Login
- ✅ GET `/api/auth/profile` - Perfil
- ✅ GET `/api/products` - Listar productos
- ✅ GET `/api/products/nearby` - Productos cercanos
- ✅ POST `/api/products` - Crear producto
- ✅ PUT `/api/products/:id` - Actualizar producto
- ✅ DELETE `/api/products/:id` - Eliminar producto
- ✅ GET `/api/merchants` - Listar comercios
- ✅ GET `/api/merchants/nearby` - Comercios cercanos
- ✅ POST `/api/orders` - Crear pedido
- ✅ GET `/api/orders/my-orders` - Mis pedidos
- ✅ PUT `/api/orders/:id/status` - Actualizar estado

### Frontend
- ✅ Context de autenticación
- ✅ Servicios API (authService, productService)
- ✅ Navegación configurada
- ✅ Pantalla de Login funcional
- ✅ Manejo de sesión con AsyncStorage

---

## 🔧 Servicios Disponibles

Ya puedes usar estos servicios en cualquier pantalla:

```typescript
import { authService } from '../services/authService';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';

// En tu componente:
const { user, signIn, signOut } = useAuth();

// Llamadas API:
const products = await productService.getAll();
const nearbyProducts = await productService.getNearby(lat, lng);
```

---

## 🐛 Solución de Problemas Comunes

### Error: No se puede conectar al backend desde el móvil

1. Encuentra tu IP local:
   ```powershell
   ipconfig
   ```
   Busca "Dirección IPv4"

2. Cambia en `frontend/src/utils/config.ts`:
   ```typescript
   export const API_URL = 'http://TU_IP:3000/api';
   // Ejemplo: 'http://192.168.1.10:3000/api'
   ```

### Error: Cannot find module 'axios'

```powershell
cd frontend
npm install
```

### Error: MySQL connection refused

```powershell
# Iniciar MySQL
net start MySQL80
```

---

## 📚 Recursos y Enlaces

- **Documentación MySQL**: https://dev.mysql.com/doc/
- **React Native Docs**: https://reactnative.dev/
- **Expo Docs**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/

---

## ✨ Próximas Mejoras Sugeridas

1. **Funcionalidad de Mapas**
   - Integrar React Native Maps
   - Mostrar comercios en mapa
   - Rutas y navegación

2. **Imágenes**
   - Subida de imágenes con Multer
   - Almacenamiento local o cloud

3. **Notificaciones**
   - Push notifications con Expo
   - Notificaciones de pedidos

4. **Pagos**
   - Integración con Stripe/PayPal
   - Métodos de pago locales

5. **Chat**
   - Mensajería entre usuarios
   - Soporte en tiempo real

6. **Análisis**
   - Dashboard de estadísticas
   - Gráficos de ventas

---

## 📞 Contacto y Soporte

Si encuentras problemas:

1. Revisa `README.md`
2. Lee `CONFIGURACION_MYSQL.md`
3. Verifica los logs del servidor
4. Usa Postman para probar la API
5. Revisa la consola de Expo

---

## ✅ Checklist Final

Antes de empezar a desarrollar, verifica:

- [ ] MySQL instalado y corriendo
- [ ] Base de datos `secondbite_db` creada
- [ ] Tablas y datos de ejemplo cargados
- [ ] Node.js y npm instalados
- [ ] Dependencias del backend instaladas
- [ ] Archivo `.env` configurado
- [ ] Backend corriendo en puerto 3000
- [ ] Dependencias del frontend instaladas
- [ ] Expo CLI instalado globalmente
- [ ] Expo Go instalado en tu móvil
- [ ] Frontend corriendo y accesible

---

**¡Todo está listo para que comiences a desarrollar! 🚀**

**El proyecto está estructurado profesionalmente siguiendo las mejores prácticas. Ahora solo necesitas:**

1. Configurar MySQL (5 minutos)
2. Instalar dependencias (5 minutos)
3. Iniciar los servidores (1 minuto)
4. ¡Empezar a crear las pantallas!

**¡Éxito con tu tesis! 🎓🍽️♻️**
