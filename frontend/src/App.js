// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Productos from './components/productos/Productos';
import NuevoProducto from './components/productos/NuevoProducto';
import EditarProducto from './components/productos/EditarProducto';

const App = () => {
    return (
        <Router>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ padding: '20px', flex: 1 }}>
                    <h1>Contenido Principal</h1>
                    <Routes>
                        <Route path="/" element={<p>Bienvenido a la página de inicio.</p>} />
                        <Route path="/about" element={<p>Esta es la página sobre nosotros.</p>} />
                        <Route path="/services" element={<p>Aquí están nuestros servicios.</p>} />
                        <Route path="/productos" element={<Productos />} />
                        <Route path="/contact" element={<p>Esta es la página de contacto.</p>} />
                        <Route path="/productos/nuevo" element={<NuevoProducto />} />
                        <Route path="/productos/editar/:upc" element={<EditarProducto />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;