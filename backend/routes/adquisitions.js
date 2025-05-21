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
  console.log('Solicitud recibida en /api/adquisitions');
  const { data, error } = await supabase
        .from('adquisitions_view2')
        .select('*');// Selecciona todos los registros de la vista 'adquisitions'

  if (error) {
    console.error('Error al obtener los productos adquiridos:', error.message);
    return res.status(500).json({ error: 'Error al obtener los productos adquiridos' }); // Retorna un error 500
  } else {
    console.log('Productos adquiridos:', data);
    return res.status(200).json(data); // Retorna los registros obtenidos con un estado 200
  }
});

router.post('/new', async (req, res) => {
  const { product_ids, quantities } = req.body;

  try {
    const { data, error } = await supabase
      .rpc('insert_order_and_acquisition', {
        p_product_ids: product_ids,
        p_quantities: quantities,
      });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Orden y adquisición insertadas exitosamente', result: data });
  } catch (error) {
    console.error('Error al llamar a la función insert_order_and_acquisition:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para obtener un producto
router.get('/order_id/:order_id', async (req, res) => {
  console.log(); // Imprime un espacio en blanco
  console.log('Solicitud recibida en /api/adquisitions/order_id/:order_id');
  const { order_id } = req.params; // Obtiene el valor del parámetro 'upc' de la URL
  console.log('Buscando producto con UPC:', order_id);

  const { data, error } = await supabase
    .from('adquisitions_view2')
    .select() // Selecciona todas las columnas
    .eq('order_id', order_id) // Filtra los registros donde la columna 'order_id' sea igual al valor recibido
    //.single(); // Espera un solo resultado (ya que el order_id debería ser único)

  if (error) {
    console.error('Error al obtener los productos adquiridos:', error.message);
    return res.status(500).json({ error: 'Error al obtener los productos adquiridos' }); // Retorna un error 500
  } else if (data) {
    console.log('Productos adquiridos:', data);
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
    const { data, error } = await supabase.rpc('update_acquisitions', {
      p_ids: ids,
      p_quantities: quantities,
      p_product_ids: product_ids
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'Adquisiciones actualizadas exitosamente', result: data });
  } catch (error) {
    console.error('Error al llamar a la función update_acquisitions:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para eliminar una adquisición y orden por ID
router.delete('/delete/:p_acquisition_id', async (req, res) => {
    const { p_acquisition_id } = req.params; // Obtener el ID de los parámetros de la ruta

    if (!p_acquisition_id) {
        return res.status(400).json({ error: 'El campo "p_acquisition_id" es requerido.' });
    }

    try {
        // Llamar a la función delete_acquisition_and_order_dynamic_order_id
        const { error } = await supabase
            .rpc('delete_acquisition_and_order_dynamic_order_id', { p_acquisition_id });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: 'Adquisición y orden eliminados con éxito' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar la adquisición y orden' });
    }
});


// Ruta para obtener un producto por descripción
router.get('/search', async (req, res) => {
    const { description } = req.query; // Obtiene el término de búsqueda de los parámetros de la consulta

    if (!description) {
        return res.status(400).json({ error: 'El campo "description" es requerido.' });
    }

    const { data, error } = await supabase
        .from('products')
        .select('id, brand')
        .ilike('description', `%${description}%`); // Utiliza ilike para buscar insensiblemente

    if (error) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    console.log('Productos encontrados con la descripción:', data);
    res.status(200).json(data);
});

router.post('/status', async (req, res) => {
  const { order_id, new_status } = req.body;

  console.log('Cuerpo completo de la solicitud (req.body):', req.body);

  try {
    const { data, error } = await supabase.rpc('update_order_status', {
        p_order_id: order_id, // Coincide con p_order_id en SQL
        p_new_status: new_status // Coincide con p_new_status en SQL
    }); 
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'Estado del pedido actualizado exitosamente', result: data });
  } catch (error) {
    console.error('Error al llamar a la función update_order_status:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Exporta el router usando CommonJS
module.exports = router;
//export default router;
