import React, { useState, useEffect } from 'react';

function Cocina() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para cargar las órdenes de la cocina al cargar el componente
    const fetchKitchenOrders = async () => {
      try {
        const response = await fetch('http://localhost:3000/orders/kitchen');
        if (response.ok) {
          const data = await response.json();
          setOrders(data); // Suponemos que la API ya filtra los pedidos "Open"
        } else {
          throw new Error('Error al obtener los pedidos de la cocina');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Indica que la carga ha terminado
      }
    };

    fetchKitchenOrders();
  }, []);

  // Función para marcar una orden como preparada
  const handleMarkAsPrepared = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/order/${orderId}/prepared`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Actualiza el estado de orders para reflejar los cambios
        setOrders(prevOrders => prevOrders.filter(order => order.orderid !== orderId));
      } else {
        throw new Error('Error al actualizar el estado del pedido');
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p>Cargando pedidos...</p>;
  }

  return (
    <div>
      <h1>Pedidos en Cocina</h1>
      {orders.length > 0 ? (
       orders.map((order, index) => (
        <div key={order.orderid + '-' + index}>
          <p>{order.name} - {order.totalquantity} unidades - Pedido a las {new Date(order.datetime).toLocaleTimeString()}</p>
          {order.Status !== 'Closed' && (
            <button onClick={() => handleMarkAsPrepared(order.orderid)}>Marcar como Preparado</button>
          )}
          </div>
        ))
      ) : (
        <p>No hay pedidos pendientes.</p>
      )}
    </div>
  );
}

export default Cocina;
