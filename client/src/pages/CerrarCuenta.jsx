import React, { useState } from 'react';

function CerrarCuenta() {
  const [tableNumber, setTableNumber] = useState('');
  const [error, setError] = useState('');

  const handleCloseAccount = async () => {
    if (!tableNumber) {
      setError('Por favor ingrese un número de mesa válido');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/orders/close/${tableNumber}`, { method: 'PATCH' });
      const data = await response.json();

      if (response.ok) {
        alert('La cuenta ha sido cerrada exitosamente.');
      } else {
        setError(data.message || 'Ocurrió un error al cerrar la cuenta.');
      }
    } catch (error) {
      setError('Error al conectar con el servidor.');
    }
  };

  return (
    <div>
      <h1>Cerrar Cuenta</h1>
      <input
        type="text"
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
        placeholder="Número de Mesa"
      />
      <button onClick={handleCloseAccount}>Cerrar Cuenta</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default CerrarCuenta;
