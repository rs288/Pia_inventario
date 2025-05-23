import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Inventario() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    const [mensajeExito, setMensajeExito] = useState('');  // ✅ nuevo estado para mensaje de éxito

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/inventory');
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Hubo un problema con la solicitud Fetch:', error);
            setError(error.message);
        }
    };


    return (
        <div>
            <div className="header-container">
                <h2 style={{ display: 'inline', marginRight: '21em' }}>Lista de Productos</h2>
            </div>


            {products.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Descripción</th>
                            <th>Marca</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.description}</td>
                                <td>{product.brand}</td>
                                <td>{product.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>{error ? `Error: ${error}` : 'Cargando inventario...'}</div>
            )}

        </div>
    );
}

export default Inventario;


