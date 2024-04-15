import React, { useState } from 'react';
import '../styles/Button.css';

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

  const titleStyle = {
    backgroundColor: '#fff3e6',
    padding: '10px 20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: '60px',
  };

  return (
    <div>
        <h1 style={{ textAlign: 'center', margin: 0 }}>Encuesta de satisfacción</h1>
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
        <button type="submit" className="custom-button">Enviar Encuesta</button>
      </form>
    </div>
  );
}

export default Encuesta;