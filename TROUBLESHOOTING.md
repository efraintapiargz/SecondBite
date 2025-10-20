# Solución de Problemas Comunes - SecondBite

## ❌ Error: "Could not find MIME for Buffer"

### Descripción del Error
```
Error: Could not find MIME for Buffer <null>
at Jimp.parseBitmap
```

### ✅ Solución Aplicada

El error ocurría porque Expo intentaba procesar el archivo `favicon.png` que estaba corrupto o no existía.

**Cambios realizados:**

1. **Eliminado favicon de app.json**
   ```json
   "web": {
     "bundler": "metro",
     "lang": "es"
     // ✅ Ya no tiene "favicon": "./assets/favicon.png"
   }
   ```

2. **Actualizado web/index.html**
   - Mejorado el título y descripción
   - Sin referencias a favicon

### 🔄 Reiniciar la Aplicación

Si el error persiste después de los cambios:

```powershell
# 1. Detener Expo (Ctrl+C en la terminal)
# 2. Limpiar cache
cd frontend
expo start -c

# 3. Presionar 'w' para abrir en web
```

---

## ❌ Error: Warnings de Paquetes Desactualizados

### Descripción
```
The following packages should be updated for best compatibility:
@types/react@18.2.79 - expected version: ~19.1.10
```

### ⚠️ Nota
Este es solo un **warning**, no un error. La aplicación funciona correctamente.

### ✅ Solución (Opcional)

Si deseas actualizar los paquetes:

```powershell
cd frontend
npm update @types/react
```

**Recomendación:** Mantener las versiones actuales por ahora para evitar cambios inesperados.

---

## ❌ Error: Metro Bundler No Inicia

### Síntomas
- El comando `npm start` falla
- Error: "Cannot find module..."

### ✅ Solución

```powershell
cd frontend

# 1. Eliminar node_modules y cache
rm -r node_modules
rm -r .expo

# 2. Reinstalar dependencias
npm install

# 3. Iniciar con cache limpio
expo start -c
```

---

## ❌ Error: Backend No Conecta a MySQL

### Síntomas
```
❌ Error al conectar con MySQL
```

### ✅ Solución

1. **Verificar que MySQL está corriendo**
   - Abrir MySQL Workbench
   - O usar: `mysql -u root -p` en terminal

2. **Revisar credenciales en .env**
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=secondbite_db
   ```

3. **Verificar que la base de datos existe**
   ```sql
   SHOW DATABASES;
   USE secondbite_db;
   SHOW TABLES;
   ```

---

## ❌ Acentos No Se Ven Correctamente

### Síntomas
- "Descripción" se ve como "DescripciÃ³n"
- "Categoría" se ve como "CategorÃ­a"

### ✅ Solución

```powershell
# Ejecutar conversión UTF-8
cd backend
node convert-utf8.js

# Reiniciar backend
npm run dev
```

---

## ❌ Puerto 3000 Ya en Uso

### Síntomas
```
Error: listen EADDRINUSE: address already in use :::3000
```

### ✅ Solución

**Opción 1: Encontrar y cerrar el proceso**
```powershell
# Ver qué está usando el puerto 3000
netstat -ano | findstr :3000

# Matar el proceso (reemplaza PID con el número que aparece)
taskkill /PID <PID> /F
```

**Opción 2: Usar otro puerto**
```powershell
# Editar backend/.env
PORT=3001
```

---

## ❌ Puerto 8081 Ya en Uso (Metro Bundler)

### Síntomas
- Expo no puede iniciar en el puerto 8081

### ✅ Solución

```powershell
# Encontrar proceso
netstat -ano | findstr :8081

# Matar proceso
taskkill /PID <PID> /F

# O simplemente reiniciar Expo
cd frontend
expo start -c
```

---

## 🔧 Comandos Útiles de Diagnóstico

### Ver Todos los Procesos Node
```powershell
tasklist | findstr node
```

### Limpiar Todo y Empezar de Nuevo

**Backend:**
```powershell
cd backend
rm -r node_modules
npm install
npm run dev
```

**Frontend:**
```powershell
cd frontend
rm -r node_modules
rm -r .expo
npm install
expo start -c
```

### Verificar Versiones
```powershell
node --version    # Debe ser >= 16
npm --version     # Debe ser >= 8
mysql --version   # Debe estar instalado
```

---

## 📞 Checklist de Solución de Problemas

Cuando algo no funciona, sigue este orden:

1. [ ] ¿El backend está corriendo? → `cd backend && npm run dev`
2. [ ] ¿MySQL está corriendo? → Abrir MySQL Workbench
3. [ ] ¿La BD está en UTF-8? → `node convert-utf8.js`
4. [ ] ¿El frontend está corriendo? → `cd frontend && expo start`
5. [ ] ¿Cache limpio? → `expo start -c`
6. [ ] ¿Puertos libres? → `netstat -ano | findstr :3000`
7. [ ] ¿Dependencias instaladas? → `npm install`

---

## 🆘 Si Nada Funciona

1. **Reiniciar la computadora** 🔄
2. **Verificar que tienes espacio en disco**
3. **Revisar el firewall** (puede bloquear puertos)
4. **Ejecutar como administrador** (solo si es necesario)

---

## 📚 Recursos Adicionales

- **Documentación Expo:** https://docs.expo.dev
- **Documentación MySQL:** https://dev.mysql.com/doc/
- **Stack Overflow:** Buscar errores específicos

---

**Última actualización:** 20 de Octubre, 2025
