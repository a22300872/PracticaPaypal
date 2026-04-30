const db = require('../config/db');
const getProductos = (req, res) => {
  const sql = 'SELECT * FROM productos';
  db.query(sql, (error, resultados) => {
    if (error) return res.status(500).json({ error: 'Error al obtener productos' });
    
    console.log('=== PRODUCTOS CARGADOS DESDE LA BASE DE DATOS ===');
    console.log('Total de productos:', resultados.length);
    console.log('Productos:');
    resultados.forEach((producto, index) => {
      console.log(`${index + 1}. ${producto.nombre} - ${producto.precio} (${producto.categoria})`);
    });
    console.log('=================================================');
    
    res.json(resultados);
  });
};
module.exports = { getProductos };