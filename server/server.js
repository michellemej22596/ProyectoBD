import express from 'express';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors'; 

const app = express();
app.use(express.json());
app.use(cors());

// Usar las rutas de autenticación
app.use('/auth', authRoutes);


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
