import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes } from './routes/authRoutes';
import { musicRoutes } from './routes/musicRoutes';
import { movieRoutes } from './routes/movieRoutes'; // Importe aqui

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/music', musicRoutes);
app.use('/movies', movieRoutes); // Use aqui


const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});