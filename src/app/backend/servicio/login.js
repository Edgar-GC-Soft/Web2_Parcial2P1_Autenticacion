const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function encriptarPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function compararPassword(contrasena, hash) {
  return await bcrypt.compare(contrasena, hash);
}

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = { encriptarPassword, compararPassword, generarToken };