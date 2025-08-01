// src/pages/Login/Login.jsx
import { useState } from 'react';
import { useAuth } from '../../shared/hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(form);
    setLoading(false);

    if (res.error || res.status !== 200) {
      const msg =
        res.response?.data?.msg ||
        res.data?.msg ||
        'Credenciales inválidas';
      setError(msg);
    } else {
      // Desestructura el usuario correctamente:
      const usuario = res.data.usuario || res.data.user;
      const role = usuario.role;

      // Redirige según el role
      if (role === 'ADMIN_COMPANY') {
        navigate('/employer');
      } else {
        navigate('/jobs');
      }
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-sm w-100" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo</label>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                className="form-control"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-100 ${loading ? 'disabled' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Ingresando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="text-center mt-3">
            <span>¿No tienes cuenta?</span>{' '}
            <button
              onClick={() => navigate('/register')}
              className="btn btn-link p-0"
            >
              Regístrate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
