import React, { useState, useEffect } from 'react';

const Cocina = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Aquí iría la llamada a la API para cargar los pedidos desde tu backend
    // La he comentado para que puedas ver el diseño con los pedidos de ejemplo
    /*
    const cargarPedidos = async () => {
      try {
        const respuesta = await fetch('https://tu-api.com/pedidos');
        const pedidosCargados = await respuesta.json();
        setPedidos(pedidosCargados);
      } catch (error) {
        console.error('Error al cargar los pedidos:', error);
      }
    };

    cargarPedidos();
    */

    // Pedidos de ejemplo para ver el diseño
    const pedidosEjemplo = [
      { id: 1, hora: '10:00', platos: ['Plato 1', 'Plato 2'] },
      { id: 2, hora: '10:30', platos: ['Plato 3'] },
      { id: 3, hora: '11:00', platos: ['Plato 4', 'Plato 5', 'Plato 6'] }
    ];
    setPedidos(pedidosEjemplo);
  }, []);

  return (
    <div>
       <h1 className="mb-4">Cocina</h1>
      <ul>
        {pedidos.map((pedido) => (
          <li key={pedido.id}>
            <strong>Hora: {pedido.hora}</strong>
            <ul>
              {pedido.platos.map((plato, index) => (
                <li key={index}>{plato}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cocina;
