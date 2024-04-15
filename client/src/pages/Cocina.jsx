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
    fetch(`http://localhost:3000/orders/markPrepared/${orderId}`, { method: 'PATCH' })
      .then(response => response.ok && delete orders[orderId] && setOrders({ ...orders }))
      .catch(error => console.error('Error marking order as prepared:', error));
  };

  return (
    <div>
      <h1>Órdenes de Cocina</h1>
      {Object.entries(orders).map(([orderId, orderItems]) => (
        <div key={orderId}>
          <h2>Orden #{orderId}</h2>
          {orderItems.map((item, index) => (
            <p key={index}>{item.name} - {item.totalquantity} unidades - Descripción: {item.description}</p>
          ))}
          <button onClick={() => handleMarkAsPrepared(orderId)}>Marcar como Preparado</button>
        </div>
      ))}
    </div>
  );
}

export default Cocina;
