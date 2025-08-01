// src/pages/Job/Jobs.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../shared/hooks/useAuth.jsx';
import { fetchJobs, fetchMyJobs } from '../../services/api.jsx';
import { Link } from 'react-router-dom';

export default function Jobs() {
  const { user } = useAuth();
  const [allJobs, setAllJobs] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    // Si es empresa, cargamos solo sus propias ofertas
    const loader = user?.role === 'ADMIN_COMPANY' ? fetchMyJobs : fetchJobs;
    const params = user?.role === 'ADMIN_COMPANY' ? undefined : { t: Date.now() };

    loader(params)
      .then(res => {
        if (res.error) {
          throw new Error(res.response?.data?.msg || 'Error cargando ofertas');
        }
        // extraemos el array de resultados
        const arr = Array.isArray(res.data.results)
          ? res.data.results
          : Array.isArray(res.data)
          ? res.data
          : [];
        if (mounted) setAllJobs(arr);
      })
      .catch(err => {
        console.error(err);
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [user]);

  // Para empresas no aplicamos filtro local
  const filteredJobs = user?.role === 'ADMIN_COMPANY'
    ? allJobs
    : allJobs.filter(job => {
        const term = filter.toLowerCase();
        return (
          job.title.toLowerCase().includes(term) ||
          (job.description || '').toLowerCase().includes(term) ||
          (job.company?.name || '').toLowerCase().includes(term)
        );
      });

  return (
    <div className="container">
      <h1 className="my-4">
        {user?.role === 'ADMIN_COMPANY'
          ? 'Mis Ofertas Publicadas'
          : 'Ofertas de Empleo'}
      </h1>

      {user?.role !== 'ADMIN_COMPANY' && (
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por palabra clave..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      )}

      {loading && <p>Cargando ofertas…</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && filteredJobs.length === 0 && (
        <p>
          {user?.role === 'ADMIN_COMPANY'
            ? 'No tienes ofertas publicadas.'
            : 'No hay ofertas que coincidan.'}
        </p>
      )}

      {!loading && !error && filteredJobs.length > 0 && (
        <div className="row g-4">
          {filteredJobs.map(job => (
            <div key={job._id || job.id} className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {job.company?.name}
                  </h6>
                  <p className="card-text">
                    {job.description?.substring(0, 100)}…
                  </p>
                  <Link
                    to={`/jobs/${job._id || job.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Ver detalles
                  </Link>
                </div>
                <div className="card-footer text-muted">
                  {new Date(job.createdAt || job.postedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
