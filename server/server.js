import express from 'express';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(express.json());

// Usar las rutas de autenticación
app.use('/auth', authRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
