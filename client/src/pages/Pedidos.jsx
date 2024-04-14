import React, { useState, useEffect } from 'react';

const Pedidos = () => {
  // Estados
  const [mesa, setMesa] = useState('');
  const [cuentaAbierta, setCuentaAbierta] = useState(false);
  const [menu, setMenu] = useState([]);

  // Efecto para cargar el menú de platos y bebidas
  useEffect(() => {
    const cargarMenu = async () => {
      try {
        const responsePlates = await fetch('http://localhost:3000/orders/plates');
        const plates = await responsePlates.json();
        const responseDrinks = await fetch('http://localhost:3000/orders/drinks');
        const drinks = await responseDrinks.json();
        const combinedMenu = [...plates, ...drinks].map(item => ({
          ...item,
          cantidad: 0
        }));
        setMenu(combinedMenu);
      } catch (error) {
        console.error('Error al cargar el menú:', error);
      }
    };
    cargarMenu();
  }, []);

  // Funciones para manejar eventos
  const manejarMesa = (e) => setMesa(e.target.value);

  const actualizarCantidad = (index, nuevaCantidad) => {
    setMenu(menu.map((item, i) => i === index ? { ...item, cantidad: nuevaCantidad } : item));
  };

  const incrementarCantidad = (index) => {
    actualizarCantidad(index, menu[index].cantidad + 1);
  };

  const decrementarCantidad = (index) => {
    if (menu[index].cantidad > 0) {
      actualizarCantidad(index, menu[index].cantidad - 1);
    }
  };

  const enviarPedido = () => {
    //console.log(Pedido para la mesa ${mesa}:, menu.filter(item => item.cantidad > 0));
  };

  // Estilos
  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  };

  const nombreItemStyle = {
    marginRight: '10px',
  };

  const buttonStyle = {
    cursor: 'pointer',
    margin: '0 5px',
    width: '30px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#78281F',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
  };

  // JSX
  return (
    <div>
      <h1>Pedidos</h1>
      <label>
        Número de mesa:
        <input type="number" min="1" value={mesa} onChange={manejarMesa} />
      </label>
      {menu.map((item, index) => (
        <div key={index} style={itemStyle}>
          <span style={nombreItemStyle}>{item.name} - {item.description}</span>
          <div>
            <button onClick={() => decrementarCantidad(index)} style={buttonStyle}>-</button>
            <span>{item.cantidad}</span>
            <button onClick={() => incrementarCantidad(index)} style={buttonStyle}>+</button>
          </div>
        </div>
      ))}
      <div>
        {!cuentaAbierta && mesa && (
          <button onClick={() => setCuentaAbierta(true)} style={buttonStyle}>Abrir cuenta</button>
        )}
        {cuentaAbierta && (
          <button onClick={enviarPedido} style={buttonStyle}>Enviar Pedido</button>
        )}
      </div>
    </div>
  );
};

export default Pedidos;
