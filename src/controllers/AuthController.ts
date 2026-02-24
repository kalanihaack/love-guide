import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';

// Uma chave secreta para assinar o token (em produção, isso vai no arquivo .env)
const JWT_SECRET = process.env.JWT_SECRET || 'super_senha_secreta_do_projeto';

export class AuthController {
  // Rota de Cadastro
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      // Verifica se o email já existe
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Este email já está em uso.' });
      }

      // Criptografa a senha antes de salvar
      const password_hash = await bcrypt.hash(password, 8);

      // Cria o usuário no banco
      const user = await prisma.user.create({
        data: { name, email, password_hash },
      });

      return res.status(201).json({ message: 'Usuário criado com sucesso!', userId: user.id });
    } catch (error: any) {
      // Mandando o erro real direto para a resposta do JSON!
      return res.status(500).json({ 
        error: 'Erro ao criar usuário.', 
        detalhes_do_erro: error.message || String(error)
      });
    }
  }

  // Rota de Login
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Busca o usuário pelo email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      // Compara a senha digitada com a senha criptografada do banco
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      // Gera o Token JWT
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

      return res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao fazer login.' });
    }
  }
}