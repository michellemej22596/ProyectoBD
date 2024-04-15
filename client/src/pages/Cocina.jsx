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
  left: 0,
  right: 0,
  zIndex: 1000,
  height: '60px',
};

const contentStyle = {
  paddingTop: '70px',
  minHeight: '100vh',
  backgroundColor: '#f9f9f9',
};

const orderStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  margin: '20px 0',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
};

const buttonStyle = {
  margin: '10px',
  width: '200px',
  height: '40px',
  backgroundColor: '#78281F',
  color: 'white',
  fontSize: '14px',
  textAlign: 'center',
  padding: '10px 0',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto'
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
