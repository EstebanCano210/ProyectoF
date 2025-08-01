// src/pages/Employer/Solicitudes.jsx

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchCompanyApplications,
  updateApplicationStatus,
  sendMessage as apiSendMessage
} from '../../services/api.jsx'
import { toast } from 'react-toastify'

export default function Solicitudes() {
  const [apps, setApps]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [openCvFor, setOpenCvFor] = useState(null)    // quién tiene el CV abierto
  const [replyTo, setReplyTo]     = useState(null)    // id de app a la que respondo
  const [body, setBody]           = useState('')      // contenido del mensaje a enviar
  const navigate                   = useNavigate()

  useEffect(() => {
    let mounted = true
    setLoading(true)

    fetchCompanyApplications()
      .then(res => {
        if (res.error) throw new Error(res.message || 'Error al cargar solicitudes')
        if (mounted) setApps(res.data)
      })
      .catch(err => {
        console.error('❌ fetchCompanyApplications error:', err)
        if (mounted) setError(err.message)
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateApplicationStatus(id, newStatus)
      if (res.error) throw new Error(res.message || 'Error al actualizar estado')
      setApps(apps.map(a => a._id === id ? { ...a, estado: newStatus } : a))
      toast.success(res.data.msg)
    } catch (err) {
      console.error('❌ updateApplicationStatus error:', err)
      toast.error(err.message)
    }
  }

  const startReply = appId => {
    setReplyTo(replyTo === appId ? null : appId)
    setBody('')
  }

  const handleSend = async app => {
    try {
      await apiSendMessage({ to: app.user._id, message: body })
      toast.success('Mensaje enviado')
      setReplyTo(null)
      navigate(`/employer/messages/${app.user._id}`)
    } catch (err) {
      console.error('❌ sendMessage error:', err)
      toast.error('No se pudo enviar el mensaje')
    }
  }

  if (loading) return <p className="text-center my-5">Cargando solicitudes…</p>
  if (error)   return <div className="alert alert-danger my-5 text-center">{error}</div>
  if (apps.length === 0) return <p className="text-center my-5">No hay solicitudes a tus ofertas.</p>

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Solicitudes Recibidas</h2>
      <div className="row g-4">
        {apps.map(app => (
          <div key={app._id} className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">

                {/* Título y estado */}
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title mb-1">{app.job.title}</h5>
                    <p className="mb-1">
                      <strong>Postulante:</strong> {app.user.name} {app.user.surname}
                    </p>
                  </div>
                  <span
                    className={`badge text-capitalize ${
                      app.estado === 'pendiente' ? 'bg-warning text-dark' :
                      app.estado === 'aceptado'  ? 'bg-success' :
                      'bg-danger'
                    }`}
                  >
                    {app.estado}
                  </span>
                </div>

                {/* Mensaje del postulante */}
                <p className="mb-3">
                  <strong>Mensaje:</strong> {app.message}
                </p>

                {/* Botones Ver CV */}
                {app.user.cvUrl && (
                  <div className="mb-3">
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() =>
                        setOpenCvFor(openCvFor === app._id ? null : app._id)
                      }
                    >
                      {openCvFor === app._id ? 'Ocultar CV' : 'Ver CV'}
                    </button>
                  </div>
                )}

                {/* Iframe embebido */}
                {openCvFor === app._id && (
                  <div className="mb-3" style={{ height: 400 }}>
                    <iframe
                      src={app.user.cvUrl}
                      title={`CV-${app.user.name}-${app.user.surname}`}
                      width="100%"
                      height="100%"
                      style={{ border: '1px solid #ddd' }}
                    />
                  </div>
                )}

                {/* Iniciar / redactar mensaje */}
                <div className="mb-3">
                  <button
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={() => startReply(app._id)}
                  >
                    {replyTo === app._id ? 'Cancelar' : 'Enviar mensaje'}
                  </button>
                </div>

                {replyTo === app._id && (
                  <div className="mb-3">
                    <textarea
                      className="form-control mb-2"
                      rows="3"
                      placeholder={`Escribe tu mensaje a ${app.user.name}...`}
                      value={body}
                      onChange={e => setBody(e.target.value)}
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={!body.trim()}
                      onClick={() => handleSend(app)}
                    >
                      Enviar
                    </button>
                  </div>
                )}

                {/* Aceptar / rechazar */}
                {app.estado === 'pendiente' && (
                  <div className="mb-3">
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleStatusChange(app._id, 'aceptado')}
                    >
                      Aceptar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleStatusChange(app._id, 'rechazado')}
                    >
                      Rechazar
                    </button>
                  </div>
                )}

                {/* Fecha */}
                <small className="text-muted">
                  Fecha de solicitud: {new Date(app.createdAt).toLocaleDateString()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
