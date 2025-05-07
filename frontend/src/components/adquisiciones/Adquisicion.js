import './Adquisicion.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Adquisicion() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [upcToDelete, setUpcToDelete] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/adquisitions');
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
        if (!upcToDelete) return;

        try {
            const response = await fetch(`http://localhost:8080/api/products/delete/${upcToDelete}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const mensaje = 'Producto adquirido eliminado correctamente';
                setFeedbackMessage(mensaje);
                fetchProducts();
            } else if (response.status === 404) {
                const errorData = await response.json();
                const mensaje = errorData.message || `No se encontró el producto adquirido con UPC ${upcToDelete}`;
                setFeedbackMessage(mensaje);
            } else {
                const errorData = await response.json();
                const mensaje = errorData.error || `Error al eliminar el producto adquirido UPC ${upcToDelete}`;
                setFeedbackMessage(mensaje);
            }
        } catch (error) {
            const mensaje = `Error al eliminar el producto adquirido UPC ${upcToDelete}: ${error.message}`;
            setFeedbackMessage(mensaje);
            console.error('Hubo un problema al eliminar el producto adquirido:', error);
        } finally {
            setUpcToDelete(null);
        }
    };

    return (
        <div>
            <div className="header-container">
                <h2 style={{ display: 'inline', marginRight: '16em' }}>Lista de Productos Adquiridos</h2>
                <Link to="/adquisiciones/nuevo">
                    <button className="nuevo"> <i className="fa-solid fa-plus"></i> Nuevo Producto</button>
                </Link>
            </div>

            {products.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Order_id</th>
                            <th>Descripci&oacute;n</th>
                            <th>Marca</th>
                            <th>UPC</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.order_id}>
                                <td>{product.order_id}</td>
                                <td>{product.description}</td>
                                <td>{product.brand}</td>
                                <td>{product.upc}</td>
                                <td>{product.quantity}</td>
                                <td>{product.status}</td>
                                <td>
                                    <Link to={`/productos/editar/${product.upc}`}>
                                        <button className="Editar">Editar</button>
                                    </Link>{' '}
                                    <button className="Eliminar" onClick={() => setUpcToDelete(product.upc)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>Cargando productos adquiridos...</div>
            )}
      





            {upcToDelete && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>¿Estás seguro de que deseas eliminar este producto adquirido?</p>
                        <div className="modal-buttons">
                            <button onClick={eliminarProducto} className="delete-btn">Sí, eliminar</button>
                            <button onClick={() => setUpcToDelete(null)} className="cancel-btn">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Adquisicion;
