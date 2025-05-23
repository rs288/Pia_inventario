// routes/products.js
//import express from 'express';
const express = require('express');
//import supabase from '../settings/db.js';
const supabase = require('../settings/db.js');
//const productsRouter = require('../routes/products.js');


const router = express.Router();

// Endpoint para obtener productos
router.get('/', async (req, res) => {
  console.log(); // Imprime un espacio en blanco
  console.log('Solicitud recibida en /api/inventory');
  const { data, error } = await supabase
        .from('inventory_view')
        .select('*');// Selecciona todos los registros de la vista 'adquisitions'

  if (error) {
    console.error('Error al obtener el inventario:', error.message);
    return res.status(500).json({ error: 'Error al obtener el inventario' }); // Retorna un error 500
  } else {
    console.log('Productos adquiridos:', data);
    return res.status(200).json(data); // Retorna los registros obtenidos con un estado 200
  }
});


// Exporta el router usando CommonJS
module.exports = router;
//export default router;
