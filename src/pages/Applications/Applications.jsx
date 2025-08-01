// src/pages/Applications/Applications.jsx
import React, { useState, useEffect } from 'react'
import { useApplications } from '../../shared/hooks/useApplications.jsx'
import { Link } from 'react-router-dom'

export default function Applications() {
  const { loadMyApplications, loading, error } = useApplications()
  const [applications, setApplications] = useState([])

  useEffect(() => {
    let mounted = true
    loadMyApplications().then(list => {
      if (mounted) setApplications(list)
    })
    return () => { mounted = false }
  }, [loadMyApplications])

  // Función auxiliar para determinar texto y clase del badge
  const renderBadge = estado => {
    switch (estado) {
      case 'aceptado':
      case true:     // compatibilidad si antes usabas booleanos
        return { text: 'Aceptada',  className: 'badge bg-success' }
      case 'rechazado':
        return { text: 'Rechazada', className: 'badge bg-danger' }
      default:
        return { text: 'Pendiente', className: 'badge bg-warning text-dark' }
    }
  }

  return (
    <div className="container">
      <h1 className="my-4">Mis Solicitudes</h1>

      {loading && <p>Cargando solicitudes…</p>}
      {error   && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && applications.length === 0 && (
        <p>No tienes solicitudes realizadas.</p>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="list-group">
          {applications.map(app => {
            const { text, className } = renderBadge(app.estado)

            return (
              <div
                key={app._id}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
              >
                <div>
                  <h5 className="mb-1">
                    {app.job?.title || 'Título no disponible'}
                  </h5>
                  <p className="mb-1 text-muted">
                    {app.job?.company?.name || 'Empresa no disponible'}
                  </p>
                  <small className="text-secondary">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </small>
                </div>

                <div className="text-end">
                  <span className={className}>{text}</span>{' '}
                  <Link
                    to={`/jobs/${app.job?._id}`}
                    className="btn btn-sm btn-outline-primary ms-2"
                    disabled={text !== 'Pendiente'}
                  >
                    Ver oferta
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
