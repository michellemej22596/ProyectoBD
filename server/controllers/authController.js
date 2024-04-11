import { login as loginService, register as registerService } from '../database/db.js';

export async function login(req, res) {
  const { userName, passwordHash } = req.body;
  const userId = await loginService(userName, passwordHash);
  if (userId) {
    res.json({ success: true, userId });
  } else {
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
}

export async function register(req, res) {
  const { userName, passwordHash, userType } = req.body;
  console.log('Datos recibidos para registro:', userName, passwordHash, userType);
  try {
    const user = await registerService(userName, passwordHash, userType);
    console.log('Usuario registrado:', user);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(400).json({ success: false, message: 'Registration failed' });
  }
}



