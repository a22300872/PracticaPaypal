-- Crear tabla pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL UNIQUE,
  fecha DATETIME NOT NULL,
  monto_total DECIMAL(10,2) NOT NULL,
  items_json JSON NOT NULL,
  nombre_comprador VARCHAR(255),
  email_comprador VARCHAR(255),
  direccion_json JSON,
  status VARCHAR(50) DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
