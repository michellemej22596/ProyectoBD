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
        <button className="btn btn-primary" style={buttonStyle} onClick={() => navigate('/pedidos')}>Pedidos</button>
        <button className="btn btn-secondary" style={buttonStyle} onClick={() => navigate('/cocina')}>Cocina</button>
        <button className="btn btn-success" style={buttonStyle} onClick={() => navigate('/bebidas')}>Bebidas</button>
        <button className="btn btn-info" style={buttonStyle} onClick={() => navigate('/reporte')}>Mostrar Factura</button>
        <button className="btn btn-warning" style={buttonStyle} onClick={() => navigate('/imprimir-factura')}>Imprimir Factura</button>
        <button className="btn btn-danger" style={buttonStyle} onClick={() => navigate('/encuestas')}>Encuestas</button>
        <button className="btn btn-dark" style={buttonStyle} onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default Home;
