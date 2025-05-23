import './Adquisicion.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Adquisicion() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const statusOptions = ['Pendiente', 'Confirmado', 'Completo', 'Cancelado'];

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

    // Modificación aquí: La función ahora recibe el 'product' completo
    const handleEdit = async (productToEdit, field, value) => {
        // Encontrar el índice global del producto a editar
        const globalIndex = products.findIndex(p => p.ac_id === productToEdit.ac_id);

        if (globalIndex === -1) {
            console.error('Producto no encontrado para editar.');
            return;
        }

        const updatedProducts = [...products];
        updatedProducts[globalIndex][field] = value;
        setProducts(updatedProducts);

        try {
            const response = await fetch('http://localhost:8080/api/adquisitions/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id: updatedProducts[globalIndex].order_id,
                    new_status: value
                }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estado en el servidor');
            }

            setFeedbackMessage('Estado del pedido actualizado correctamente');
            setTimeout(() => setFeedbackMessage(null), 3000);
            fetchProducts();
        } catch (error) {
            console.error('Error al actualizar el estado del pedido:', error);
            setFeedbackMessage('Error al actualizar el estado del pedido');
            setTimeout(() => setFeedbackMessage(null), 3000);
        }
    };

    const eliminarProducto = async () => {
        if (!productoAEliminar) return;

        const id = productoAEliminar.ac_id;
         console.error(id);

        try {
            const response = await fetch(`http://localhost:8080/api/adquisitions/delete/${id}`, {
                method: 'DELETE',
            });

            let mensaje;
            if (response.ok) {
                mensaje = 'Producto adquirido eliminado correctamente';
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
            const mensaje = `Error al eliminar el producto adquirido ID ${id}: ${error.message}`;
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
                <h2 style={{ display: 'inline', marginRight: '16em' }}>Lista de Productos Adquiridos</h2>
                <Link to="/adquisiciones/nuevo">
                    <button className="nuevo"><i className="fa-solid fa-plus"></i> Nuevo Producto adquirido</button>
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
                                <th>Status</th>
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
                                        <select
                                            value={product.status}
                                            onChange={(e) => handleEdit(product, 'status', e.target.value)}> {/* Pasamos el objeto 'product' completo */}
                                            {statusOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <Link to={`/adquisiciones/editar/${product.order_id}`}>
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
                        <h3>¿Estás seguro de que deseas eliminar este producto adquirido?</h3>
                        <p><strong>Order ID:</strong> {productoAEliminar.order_id}</p>
                        <p><strong>Descripción:</strong> {productoAEliminar.description}</p>
                        <p><strong>ID:</strong> {productoAEliminar.ac_id}</p>
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

export default Adquisicion;
