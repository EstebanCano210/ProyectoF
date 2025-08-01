// src/shared/hooks/useMessages.jsx
import { useState, useEffect } from 'react'
import {
  fetchConversationsSummary,
  fetchConversation,
  sendMessage,
  markNotificationRead
} from '../../services/api.jsx'

export function useMessages() {
  const [inbox, setInbox]       = useState([])
  const [loadingInbox, setLoadingInbox] = useState(true)
  const [errorInbox, setErrorInbox]     = useState(null)

  const [convo, setConvo]       = useState([])
  const [loadingConvo, setLoadingConvo] = useState(false)
  const [errorConvo, setErrorConvo]     = useState(null)

  // Carga la lista de conversaciones (resumen)
  async function loadInbox() {
    setLoadingInbox(true); setErrorInbox(null)
    try {
      const res = await fetchConversationsSummary()
      if (res.error) throw new Error(res.message)
      setInbox(res.data)
    } catch (err) {
      setErrorInbox(err.message)
    } finally {
      setLoadingInbox(false)
    }
  }

  // Carga un hilo de conversación con un contacto
  async function loadConversation(contactId) {
    setLoadingConvo(true); setErrorConvo(null)
    try {
      const res = await fetchConversation(contactId)
      if (res.error) throw new Error(res.message)
      setConvo(res.data)
      // marcar notificaciones como leídas
      await markNotificationRead(contactId)
    } catch (err) {
      setErrorConvo(err.message)
    } finally {
      setLoadingConvo(false)
    }
  }

  // Envía un mensaje al usuario seleccionado
  async function postMessage(toUserId, text) {
    try {
      const res = await sendMessage(toUserId, text)
      if (res.error) throw new Error(res.message)
      // añadir el mensaje al hilo actual
      setConvo(c => [...c, res.data])
      return res.data
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    loadInbox()
  }, [])

  return {
    // Bandeja
    inbox, loadingInbox, errorInbox, loadInbox,
    // Conversación
    convo, loadingConvo, errorConvo, loadConversation,
    // Envío
    postMessage
  }
}
