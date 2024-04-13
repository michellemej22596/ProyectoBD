import express from 'express';
import authRoutes from './routes/authRoutes.js'; //Rutas para login y sign in
import orderRoutes from './routes/orderRoutes.js'; // Rutas para manejar pedidos
import reportRoutes from './routes/reportRoutes.js'; // Rutas para reportes

import cors from 'cors'; 

const app = express();
app.use(express.json());
app.use(cors());

// Usar las rutas de autenticación
app.use('/auth', authRoutes);
app.use('/orders', orderRoutes); 
app.use('/reports', reportRoutes);


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
