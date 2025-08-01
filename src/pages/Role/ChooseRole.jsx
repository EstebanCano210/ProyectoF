// src/pages/Role/ChooseRole.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth.jsx';
import { definirRol } from '../../services/api.jsx';

export default function ChooseRole() {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  const handleUserRole = async () => {
    // Llamamos al backend para cambiar su rol a USER
    const formData = new FormData();
    formData.append('role', 'USER');
    const res = await definirRol(formData);
    if (res.error) {
      console.error('Error definiendo rol USER:', res);
      return;
    }
    navigate('/jobs');
  };

  const handleEmployer = () => {
    // No tocamos rol aún: vamos al form donde crear o elegir empresa
    navigate('/employer-form');
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <h2 className="mb-4">¿Qué estás buscando?</h2>
      <div className="d-flex gap-3">
        <button
          className="btn btn-outline-primary"
          onClick={handleUserRole}
        >
          Buscando trabajo
        </button>
        <button
          className="btn btn-primary"
          onClick={handleEmployer}
        >
          Soy empleador
        </button>
      </div>
    </div>
  );
}
