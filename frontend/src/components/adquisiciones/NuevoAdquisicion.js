import React, { useState, useEffect } from 'react';

const ProductSearchForm = () => {
    const [upc, setUpc] = useState('');
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            if (upc) {
                setError(''); // Reinicia el error
                try {
                    const response = await fetch(`http://localhost:8080/api/products/search?upc=${upc}`);
                    if (!response.ok) {
                        throw new Error('Producto no encontrado');
                    }
                    const data = await response.json();
                    setProduct(data);
                } catch (err) {
                    setError(err.message); // Maneja el error
                    setProduct(null); // Reinicia el producto si hay error
                }
            } else {
                setProduct(null); // Reinicia el producto si el campo está vacío
            }
        };

        const debounceFetch = setTimeout(fetchProduct, 300); // Debounce para evitar múltiples solicitudes

        return () => clearTimeout(debounceFetch); // Limpia el timeout al desmontar
    }, [upc]);

    return (
        <div>
            <h1>Búsqueda de Producto</h1>
            <label>
                UPC:
                <input
                    type="text"
                    value={upc}
                    onChange={(e) => setUpc(e.target.value)}
                    required
                />
            </label>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {product && (
                <div>
                    <h2>Producto Encontrado</h2>
                    <p><strong>Marca:</strong> {product.brand}</p>
                    <p><strong>Descripción:</strong> {product.description}</p>
                    <label>
                    Cantidad:
                    <input
                    type="number" // Cambiado a tipo numérico
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    />
                    </label>
                </div>
            )}
        </div>
    );
};

export default ProductSearchForm;
