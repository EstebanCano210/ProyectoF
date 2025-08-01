// src/pages/Employer/JobForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createJob, fetchJob, updateJob } from '../../services/api.jsx';

export default function JobForm() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const isEdit    = Boolean(id);

  const [form, setForm] = useState({
    title:        '',
    description:  '',
    requirements: '',
    location:     '',
    modality:     'presencial',
    type:         'tiempo completo',
    category:     '',
    salary:       0
  });
  const [loading, setLoading] = useState(isEdit); // si edit, esperamos cargar
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);

  // Si es edición, traemos la oferta existente
  useEffect(() => {
    let mounted = true;
    if (isEdit) {
      fetchJob(id)
        .then(res => {
          if (res.error) throw new Error(res.response?.data?.msg || res.message);
          if (!mounted) return;
          const job = res.data;
          setForm({
            title:        job.title,
            description:  job.description,
            requirements: job.requirements || '',
            location:     job.location || '',
            modality:     job.modality,
            type:         job.type,
            category:     job.category || '',
            salary:       job.salary || 0
          });
        })
        .catch(err => setError(err.message))
        .finally(() => mounted && setLoading(false));
    }
    return () => { mounted = false; };
  }, [isEdit, id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === 'salary' ? Number(value) : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim() || !form.description.trim()) {
      setError('Título y descripción son obligatorios');
      return;
    }

    setSaving(true);
    try {
      let res;
      if (isEdit) {
        res = await updateJob(id, form);
      } else {
        res = await createJob(form);
      }
      if (res.error) throw new Error(res.response?.data?.msg || res.message);
      navigate('/employer/jobs');
    } catch (err) {
      console.error('❌ Error guardando oferta:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando datos de la oferta…</p>;

  return (
    <div className="container-fluid">
      <h2 className="mb-4">
        {isEdit ? 'Editar Oferta' : 'Crear Nueva Oferta'}
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Título */}
        <div className="mb-3">
          <label className="form-label">
            Título <span className="text-danger">*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="form-control"
            disabled={saving}
          />
        </div>

        {/* Descripción */}
        <div className="mb-3">
          <label className="form-label">
            Descripción <span className="text-danger">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="form-control"
            rows="5"
            disabled={saving}
          />
        </div>

        {/* Requisitos */}
        <div className="mb-3">
          <label className="form-label">Requisitos</label>
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            className="form-control"
            rows="3"
            disabled={saving}
          />
        </div>

        <div className="row">
          {/* Ubicación */}
          <div className="col-md-4 mb-3">
            <label className="form-label">Ubicación</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="form-control"
              disabled={saving}
            />
          </div>

          {/* Modalidad */}
          <div className="col-md-4 mb-3">
            <label className="form-label">Modalidad</label>
            <select
              name="modality"
              value={form.modality}
              onChange={handleChange}
              className="form-select"
              disabled={saving}
            >
              <option value="presencial">Presencial</option>
              <option value="remoto">Remoto</option>
              <option value="híbrido">Híbrido</option>
            </select>
          </div>

          {/* Tipo de contrato */}
          <div className="col-md-4 mb-3">
            <label className="form-label">Tipo de contrato</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="form-select"
              disabled={saving}
            >
              <option value="tiempo completo">Tiempo completo</option>
              <option value="medio tiempo">Medio tiempo</option>
            </select>
          </div>
        </div>

        <div className="row">
          {/* Categoría */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Categoría</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="form-control"
              disabled={saving}
            />
          </div>

          {/* Salario */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Salario</label>
            <input
              name="salary"
              type="number"
              value={form.salary}
              onChange={handleChange}
              className="form-control"
              disabled={saving}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving
            ? (isEdit ? 'Actualizando…' : 'Creando…')
            : (isEdit ? 'Actualizar Oferta' : 'Crear Oferta')}
        </button>
      </form>
    </div>
  );
}
