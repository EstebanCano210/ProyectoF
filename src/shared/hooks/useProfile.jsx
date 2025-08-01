// src/shared/hooks/useProfile.jsx
import { useState, useEffect } from 'react'
import {
  fetchProfile,
  updateProfile,
  deleteCurrentUser,
  updateProfilePictureMe,
  uploadCvMe,
  changePassword
} from '../../services/api.jsx'
import { useAuth } from './useAuth.jsx'

export function useProfile() {
  const { user, setUser, logout } = useAuth()  // observa que traemos el user actual
  const [form, setForm]       = useState({ name:'', surname:'', phone:'', email:'' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState(null)
  const [success, setSuccess] = useState(null)

  // Al montar, cargo perfil
  useEffect(() => {
    let mounted = true
    fetchProfile()
      .then(res => {
        if (res.error) {
          if (mounted) setError(res.msg)
        } else if (mounted) {
          const u = res.data
          setForm({
            name:    u.name,
            surname: u.surname,
            phone:   u.phone   || '',
            email:   u.email   || ''
          })
          // **¡Conservamos el token!**
          setUser(prev => ({ ...prev, ...u }))
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [setUser])

  // Guardar cambios de perfil
  const save = async () => {
    setSaving(true); setError(null); setSuccess(null)
    const res = await updateProfile(form)
    if (res.error) {
      setError(res.msg)
    } else {
      setSuccess('Perfil actualizado')
      // aquí también mantenemos el token
      setUser(prev => ({ ...prev, ...form }))
    }
    setSaving(false)
  }

  // Eliminar cuenta
  const remove = async () => {
    setError(null)
    const res = await deleteCurrentUser()
    if (res.error) {
      setError(res.msg)
    } else {
      logout()
    }
  }

  // Cambiar foto
  const changePicture = async file => {
    setError(null); setSuccess(null)
    const fd = new FormData()
    fd.append('imagen', file)
    const res = await updateProfilePictureMe(fd)
    if (res.error) {
      setError(res.msg || res.error)
    } else {
      // la API devuelve { profilePicture }
      setUser(prev => ({ ...prev, profilePicture: res.data.profilePicture }))
      setSuccess('Foto de perfil actualizada')
    }
  }

  // Subir CV
  const changeCv = async file => {
    setError(null); setSuccess(null)
    const fd = new FormData()
    fd.append('cv', file)
    const res = await uploadCvMe(fd)
    if (res.error) {
      setError(res.msg || res.error)
    } else {
      setUser(prev => ({ ...prev, cvUrl: res.data.cvUrl }))
      setSuccess('CV subido correctamente')
    }
  }

  // Cambiar contraseña
  const changePasswordCurrent = async ({ actual, nueva }) => {
    setError(null); setSuccess(null)
    const res = await changePassword({ actual, nueva })
    if (res.error) {
      setError(res.msg || res.error)
    } else {
      setSuccess('Contraseña actualizada correctamente')
    }
  }

  return {
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
    changePassword: changePasswordCurrent
  }
}
