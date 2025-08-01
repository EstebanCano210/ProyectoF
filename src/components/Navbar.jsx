// src/components/Navbar.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../shared/hooks/useAuth.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Si el usuario está logueado, no renderizamos este navbar:
  if (user) return null

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{ backgroundColor: '#F5F7FA', borderBottom: '1px solid #E9EFF5' }}
    >
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold text-primary" to="/">
          Emplea Ya
        </Link>

        {/* Toggler para móvil */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="ms-auto d-flex align-items-center">
            <Link
              to="/login"
              className="btn btn-outline-primary me-2"
              style={{ borderColor: '#5282A5', color: '#5282A5' }}
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="btn btn-primary"
              style={{ backgroundColor: '#5282A5', borderColor: '#5282A5' }}
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
