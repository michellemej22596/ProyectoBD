import React, { useState, useEffect } from 'react';

const Home = ({ navigate }) => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState();

  const getStudents = async () => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer token`
      }
    };
    try {
      const response = await fetch('http://127.0.0.1:5000/students/', fetchOptions);
      const json = await response.json();
      if (json) {
        setStudents(json);
      }
    } catch (e) {
      console.error('Error fetching', e);
      setError('Failed to fetch');
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  const buttonStyle = {
    margin: '10px',
    width: '200px',
    height: '50px',
    backgroundColor: '#78281F'
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Menú Principal</h1>
      <div className="d-flex flex-column align-items-center">
        <button className="btn btn-primary" style={buttonStyle} onClick={() => navigate('/pedidos')}>Pedidos</button>
        <button className="btn btn-secondary" style={buttonStyle} onClick={() => navigate('/cocina')}>Cocina</button>
        <button className="btn btn-success" style={buttonStyle} onClick={() => navigate('/bebidas')}>Bebidas</button>
        <button className="btn btn-info" style={buttonStyle} onClick={() => navigate('/mostrar-factura')}>Mostrar Factura</button>
        <button className="btn btn-warning" style={buttonStyle} onClick={() => navigate('/imprimir-factura')}>Imprimir Factura</button>
        <button className="btn btn-danger" style={buttonStyle} onClick={() => navigate('/encuestas')}>Encuestas</button>
        <button className="btn btn-dark" style={buttonStyle} onClick={() => navigate('/logout')}>Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default Home;
