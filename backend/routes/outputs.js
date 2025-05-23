// routes/outputs.js
//import express from 'express';
const express = require('express');
//import supabase from '../settings/db.js';
const supabase = require('../settings/db.js');
//const productsRouter = require('../routes/products.js');


const router = express.Router();

// Endpoint para obtener productos vendidos
router.get('/', async (req, res) => {
  console.log(); // Imprime un espacio en blanco
  console.log('Solicitud recibida en /api/outputs');
  const { data, error } = await supabase
        .from('outputs_view')
        .select('*');// Selecciona todos los registros de la vista 'adquisitions'

  if (error) {
    console.error('Error al obtener los productos vendidos:', error.message);
    return res.status(500).json({ error: 'Error al obtener los productos vendidos' }); // Retorna un error 500
  } else {
    console.log('Productos vendidos:', data);
    return res.status(200).json(data); // Retorna los registros obtenidos con un estado 200
  }
});

router.post('/new', async (req, res) => {
  const { product_ids, quantities } = req.body;

  try {
    const { data, error } = await supabase
      .rpc('insert_order_and_outputs', {
        p_product_ids: product_ids,
        p_quantities: quantities,
      });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Orden y output insertadas exitosamente', result: data });
  } catch (error) {
    console.error('Error al llamar a la función insert_order_and_output:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para obtener un producto
router.get('/order_id/:order_id', async (req, res) => {
  console.log(); // Imprime un espacio en blanco
  console.log('Solicitud recibida en /api/outputs/order_id/:order_id');
  const { order_id } = req.params; // Obtiene el valor del parámetro 'upc' de la URL
  console.log('Buscando producto con order_id:', order_id);

  const { data, error } = await supabase
    .from('outputs_view')
    .select() // Selecciona todas las columnas
    .eq('order_id', order_id) // Filtra los registros donde la columna 'order_id' sea igual al valor recibido
  if (error) {
    console.error('Error al obtener los productos vendidos:', error.message);
    return res.status(500).json({ error: 'Error al obtener los productos vendidos' }); // Retorna un error 500
  } else if (data) {
    console.log('Productos vendidos:', data);
    return res.status(200).json(data); // Retorna el producto encontrado con un estado 200
  } else {
    console.log('No se encontró ningún producto con el order_id:', order_id);
    return res.status(404).json({ message: 'Producto no encontrado' }); // Retorna un error 404 si no se encuentra el producto
  }
});

router.post('/update', async (req, res) => {
  const { ids, quantities, product_ids } = req.body;
  
  console.log('Cuerpo completo de la solicitud (req.body):', req.body);

  try {
    const { data, error } = await supabase.rpc('update_outputs', {
      p_ids: ids,
      p_quantities: quantities,
      p_product_ids: product_ids
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'Outputs actualizadas exitosamente', result: data });
  } catch (error) {
    console.error('Error al llamar a la función update_outputs:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para eliminar una adquisición y orden por ID
router.delete('/delete/:p_output_id', async (req, res) => {
    const { p_output_id } = req.params; // Obtener el ID de los parámetros de la ruta

    if (!p_output_id) {
        return res.status(400).json({ error: 'El campo "p_output_id" es requerido.' });
    }

    try {
        // Llamar a la función delete_output_and_order_dynamic_order_id
        const { error } = await supabase
            .rpc('delete_output_and_order_dynamic_order_id', { p_output_id });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: 'Output y orden eliminados con éxito' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar la venta y orden' });
    }
});

// Exporta el router usando CommonJS
module.exports = router;
//export default router;
