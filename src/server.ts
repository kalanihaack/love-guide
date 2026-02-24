import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes } from './routes/authRoutes';
import { musicRoutes } from './routes/musicRoutes'; // <-- Adicionado

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Nossas rotas
app.use('/auth', authRoutes);
app.use('/music', musicRoutes); // <-- Adicionado

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});