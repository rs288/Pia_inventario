import './Venta.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Venta() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [productoAEliminar, setProductoAEliminar] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/outputs');
            if (!response.ok) throw new Error('Error en la red');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Hubo un problema con la solicitud Fetch:', error);
            setError(error.message);
        }
    };

    const eliminarProducto = async () => {
        if (!productoAEliminar) return;
        const upc = productoAEliminar.upc;

        try {
            const response = await fetch(`http://localhost:8080/api/products/delete/${upc}`, {
                method: 'DELETE',
            });

            let mensaje;
            if (response.ok) {
                mensaje = 'Producto vendido eliminado correctamente';
                fetchProducts();
            } else if (response.status === 404) {
                const errorData = await response.json();
                mensaje = errorData.message || `No se encontró el producto con UPC ${upc}`;
            } else {
                const errorData = await response.json();
                mensaje = errorData.error || `Error al eliminar el producto con UPC ${upc}`;
            }

            setFeedbackMessage(mensaje);
            setTimeout(() => setFeedbackMessage(null), 3000);
        } catch (error) {
            const mensaje = `Error al eliminar el producto con UPC ${upc}: ${error.message}`;
            setFeedbackMessage(mensaje);
            console.error('Hubo un problema al eliminar el producto:', error);
            setTimeout(() => setFeedbackMessage(null), 3000);
        } finally {
            setProductoAEliminar(null);
        }
    };

    return (
        <div>
            <div className="header-container">
                <h2 style={{ display: 'inline', marginRight: '17em' }}>Lista de Productos Vendidos</h2>
                <Link to="/productos/nuevo">
                    <button className="nuevo"> <i className="fa-solid fa-plus"></i> Nuevo Producto</button>
                </Link>
            </div>

            {products.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID Venta</th>
                            <th>Descripción</th>
                            <th>Marca</th>
                            <th>Cantidad</th>
                            <th>UPC</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.upc}>
                                <td>{product.output_id}</td>
                                <td>{product.description}</td>
                                <td>{product.brand}</td>
                                <td>{product.quantity}</td>
                                <td>{product.upc}</td>
                                <td>
                                    <Link to={`/productos/editar/${product.upc}`}>
                                        <button className="Editar">Editar</button>
                                    </Link>{' '}
                                    <button className="Eliminar" onClick={() => setProductoAEliminar(product)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>{error ? `Error: ${error}` : 'Cargando productos vendidos...'}</div>
            )}

            {/* Modal de confirmación */}
            {productoAEliminar && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>¿Estás seguro de que deseas eliminar este producto adquirido?</h3>

                        <p><strong>Order ID:</strong> {productoAEliminar.order_id}</p>
                        <p><strong>Descripción:</strong> {productoAEliminar.description}</p>
                        <p><strong>UPC:</strong> {productoAEliminar.upc}</p>
                        <p><strong>Cantidad:</strong> {productoAEliminar.quantity}</p>
                        <p><strong>Status:</strong> {productoAEliminar.status}</p>

                        <p style={{ color: 'red' }}>¡Esta acción no se puede deshacer!</p>

                        <div className="modal-actions">
                            <button onClick={eliminarProducto} className="delete-btn" style={{ marginRight: '1em' }}>
                                Sí, eliminar
                            </button>
                            <button onClick={() => setProductoAEliminar(null)} className="cancel-btn">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export default Venta;


