const mysql = require('mysql2');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
});

conexion.connect((error) => {
  if (error) { 
    console.error('Error al conectar:', error); 
    return; 
  }
  console.log('Conexión exitosa');
  
   // Crear tabla pedidos si no existe
   const sqlPath = path.join(__dirname, '../../sql/crear_tabla_pedidos_v2.sql');
   if (fs.existsSync(sqlPath)) {
     const sql = fs.readFileSync(sqlPath, 'utf8');
     conexion.query(sql, (err) => {
       if (err) {
         console.error('Error creando tabla pedidos:', err.message);
       } else {
         console.log('Tabla pedidos verificada/creada con nueva estructura');
       }
     });
   }
});

module.exports = conexion;