const usuarioModelo = require("../modelo/usuario");
const loginServicio = require("../servicio/login");

// POST /api/registro
// (la practica no lo exige, pero queda disponible; el rol siempre es "cliente")
async function registro(req, res) {
  const { nombre, correo, contrasena } = req.body || {};

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ error: "Nombre, correo y contrasena son obligatorios" });
  }

  const passwordHash = await loginServicio.encriptarPassword(contrasena);

  usuarioModelo.crearUsuario(nombre, correo, passwordHash, "cliente", (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Ese correo ya esta registrado" });
      }
      return res.status(500).json({ error: "Error al registrar el usuario" });
    }
    res.status(201).json({ message: "Usuario registrado correctamente" });
  });
}

// POST /api/login
function login(req, res) {
  const { correo, contrasena } = req.body || {};

  if (!correo || !contrasena) {
    return res.status(400).json({ error: "Correo y contrasena son obligatorios" });
  }

  usuarioModelo.buscarPorCorreo(correo, async (error, resultados) => {
    if (error) {
      return res.status(500).json({ error: "Error del servidor" });
    }
    if (resultados.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const usuario = resultados[0];

    // comparar la contrasena escrita contra el hash guardado
    const passwordValido = await loginServicio.compararPassword(contrasena, usuario.contrasena);
    if (!passwordValido) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // crear el token de sesion
    const token = loginServicio.generarToken(usuario);
    res.json({
      token: token,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    });
  });
}

module.exports = { registro, login };