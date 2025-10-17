-- Script de inicialización de la base de datos SecondBite
-- Ejecutar este script para crear la estructura completa

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS secondbite_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE secondbite_db;

-- Tabla de usuarios (consumidores y comerciantes)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    user_type ENUM('consumer', 'merchant') NOT NULL DEFAULT 'consumer',
    profile_image VARCHAR(500),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de información de comercios
CREATE TABLE IF NOT EXISTS merchants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_type ENUM('restaurant', 'supermarket', 'bakery', 'cafe', 'grocery', 'other') NOT NULL,
    description TEXT,
    business_hours JSON,
    logo_image VARCHAR(500),
    banner_image VARCHAR(500),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_products_sold INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_business_type (business_type),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    merchant_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('fruits', 'vegetables', 'bakery', 'dairy', 'meat', 'prepared_food', 'beverages', 'other') NOT NULL,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2) NOT NULL,
    discount_percentage INT,
    quantity_available INT NOT NULL DEFAULT 1,
    expiry_date DATE NOT NULL,
    image_url VARCHAR(500),
    status ENUM('available', 'reserved', 'sold', 'expired') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
    INDEX idx_merchant_id (merchant_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_expiry_date (expiry_date),
    INDEX idx_discounted_price (discounted_price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de pedidos/reservas
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    consumer_id INT NOT NULL,
    merchant_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('cash', 'card', 'transfer') DEFAULT 'cash',
    pickup_time DATETIME,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (consumer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
    INDEX idx_consumer_id (consumer_id),
    INDEX idx_merchant_id (merchant_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de items del pedido
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de reseñas y calificaciones
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    consumer_id INT NOT NULL,
    merchant_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (consumer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
    INDEX idx_merchant_id (merchant_id),
    INDEX idx_consumer_id (consumer_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de favoritos
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    merchant_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, merchant_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('order', 'product', 'promotion', 'system') DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo (opcional para pruebas)

-- Usuario consumidor de ejemplo
INSERT INTO users (email, password, full_name, phone, user_type, address, latitude, longitude) 
VALUES 
('consumer@example.com', '$2a$10$YourHashedPasswordHere', 'Juan Pérez', '3121234567', 'consumer', 'Av. Universidad 123, Colima', 19.2433, -103.7248),
('maria@example.com', '$2a$10$YourHashedPasswordHere', 'María García', '3127654321', 'consumer', 'Calle Reforma 456, Colima', 19.2456, -103.7289);

-- Usuario comerciante de ejemplo
INSERT INTO users (email, password, full_name, phone, user_type, address, latitude, longitude) 
VALUES 
('merchant@example.com', '$2a$10$YourHashedPasswordHere', 'Restaurante El Sabor', '3129876543', 'merchant', 'Calle Madero 789, Colima', 19.2445, -103.7256),
('panaderia@example.com', '$2a$10$YourHashedPasswordHere', 'Panadería La Espiga', '3123456789', 'merchant', 'Av. Tecnológico 321, Colima', 19.2467, -103.7298);

-- Información de comercios
INSERT INTO merchants (user_id, business_name, business_type, description, business_hours, rating, total_reviews) 
VALUES 
(3, 'Restaurante El Sabor', 'restaurant', 'Comida tradicional mexicana con ingredientes frescos', '{"monday": "9:00-20:00", "tuesday": "9:00-20:00", "wednesday": "9:00-20:00", "thursday": "9:00-20:00", "friday": "9:00-21:00", "saturday": "10:00-21:00", "sunday": "10:00-18:00"}', 4.5, 25),
(4, 'Panadería La Espiga', 'bakery', 'Pan fresco y repostería artesanal', '{"monday": "7:00-19:00", "tuesday": "7:00-19:00", "wednesday": "7:00-19:00", "thursday": "7:00-19:00", "friday": "7:00-19:00", "saturday": "7:00-15:00", "sunday": "closed"}', 4.8, 42);

-- Productos de ejemplo
INSERT INTO products (merchant_id, name, description, category, original_price, discounted_price, discount_percentage, quantity_available, expiry_date, status) 
VALUES 
(1, 'Comida del día - Pozole', 'Delicioso pozole rojo con acompañamientos', 'prepared_food', 80.00, 50.00, 38, 5, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'available'),
(1, 'Ensalada César', 'Ensalada fresca con pollo y aderezo', 'prepared_food', 65.00, 40.00, 38, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'available'),
(2, 'Pan de muerto', 'Pan tradicional del día anterior', 'bakery', 25.00, 15.00, 40, 10, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'available'),
(2, 'Conchas surtidas', 'Variedad de conchas del día anterior', 'bakery', 8.00, 5.00, 38, 20, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'available');

-- Mostrar estadísticas de la base de datos
SELECT 'Base de datos inicializada correctamente' AS Status;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_merchants FROM merchants;
SELECT COUNT(*) AS total_products FROM products;
