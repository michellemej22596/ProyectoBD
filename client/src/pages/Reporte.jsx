import React, { useState, useEffect } from 'react';

const ReportePedido = () => {
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    // Aquí iría la llamada a la API para cargar los datos del pedido
    // Comentado para usar datos de ejemplo
    /*
    const cargarPedido = async () => {
      try {
        const respuesta = await fetch('https://tu-api.com/pedido');
        const pedidoCargado = await respuesta.json();
        setPedido(pedidoCargado);
      } catch (error) {
        console.error('Error al cargar el pedido:', error);
      }
    };

    cargarPedido();
    */

    // Datos de ejemplo para ver el diseño
    const pedidoEjemplo = {
      mesa: 5,
      platos: ['Plato 1', 'Plato 2', 'Plato 3'],
      bebidas: ['Bebida 1', 'Bebida 2']
    };
    setPedido(pedidoEjemplo);
  }, []);

  const buttonStyle = {
    margin: '10px',
    width: '200px',
    height: '50px',
    backgroundColor: '#78281F',
    color: 'white'
  };

  if (!pedido) {
    return <div>Cargando pedido...</div>;
  }

  return (
    <div>
       <h1 className="mb-4">Reporte del pedido</h1>
      <p><strong>Mesa:</strong> {pedido.mesa}</p>
      <h3>Platos:</h3>
      <ul>
        {pedido.platos.map((plato, index) => (
          <li key={index}>{plato}</li>
        ))}
      </ul>
      <h3>Bebidas:</h3>
      <ul>
        {pedido.bebidas.map((bebida, index) => (
          <li key={index}>{bebida}</li>
        ))}
      </ul>
      {/* Aquí puedes agregar botones o acciones adicionales según necesites */}
      <button style={buttonStyle}>Revisar cuenta</button>
      <button style={buttonStyle}>Cerrar cuenta</button>
    </div>
  );
};

export default ReportePedido;
