// routes/products.js
//import express from 'express';
const express = require('express');
//import supabase from '../settings/db.js';
const supabase = require('../settings/db.js');
const productsRouter = require('../routes/products.js');


const router = express.Router();

// Endpoint para obtener productos
router.get('/', async (req, res) => {
  console.log(); // Imprime un espacio en blanco
  console.log('Solicitud recibida en /api/products');
  const { data, error } = await supabase
    .from('products')
    .select(); // Selecciona todos los registros de la tabla 'products'

  if (error) {
    console.error('Error al obtener los productos:', error.message);
    return res.status(500).json({ error: 'Error al obtener los productos' }); // Retorna un error 500
  } else {
    console.log('Productos obtenidos:', data);
    return res.status(200).json(data); // Retorna los registros obtenidos con un estado 200
  }
});

router.post('/new', async (req, res) => {
    const { description, brand, unit_price } = req.body;

    // Inserción en la tabla products
    const { data, error } = await supabase
        .from('products')
        .insert([{ description, brand, unit_price }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Producto agregado exitosamente', product: data });
});

// Example route to update the brand of a product
router.put('/update/:id', async (req, res) => {
    const { error } = await supabase
        .from('products')
        .update({
            description: req.body.description,
            brand: req.body.brand,
            unit_price: req.body.unit_price
        })
        .eq('id', req.params.id)
    if (error) {
        res.send(error);
    }
    res.send("updated!!");
});

// Endpoint para eliminar un producto por UPC
router.delete('/delete/:id', async (req, res) => {
        const { id } = req.params; // Obtener el UPC de los parámetros de la ruta

        if (!id) {
            return res.status(400).json({ error: 'El campo "id" es requerido.' });
        }

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id); // Usamos 'id' como columna para la comparación

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            res.status(200).json({ message: 'Producto eliminado con éxito' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    });

// Endpoint para obtener un producto
router.get('/id/:id', async (req, res) => {
  console.log(); // Imprime un espacio en blanco
  console.log('Solicitud recibida en /api/products/id/:id');
  const { id } = req.params; // Obtiene el valor del parámetro 'upc' de la URL
  console.log('Buscando producto con ID:', id);

  const { data, error } = await supabase
    .from('products')
    .select() // Selecciona todas las columnas
    .eq('id', id) // Filtra los registros donde la columna 'upc' sea igual al valor recibido
    .single(); // Espera un solo resultado (ya que el UPC debería ser único)

  if (error) {
    console.error('Error al obtener el producto:', error.message);
    return res.status(500).json({ error: 'Error al obtener el producto' }); // Retorna un error 500
  } else if (data) {
    console.log('Producto obtenido:', data);
    console.log(typeof id)
    return res.status(200).json(data); // Retorna el producto encontrado con un estado 200
  } else {
    console.log('No se encontró ningún producto con el Id:', id);
    return res.status(404).json({ message: 'Producto no encontrado' }); // Retorna un error 404 si no se encuentra el producto
  }
});


// Ruta para obtener un producto por UPC
router.get('/search', async (req, res) => {

    const { id } = req.query; // Obtiene el UPC de los parámetros de la consulta

    if (!id) {
        return res.status(400).json({ error: 'El campo "id" es requerido.' });
    }

    const { data, error } = await supabase
        .from('products')
        .select('brand, description')
        .eq('id', id)
        .single();

    if (error) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    console.log('Producto encontrado con el UPC:', data);
    res.status(200).json(data);
});

// Exporta el router usando CommonJS
module.exports = router;
//export default router;
