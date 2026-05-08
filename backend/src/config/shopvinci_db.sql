-- ============================================
-- ShopVinci — Base de Datos
-- ISW1 2026 — Universidad Da Vinci de Guatemala
-- ============================================

CREATE DATABASE IF NOT EXISTS shopvinci_db;
USE shopvinci_db;

-- Tabla de usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  rol ENUM('comprador', 'comerciante', 'admin') DEFAULT 'comprador',
  activo BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  descripcion VARCHAR(255)
);

-- Tabla de productos
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  imagen VARCHAR(255),
  calificacion DECIMAL(2,1) DEFAULT 0,
  comerciante_id INT NOT NULL,
  categoria_id INT,
  activo BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (comerciante_id) REFERENCES usuarios(id),
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Tabla de órdenes
CREATE TABLE ordenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  comprador_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  estado ENUM('pendiente','en_proceso','enviado','entregado') DEFAULT 'pendiente',
  direccion_envio VARCHAR(255),
  metodo_pago VARCHAR(50) DEFAULT 'simulado',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (comprador_id) REFERENCES usuarios(id)
);

-- Tabla de items por orden
CREATE TABLE items_orden (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orden_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (orden_id) REFERENCES ordenes(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de reseñas
CREATE TABLE resenas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  comprador_id INT NOT NULL,
  producto_id INT NOT NULL,
  calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
  comentario TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (comprador_id) REFERENCES usuarios(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- ============================================
-- Datos de prueba
-- ============================================

-- Categorías
INSERT INTO categorias (nombre, descripcion) VALUES
('Electrónica', 'Dispositivos y accesorios electrónicos'),
('Ropa', 'Moda y vestimenta'),
('Hogar', 'Artículos para el hogar'),
('Deportes', 'Equipamiento deportivo'),
('Libros', 'Libros y material educativo');

-- Usuario admin (contraseña: Admin123!)
INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES
('Administrador ShopVinci', 'admin@shopvinci.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Usuario comerciante de prueba (contraseña: Test123!)
INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES
('Tienda Demo GT', 'comerciante@shopvinci.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'comerciante');

-- Usuario comprador de prueba (contraseña: Test123!)
INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES
('Comprador Demo', 'comprador@shopvinci.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'comprador');

-- Productos de prueba
INSERT INTO productos (nombre, descripcion, precio, stock, comerciante_id, categoria_id) VALUES
('Audífonos Bluetooth Pro', 'Audífonos inalámbricos con cancelación de ruido', 299.99, 50, 2, 1),
('Camiseta Casual Guatemala', 'Camiseta 100% algodón, varios colores', 89.99, 100, 2, 2),
('Cafetera Eléctrica 12 tazas', 'Cafetera programable con jarra térmica', 449.99, 25, 2, 3),
('Balón de Fútbol Profesional', 'Balón oficial FIFA talla 5', 199.99, 40, 2, 4),
('Introducción a React.js', 'Libro de programación frontend moderno', 149.99, 30, 2, 5),
('Mouse Inalámbrico Ergonómico', 'Mouse con 6 botones y receptor USB', 189.99, 60, 2, 1),
('Mochila Urbana 25L', 'Mochila resistente al agua con puerto USB', 349.99, 35, 2, 2),
('Lámpara LED de Escritorio', 'Lámpara regulable con puerto de carga', 259.99, 45, 2, 3);
