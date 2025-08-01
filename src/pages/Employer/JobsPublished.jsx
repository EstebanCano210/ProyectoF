// src/pages/Employer/JobsPublished.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyJobs, deleteJob } from '../../services/api.jsx'
import { toast } from 'react-toastify'

export default function JobsPublished() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    fetchMyJobs()
      .then(res => {
        if (res.error) {
          throw new Error(res.response?.data?.msg || res.message || 'Error al cargar ofertas')
        }
        // Tu API puede devolver data.results o data directamente
        const arr = Array.isArray(res.data.results)
          ? res.data.results
          : Array.isArray(res.data)
          ? res.data
          : []
        if (mounted) setJobs(arr)
      })
      .catch(err => {
        console.error('❌ fetchMyJobs error:', err)
        if (mounted) setError(err.message)
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta oferta?')) {
      return
    }
    try {
      const res = await deleteJob(id)
      if (res.error) {
        throw new Error(res.response?.data?.msg || res.message || 'Error al eliminar')
      }
      toast.success(res.msg || 'Oferta eliminada correctamente')
      setJobs(jobs.filter(job => (job._id || job.id) !== id))
    } catch (err) {
      console.error('❌ deleteJob error:', err)
      toast.error(err.response?.data?.msg || err.message || 'No se pudo eliminar')
    }
  }

  if (loading) {
    return <p className="text-center my-5">Cargando ofertas publicadas…</p>
  }

  if (error) {
    return <div className="alert alert-danger my-5 text-center">Error: {error}</div>
  }

  if (jobs.length === 0) {
    return (
      <div className="alert alert-info my-5 text-center">
        No tienes ofertas publicadas.{' '}
        <Link to="/employer/jobs/new" className="btn btn-primary btn-sm ms-2">
          + Crear una nueva
        </Link>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Mis Ofertas Publicadas</h2>
        <Link to="/employer/jobs/new" className="btn btn-primary">
          + Crear Oferta
        </Link>
      </div>

      <div className="row row-cols-1 row-cols-md-2 g-4">
        {jobs.map(job => {
          const jobId = job._id || job.id
          return (
            <div key={jobId} className="col">
              <div className="card h-100 shadow-sm rounded">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{job.title}</h5>

                  {/* Badges de modalidad y tipo (si las tienes) */}
                  {job.modality && (
                    <span className="badge bg-info text-dark me-1 text-capitalize">
                      {job.modality}
                    </span>
                  )}
                  {job.type && (
                    <span className="badge bg-info text-dark text-capitalize">
                      {job.type}
                    </span>
                  )}

                  <p className="card-text mt-2">{job.description}</p>

                  {job.requirements && (
                    <p className="card-text">
                      <strong>Requisitos:</strong> {job.requirements}
                    </p>
                  )}
                  {job.category && (
                    <p className="card-text">
                      <strong>Categoría:</strong> {job.category}
                    </p>
                  )}
                  <p className="card-text">
                    <strong>Salario:</strong>{' '}
                    {job.salary ? `$${job.salary}` : 'No especificado'}
                  </p>
                  <p className="card-text">
                    <strong>Ubicación:</strong> {job.location || 'No especificada'}
                  </p>

                  <div className="mt-auto">
                    <small className="text-muted">
                      Publicado el {new Date(job.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>

                <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center">
                  <Link
                    to={`/employer/jobs/${jobId}/edit`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Editar
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(jobId)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
