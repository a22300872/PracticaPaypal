-- Crear tabla pedidos mejorada
CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL UNIQUE,
  fecha DATETIME NOT NULL,
  monto_total DECIMAL(10,2) NOT NULL,
  items_texto LONGTEXT NOT NULL,
  nombre_comprador VARCHAR(255) NOT NULL,
  email_comprador VARCHAR(255),
  direccion_calle VARCHAR(500),
  direccion_ciudad VARCHAR(100),
  direccion_estado VARCHAR(100),
  direccion_codigo_postal VARCHAR(20),
  direccion_pais VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
