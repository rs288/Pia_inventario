// src/components/Sidebar.js
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import tienda from '../assets/tienda.png'; // Ajusta la ruta si está en otra carpet

const Sidebar = () => {
    const location = useLocation(); // Obtiene la ubicación actual
    const menuItems = [
        {/* { name: 'Home', path: '/' }, */},
        { name: 'Productos', path: '/productos', icon: <i className="fas fa-box"></i> },
        { name: 'Adquisiciones', path: '/adquisiciones', icon: <i className="fas fa-shopping-cart"></i> },
        { name: 'Ventas', path: '/ventas', icon: <i className="fas fa-sign-out-alt"></i> },
        { name: 'Reporte de inventario', path: '/inventario', icon: <i className="fas fa-warehouse"></i> },
        { name: 'Reporte valor de inventario', path: '/valorInventario', icon: <i className="fa-solid fa-dollar-sign"></i> },
    ];

    return (
        <div className="sidebar">
            <h2 className="app-name">NombreApp</h2>
			<div className="logo-container">
                <img src={tienda} alt="Tienda" className="logo-img" />
            </div>
			
	
            <ul>
                {menuItems.map((item) => (
                    <li
                        key={item.path}
                        className={location.pathname === item.path ? 'active' : ''}
                    >
                        <Link to={item.path}>{item.icon}{item.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
