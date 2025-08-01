// src/layouts/PublicLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="container my-5">
        <Outlet />
      </main>
    </>
  );
}
