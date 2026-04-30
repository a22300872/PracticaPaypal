const db = require('../src/config/db');

const crearPedido = (pedidoData) => {
  return new Promise((resolve, reject) => {
    const { order_id, fecha, monto_total, items, nombre_comprador, email_comprador, direccion, status } = pedidoData;
    
    // Formatear items como texto bonito
    const itemsTexto = items.map((item, index) => 
      `${index + 1}. ${item.nombre} - Cantidad: ${item.cantidad} - Precio unitario: $${item.precio.toFixed(2)}`
    ).join('\n');
    
    // Extraer campos de dirección
    const direccionCalle = direccion?.address_line_1 || direccion?.street_address || null;
    const direccionCiudad = direccion?.admin_area_2 || direccion?.city || null;
    const direccionEstado = direccion?.admin_area_1 || direccion?.state || null;
    const direccionCP = direccion?.postal_code || null;
    const direccionPais = direccion?.country_code || null;
    
    const sql = `
      INSERT INTO pedidos (
        order_id, fecha, monto_total, items_texto, 
        nombre_comprador, email_comprador,
        direccion_calle, direccion_ciudad, direccion_estado, direccion_codigo_postal, direccion_pais,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        fecha = VALUES(fecha),
        monto_total = VALUES(monto_total),
        items_texto = VALUES(items_texto),
        nombre_comprador = VALUES(nombre_comprador),
        email_comprador = VALUES(email_comprador),
        direccion_calle = VALUES(direccion_calle),
        direccion_ciudad = VALUES(direccion_ciudad),
        direccion_estado = VALUES(direccion_estado),
        direccion_codigo_postal = VALUES(direccion_codigo_postal),
        direccion_pais = VALUES(direccion_pais),
        status = VALUES(status)
    `;
    
    db.query(sql, [
      order_id, 
      fecha, 
      monto_total, 
      itemsTexto,
      nombre_comprador, 
      email_comprador,
      direccionCalle,
      direccionCiudad,
      direccionEstado,
      direccionCP,
      direccionPais,
      status
    ], (error, results) => {
      if (error) {
        console.error('Error SQL:', error.message);
        return reject(error);
      }
      resolve(results);
    });
  });
};

const actualizarPedido = (orderId, updateData) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];
    
    if (updateData.status !== undefined) {
      fields.push('status = ?');
      values.push(updateData.status);
    }
    if (updateData.nombre_comprador !== undefined) {
      fields.push('nombre_comprador = ?');
      values.push(updateData.nombre_comprador);
    }
    if (updateData.email_comprador !== undefined) {
      fields.push('email_comprador = ?');
      values.push(updateData.email_comprador);
    }
    if (updateData.direccion !== undefined) {
      const dir = updateData.direccion;
      fields.push('direccion_calle = ?, direccion_ciudad = ?, direccion_estado = ?, direccion_codigo_postal = ?, direccion_pais = ?');
      values.push(
        dir.address_line_1 || dir.street_address || null,
        dir.admin_area_2 || dir.city || null,
        dir.admin_area_1 || dir.state || null,
        dir.postal_code || null,
        dir.country_code || null
      );
    }
    
    values.push(orderId);
    
    const sql = `UPDATE pedidos SET ${fields.join(', ')} WHERE order_id = ?`;
    db.query(sql, values, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

const obtenerPedidoPorOrderId = (orderId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM pedidos WHERE order_id = ?';
    db.query(sql, [orderId], (error, results) => {
      if (error) return reject(error);
      resolve(results[0]);
    });
  });
};

const listarPedidos = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM pedidos ORDER BY fecha DESC';
    db.query(sql, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

// Generar XML de recibo
const generarXMLPedido = (pedido) => {
  const fecha = new Date(pedido.fecha).toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Formatear items
  const itemsArray = pedido.items_texto.split('\n').filter(line => line.trim() !== '');
  const itemsXml = itemsArray.map(item => `    <item>${item}</item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<recibo>
  <informacion>
    <id>${pedido.id}</id>
    <order_id>${pedido.order_id}</order_id>
    <fecha>${fecha}</fecha>
    <monto_total>$${Number(pedido.monto_total).toFixed(2)}</monto_total>
    <status>${pedido.status}</status>
  </informacion>
  <comprador>
    <nombre>${pedido.nombre_comprador}</nombre>
    <email>${pedido.email_comprador || 'N/A'}</email>
    <direccion>
      <calle>${pedido.direccion_calle || 'N/A'}</calle>
      <ciudad>${pedido.direccion_ciudad || 'N/A'}</ciudad>
      <estado>${pedido.direccion_estado || 'N/A'}</estado>
      <codigo_postal>${pedido.direccion_codigo_postal || 'N/A'}</codigo_postal>
      <pais>${pedido.direccion_pais || 'N/A'}</pais>
    </direccion>
  </comprador>
  <items>
${itemsXml}
  </items>
</recibo>`;
};

module.exports = {
  crearPedido,
  actualizarPedido,
  obtenerPedidoPorOrderId,
  listarPedidos,
  generarXMLPedido
};
