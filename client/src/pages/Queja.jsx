import React, { useState } from 'react';

function Queja() {
  const [customer, setCustomer] = useState('');
  const [reason, setReason] = useState('');
  const [classification, setClassification] = useState(3);
  const [personnel, setPersonnel] = useState('');
  const [itemId, setItemId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch('http://localhost:3000/orders/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer,
          reason,
          classification,
          personnel,
          itemId: itemId || null // Permitir null si no se proporciona un itemId
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Queja enviada con éxito.');
      } else {
        setError(data.message || 'Error al enviar la queja.');
      }
    } catch (error) {
      setError('Error al conectar al servidor.');
    }
  };

  return (
    <div>
      <h1>Registrar Queja</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nombre del Cliente:
          <input type="text" value={customer} onChange={e => setCustomer(e.target.value)} />
        </label>
        <label>
          Motivo de la Queja:
          <input type="text" value={reason} onChange={e => setReason(e.target.value)} />
        </label>
        <label>
          Clasificación (1-5):
          <input type="number" min="1" max="5" value={classification} onChange={e => setClassification(e.target.value)} />
        </label>
        <label>
          Personal Involucrado:
          <input type="text" value={personnel} onChange={e => setPersonnel(e.target.value)} />
        </label>
        <label>
          ID del Producto (opcional):
          <input type="number" value={itemId} onChange={e => setItemId(e.target.value)} />
        </label>
        <button type="submit">Enviar Queja</button>
      </form>
    </div>
  );
}

export default Queja;
