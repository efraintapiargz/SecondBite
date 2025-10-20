-- Script para convertir todas las tablas a UTF-8mb4
-- Ejecutar este script si ya tienes la base de datos creada

USE secondbite_db;

-- Convertir la base de datos
ALTER DATABASE secondbite_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Convertir tabla users
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Convertir tabla merchants
ALTER TABLE merchants CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Convertir tabla products
ALTER TABLE products CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Convertir tabla orders
ALTER TABLE orders CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Convertir tabla order_items
ALTER TABLE order_items CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verificar la conversión
SELECT 
    TABLE_NAME,
    TABLE_COLLATION
FROM 
    information_schema.TABLES
WHERE 
    TABLE_SCHEMA = 'secondbite_db';

-- Verificar columnas específicas
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CHARACTER_SET_NAME,
    COLLATION_NAME
FROM 
    information_schema.COLUMNS
WHERE 
    TABLE_SCHEMA = 'secondbite_db'
    AND CHARACTER_SET_NAME IS NOT NULL;
