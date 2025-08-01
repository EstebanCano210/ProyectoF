// src/layouts/AppLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function AppLayout() {
  return (
    <div className="d-flex vh-100">
      <Sidebar />            {/* Sidebar “user” o “employer” según el rol */}
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <div className="p-4 flex-fill overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
