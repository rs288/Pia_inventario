// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Productos from './components/productos/Productos';
import NuevoProducto from './components/productos/NuevoProducto';
import EditarProducto from './components/productos/EditarProducto';
import Adquisicion from './components/adquisiciones/Adquisicion';
import NuevoAdquisicion from './components/adquisiciones/NuevoAdquisicion';
import EditarAdquisicion from './components/adquisiciones/EditarAdquisicion';
import Ventas from './components/ventas/Venta';

const App = () => {
    return (
        <Router>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ padding: '20px', flex: 1 }}>
                    {/* <h1>Contenido Principal</h1> */}
                    <Routes>
                        <Route path="/" element={<p>Bienvenido a la p&aacute;gina de inicio.</p>} />
                        <Route path="/productos" element={<Productos />} />
                        <Route path="/productos/nuevo" element={<NuevoProducto />} />
                        <Route path="/productos/editar/:id" element={<EditarProducto />} />
                        <Route path="/adquisiciones" element={<Adquisicion />} />
                        <Route path="/adquisiciones/nuevo" element={<NuevoAdquisicion />} />
                        <Route path="/adquisiciones/editar/:upc" element={<EditarAdquisicion />} />
                        <Route path="/ventas" element={<Ventas />} />
                        <Route path="/salidas/nuevo" element={<NuevoProducto />} />
                        <Route path="/salidas/editar/:upc" element={<EditarProducto />} />
                        <Route path="/inventario" element={<p>Aqu&iacute; est&aacute;n nuestro almacen (inventario).</p>} />
                        <Route path="/ValorInventario" element={<p>Esta es la p&aacute;gina del valor de inventario.</p>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
