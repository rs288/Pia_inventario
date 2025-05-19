import './Productos.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Producto() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    const [mensajeExito, setMensajeExito] = useState('');  // ✅ nuevo estado para mensaje de éxito

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/products');
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

    const confirmarEliminacion = (product) => {
        setProductToDelete(product);
    };

    const cancelarEliminacion = () => {
        setProductToDelete(null);
    };

    const eliminarProducto = async () => {
        if (!productToDelete) return;

        try {
            const response = await fetch(`http://localhost:8080/api/products/delete/${productToDelete.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setMensajeExito(` Producto eliminado correctamente: ${productToDelete.description}`);
                setProductToDelete(null);
                fetchProducts();
                // ✅ limpiar el mensaje después de 3 segundos
                setTimeout(() => setMensajeExito(''), 3000);
            } else {
                const errorData = await response.json();
                setMensajeExito(errorData.message || 'Error al eliminar el producto');
                setTimeout(() => setMensajeExito(''), 3000);
            }
        } catch (error) {
            setMensajeExito('Error: ' + error.message);
            setTimeout(() => setMensajeExito(''), 3000);
        }
    };

    return (
        <div>
            <div className="header-container">
                <h2 style={{ display: 'inline', marginRight: '21em' }}>Lista de Productos</h2>
                <Link to="/productos/nuevo">
                    <button className="nuevo"> <i className="fa-solid fa-plus"></i> Nuevo Producto</button>
                </Link>
            </div>

            {/* ✅ Mostrar mensaje de éxito si existe */}
            {mensajeExito && (
                <div className="mensaje-exito">{mensajeExito}</div>
            )}

            {products.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Descripción</th>
                            <th>Marca</th>
                            <th>Precio</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.description}</td>
                                <td>{product.brand}</td>
                                <td>${product.unit_price && product.unit_price.toFixed(2)}</td>
                                <td>
                                    <Link to={`/productos/editar/${product.id}`}>
                                        <button className="Editar">Editar</button>
                                    </Link>{' '}
                                    <button className="Eliminar" onClick={() => confirmarEliminacion(product)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>{error ? `Error: ${error}` : 'Cargando productos...'}</div>
            )}

            {productToDelete && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>¿Estás seguro de que deseas eliminar este producto?</h3>
                        <p><strong>Id:</strong> {productToDelete.id}</p>
                        <p><strong>Descripción:</strong> {productToDelete.description}</p>
                        <p><strong>Marca:</strong> {productToDelete.brand}</p>
                        <p><strong>Precio:</strong> ${productToDelete.unit_price?.toFixed(2)}</p>
                        <p style={{ color: 'red' }}>¡Esta acción no se puede deshacer!</p>
                        <div className="modal-actions">
                            <button className="delete-btn" onClick={eliminarProducto}>Sí, eliminar</button>
                            <button className="cancel-btn" onClick={cancelarEliminacion}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Producto;


