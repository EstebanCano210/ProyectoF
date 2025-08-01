// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth.jsx';

// (Opcional) import de íconos de Bootstrap Icons
import { HouseFill, ChatDotsFill, ClipboardFill, PersonFill, BriefcaseFill, EnvelopeFill, BuildingFill } from 'react-bootstrap-icons';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const baseItems = [
    { to: '/jobs',         label: 'Inicio',       icon: <HouseFill className="me-2" /> },
    { to: '/messages',         label: 'Mensajes',     icon: <ChatDotsFill className="me-2" /> },
    { to: '/applications', label: 'Mis solicitudes', icon: <ClipboardFill className="me-2" /> },
    { to: '/profile',      label: 'Perfil',       icon: <PersonFill className="me-2" /> },
  ];

  const employerItems = [
    { to: '/employer/jobs',       label: 'Mis Ofertas',       icon: <BriefcaseFill className="me-2" /> },
    { to: '/employer/messages',   label: 'Mensajes',  icon: <EnvelopeFill className="me-2" /> },
    { to: '/employer/solicitudes',label: 'Solicitudes',icon: <ClipboardFill className="me-2" /> },
    { to: '/employer/company',    label: 'Empresa',           icon: <BuildingFill className="me-2" /> },
    { to: '/profile',      label: 'Perfil',       icon: <PersonFill className="me-2" /> },
  ];

  const role = user?.role?.toString().toLowerCase();
  const items = role === 'admin_company' ? employerItems : baseItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="d-flex flex-column bg-white shadow-sm" style={{ width: 240, minHeight: '100vh' }}>
      {/* Logo */}
      <div className="p-4 text-center border-bottom">
        <img
          src="/src/assets/img/Emplea Ya logo2.png" // Ajusta a tu logo
          alt="Emplea Ya"
          className="img-fluid"
          style={{ maxHeight: 50 }}
        />
      </div>

      {/* Navegación */}
      <nav className="flex-grow-1">
        <ul className="nav nav-pills flex-column mt-3 px-2">
          {items.map(({ to, label, icon }) => (
            <li className="nav-item mb-1" key={to}>
              <NavLink
                to={to}
                className="nav-link d-flex align-items-center rounded"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#e7f1ff' : undefined,
                  color: isActive ? '#0d6efd' : '#495057'
                })}
              >
                {icon}
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      {user && (
        <div className="p-3 border-top">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
