import './Productos.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Producto() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null); // Producto que se quiere eliminar

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
        setProductToDelete(product); // Mostrar modal con datos del producto
    };

    const cancelarEliminacion = () => {
        setProductToDelete(null); // Ocultar modal
    };

    const eliminarProducto = async () => {
        if (!productToDelete) return;

        try {
            const response = await fetch(`http://localhost:8080/api/products/delete/${productToDelete.upc}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert(`Producto "${productToDelete.description}" eliminado correctamente`);
                setProductToDelete(null); // Cerrar modal
                fetchProducts(); // Refrescar la lista
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Error al eliminar el producto');
            }
        } catch (error) {
            alert('Error: ' + error.message);
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

            {products.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Marca</th>
                            <th>UPC</th>
                            <th>Precio</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.upc}>
                                <td>{product.description}</td>
                                <td>{product.brand}</td>
                                <td>{product.upc}</td>
                                <td>${product.unit_price && product.unit_price.toFixed(2)}</td>
                                <td>
                                    <Link to={`/productos/editar/${product.upc}`}>
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

            {/* Modal personalizado de confirmación */}
            {productToDelete && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>¿Eliminar "{productToDelete.description}"?</h3>
                        <p>UPC: {productToDelete.upc}</p>
                        <p>Esta acción no se puede deshacer.</p>
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

