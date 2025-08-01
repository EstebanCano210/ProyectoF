// src/pages/About.jsx
import React from 'react';

export default function About() {
  return (
    <div className="bg-light py-5">
      <div className="container">

        {/* Encabezado */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">Quiénes Somos</h1>
          <p className="lead text-muted">
            Emplea Ya es una iniciativa guatemalteca creada por jóvenes desarrolladores
            para ayudar a otros jóvenes sin experiencia a encontrar su primer empleo.
          </p>
        </div>

        {/* Propósito */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="h4 mb-3">Nuestro Propósito</h2>
                <p className="text-muted">
                  Sabemos que los jóvenes guatemaltecos enfrentan muchas barreras para
                  ingresar al mercado laboral: falta de contactos, ausencia de experiencia
                  y conocimiento de oportunidades.
                </p>
                <p className="text-muted">
                  En Emplea Ya conectamos talento emergente con empresas que buscan
                  frescura, energía y nuevas ideas. A través de una plataforma
                  sencilla e intuitiva:
                </p>
                <div className="row text-center">
                  {[
                    "Publicación gratuita de vacantes",
                    "Perfiles de candidatos con CV digital",
                    "Mensajería interna para entrevistas rápidas",
                    "Notificaciones en tiempo real"
                  ].map((item, i) => (
                    <div key={i} className="col-md-6 mb-3">
                      <div className="d-flex align-items-start">
                        <span className="badge bg-primary rounded-pill me-3">{i + 1}</span>
                        <p className="mb-0 text-start">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Equipo */}
        <div className="row text-center mb-4">
          {[
            { name: "Esteban Cano", role: "Full Stack Dev" },
            { name: "Adrián Arbizu", role: "Front End Dev" },
            { name: "Jonathan García", role: "Back End Dev" },
            { name: "Christian Medrano", role: "Back End Dev" },
            { name: "Carlos Priego", role: "Back End Dev" }
          ].map((member, i) => (
            <div key={i} className="col-sm-6 col-lg-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src={`https://via.placeholder.com/150?text=${member.name.split(' ')[0]}`}
                  className="card-img-top rounded-circle mx-auto mt-4"
                  alt={member.name}
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title mb-1">{member.name}</h5>
                  <p className="card-text text-muted">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-4">
          <a href="/" className="btn btn-primary me-2">Inicio</a>
          <a href="/jobs" className="btn btn-outline-primary">Ver Ofertas</a>
        </div>

      </div>
    </div>
  );
}
