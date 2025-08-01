// src/pages/Job/JobDetails.jsx
import React, { useState, useEffect } from 'react'
import { fetchJob, applyToJob } from '../../services/api.jsx'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../shared/hooks/useAuth.jsx'

export default function JobDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  
  const [job, setJob] = useState(null)
  const [loadingJob, setLoadingJob] = useState(true)
  const [errorJob, setErrorJob] = useState(null)

  const [message, setMessage] = useState('')
  const [applying, setApplying] = useState(false)
  const [applyError, setApplyError] = useState(null)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    const loadJob = async () => {
      setLoadingJob(true)
      try {
        const res = await fetchJob(id)
        if (res.error) throw new Error(res.message || 'No se encontró la oferta')
        setJob(res.data)
      } catch (err) {
        setErrorJob(err.message)
      } finally {
        setLoadingJob(false)
      }
    }
    loadJob()
  }, [id])

  const handleApply = async () => {
    if (!message.trim()) {
      setApplyError('Debes escribir un mensaje para el empleador.')
      return
    }
    setApplying(true)
    setApplyError(null)
    try {
      const res = await applyToJob(id, { message })
      if (res.error) {
        const msg = res.response?.data?.msg || res.message || 'Error al aplicar'
        throw new Error(msg)
      }
      setApplied(true)
    } catch (err) {
      setApplyError(err.message)
    } finally {
      setApplying(false)
    }
  }

  if (loadingJob) return <p className="text-center py-5">Cargando oferta…</p>
  if (errorJob) return <div className="alert alert-danger my-5 text-center">{errorJob}</div>
  if (!job) return null

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="card-title mb-2">{job.title}</h1>
          <h6 className="text-muted mb-4">{job.company?.name}</h6>

          <h5>Descripción</h5>
          <p className="mb-4">{job.description}</p>

          {user ? (
            applied ? (
              <div className="alert alert-success">
                ¡Te has postulado correctamente!
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label htmlFor="applicationMessage" className="form-label">
                    Mensaje para el empleador
                  </label>
                  <textarea
                    id="applicationMessage"
                    className="form-control"
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Escribe aquí por qué eres el candidato ideal…"
                    disabled={applying}
                  />
                </div>
                {applyError && (
                  <div className="alert alert-danger">{applyError}</div>
                )}
                <button
                  className="btn btn-success"
                  onClick={handleApply}
                  disabled={applying}
                >
                  {applying ? 'Aplicando…' : 'Enviar postulación'}
                </button>
              </>
            )
          ) : (
            <p className="mt-4">
              Necesitas <a href="/login">iniciar sesión</a> para postularte.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
