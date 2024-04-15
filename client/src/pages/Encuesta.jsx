import React, { useState } from 'react';

function Encuesta() {
  const [orderId, setOrderId] = useState('');
  const [waiterQuality, setWaiterQuality] = useState(3);
  const [orderAccuracy, setOrderAccuracy] = useState(3);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch('http://localhost:3000/orders/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          waiterQuality,
          orderAccuracy
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Encuesta enviada con éxito.');
      } else {
        setError(data.message || 'Error al enviar la encuesta.');
      }
    } catch (error) {
      setError('Error al conectar al servidor.');
    }
  };

  return (
    <div>
      <h1>Encuesta de Satisfacción</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          ID del Pedido:
          <input type="number" value={orderId} onChange={e => setOrderId(e.target.value)} />
        </label>
        <label>
          Calidad del Servicio del Mesero (1-5):
          <input type="number" min="1" max="5" value={waiterQuality} onChange={e => setWaiterQuality(e.target.value)} />
        </label>
        <label>
          Precisión del Pedido (1-5):
          <input type="number" min="1" max="5" value={orderAccuracy} onChange={e => setOrderAccuracy(e.target.value)} />
        </label>
        <button type="submit">Enviar Encuesta</button>
      </form>
    </div>
  );
}

export default Encuesta;
