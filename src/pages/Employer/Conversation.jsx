// src/pages/Employer/Conversation.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  fetchConversation,
  sendMessage,
  markAsRead
} from '../../services/api.jsx';
import { Form, Button, InputGroup } from 'react-bootstrap';

export default function Conversation() {
  const { id: contactId } = useParams();
  const [msgs,     setMsgs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [text,     setText]     = useState('');
  const containerRef = useRef();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // marcamos como leídos
    markAsRead(contactId).catch(() => {});

    fetchConversation(contactId)
      .then(res => {
        if (res.error) throw new Error(res.message);
        if (mounted) setMsgs(res.data);
      })
      .catch(err => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [contactId]);

  useEffect(() => {
    // scroll al final
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [msgs]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await sendMessage(contactId, text.trim());
    if (res.error) {
      return setError(res.message);
    }
    setMsgs([...msgs, res.data]);
    setText('');
  };

  if (loading) return <p>Cargando conversación…</p>;
  if (error)   return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid h-100 d-flex flex-column">
      <div className="mb-3">
        <Link to="/employer/messages" className="btn btn-link">&larr; Volver a Mensajes</Link>
      </div>

      <div
        ref={containerRef}
        className="flex-fill overflow-auto border rounded p-3 mb-3"
        style={{ background: '#f9f9f9' }}
      >
        {msgs.map(m => (
          <div
            key={m._id}
            className={`d-flex mb-3 ${m.from._id === contactId ? '' : 'justify-content-end'}`}
          >
            <div
              className={`p-2 rounded ${
                m.from._id === contactId ? 'bg-white text-dark' : 'bg-primary text-white'
              }`}
              style={{ maxWidth: '75%' }}
            >
              {m.message}
              <div className="text-end" style={{ fontSize: '0.75rem' }}>
                {new Date(m.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            placeholder="Escribe un mensaje…"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <Button type="submit" variant="primary">Enviar</Button>
        </InputGroup>
      </Form>
    </div>
  );
}
