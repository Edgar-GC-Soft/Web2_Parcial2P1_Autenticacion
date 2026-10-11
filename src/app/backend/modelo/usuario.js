const conexion = require("../config/database");

function crearUsuario(nombre, correo, contrasenaHash, rol, callback) {
  const sql = "INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)";
  conexion.query(sql, [nombre, correo, contrasenaHash, rol], callback);
}

function buscarPorCorreo(correo, callback) {
  const sql = "SELECT * FROM usuarios WHERE correo = ?";
  conexion.query(sql, [correo], callback);
}

function eliminarPorCorreo(correo, callback) {
  const sql = "DELETE FROM usuarios WHERE correo = ?";
  conexion.query(sql, [correo], callback);
}

module.exports = { crearUsuario, buscarPorCorreo, eliminarPorCorreo };