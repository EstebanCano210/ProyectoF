// src/pages/Employer/Messages.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchConversationsSummary,
  fetchUnreadCount
} from '../../services/api.jsx';
import { Badge } from 'react-bootstrap';

export default function Messages() {
  const [convos,   setConvos]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [unread,   setUnread]   = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    Promise.all([
      fetchConversationsSummary(),
      fetchUnreadCount()
    ])
      .then(([sumRes, unreadRes]) => {
        if (sumRes.error) throw new Error(sumRes.message);
        if (unreadRes.error) throw new Error(unreadRes.message);
        if (mounted) {
          setConvos(sumRes.data);
          setUnread(unreadRes.data);
        }
      })
      .catch(err => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  if (loading) return <p>Cargando conversaciones…</p>;
  if (error)   return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Mensajes</h2>
        {unread > 0 && <Badge bg="danger">{unread}</Badge>}
      </div>

      {convos.length === 0 && <p>No tienes conversaciones iniciadas.</p>}

      <div className="list-group">
        {convos.map(c => (
          <button
            key={c.contactId}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
            onClick={() => navigate(`/employer/messages/${c.contactId}`)}
          >
            <div className="me-2">
              <img
                src={c.profilePicture || '/placeholder-user.png'}
                alt={c.name}
                className="rounded-circle"
                style={{ width: 40, height: 40, objectFit: 'cover' }}
              />
            </div>
            <div className="flex-fill">
              <div className="d-flex justify-content-between">
                <h6 className="mb-1">{c.name}</h6>
                <small className="text-muted">
                  {new Date(c.date).toLocaleDateString()}
                </small>
              </div>
              <p className="mb-0 text-truncate">{c.lastMessage}</p>
            </div>
            {!c.read && <Badge bg="warning" pill>●</Badge>}
          </button>
        ))}
      </div>
    </div>
  );
}
