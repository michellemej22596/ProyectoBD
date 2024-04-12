import React from 'react';
import { useState } from 'react';
import { md5 } from 'js-md5';
import { PropTypes } from 'prop-types';
import Button from '../components/Button';
import Input from '../components/Input';
import '../styles/Login.css';


import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const navigate = useNavigate(); // Inicializa el hook useNavigate
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const setValue = (name, value) => {
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async () => {
    const body = {
      userName: username,
      passwordHash: md5(password)
    };
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch('http://localhost:3000/auth/login', fetchOptions);
    const data = await response.json();
    if (response.ok) {
      console.log('Login success! UserID is: ', data.userId);
      const token = 'simulated-token';  // Ejemplo de token obtenido
      setToken(token);
      navigate('/'); // Redirect user to the home page or dashboard
      return;
    }
    setErrorMessage('Credenciales inválidas.');
  };

  return (
    <aside className="login">
      <div className="logo-container">
        <img className="login-logo" src="../../public/images/logo.png" alt="Logo del Restaurante" />
      </div>
      <h1 className="title">¡Bienvenido a Winery!</h1>
      <p className="welcome-message">Disfruta de la experiencia culinaria más auténtica.</p>
      {
        errorMessage !== '' && (
          <div className='error-message' onClick={() => setErrorMessage('')}>
            {errorMessage}
          </div>
        )
      }
      <Input placeholder="Tu nombre de usuario" label="Usuario" type="text" value={username} onChange={(value) => setValue('username', value)} />
      <Input placeholder="Tu contraseña" label="Contraseña" type="password" value={password} onChange={(value) => setValue('password', value)}/>
      <Button text="Iniciar sesión" onClick={handleSubmit} />
    </aside>
  );
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Login;
