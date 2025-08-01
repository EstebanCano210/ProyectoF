// src/pages/Messages/Inbox.jsx
import React, { useEffect, useState } from 'react'
import { fetchConversationsSummary } from '../../services/api.jsx'
import { useNavigate } from 'react-router-dom'

export default function Inbox() {
  const [convos, setConvos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchConversationsSummary()
      .then(res => {
        if (res.error) throw new Error(res.message)
        setConvos(res.data)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Cargando conversaciones…</p>
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!convos.length) return <p>No tienes conversaciones aún.</p>

  return (
    <div className="list-group">
      {convos.map(c => (
        <button
          key={c.contactId}
          className="list-group-item list-group-item-action d-flex align-items-center"
          onClick={() => navigate(`/messages/${c.contactId}`)}
        >
          <img
            src={c.profilePicture || '/placeholder.png'}
            alt=""
            className="rounded-circle me-3"
            style={{ width: 40, height: 40, objectFit: 'cover' }}
          />
          <div className="flex-grow-1">
            <strong>{c.name}</strong>
            <div className="small text-truncate">{c.lastMessage}</div>
          </div>
          {c.read === false && <span className="badge bg-primary">Nuevo</span>}
        </button>
      ))}
    </div>
  )
}
