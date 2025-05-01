import './Venta.css'; // Importa el archivo CSS
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Venta() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState(null);

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

    //const mostrarUPC = (upc) => {
    //    alert('El UPC del producto es: ' + upc);
    //};

    //const editar = (upc) => {
        // Redirigir al formulario de edici�n
    //    window.location.href = `/productos/editar/${upc}`;
    //};

    const eliminarProducto = async (upc) => {
        // Limpiar cualquier mensaje de feedback previo (ya no es estrictamente necesario para la alerta)
        // setFeedbackMessage(null);

        // Confirmar si el usuario realmente desea eliminar el producto

        const confirmacion = window.confirm("¿Estas seguro de que deseas eliminar este producto?");

        if (!confirmacion) {

            return; // Si el usuario cancela, no hacer nada

        }

        try {
            const response = await fetch(`http://localhost:8080/api/products/delete/${upc}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const mensaje = 'Producto eliminado correctamente';
                setFeedbackMessage(mensaje);
                alert(mensaje); // Mostrar el mensaje en una alerta
                fetchProducts();
            } else if (response.status === 404) {
                const errorData = await response.json();
                const mensaje = errorData.message || `No se encontr� el producto con UPC ${upc}`;
                setFeedbackMessage(mensaje);
                alert(mensaje); // Mostrar el mensaje en una alerta
            } else {
                const errorData = await response.json();
                const mensaje = errorData.error || `Error al eliminar el producto con UPC ${upc}`;
                setFeedbackMessage(mensaje);
                alert(mensaje); // Mostrar el mensaje en una alerta
            }
        } catch (error) {
            const mensaje = `Error al eliminar el producto con UPC ${upc}: ${error.message}`;
            setFeedbackMessage(mensaje);
            alert(mensaje); // Mostrar el mensaje en una alerta
            console.error('Hubo un problema al eliminar el producto:', error);
        }
    };

    return (
        <div>
         <div className="header-container">
            <h2 style={{ display: 'inline', marginRight: '17em' }}>Lista de Productos Vendidos</h2>
            <Link to="/productos/nuevo">
                <button class="nuevo"> <i className="fa-solid fa-plus"></i> Nuevo Producto</button>
            </Link>
         </div>
            {products.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>id_venta</th>
                            <th>Descripci&oacute;n</th>
                            <th>Marca</th>
                            <th>cantidad</th>
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
                                    {/* <button onClick={() => editar(product.upc)}>Editar</button> */}
                                    <Link to={`/productos/editar/${product.upc}`}>
                                        <button class="Editar">Editar</button>
                                    </Link>{' '}
                                    <button class="Eliminar" onClick={() => eliminarProducto(product.upc)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>Cargando productos vendidos...</div>
            )}
        </div>
    );
}

export default Venta;
