import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './NuevoProducto.css';

function EditarProducto() {
    const { upc } = useParams(); // Obtener el UPC de los parámetros de la URL
    const navigate = useNavigate(); // Para redirigir después de la edición
    const [product, setProduct] = useState({
        description: '',
        brand: '',
        unit_price: 0,
    });
    const [error, setError] = useState(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/products/upc/${upc}`);
                if (!response.ok) {
                    throw new Error('Error al cargar el producto ');
                }
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Hubo un problema con la solicitud Fetch:', error);
                setError(error.message);
            }
        };

        fetchProduct();
    }, [upc]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: name === 'unit_price' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/products/update/${upc}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });

            if (response.ok) {
                alert('Producto actualizado correctamente');
                navigate('/productos'); // Redirigir a la lista de productos
            } else {
                const errorData = await response.json();
                const mensaje = errorData.error || 'Error al actualizar el producto';
                alert(mensaje);
            }
        } catch (error) {
            console.error('Hubo un problema al actualizar el producto:', error);
            alert('Error al actualizar el producto');
        }
    };

    const handleCancel = () => {

        navigate(-1); // Regresar a la página anterior

    };
    const handleDeleteConfirmed = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/products/delete/${upc}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Producto eliminado correctamente');
                navigate('/productos');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Error al eliminar el producto');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Error al eliminar el producto');
        } finally {
            setShowConfirmDelete(false);
        }
    };
 
    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>Cargando producto...</div>;
    }

    return (
        <div className="new-product-form">
        <form onSubmit={handleSubmit}>
            <h3>Editar Producto</h3>
            <div>
                <label>Descripci&oacute;n:</label>
                <input
                    type="text"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Marca:</label>
                <input
                    type="text"
                    name="brand"
                    value={product.brand}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Precio:</label>
                <input
                    type="number"
                    name="unit_price"
                    value={product.unit_price}
                    onChange={handleChange}
                />
            </div>
            <div className="button-container">
                <button type="submit" className="full-width-button">Guardar Cambios</button>
                    <button type="button" className="full-width-button" onClick={handleCancel}>Cancelar</button>
                    <button
                        type="button"
                        className="full-width-button"
                        onClick={() => setShowConfirmDelete(true)}
                        style={{ backgroundColor: '#e74c3c', color: 'white', marginTop: '10px' }}
                    >
                        Eliminar Producto
                    </button>

            </div>
        </form>
        
         {
        showConfirmDelete && (
        <div className="modal-overlay">
                    <div className="modal-content">
                        <h4>Eliminar "{product.description}"</h4>
                        <p>Esta acción no se puede deshacer.</p>
                        <div className="lock-icon">🔒</div>
                            <p style={{ fontWeight: 'bold' }}>¿Desea borrar este producto?</p>
                        <button
                            className="full-width-button"
                            onClick={handleDeleteConfirmed}
                            style={{ backgroundColor: '#d9534f', color: 'white', marginTop: '10px' }}
                        >
                            Quiero eliminar este producto
                        </button>
                        <button
                            className="full-width-button"
                            onClick={() => setShowConfirmDelete(false)}
                            style={{ marginTop: '10px' }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
    )
}
        </div >
    );

}

export default EditarProducto;
