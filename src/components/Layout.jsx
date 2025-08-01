// src/components/Layout.jsx
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth.jsx';
import Sidebar from './Sidebar.jsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar solo si está logueado */}
      {user && <Sidebar />}

      <div className="flex-fill d-flex flex-column">
        {/* Barra superior */}
        <nav className="navbar navbar-light bg-white border-bottom px-4">
          <div className="container-fluid">
            {!user ? (
              <>
                {/* Logo y enlaces cuando NO está logueado */}
                <Link to="/" className="navbar-brand fw-bold">
                  Emplea Ya
                </Link>
                <div>
                  <Link to="/login" className="btn btn-outline-primary me-2">
                    Iniciar Sesión
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Registrarse
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Si está logueado, solo botón de cerrar sesión */}
                <button
                  className="btn btn-outline-danger ms-auto"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Contenedor principal para las páginas */}
        <main className="p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
