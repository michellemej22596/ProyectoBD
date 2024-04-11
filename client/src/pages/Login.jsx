import React from 'react';
import { useState } from 'react';
import { md5 } from 'js-md5';
import { PropTypes } from 'prop-types';
import Button from '../components/Button';
import Input from '../components/Input';
import '../styles/Login.css';

const Login = ({ setToken, navigate }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState('');

  const setValue = (name, value) => {
    switch(name) {
      case 'username':
        setUsername(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    const body = {
      username: username,
      password: md5(password)
    };
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch('http://127.0.0.1:5000/login/', fetchOptions);
    const { access_token } = await response.json();
    if (response.ok) {
      console.log('success! token is: ', access_token);
      setToken(access_token);
      navigate('/');
      return;
    }
    setErrorMessage('Incorrect user or password');
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
