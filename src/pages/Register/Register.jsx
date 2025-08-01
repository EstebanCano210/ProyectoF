// src/pages/Register/Register.jsx
import { useState } from 'react';
import { useAuth } from '../../shared/hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await register(form);
    setLoading(false);

    if (res.error || res.status !== 201) {
      setError(res.response?.data?.msg || res.data?.msg || 'Error al registrar');
    } else {
      // Ya estás registrado y logueado automáticamente
      navigate('/choose-role');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Crea tu cuenta</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="surname">Apellido</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={form.surname}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="username">Usuario</label>
              <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="email">Correo</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-control"
                required
                minLength={8}
              />
            </div>

            <div className="mb-4">
              <label className="form-label" htmlFor="phone">Teléfono</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="form-control"
                required
                minLength={8}
                maxLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn btn-success w-100 ${loading ? 'disabled' : ''}`}
            >
              {loading
                ? <span className="spinner-border spinner-border-sm me-2" role="status" />
                : 'Registrarse'
              }
            </button>
          </form>

          <div className="text-center mt-3">
            <span>¿Ya tienes cuenta?</span>{' '}
            <button
              className="btn btn-link p-0"
              onClick={() => navigate('/login')}
            >
              Inicia sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
