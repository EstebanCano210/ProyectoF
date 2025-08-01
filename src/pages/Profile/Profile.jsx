// src/pages/Profile/Profile.jsx
import React, { useState } from 'react'
import { useProfile } from '../../shared/hooks/useProfile.jsx'
import { useAuth }    from '../../shared/hooks/useAuth.jsx'

export default function Profile() {
  const {
    form,
    setForm,
    loading,
    saving,
    error,
    success,
    save,
    remove,
    changePicture,
    changeCv,
    changePassword
  } = useProfile()
  const { user } = useAuth()

  const [passwords, setPasswords] = useState({ actual: '', nueva: '' })
  const [pwError, setPwError]     = useState(null)
  const [pwSuccess, setPwSuccess] = useState(null)
  const [formError, setFormError] = useState(null)

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p>Cargando perfil…</p>
      </div>
    )
  }

  const handleSave = async () => {
    setFormError(null)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setFormError('Correo inválido')
      return
    }
    if (!/^\d{8}$/.test(form.phone)) {
      setFormError('El teléfono debe tener exactamente 8 dígitos')
      return
    }
    await save()
  }

  const handlePasswordChange = async () => {
    setPwError(null)
    setPwSuccess(null)
    try {
      await changePassword(passwords)
      setPwSuccess('Contraseña actualizada correctamente')
      setPasswords({ actual: '', nueva: '' })
    } catch (err) {
      setPwError(err.message)
    }
  }

  const handleDownloadCv = async () => {
    try {
      const res = await fetch(user.cvUrl, { mode: 'cors' })
      if (!res.ok) throw new Error('Error al descargar el CV')
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `cv-${user.name}-${user.surname}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('No se pudo descargar el CV')
    }
  }

  // Nueva función de confirmación
  const confirmAndRemove = () => {
    if (
      window.confirm(
        '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.'
      )
    ) {
      remove()
    }
  }

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      <h1 className="my-4">Mi Perfil</h1>

      {(error || formError) && (
        <div className="alert alert-danger">{formError || error}</div>
      )}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card mb-5 shadow-sm">
        <div className="card-body">
          <div className="d-flex align-items-center mb-4">
            <div className="me-4">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Foto perfil"
                  className="rounded-circle"
                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="bg-secondary rounded-circle d-flex justify-content-center align-items-center text-white"
                  style={{ width: 100, height: 100 }}
                >
                  <i className="bi bi-person-fill" style={{ fontSize: 40 }} />
                </div>
              )}
            </div>
            <div>
              <h4 className="mb-1">
                {user.name} {user.surname}
              </h4>
              <small className="text-muted">
                Registrado el{' '}
                {new Date(user.createdAt).toLocaleDateString()}
              </small>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={e =>
                  setForm(f => ({ ...f, email: e.target.value }))
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Teléfono</label>
              <input
                type="text"
                className="form-control"
                value={form.phone}
                onChange={e =>
                  setForm(f => ({ ...f, phone: e.target.value }))
                }
                maxLength={8}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Foto de perfil</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={e => changePicture(e.target.files[0])}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Currículum (PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                className="form-control"
                onChange={e => changeCv(e.target.files[0])}
              />
              {user.cvUrl && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary mt-2"
                  onClick={handleDownloadCv}
                >
                  Descargar CV
                </button>
              )}
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
            <button
              className="btn btn-outline-danger ms-auto"
              onClick={confirmAndRemove}
            >
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>

      <hr />

      <h2 className="my-4">Cambiar Contraseña</h2>
      {pwError && <div className="alert alert-danger">{pwError}</div>}
      {pwSuccess && <div className="alert alert-success">{pwSuccess}</div>}

      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Contraseña Actual</label>
            <input
              type="password"
              className="form-control"
              value={passwords.actual}
              onChange={e =>
                setPasswords(p => ({ ...p, actual: e.target.value }))
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Nueva Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={passwords.nueva}
              onChange={e =>
                setPasswords(p => ({ ...p, nueva: e.target.value }))
              }
            />
          </div>
          <button
            className="btn btn-secondary"
            onClick={handlePasswordChange}
            disabled={!passwords.actual || !passwords.nueva}
          >
            Actualizar Contraseña
          </button>
        </div>
      </div>
    </div>
  )
}
