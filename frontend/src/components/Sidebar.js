// src/components/Sidebar.js
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar2.css';

const Sidebar = () => {
    const location = useLocation(); // Obtiene la ubicación actual
    const menuItems = [
        { name: 'Home', path: '/' },
        { name: 'Reporte inventario', path: '/about' },
        { name: 'Reporte valor de inventario', path: '/services' },
        { name: 'Productos', path: '/productos' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <div className="sidebar">
            <h2>Menu</h2>
            <ul>
                {menuItems.map((item) => (
                    <li
                        key={item.path}
                        className={location.pathname === item.path ? 'active' : ''}
                    >
                        <Link to={item.path}>{item.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;