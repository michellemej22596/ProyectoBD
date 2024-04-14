import React, { useState, useEffect } from 'react';

const Cocina = () => {
  const [pedidosCocina, setPedidosCocina] = useState([]);

  const cargarPedidosCocina = async () => {
    try {
      const response = await fetch('http://localhost:3000/orders/kitchen');
      if (response.ok) {
        const pedidos = await response.json();
        // Agregar estado de finalizado a cada pedido
        const pedidosConEstado = pedidos.map(pedido => ({ ...pedido, finalizado: false }));
        setPedidosCocina(pedidosConEstado);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    cargarPedidosCocina();
  }, []);

  const marcarComoFinalizado = (index) => {
    const nuevosPedidos = [...pedidosCocina];
    nuevosPedidos[index].finalizado = true; // Marcar el pedido como finalizado
    setPedidosCocina(nuevosPedidos);
  };

  const buttonStyle = {
    margin: '10px',
    width: '220px', 
    height: '50px',
    backgroundColor: '#78281F',
    color: 'white',
    fontSize: '14px', 
    textAlign: 'center', 
    padding: '10px 0', 
    border: 'none', 
    borderRadius: '5px', 
    cursor: 'pointer' 
  };

  const buttonsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    marginTop: '20px'
  };

  return (
    <div>
      <h1 className="mb-4">Pedidos para Cocina</h1>
      <div style={buttonsContainerStyle}>
        {pedidosCocina.map((pedido, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <p><strong>{pedido.name}</strong> (x{pedido.quantity})</p>
            <p>{pedido.description}</p>
            <p>Fecha y Hora: {new Date(pedido.datetime).toLocaleString()}</p>
            {!pedido.finalizado && (
              <button style={buttonStyle} onClick={() => marcarComoFinalizado(index)}>
                Marcar como finalizado
              </button>
            )}
            {pedido.finalizado && <p>Pedido finalizado</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cocina;

