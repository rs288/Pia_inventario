/// NuevoProducto.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './NuevoProducto.css';

function FormularioNuevoProducto() {
    const [newProduct, setNewProduct] = useState({
        upc: '',
        description: '',
        brand: '',
        unit_price: ''
    });
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const navigate = useNavigate(); // Hook para navegar

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSaveNewProduct = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/products/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });

            if (response.ok) {
                const data = await response.json();
                setFeedbackMessage('Producto agregado exitosamente');
                alert('Producto agregado exitosamente');
                navigate('/productos'); // Redirige a la página principal (lista de productos)
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Error al agregar el producto';
                setFeedbackMessage(errorMessage);
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            setFeedbackMessage('Error al agregar el producto');
            alert('Error al agregar el producto');
        }
    };

    const handleCancelAdd = () => {
        navigate('/productos'); // Redirige a la página principal
    };

    return (
        <div className="new-product-form">
            <h3>Agregar Nuevo Producto</h3>
            <label>
                UPC:
                <input
                    type="number"
                    name="upc"
                    value={newProduct.upc}
                    onChange={handleInputChange}
                />
            </label>
            <label>
                Descripci&oacute;n:
                <input
                    type="text"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                />
            </label>
            <label>
                Marca:
                <input
                    type="text"
                    name="brand"
                    value={newProduct.brand}
                    onChange={handleInputChange}
                />
            </label>
            <label>
                Precio:
                <input
                    type="number"
                    step="0.01"
                    name="unit_price"
                    value={newProduct.unit_price}
                    onChange={handleInputChange}
                />
            </label>
            <div className="button-container">
                <button className="full-width-button" onClick={handleSaveNewProduct}>Guardar</button>
                <button className="full-width-button" onClick={handleCancelAdd}>Cancelar</button>
            </div>
        </div>
    );
}

export default FormularioNuevoProducto;
