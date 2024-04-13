import React, { useState } from 'react';
import { md5 } from 'js-md5';
import { useNavigate } from 'react-router-dom';

import Button from '../components/Button';
import Input from '../components/Input';
import '../styles/Login.css'; // Asegúrate de que los estilos sean apropiados para el registro también

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const setValue = (name, value) => {
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        } else if (name === 'userType') {
            setUserType(value);
        }
    };

    const handleSubmit = async () => {
        const body = {
            userName: username,
            passwordHash: md5(password),
            userType: userType
        };

        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };

        const response = await fetch('http://localhost:3000/auth/register', fetchOptions);
        if (response.ok) {
            console.log('Registration successful!');
            navigate('/login'); // Redirigir al usuario a la página de inicio de sesión después del registro
        } else {
            const data = await response.json();
            setErrorMessage(data.message || 'Registro fallido.');
        }
    };

    return (
        <aside className="login">
            <div className="logo-container">
                <img className="login-logo" src="../../public/images/logo.png" alt="Logo del Restaurante" />
            </div>
            <h1 className="title">Registra un usuario con Winery</h1>
            <p className="welcome-message">Agrega nuevos colaboradores y amigos.</p>
            {errorMessage && (
                <div className='error-message' onClick={() => setErrorMessage('')}>
                    {errorMessage}
                </div>
            )}
            <Input placeholder="Tu nombre de usuario" label="Usuario" type="text" value={username} onChange={(value) => setValue('username', value)} />
            <Input placeholder="Tu contraseña" label="Contraseña" type="password" value={password} onChange={(value) => setValue('password', value)} />
            <Input placeholder="Tu tipo de usuario" label="Rol" type="text" value={userType} onChange={(value) => setValue('userType', value)} />
            <Button text="Registrar" onClick={handleSubmit} />
        </aside>
    );
};

export default Register;
