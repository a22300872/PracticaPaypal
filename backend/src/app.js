const express = require('express');
require('dotenv').config();

const cors = require('cors');
const productosRouter = require('./routes/productos.routes');
const paypalRouter = require('./routes/paypal.routes');
const pedidosRouter = require('./routes/pedidos.routes');
const app = express();

app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());
app.use('/api', productosRouter);
app.use('/api', paypalRouter);
app.use('/api', pedidosRouter);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;