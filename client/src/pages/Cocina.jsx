import React, { useState, useEffect } from 'react';

function Cocina() {
  const [orders, setOrders] = useState({});

  useEffect(() => {
    fetch('http://localhost:3000/orders/kitchen')
    .then(response => response.json())
    .then(data => {
      // Agrupa los ítems por orderID
      const groupedOrders = data.reduce((acc, item) => {
        acc[item.orderid] = acc[item.orderid] || [];
        acc[item.orderid].push(item);
        return acc;
      }, {});
      setOrders(groupedOrders);
    })
    .catch(error => console.error('Error fetching kitchen orders:', error));

  }, []);

   const handleMarkAsPrepared = (orderId) => {
    
    // Llamada a la API para marcar la orden como preparada
    fetch(`http://localhost:3000/orders/order/${orderId}/preparedFood`, { method: 'PATCH' })
      .then(response => response.ok && delete orders[orderId] && setOrders({ ...orders }))
      .catch(error => console.error('Error marking order as prepared:', error));
   }

  // Estilos
  const titleStyle = {
    backgroundColor: '#fff3e6',
    padding: '10px 20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000,
  };

  const contentStyle = {
    paddingTop: '60px', // Ajusta este valor si cambias la altura del título
    paddingBottom: '10px', // Espacio adicional en el fondo
    backgroundColor: '#f9f9f9',
  };

  const orderStyle = {
    backgroundColor: '#fff',
    margin: '10px',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
  };

  const buttonStyle = {
    margin: '10px auto', // Centrado horizontalmente
    display: 'block', // Esto permite centrar el botón
    width: '200px',
    height: '50px',
    backgroundColor: '#78281F',
    color: 'white',
    fontSize: '14px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <div style={{ paddingTop: '60px' }}>
      <header style={titleStyle}>
        <h1 style={{ textAlign: 'center', margin: 0 }}>Órdenes de Cocina</h1>
      </header>
      <section style={contentStyle}>
        {Object.entries(orders).map(([orderId, orderItems]) => (
          <div key={orderId} style={orderStyle}>
            <h2>Orden #{orderId}</h2>
            {orderItems.map((item, index) => (
              <p key={index}>{item.name} - {item.totalquantity} unidades - Descripción: {item.description}</p>
            ))}
            <button style={buttonStyle} onClick={() => handleMarkAsPrepared(orderId)}>
              Marcar como Preparado
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Cocina;
