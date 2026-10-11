require("dotenv").config();

const express = require("express");
const cors = require("cors");

const rutas = require("./routes/login");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", rutas);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
});