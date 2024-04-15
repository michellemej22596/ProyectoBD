import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const buttonStyle = {
    margin: '10px',
    width: '200px',
    height: '50px',
    backgroundColor: '#78281F'
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token de localStorage
    navigate('/login');
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Menú Principal</h1>
      <div className="d-flex flex-column align-items-center">
        <button className="btn btn-primary" style={buttonStyle} onClick={() => navigate('/pedidos')}>Tomar Pedido</button>
        <button className="btn btn-secondary" style={buttonStyle} onClick={() => navigate('/cocina')}>Revisar Cocina</button>
        <button className="btn btn-success" style={buttonStyle} onClick={() => navigate('/bar')}>Revisar Bebidas</button>
        <button className="btn btn-info" style={buttonStyle} onClick={() => navigate('/imprimirPedido')}>Mostrar Pedido</button>
        <button className="btn btn-warning" style={buttonStyle} onClick={() => navigate('/imprimirFactura')}>Generar Factura</button>
        <button className="btn btn-danger" style={buttonStyle} onClick={() => navigate('/reportes')}>Reportes</button>
        <button className="btn btn-danger" style={buttonStyle} onClick={() => navigate('/survey')}>Realizar Encuesta</button>
        <button className="btn btn-danger" style={buttonStyle} onClick={() => navigate('/complaint')}>Enviar Queja</button>
        <button className="btn btn-dark" style={buttonStyle} onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default Home;
