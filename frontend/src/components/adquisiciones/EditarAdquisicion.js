import React, { useState, useRef, useEffect } from 'react';
import './NuevoAdquisiciones.css';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';

const EditableTableWithAutocomplete = ({ initialData = [], apiUrl = 'http://localhost:8080/api/products/' }) => {
  const [data, setData] = useState(() => {
    return initialData.length > 0
      ? initialData.map((item) => ({ ...item, product_id: item.product_id || '' }))
      : [{ product_id: '', descripcion: '', marca: '', cantidad: 1 }];
  });
  const [inputValue, setInputValue] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState({});
  const [showSuggestions, setShowSuggestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inputRefs = useRef({});
  const [editableRows, setEditableRows] = useState({});
  const navigate = useNavigate();
  const { order_id } = useParams();

  const fetchProductDetails = async (description) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/adquisitions/search?description=${description}`
      );
      if (!response.ok) {
        console.error(
          `Error al buscar producto con descripción "${description}": ${response.status}`
        );
        return null;
      }
      const productData = await response.json();
      if (productData && productData.length > 0) {
        return {
          marca: productData[0].brand,
          product_id: productData[0].id || productData[0].product_id
        };
      }
      return null;
    } catch (error) {
      console.error('Error al buscar detalles del producto:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data) {
          setAllProducts(data.map((product) => product.description));
        } else {
          setAllProducts([]);
        }
      } catch (e) {
        console.error('Error fetching products:', e);
        setError('Error al cargar los productos.');
        setAllProducts(['Error al cargar productos']);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  useEffect(() => {
    const fetchAdquisitionDetails = async () => {
      if (order_id) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`http://localhost:8080/api/adquisitions/order_id/${order_id}`);
          if (!response.ok) {
            throw new Error(`Error al cargar la adquisición: ${response.statusText}`);
          }
          const adquisitionData = await response.json();
          if (adquisitionData && adquisitionData.length > 0) {
            setData(adquisitionData.map(item => ({
              ac_id: item.ac_id,
              product_id: item.product_id,
              descripcion: item.description,
              marca: item.brand,
              cantidad: item.quantity
            })));
            const initialEditableState = {};
            adquisitionData.forEach((_, idx) => initialEditableState[idx] = false);
            setEditableRows(initialEditableState);
          } else {
            setData([{ ac_id: '', product_id: '', descripcion: '', marca: '', cantidad: 1 }]);
          }
        } catch (e) {
          console.error('Error al cargar los detalles de la adquisición:', e);
          setError(`Error al cargar los detalles de la adquisición: ${e.message}`);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAdquisitionDetails();
  }, [order_id]);

  const handleInputChange = (index, column, value) => {
    const newData = [...data];
    newData[index][column] = value;
    setData(newData);
  };

  const agregarFila = () => {
    setData([...data, { product_id: '', descripcion: '', marca: '', cantidad: 1 }]);
    setEditableRows((prev) => ({ ...prev, [data.length]: true }));
  };

  const handleDescriptionInputChange = async (index, event) => {
    const value = event.target.value;
    setInputValue((prev) => ({ ...prev, [index]: value }));
    handleInputChange(index, 'descripcion', value);
    setShowSuggestions((prev) => ({ ...prev, [index]: true }));

    if (value.length >= 1) {
      const filteredSuggestions = allProducts.filter((productDescription) =>
        productDescription.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions((prev) => ({ ...prev, [index]: filteredSuggestions }));

      if (event.key === 'Enter' && filteredSuggestions.length === 1) {
        const descriptionToUse = filteredSuggestions[0];
        setInputValue((prev) => ({ ...prev, [index]: descriptionToUse }));
        handleInputChange(index, 'descripcion', descriptionToUse);

        const productDetails = await fetchProductDetails(descriptionToUse);
        if (productDetails) {
          handleInputChange(index, 'marca', productDetails.marca);
          handleInputChange(index, 'product_id', productDetails.product_id);
        } else {
          handleInputChange(index, 'marca', '');
          handleInputChange(index, 'product_id', '');
        }

        setShowSuggestions((prev) => ({ ...prev, [index]: false }));
        setEditableRows((prev) => ({ ...prev, [index]: false }));
      }
    } else {
      setSuggestions((prev) => ({ ...prev, [index]: [] }));
      handleInputChange(index, 'marca', '');
      handleInputChange(index, 'product_id', '');
    }
  };

  const handleSuggestionClick = async (index, suggestion) => {
    setInputValue((prev) => ({ ...prev, [index]: suggestion }));
    handleInputChange(index, 'descripcion', suggestion);

    const productDetails = await fetchProductDetails(suggestion);
    if (productDetails) {
      handleInputChange(index, 'marca', productDetails.marca);
      handleInputChange(index, 'product_id', productDetails.product_id);
    } else {
      handleInputChange(index, 'marca', '');
      handleInputChange(index, 'product_id', '');
    }

    setShowSuggestions((prev) => ({ ...prev, [index]: false }));
    setEditableRows((prev) => ({ ...prev, [index]: false }));
  };

  const handleClickOutside = (event) => {
    Object.keys(inputRefs.current).forEach((index) => {
      const input = inputRefs.current[index];
      const suggestionsContainerId = `suggestions-${index}`;
      const suggestionsContainer = document.getElementById(suggestionsContainerId);
      if (
        input &&
        suggestionsContainer &&
        !input.contains(event.target) &&
        !suggestionsContainer.contains(event.target)
      ) {
        setShowSuggestions((prev) => ({ ...prev, [index]: false }));
      }
    });
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --- Función handleGuardar ---
  const handleGuardar = async () => {
    try {
      const ids = data.map(item => item.ac_id).filter(id => id !== '' && id !== undefined && id !== null); // Filtra los IDs vacíos o nulos
      const quantities = data.map(item => item.cantidad);
      const product_ids = data.map(item => item.product_id);

      const requestBody = {
        ids: ids,
        quantities: quantities,
        product_ids: product_ids
      };

      console.log('Enviando datos:', requestBody);

      const response = await fetch('http://localhost:8080/api/adquisitions/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al guardar los datos: ${response.statusText} - ${errorData.message || ''}`);
      }

      const result = await response.json();
      console.log('Datos guardados exitosamente:', result);
      alert('Datos guardados exitosamente!');
      // Opcional: Redirigir a otra página o actualizar la tabla
      // navigate('/ruta-de-confirmacion');

    } catch (error) {
      console.error('Hubo un error al intentar guardar los datos:', error);
      alert(`Error al guardar los datos: ${error.message}`);
    }
  };
  // --- Fin Función handleGuardar ---

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>Error al cargar los datos: {error}</p>;
  }

  return (
    <div>
      <h2>Lista de productos por adquirir</h2>
      <div className="botones-container">
        <button className="nuevo" onClick={handleGuardar}>Guardar</button>
      </div>

      <div className="table-container">
        <table className="editable-table">
          <thead>
            <tr>
              <th className="editable-table th">Ac ID</th>
              <th className="editable-table th">Product ID</th>
              <th className="editable-table th">Descripción</th>
              <th className="editable-table th">Marca</th>
              <th className="editable-table th">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="editable-table td">{row.ac_id}</td>
                <td className="editable-table td">{row.product_id}</td>
                <td className="editable-table td">
                  <div className="autocomplete-container">
                    {editableRows[index] !== false ? (
                      <input
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        className="editable-input"
                        value={inputValue[index] || row.descripcion}
                        onChange={(e) => handleDescriptionInputChange(index, e)}
                        onKeyDown={(e) => handleDescriptionInputChange(index, e)}
                        onFocus={() =>
                          setShowSuggestions((prev) => ({ ...prev, [index]: true }))
                        }
                      />
                    ) : (
                      <span
                        onClick={() =>
                          setEditableRows((prev) => ({ ...prev, [index]: true }))
                        }
                        style={{ cursor: 'pointer' }}
                      >
                        {row.descripcion}
                      </span>
                    )}
                    {showSuggestions[index] &&
                      suggestions[index] &&
                      suggestions[index].length > 0 &&
                      createPortal(
                        <div
                          id={`suggestions-${index}`}
                          className="autocomplete-suggestions"
                          style={{
                            width: inputRefs.current[index]
                              ? inputRefs.current[index].offsetWidth
                              : 'auto',
                            position: 'absolute',
                            top: inputRefs.current[index]
                              ? inputRefs.current[index].getBoundingClientRect().bottom +
                                window.scrollY +
                                'px'
                              : 'auto',
                            left: inputRefs.current[index]
                              ? inputRefs.current[index].getBoundingClientRect().left +
                                window.scrollX +
                                'px'
                              : 'auto',
                          }}
                        >
                          <ul>
                            {suggestions[index].map((suggestion, suggestionIndex) => (
                              <li
                                key={suggestionIndex}
                                onClick={() => handleSuggestionClick(index, suggestion)}
                              >
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>,
                        document.body
                      )}
                  </div>
                </td>
                <td className="editable-table td">
                  <span>{row.marca}</span>
                </td>
                <td className="editable-table td">
                  <input
                    type="number"
                    className="editable-input editable-cantidad-input"
                    value={row.cantidad}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'cantidad',
                        parseInt(e.target.value)
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditableTableWithAutocomplete;
