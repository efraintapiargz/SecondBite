# 🗄️ Guía de Configuración de MySQL para SecondBite

## ⚠️ IMPORTANTE: Este proyecto NO usa Firebase

Este proyecto utiliza **MySQL como base de datos local** ya que NO se llevará a producción. Esta guía te mostrará cómo configurar MySQL paso a paso.

---

## 📋 Requisitos

- MySQL 8.0 o superior
- Acceso de administrador (root)

---

## 🚀 Instalación de MySQL (si no lo tienes)

### Windows

1. **Descargar MySQL**:
   - Ve a: https://dev.mysql.com/downloads/installer/
   - Descarga "MySQL Installer for Windows"
   - Elige la versión completa (mysql-installer-web-community)

2. **Instalar**:
   - Ejecuta el instalador
   - Selecciona "Developer Default"
   - Configura una contraseña para el usuario root (¡RECUÉRDALA!)
   - Completa la instalación

3. **Verificar instalación**:
   ```bash
   mysql --version
   ```

### macOS

```bash
# Usando Homebrew
brew install mysql

# Iniciar MySQL
brew services start mysql

# Configurar contraseña de root
mysql_secure_installation
```

### Linux (Ubuntu/Debian)

```bash
# Instalar MySQL
sudo apt update
sudo apt install mysql-server

# Iniciar servicio
sudo systemctl start mysql

# Configurar contraseña
sudo mysql_secure_installation
```

---

## 🔧 Configuración Paso a Paso

### Paso 1: Iniciar MySQL

**Windows (PowerShell como Administrador):**
```powershell
# Iniciar el servicio
net start MySQL80

# Si da error, prueba:
net start MySQL
```

**macOS/Linux:**
```bash
# macOS con Homebrew
brew services start mysql

# Linux
sudo systemctl start mysql
```

### Paso 2: Conectarse a MySQL

```bash
# Conectar como root
mysql -u root -p

# Ingresa tu contraseña cuando se solicite
```

### Paso 3: Crear la Base de Datos

Opción 1 - **Ejecutar el script completo** (RECOMENDADO):

```bash
# Desde la línea de comandos (fuera de MySQL)
mysql -u root -p < "C:\Users\Efrain PC\Desktop\SecondBite\backend\database\init.sql"
```

Opción 2 - **Manualmente en MySQL**:

```sql
-- En el prompt de MySQL:

-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS secondbite_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Usar la base de datos
USE secondbite_db;

-- 3. Copiar y pegar TODO el contenido del archivo init.sql
-- (Se encuentra en: backend/database/init.sql)
```

### Paso 4: Verificar la Creación

```sql
-- Mostrar bases de datos
SHOW DATABASES;

-- Seleccionar nuestra base de datos
USE secondbite_db;

-- Ver todas las tablas
SHOW TABLES;

-- Deberías ver:
-- +---------------------------+
-- | Tables_in_secondbite_db   |
-- +---------------------------+
-- | favorites                 |
-- | merchants                 |
-- | notifications             |
-- | order_items               |
-- | orders                    |
-- | products                  |
-- | reviews                   |
-- | users                     |
-- +---------------------------+

-- Ver usuarios de ejemplo
SELECT id, email, full_name, user_type FROM users;

-- Ver comercios de ejemplo
SELECT id, business_name, business_type, rating FROM merchants;

-- Ver productos de ejemplo
SELECT id, name, category, discounted_price, expiry_date FROM products;
```

### Paso 5: Crear Usuario para la Aplicación (Opcional pero Recomendado)

En lugar de usar root, es mejor crear un usuario específico:

```sql
-- Crear usuario
CREATE USER 'secondbite_user'@'localhost' IDENTIFIED BY 'tu_password_segura';

-- Dar permisos
GRANT ALL PRIVILEGES ON secondbite_db.* TO 'secondbite_user'@'localhost';

-- Aplicar cambios
FLUSH PRIVILEGES;

-- Salir
EXIT;
```

Luego actualiza tu archivo `.env`:

```env
DB_USER=secondbite_user
DB_PASSWORD=tu_password_segura
```

---

## 🔐 Configurar Contraseñas de Ejemplo

Los usuarios de ejemplo en el script tienen contraseñas hasheadas de ejemplo. Para crear contraseñas reales:

### Opción 1: Usar Node.js

```bash
# En la carpeta backend
cd backend

# Ejecutar Node
node

# En la consola de Node:
const bcrypt = require('bcryptjs');
const password = 'mipassword123';
bcrypt.hash(password, 10).then(hash => console.log(hash));

# Copia el hash generado
```

### Opción 2: Actualizar manualmente

```sql
USE secondbite_db;

-- Actualizar contraseña del consumidor
UPDATE users 
SET password = '$2a$10$HASH_GENERADO_AQUI' 
WHERE email = 'consumer@example.com';

-- Actualizar contraseña del comerciante
UPDATE users 
SET password = '$2a$10$HASH_GENERADO_AQUI' 
WHERE email = 'merchant@example.com';
```

---

## 📊 Estructura de Tablas

### 1. users (Usuarios)
Almacena consumidores y comerciantes.

```sql
DESC users;
```

Campos importantes:
- `id`: ID único
- `email`: Email (único)
- `password`: Contraseña hasheada
- `full_name`: Nombre completo
- `user_type`: 'consumer' o 'merchant'
- `latitude`, `longitude`: Ubicación

### 2. merchants (Comercios)
Información adicional de comerciantes.

```sql
DESC merchants;
```

Campos importantes:
- `user_id`: Relación con users
- `business_name`: Nombre del negocio
- `business_type`: Tipo de negocio
- `rating`: Calificación promedio

### 3. products (Productos)
Productos próximos a caducar.

```sql
DESC products;
```

Campos importantes:
- `merchant_id`: Relación con merchants
- `name`: Nombre del producto
- `original_price`: Precio original
- `discounted_price`: Precio con descuento
- `expiry_date`: Fecha de caducidad
- `status`: Estado del producto

### 4. orders (Pedidos)
Pedidos realizados.

```sql
DESC orders;
```

Campos importantes:
- `consumer_id`: ID del consumidor
- `merchant_id`: ID del comercio
- `total_amount`: Total a pagar
- `status`: Estado del pedido

### 5. order_items (Items de Pedido)
Productos dentro de cada pedido.

```sql
DESC order_items;
```

---

## 🧪 Consultas de Prueba Útiles

### Ver todos los productos disponibles

```sql
SELECT 
    p.name, 
    p.discounted_price, 
    p.discount_percentage,
    p.expiry_date,
    m.business_name,
    p.status
FROM products p
INNER JOIN merchants m ON p.merchant_id = m.id
WHERE p.status = 'available'
ORDER BY p.discount_percentage DESC;
```

### Ver pedidos de un usuario

```sql
SELECT 
    o.id,
    o.total_amount,
    o.status,
    o.created_at,
    m.business_name
FROM orders o
INNER JOIN merchants m ON o.merchant_id = m.id
WHERE o.consumer_id = 1
ORDER BY o.created_at DESC;
```

### Ver productos cercanos a una ubicación

```sql
SELECT 
    p.name,
    p.discounted_price,
    m.business_name,
    u.address,
    (6371 * acos(cos(radians(19.2433)) * cos(radians(u.latitude)) * 
    cos(radians(u.longitude) - radians(-103.7248)) + sin(radians(19.2433)) * 
    sin(radians(u.latitude)))) AS distance_km
FROM products p
INNER JOIN merchants m ON p.merchant_id = m.id
INNER JOIN users u ON m.user_id = u.id
WHERE p.status = 'available'
HAVING distance_km < 10
ORDER BY distance_km;
```

### Ver estadísticas de un comerciante

```sql
SELECT 
    m.business_name,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(o.total_amount) as total_sales,
    AVG(o.total_amount) as average_order,
    m.rating,
    m.total_reviews
FROM merchants m
LEFT JOIN orders o ON m.id = o.merchant_id AND o.status = 'completed'
WHERE m.id = 1
GROUP BY m.id;
```

---

## 🔄 Reiniciar la Base de Datos

Si necesitas empezar de cero:

```sql
-- ⚠️ CUIDADO: Esto eliminará TODOS los datos

DROP DATABASE IF EXISTS secondbite_db;

-- Luego ejecuta nuevamente el script init.sql
```

O desde la línea de comandos:

```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS secondbite_db;"
mysql -u root -p < backend/database/init.sql
```

---

## 🛠️ Herramientas Recomendadas

### 1. MySQL Workbench (Oficial)
- Descarga: https://dev.mysql.com/downloads/workbench/
- Interfaz gráfica oficial de MySQL
- Ideal para diseño y consultas

### 2. phpMyAdmin
- Interfaz web
- Viene con XAMPP/WAMP
- Fácil de usar

### 3. DBeaver (Multiplataforma)
- Descarga: https://dbeaver.io/
- Soporta múltiples bases de datos
- Gratuito y open source

### 4. DataGrip (JetBrains)
- IDE profesional para bases de datos
- De pago (con trial)

---

## 🐛 Solución de Problemas

### Error: Access denied for user 'root'@'localhost'

```bash
# Reiniciar MySQL sin contraseña
mysqld --skip-grant-tables

# En otra terminal, conectarse sin contraseña
mysql -u root

# Cambiar contraseña
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nueva_password';
FLUSH PRIVILEGES;
EXIT;

# Reiniciar MySQL normalmente
```

### Error: Can't connect to MySQL server

```bash
# Windows
net start MySQL80

# Verificar si el servicio está corriendo
sc query MySQL80
```

### Error: Table doesn't exist

```bash
# Verificar que estás en la base de datos correcta
USE secondbite_db;
SHOW TABLES;

# Si no hay tablas, ejecutar init.sql nuevamente
```

### Error: Unknown database 'secondbite_db'

```bash
# La base de datos no se creó, ejecutar:
mysql -u root -p < backend/database/init.sql
```

---

## 📝 Notas Importantes

1. **Seguridad**: Este proyecto es para desarrollo local. En producción:
   - Cambiar todas las contraseñas
   - Configurar SSL/TLS
   - Limitar permisos de usuarios
   - Usar variables de entorno seguras

2. **Backup**: Respalda tu base de datos regularmente:
   ```bash
   mysqldump -u root -p secondbite_db > backup.sql
   ```

3. **Restore**: Restaurar desde backup:
   ```bash
   mysql -u root -p secondbite_db < backup.sql
   ```

4. **Performance**: Para mejor rendimiento:
   - Los índices ya están creados en el script
   - Usa EXPLAIN para analizar consultas lentas
   - Considera agregar más índices según tu uso

---

## ✅ Checklist de Verificación

Antes de continuar con el backend, verifica:

- [ ] MySQL está instalado y funcionando
- [ ] Puedes conectarte como root
- [ ] La base de datos `secondbite_db` existe
- [ ] Las 8 tablas fueron creadas
- [ ] Los datos de ejemplo están cargados
- [ ] Puedes hacer SELECT en las tablas
- [ ] Tienes las credenciales anotadas
- [ ] El archivo .env está configurado

---

## 🎓 Recursos Adicionales

- [Documentación MySQL](https://dev.mysql.com/doc/)
- [Tutorial de MySQL](https://www.mysqltutorial.org/)
- [SQL para principiantes](https://www.w3schools.com/sql/)

---

**¡Listo! Ahora puedes continuar con la configuración del backend. 🚀**
