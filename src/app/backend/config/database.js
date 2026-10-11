const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

conexion.connect((err) => {
  if (err) {
    console.error("Error de conexion: ", err);
    return;
  }
  console.log("Conectado a MySQL");
});

module.exports = conexion;