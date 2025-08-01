// src/pages/Employer/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { fetchMyJobs } from '../../services/api.jsx'
import { Link } from 'react-router-dom'

export default function EmployerDashboard() {
  const [jobs, setJobs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchMyJobs()
      .then(res => {
        if (res.error) throw new Error(res.response?.data?.msg || res.message)
        if (mounted) setJobs(res.data)
      })
      .catch(err => {
        console.error(err)
        if (mounted) setError(err.message)
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  return (
    <div className="container">
      <h1 className="my-4">Mis Ofertas Publicadas</h1>
      {loading && <p>Cargando…</p>}
      {error   && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && jobs.length === 0 && (
        <p>No tienes ofertas publicadas. <Link to="/jobs/new">Crear una nueva</Link></p>
      )}
      <div className="row g-4">
        {jobs.map(job => (
          <div key={job._id} className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text">{job.description?.substring(0,100)}…</p>
                <Link to={`/jobs/${job._id}/edit`} className="btn btn-sm btn-primary">
                  Editar
                </Link>
              </div>
              <div className="card-footer text-muted">
                {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
