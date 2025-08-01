// src/pages/Company/CompanyForm.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../shared/hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import { fetchCompanies, definirRol } from '../../services/api.jsx';

export default function CompanyForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [newData, setNewData] = useState({
    name: '',
    industry: '',
    location: '',
    description: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return navigate('/login');
    fetchCompanies().then(res => {
      if (!res.error) setCompanies(res.data);
    });
  }, [user]);

  const handleChangeNew = e => {
    setNewData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    const fd = new FormData();
    fd.append('role', 'ADMIN_COMPANY');

    if (selectedId) {
      // seleccionó empresa existente
      fd.append('companyId', selectedId);
    } else {
      // crea la nueva
      const { name, industry, location, description } = newData;
      if (!name || !industry) {
        return setError('Name e industry son obligatorios');
      }
      fd.append('nuevaEmpresa', JSON.stringify({ name, industry, location, description }));
      // opcionalmente append logo: fd.append('logo', file)
    }

    const res = await definirRol(fd);
    if (res.error) {
      setError(res.response?.data?.msg || 'Error al definir rol y/o crear empresa');
    } else {
      navigate('/employer/dashboard');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Elige o crea tu empresa</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Seleccionar empresa existente</label>
          <select
            className="form-select"
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
          >
            <option value="">-- ninguna --</option>
            {companies.map(c => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <hr />

        <p>O crea una nueva:</p>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            name="name"
            className="form-control"
            value={newData.name}
            onChange={handleChangeNew}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Industry</label>
          <input
            name="industry"
            className="form-control"
            value={newData.industry}
            onChange={handleChangeNew}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            name="location"
            className="form-control"
            value={newData.location}
            onChange={handleChangeNew}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={newData.description}
            onChange={handleChangeNew}
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Continuar
        </button>
      </form>
    </div>
  );
}
