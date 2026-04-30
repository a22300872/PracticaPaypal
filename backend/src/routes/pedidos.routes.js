const { Router } = require('express');
const { listarPedidos, obtenerPedidoPorOrderId } = require('../../models/pedido.model.js');

const router = Router();

router.get('/pedidos', listarPedidos);
router.get('/pedidos/:orderId', obtenerPedidoPorOrderId);

module.exports = router;
