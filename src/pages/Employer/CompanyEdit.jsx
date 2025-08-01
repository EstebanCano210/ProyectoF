// src/pages/Employer/CompanyEdit.jsx
import React, { useEffect, useState } from 'react';
import { fetchCompany, updateCompany } from '../../services/api.jsx';
import { useAuth } from '../../shared/hooks/useAuth.jsx';

export default function CompanyEdit() {
  const { user, setUser } = useAuth();
  const [data, setData]   = useState({
    name: '',
    industry: '',
    location: '',
    description: '',
    logoUrl: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [error,   setError]     = useState(null);

  useEffect(() => {
    if (!user.company) return;
    fetchCompany(user.company)
      .then(res => {
        if (res.error) throw new Error(res.response?.data?.msg || res.message);
        setData({
          name:        res.data.name || '',
          industry:    res.data.industry || '',
          location:    res.data.location || '',
          description: res.data.description || '',
          logoUrl:     res.data.logoUrl || ''
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.company]);

  const handleChange = e => {
    const { name, value } = e.target;
    setData(d => ({ ...d, [name]: value }));
  };

  const handleFile = e => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setData(d => ({ ...d, logoUrl: URL.createObjectURL(file) }));
    }
  };

  const handleSave = async () => {
    setError(null);
    if (!data.name.trim() || !data.industry.trim()) {
      setError('Nombre e industria son obligatorios');
      return;
    }

    setSaving(true);
    try {
      let payload;
      if (logoFile) {
        payload = new FormData();
        ['name', 'industry', 'location', 'description'].forEach(key =>
          payload.append(key, data[key])
        );
        payload.append('logo', logoFile);
      } else {
        payload = {
          name:        data.name,
          industry:    data.industry,
          location:    data.location,
          description: data.description
        };
      }

      const res = await updateCompany(user.company, payload);
      if (res.error) throw new Error(res.response?.data?.msg || res.message);

      setUser(u => ({
        ...u,
        company: res.data._id
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando datos de la empresa…</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h3 className="mb-0">Editar Empresa</h3>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row">
            <div className="col-lg-4 text-center mb-4">
              <div className="border rounded p-3 d-inline-block">
                {data.logoUrl
                  ? <img
                      src={data.logoUrl}
                      alt="Logo Empresa"
                      className="img-fluid rounded"
                      style={{ maxHeight: 150 }}
                    />
                  : <div className="text-muted">Sin logo</div>
                }
              </div>
              <div className="mt-3">
                <label className="btn btn-outline-secondary btn-sm">
                  Cambiar logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    hidden
                    disabled={saving}
                  />
                </label>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="mb-3">
                <label className="form-label">Nombre <span className="text-danger">*</span></label>
                <input
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  className="form-control"
                  disabled={saving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Industria <span className="text-danger">*</span></label>
                <input
                  name="industry"
                  value={data.industry}
                  onChange={handleChange}
                  className="form-control"
                  disabled={saving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Ubicación</label>
                <input
                  name="location"
                  value={data.location}
                  onChange={handleChange}
                  className="form-control"
                  disabled={saving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  disabled={saving}
                />
              </div>

              <div className="text-end">
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Guardando…' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
