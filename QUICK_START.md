# SecondBite - Guía de Inicio Rápido

## 🚀 Inicio Rápido

### 1️⃣ **Backend (API)**

```powershell
cd backend
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

### 2️⃣ **Frontend (App Expo)**

```powershell
cd frontend
npm start
```

Luego presiona:
- `w` para abrir en el navegador web
- `a` para Android (requiere emulador)
- `i` para iOS (solo en Mac)

---

## 🔧 Configuración UTF-8 (Primera vez)

### Opción 1: Desde MySQL Workbench
1. Abre MySQL Workbench
2. Conecta a tu servidor local
3. Abre el archivo `backend/database/convert_utf8.sql`
4. Ejecuta el script completo (⚡ icono de rayo)

### Opción 2: Desde línea de comandos

**Si MySQL está en el PATH:**
```powershell
# PowerShell (desde la raíz del proyecto)
Get-Content backend\database\convert_utf8.sql | & "mysql" -u root -p
```

**Si MySQL NO está en el PATH:**
```powershell
# Usar ruta completa (ajusta según tu instalación)
Get-Content backend\database\convert_utf8.sql | & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

### Opción 3: Script Automático (Windows)
```powershell
.\convert_utf8.bat
```

---

## 📋 Verificar que funciona

### Backend
1. Abre: `http://localhost:3000/health`
2. Deberías ver: `{"status":"healthy","timestamp":"..."}`

### Frontend
1. Presiona `w` en la terminal de Expo
2. Se abrirá en el navegador
3. Haz login con:
   - Email: `consumer@test.com` o `merchant@test.com`
   - Password: `password123`

### UTF-8
1. Crea un producto con descripción: "Panadería"
2. Verifica que se vea correctamente (no como "PanaderÃ­a")

---

## ⚠️ Solución de Problemas

### Error: "Cannot find module 'metro-react-native-babel-transformer'"
✅ **YA SOLUCIONADO** - El archivo `metro.config.js` ha sido corregido

### Error: "collation is not a valid option"
✅ **YA SOLUCIONADO** - La configuración de la base de datos ha sido actualizada

### Los acentos no se ven bien
1. Ejecuta el script de conversión UTF-8 (ver arriba)
2. Reinicia el backend: Ctrl+C y luego `npm run dev`
3. Limpia el cache de Expo: `expo start -c`

### El frontend no inicia
```powershell
cd frontend
rm -r node_modules
npm install
npm start
```

### El backend no conecta a MySQL
1. Verifica que MySQL esté corriendo
2. Revisa las credenciales en `backend/.env`
3. Asegúrate que la base de datos `secondbite_db` existe

---

## 📁 Estructura del Proyecto

```
SecondBite/
├── backend/              # API Node.js + Express
│   ├── src/
│   │   ├── server.js    # Punto de entrada
│   │   ├── config/      # Configuración DB
│   │   ├── routes/      # Rutas API
│   │   └── controllers/ # Lógica de negocio
│   └── database/
│       ├── init.sql     # Crear BD desde cero
│       └── convert_utf8.sql # Convertir a UTF-8
│
├── frontend/            # App React Native (Expo)
│   ├── App.tsx         # Punto de entrada
│   ├── src/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── screens/    # Pantallas de la app
│   │   ├── navigation/ # Configuración de navegación
│   │   └── utils/      # Utilidades (formatters, etc.)
│   └── metro.config.js # Configuración del bundler
│
└── convert_utf8.bat    # Script de conversión UTF-8
```

---

## 🔑 Usuarios de Prueba

### Consumidor
- **Email:** `consumer@test.com`
- **Password:** `password123`
- **Funciones:** Buscar productos, agregar al carrito, hacer pedidos

### Comerciante
- **Email:** `merchant@test.com`
- **Password:** `password123`
- **Funciones:** Gestionar productos, ver pedidos, dashboard

---

## 🌐 URLs Importantes

### Backend
- API Base: `http://localhost:3000`
- Health Check: `http://localhost:3000/health`
- Docs: `http://localhost:3000/api`

### Frontend (Web)
- App: `http://localhost:8081` (o el puerto que asigne Expo)
- Metro Bundler: Se abre automáticamente

---

## ✅ Checklist de Primera Vez

- [ ] Backend iniciado (`npm run dev` en carpeta backend)
- [ ] Frontend iniciado (`npm start` en carpeta frontend)
- [ ] Base de datos convertida a UTF-8 (ejecutar script)
- [ ] Login exitoso con usuarios de prueba
- [ ] Los acentos se ven correctamente

---

## 📞 Comandos Útiles

```powershell
# Limpiar cache de Expo
cd frontend
expo start -c

# Reinstalar dependencias backend
cd backend
rm -r node_modules
npm install

# Reinstalar dependencias frontend
cd frontend
rm -r node_modules
npm install

# Ver logs del backend en tiempo real
cd backend
npm run dev

# Abrir Metro Bundler web
cd frontend
npm start
# Luego presiona 'w'
```

---

**¡Listo para desarrollar!** 🎉
