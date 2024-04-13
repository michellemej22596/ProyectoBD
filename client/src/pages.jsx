import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import Pedidos from './pages/Pedidos'
import Cocina from './pages/Cocina'
import Reporte from './pages/Reporte'

function Pages({ token, setToken }) {
  return (
    <Routes>
      <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} /> 
      <Route path="/login" element={<Login setToken={setToken} />} />
      
      <Route path="/register" element={<Register />} />

      <Route path="/pedidos" element={token ? <Pedidos /> : <Navigate to="/pedidos" />} /> 
      <Route path="/cocina" element={token ? <Cocina /> : <Navigate to="/cocina" />} /> 
      <Route path="/reportes" element={token ? <Reporte /> : <Navigate to="/reportes" />} /> 
    </Routes>
  );
}

export default Pages;
