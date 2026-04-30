const { createPaypalOrder, capturePaypalOrder } = require('../services/paypal.service.js');
const { crearPedido, actualizarPedido, obtenerPedidoPorOrderId, generarXMLPedido } = require('../models/pedido.model.js');

async function createOrder(req, res) {
  try {
    const { items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    if (!total || Number(total) <= 0) {
      return res.status(400).json({ error: 'El total es inválido' });
    }

    const order = await createPaypalOrder({ items, total });

    // Guardar pedido en base de datos (estado pendiente)
    const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await crearPedido({
      order_id: order.id,
      fecha,
      monto_total: Number(total),
      items: items,
      nombre_comprador: 'Por confirmar',
      status: 'pendiente'
    });

    console.log(`Pedido ${order.id} guardado en BD`);

    res.status(200).json(order);
  } catch (error) {
    console.error('Error en createOrder:', error.message);
    res.status(500).json({
      error: 'No se pudo crear la orden',
      detalle: error.message
    });
  }
}

async function captureOrder(req, res) {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId es obligatorio' });
    }

    const captureData = await capturePaypalOrder(orderId);

    // Extraer datos del comprador de la respuesta de PayPal
    const payer = captureData.payer || {};
    const purchaseUnits = captureData.purchase_units || [];
    const shipping = purchaseUnits[0]?.shipping || {};

    // Actualizar pedido en base de datos
    await actualizarPedido(orderId, {
      status: 'completado',
      nombre_comprador: payer.name?.given_name || payer.name?.full_name || null,
      email_comprador: payer.email_address || null,
      direccion: shipping.address || null
    });

    // Obtener pedido completo para generar XML
    const pedido = await obtenerPedidoPorOrderId(orderId);
    const xmlRecibo = generarXMLPedido(pedido);

    console.log(`Pedido ${orderId} actualizado en BD (completado)`);

    res.status(200).json({
      ...captureData,
      xml: xmlRecibo
    });
  } catch (error) {
    console.error('Error en captureOrder:', error.message);
    res.status(500).json({
      error: 'No se pudo capturar la orden',
      detalle: error.message
    });
  }
}

module.exports = { createOrder, captureOrder };