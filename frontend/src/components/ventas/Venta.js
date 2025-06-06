﻿import './Venta.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Venta() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/outputs');
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

    const eliminarProducto = async () => {
        if (!productoAEliminar) return;

        const id = productoAEliminar.ac_id;
         console.error(id);

        try {
            const response = await fetch(`http://localhost:8080/api/outputs/delete/${id}`, {
                method: 'DELETE',
            });

            let mensaje;
            if (response.ok) {
                mensaje = 'Producto vendido eliminado correctamente';
                fetchProducts();
            } else if (response.status === 404) {
                const errorData = await response.json();
                mensaje = errorData.message || `No se encontró el producto adquirido con ID ${id}`;
            } else {
                const errorData = await response.json();
                mensaje = errorData.error || `Error al eliminar el producto adquirido ID ${id}`;
            }

            setFeedbackMessage(mensaje);
            setTimeout(() => setFeedbackMessage(null), 3000);
        } catch (error) {
            const mensaje = `Error al eliminar el producto vendido ID ${id}: ${error.message}`;
            setFeedbackMessage(mensaje);
            console.error('Hubo un problema al eliminar el producto adquirido:', error);
            setTimeout(() => setFeedbackMessage(null), 3000);
        } finally {
            setProductoAEliminar(null);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            <div className="header-container">
                <h2 style={{ display: 'inline', marginRight: '16em' }}>Lista de Productos Vendido</h2>
                <Link to="/ventas/nuevo">
                    <button className="nuevo"><i className="fa-solid fa-plus"></i> Nuevo Producto vendido</button>
                </Link>
            </div>

            {feedbackMessage && <div className="feedback-message">{feedbackMessage}</div>}

            {currentItems.length > 0 ? (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Ac_id</th>
                                <th>Order_id</th>
                                <th>Descripción</th>
                                <th>Marca</th>
                                <th>Quantity</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((product) => ( // Eliminamos 'index' aquí
                                <tr key={product.ac_id}>
                                    <td>{product.ac_id}</td>
                                    <td>{product.order_id}</td>
                                    <td>{product.description}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.quantity}</td>
                                    <td>
                                        <Link to={`/ventas/editar/${product.order_id}`}>
                                            <button className="Editar">Editar</button>
                                        </Link>{' '}
                                        <button className="Eliminar" onClick={() => setProductoAEliminar(product)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        {pageNumbers.map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={currentPage === number ? 'active' : ''}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div>{error ? `Error: ${error}` : 'Cargando productos...'}</div>
            )}

            {productoAEliminar && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>¿Estás seguro de que deseas eliminar este producto vendido?</h3>
                        <p><strong>Order ID:</strong> {productoAEliminar.order_id}</p>
                        <p><strong>Descripción:</strong> {productoAEliminar.description}</p>
                        <p><strong>ID:</strong> {productoAEliminar.ac_id}</p>
                        <p><strong>Cantidad:</strong> {productoAEliminar.quantity}</p>
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
