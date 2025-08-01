// src/pages/Employer/EmployerLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function EmployerLayout() {
  return (
    <div className="d-flex vh-100">
      {/* NO montamos Sidebar aquí: AppLayout ya lo hizo */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Si quieres, puedes reutilizar Navbar o dejarlo solo en AppLayout */}
        <Outlet />
      </div>
    </div>
  );
}
