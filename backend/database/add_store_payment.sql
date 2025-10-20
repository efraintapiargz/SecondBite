-- Agregar 'store' como opción de payment_method
USE secondbite_db;

ALTER TABLE orders 
MODIFY COLUMN payment_method ENUM('cash', 'card', 'transfer', 'store') DEFAULT 'store';

-- Verificar el cambio
DESCRIBE orders;
