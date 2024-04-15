import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pedidos from './pages/Pedidos'
import Cocina from './pages/Cocina'
import Reporte from './pages/Reporte'
import Impresion from './pages/Impresion';
import Factura from './pages/Factura';
import Bar from './pages/Bar';

function Pages({ token, setToken }) {
  return (
    <Routes>
      <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} /> 

      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route path="/register" element={<Register />} />

      <Route path="/pedidos" element={token ? <Pedidos /> : <Navigate to="/login" />} /> 
      <Route path="/cocina" element={<Cocina />} /> 
      <Route path="/bar" element={<Bar />} /> 
      <Route path="/imprimirPedido" element={token ? <Impresion /> : <Navigate to="/login" />} /> 
      <Route path="/imprimirFactura" element={token ? <Factura /> : <Navigate to="/login" />} /> 
      <Route path="/reportes" element={token ? <Reporte /> : <Navigate to="/login" />} /> 
    </Routes>
  );
}

export default Pages;
