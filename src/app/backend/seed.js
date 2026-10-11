// Inserta 2 usuarios con datos fijos y contrasena encriptada.
// Uso:  node seed.js   (o: npm run seed)
require("dotenv").config();

const usuarioModelo = require("./modelo/usuario");
const loginServicio = require("./servicio/login");

const usuarios = [
  { nombre: "Edgar", correo: "administrador@cafeteria.com", contrasena: "admin123",   rol: "admin"   },
  { nombre: "Ruben", correo: "cliente@cafeteria.com",       contrasena: "cliente123", rol: "cliente" },
];

const promesa = (fn, ...args) =>
  new Promise((resolve, reject) => fn(...args, (err, res) => (err ? reject(err) : resolve(res))));

async function sembrar() {
  for (const u of usuarios) {
    const hash = await loginServicio.encriptarPassword(u.contrasena);

    // se borra primero por si ya existia, para poder correr el script varias veces
    await promesa(usuarioModelo.eliminarPorCorreo, u.correo);
    await promesa(usuarioModelo.crearUsuario, u.nombre, u.correo, hash, u.rol);
    console.log(`Usuario listo: ${u.correo} (${u.rol})`);
  }
  process.exit(0);
}

sembrar().catch((error) => {
  console.error(error);
  process.exit(1);
});