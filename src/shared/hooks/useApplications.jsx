// src/shared/hooks/useApplications.jsx
import { useState, useCallback } from 'react'
import {
  applyToJob as apiApplyToJob,
  fetchApplications as apiFetchApplications
} from '../../services/api.jsx'

export function useApplications() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  /**
   * Aplica a un empleo.
   * @param {{ job: string, message?: string, cvUrl?: File }} data
   * @returns {object|null} la aplicación creada, o null en error
   */
  const apply = async data => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiApplyToJob(data)
      if (res.error || res.status !== 201) {
        throw new Error(res.response?.data?.msg || 'Error al aplicar al empleo')
      }
      return res.data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  /**
   * Carga las solicitudes hechas por el usuario autenticado.
   * @returns {Array} lista de aplicaciones
   */
  const loadMyApplications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetchApplications()
      if (res.error || res.status !== 200) {
        throw new Error(res.response?.data?.msg || 'Error cargando tus solicitudes')
      }
      // res.data es un arreglo de aplicaciones con job, estado, createdAt, etc.
      return res.data
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    apply,
    loadMyApplications,
    loading,
    error
  }
}
