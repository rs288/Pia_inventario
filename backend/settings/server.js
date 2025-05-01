// settings/server.js
const express = require('express');
const cors = require('cors');
//import productsRouter from '../routes/products.js'; // Importa el router de productos
const productsRouter = require('../routes/products.js');
const adquisitionsRouter = require('../routes/adquisitions.js');
const outputsRouter = require('../routes/outputs.js');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080;

// Habilita CORS
app.use(cors({
    origin: '*' // Cambia esto por el origen de tu frontend
}));


// Middleware para manejar JSON
app.use(bodyParser.json());
//app.use(express.json());

// Manejar solicitudes OPTIONS
app.options('*', cors()); // Agrega esto para manejar solicitudes OPTIONS

// Usar el router de productos
app.use('/api/products', productsRouter);
app.use('/api/adquisitions', adquisitionsRouter);
app.use('/api/outputs', outputsRouter);

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
