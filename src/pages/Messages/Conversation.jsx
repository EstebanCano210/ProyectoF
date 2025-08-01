// src/pages/Messages/Conversation.jsx
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {
  fetchConversation,
  sendMessage as apiSendMessage,
  markAsRead
} from '../../services/api.jsx'
import { useAuth } from '../../shared/hooks/useAuth.jsx'

export default function Conversation() {
  const { id: contactId } = useParams()
  const { user }          = useAuth()
  const [msgs, setMsgs]   = useState([])
  const [input, setInput] = useState('')
  const [error, setError] = useState(null)
  const scrollRef         = useRef()

  // Cargar conversación y marcar como leída
  useEffect(() => {
    if (!contactId) return

    const load = async () => {
      try {
        const res = await fetchConversation(contactId)
        if (res.error) throw new Error(res.message)
        setMsgs(res.data)
        await markAsRead(contactId)
      } catch (err) {
        setError(err.message)
      }
    }

    load()
  }, [contactId])

  // Hacer scroll al fondo cada vez que cambian los mensajes
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  const handleSend = async () => {
    if (!input.trim()) return
    try {
      const res = await apiSendMessage(contactId, input)
      if (res.error) throw new Error(res.message)
      setMsgs(prev => [...prev, res.data])
      setInput('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container py-4 d-flex flex-column" style={{ height: '100%' }}>
      <h4 className="mb-3">Chat</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="flex-grow-1 overflow-auto mb-3">
        {msgs.map(m => {
          const isMine = m.from._id === user.id
          return (
            <div
              key={m._id}
              className={`mb-2 p-2 rounded ${isMine
                ? 'bg-primary text-white text-end ms-auto'
                : 'bg-light text-dark me-auto'}`}
              style={{ maxWidth: '75%' }}
            >
              <div className="small text-muted mb-1">
                {isMine ? 'Tú' : m.from.name}
              </div>
              <div>{m.message}</div>
              <div className="small text-muted mt-1">
                {new Date(m.createdAt).toLocaleTimeString()}
              </div>
            </div>
          )
        })}
        <div ref={scrollRef} />
      </div>

      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Escribe un mensaje…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button className="btn btn-primary" onClick={handleSend}>
          Enviar
        </button>
      </div>
    </div>
  )
}
