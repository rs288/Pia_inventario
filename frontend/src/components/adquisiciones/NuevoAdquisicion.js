import React, { useState, useRef, useEffect } from 'react';
import './NuevoAdquisicion.css';
import { createPortal } from 'react-dom';

const EditableTableWithAutocomplete = ({ initialData = [], apiUrl = 'http://localhost:8080/api/products/' }) => {
  const [data, setData] = useState(() => {
    return initialData.length > 0 ? initialData : [{ descripcion: '', marca: '', cantidad: 1 }];
  });
  const [inputValue, setInputValue] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState({});
  const [showSuggestions, setShowSuggestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inputRefs = useRef({});
  const [editableRows, setEditableRows] = useState({});

  const fetchProductDetails = async (description, index) => {
    try {
      const response = await fetch(`http://localhost:8080/api/adquisitions/search?description=${description}`);
      if (!response.ok) {
        console.error(`Error al buscar producto con descripción "${description}": ${response.status}`);
        return null;
      }
      const data = await response.json();
      if (data && data.length > 0 && data[0].brand) {
        return { marca: data[0].brand };
      }
      return null;
    } catch (error) {
      console.error('Error al buscar detalles del producto:', error);
      return null;
    }
  };

  const autocompleteBrand = async (description, index) => {
    const productDetails = await fetchProductDetails(description, index);
    if (productDetails && productDetails.marca) {
      const newData = [...data];
      newData[index].marca = productDetails.marca;
      setData(newData);
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
          setAllProducts(data.map(product => product.description));
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

  const handleInputChange = (index, column, value) => {
    const newData = [...data];
    newData[index][column] = value;
    setData(newData);
  };

  const agregarFila = () => {
    setData([...data, { descripcion: '', marca: '', cantidad: 1 }]);
    setEditableRows(prev => ({ ...prev, [data.length]: true })); // La nueva fila es editable
  };

  const eliminarFila = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);

    const newEditableRows = { ...editableRows };
    delete newEditableRows[index]; // Elimina la entrada del estado de edición
    setEditableRows(newEditableRows);

    const newInputValues = { ...inputValue };
    delete newInputValues[index];
    setInputValue(newInputValues);

    const newSuggestions = { ...suggestions };
    delete newSuggestions[index];
    setSuggestions(newSuggestions);

    const newShowSuggestions = { ...showSuggestions };
    delete newShowSuggestions[index];
    setShowSuggestions(newShowSuggestions);
  };

  const handleDescriptionInputChange = (index, event) => {
    const value = event.target.value;
    setInputValue(prev => ({ ...prev, [index]: value }));
    setShowSuggestions(prev => ({ ...prev, [index]: true }));

    if (value.length >= 1) {
      const filteredSuggestions = allProducts.filter(productDescription =>
        productDescription.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(prev => ({ ...prev, [index]: filteredSuggestions }));

      if (event.key === 'Enter' && filteredSuggestions.length === 1) {
        autocompleteBrand(filteredSuggestions[0], index);
        setShowSuggestions(prev => ({ ...prev, [index]: false }));
        setEditableRows(prev => ({ ...prev, [index]: false }));
      }
    } else {
      setSuggestions(prev => ({ ...prev, [index]: [] }));
    }
  };

  const handleSuggestionClick = (index, suggestion) => {
    setInputValue(prev => ({ ...prev, [index]: suggestion }));
    handleInputChange(index, 'descripcion', suggestion);
    autocompleteBrand(suggestion, index);
    setShowSuggestions(prev => ({ ...prev, [index]: false }));
    setEditableRows(prev => ({ ...prev, [index]: false }));
  };

  const handleClickOutside = (event) => {
    Object.keys(inputRefs.current).forEach(index => {
      const input = inputRefs.current[index];
      const suggestionsContainerId = `suggestions-${index}`;
      const suggestionsContainer = document.getElementById(suggestionsContainerId);
      if (input && suggestionsContainer && !input.contains(event.target) && !suggestionsContainer.contains(event.target)) {
        setShowSuggestions(prev => ({ ...prev, [index]: false }));
      }
    });
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>Error al cargar los datos: {error}</p>;
  }

  return (
    <div>
      <h2>Lista de productos por adquirir</h2>
      <button onClick={agregarFila} className="agregar-fila-button espacio-derecha">
        Agregar Fila
      </button>
      <button type="button" className="agregar-fila-button">Guardar</button>
      <div className="table-container">
        <table className="editable-table">
          <thead>
            <tr>
              <th className="editable-table th">Descripción</th>
              <th className="editable-table th">Marca</th>
              <th className="editable-table th">Cantidad</th>
              <th className="editable-table th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="editable-table td">
                  <div className="autocomplete-container">
                    {editableRows[index] !== false ? (
                      <input
                        ref={el => (inputRefs.current[index] = el)}
                        type="text"
                        className="editable-input"
                        value={inputValue[index] || row.descripcion}
                        onChange={(e) => handleDescriptionInputChange(index, e)}
                        onKeyDown={(e) => handleDescriptionInputChange(index, e)}
                        onFocus={() => setShowSuggestions(prev => ({ ...prev, [index]: true }))}
                      />
                    ) : (
                      <span onClick={() => setEditableRows(prev => ({...prev, [index]: true}))} style={{cursor: 'pointer'}}>{row.descripcion}</span>
                    )}
                    {showSuggestions[index] && suggestions[index] && suggestions[index].length > 0 && (
                      createPortal(
                        <div
                          id={`suggestions-${index}`}
                          className="autocomplete-suggestions"
                          style={{
                            width: inputRefs.current[index] ? inputRefs.current[index].offsetWidth : 'auto',
                            position: 'absolute',
                            top: inputRefs.current[index] ? inputRefs.current[index].getBoundingClientRect().bottom + window.scrollY + 'px' : 'auto',
                            left: inputRefs.current[index] ? inputRefs.current[index].getBoundingClientRect().left + window.scrollX + 'px' : 'auto',
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
                      )
                    )}
                  </div>
                </td>
                <td className="editable-table td">
                  {editableRows[index] !== false ? (
                    <input
                      type="text"
                      className="editable-input"
                      value={row.marca}
                      onChange={(e) => handleInputChange(index, 'marca', e.target.value)}
                    />
                  ) : (
                    <span>{row.marca}</span>
                  )}
                </td>
                <td className="editable-table td">
                  <input
                    type="number"
                    className="editable-input editable-cantidad-input"
                    value={row.cantidad}
                    onChange={(e) => handleInputChange(index, 'cantidad', parseInt(e.target.value))}
                  />
                </td>
                <td className="editable-table td">
                  <button type="button" onClick={() => eliminarFila(index)}>Eliminar</button>
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
