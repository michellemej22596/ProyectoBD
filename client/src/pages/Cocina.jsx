import React, { useState, useEffect } from 'react';

function Cocina() {
  const [orders, setOrders] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3000/orders/kitchen');
        if (response.ok) {
          const data = await response.json();
          // Agrupa los ítems por orderId
          const groupedOrders = data.reduce((acc, item) => {
            acc[item.orderId] = acc[item.orderId] || [];
            acc[item.orderId].push(item);
            return acc;
          }, {});
          setOrders(groupedOrders);
        } else {
          console.error('Error fetching orders:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching kitchen orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const handleMarkAsPrepared = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/order/${orderId}/prepared`, { method: 'PATCH' });
      if (response.ok) {
        const updatedOrders = { ...orders };
        delete updatedOrders[orderId];
        setOrders(updatedOrders);
      } else {
        console.error('Error marking order as prepared:', response.statusText);
      }
    } catch (error) {
      console.error('Error marking order as prepared:', error);
    }
  };

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
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={titleStyle}>
        <h1 style={{ textAlign: 'center', lineHeight: '60px', margin: 0 }}>Órdenes de Cocina</h1>
      </div>
      <div style={contentStyle}>
        {Object.keys(orders).length === 0 && <p>No hay órdenes en la cocina.</p>}
        {Object.entries(orders).map(([orderId, items]) => (
          <div key={orderId} style={orderStyle}>
            <h2>Orden #{orderId}</h2>
            {items.map((item, index) => (
              <p key={index}>{item.name} - {item.quantity} unidades - {item.description}</p>
            ))}
            <button
              style={buttonStyle}
              onClick={() => handleMarkAsPrepared(orderId)}
            >
              Marcar como Preparado
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cocina;
