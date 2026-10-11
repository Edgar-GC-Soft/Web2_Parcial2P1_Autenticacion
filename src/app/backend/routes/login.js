const express = require("express");
const { registro, login } = require("../controlador/registro");

const router = express.Router();

router.post("/registro", registro);
router.post("/login", login);

module.exports = router;