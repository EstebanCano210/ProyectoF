// src/routes.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import PublicLayout   from './layouts/PublicLayout.jsx'
import AppLayout      from './layouts/AppLayout.jsx'

// Pages público
import Home           from './pages/Home/Home.jsx'
import Login          from './pages/Login/Login.jsx'
import Register       from './pages/Register/Register.jsx'
import ChooseRole     from './pages/Role/ChooseRole.jsx'
import CompanyForm    from './pages/Company/CompanyForm.jsx'

// Pages usuario
import Jobs           from './pages/Job/Jobs.jsx'
import JobDetails     from './pages/Job/JobDetails.jsx'
import Applications   from './pages/Applications/Applications.jsx'
import Profile        from './pages/Profile/Profile.jsx'

// Mensajería compartida
import Inbox          from './pages/Messages/Inbox.jsx'
import Conversation   from './pages/Messages/Conversation.jsx'

// Pages empleador
import EmployerLayout from './pages/Employer/EmployerLayout.jsx'
import JobsPublished  from './pages/Employer/JobsPublished.jsx'
import JobForm        from './pages/Employer/JobForm.jsx'
import Solicitudes    from './pages/Employer/Solicitudes.jsx'
import CompanyEdit    from './pages/Employer/CompanyEdit.jsx'

export default function Router() {
  return (
    <Routes>
      {/* 1) PÚBLICO */}
      <Route element={<PublicLayout />}>
        <Route path="/"                element={<Home />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/choose-role"     element={<ChooseRole />} />
        <Route path="/employer-form"   element={<CompanyForm />} />
      </Route>

      {/* 2) PRIVADO (USUARIO) */}
      <Route element={<AppLayout />}>
        {/* Buscador de empleos */}
        <Route path="/jobs"            element={<Jobs />} />
        <Route path="/jobs/:id"        element={<JobDetails />} />

        {/* Mis aplicaciones */}
        <Route path="/applications"    element={<Applications />} />

        {/* Perfil personal */}
        <Route path="/profile"         element={<Profile />} />

        {/* Mensajería usuario */}
        <Route path="/messages"            element={<Inbox />} />
        <Route path="/messages/:id" element={<Conversation />} />

        {/* 3) SECCIÓN EMPLEADOR */}
        <Route path="/employer" element={<EmployerLayout />}>
          {/* Ofertas publicadas */}
          <Route index                  element={<JobsPublished />} />
          <Route path="jobs"            element={<JobsPublished />} />
          <Route path="jobs/new"        element={<JobForm />} />
          <Route path="jobs/:id/edit"   element={<JobForm />} />

          {/* Mensajería empleador */}
          <Route path="messages"          element={<Inbox />} />
          <Route path="messages/:id" element={<Conversation />} />

          {/* Solicitudes a mis ofertas */}
          <Route path="solicitudes"     element={<Solicitudes />} />

          {/* Datos de la empresa */}
          <Route path="company"         element={<CompanyEdit />} />
        </Route>
      </Route>

      {/* 4) CATCH-ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
