import React, { useState } from 'react';

const Pedidos = () => {
  const [mesa, setMesa] = useState('');
  const [cuentaAbierta, setCuentaAbierta] = useState(false);
  const [platos, setPlatos] = useState([]);
  const [bebidas, setBebidas] = useState([]);

  const agregarPlato = (plato) => {
    setPlatos([...platos, plato]);
  };

  const agregarBebida = (bebida) => {
    setBebidas([...bebidas, bebida]);
  };

  const enviarPedido = () => {
    // Aquí se puede enviar el pedido a tu backend 
    console.log(`Pedido para la mesa ${mesa}:`, platos, bebidas);
  };

  const manejarMesa = (e) => {
    const numeroMesa = parseInt(e.target.value, 10);
    if (numeroMesa >= 1) {
      setMesa(numeroMesa);
      verificarCuenta(numeroMesa);
    } else {
      setMesa('');
    }
  };

  const buttonStyle = {
    margin: '10px',
    width: '200px',
    height: '50px',
    backgroundColor: '#78281F',
    color: 'white'
  };

  const buttonsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px'
  };

  return (
    <div>
      <h1 className="mb-4">Pedidos</h1>
      <label>
        Número de mesa:
        <input type="number" min="1" value={mesa} onChange={manejarMesa} />
      </label>
      <br />
      <label>
        Agregar plato:
        <input type="text" onKeyDown={(e) => e.key === 'Enter' && agregarPlato(e.target.value)} />
      </label>
      <ul>
        {platos.map((plato, index) => (
          <li key={index}>{plato}</li>
        ))}
      </ul>
      <label>
        Agregar bebida:
        <input type="text" onKeyDown={(e) => e.key === 'Enter' && agregarBebida(e.target.value)} />
      </label>
      <ul>
        {bebidas.map((bebida, index) => (
          <li key={index}>{bebida}</li>
        ))}
      </ul>
      <div style={buttonsContainerStyle}>
        {!cuentaAbierta && mesa && (
          <button style={buttonStyle} onClick={() => abrirCuenta(mesa)}>Abrir cuenta</button>
        )}
        <button style={buttonStyle} onClick={enviarPedido}>Enviar Pedido</button>
      </div>
    </div>
  );
};

export default Pedidos;
