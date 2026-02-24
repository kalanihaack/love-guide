import { Request, Response } from 'express';
import { prisma } from '../config/db';

class UserController {
  // 1. Busca um usuário pelo email (exato)
  async searchByEmail(req: Request, res: Response) {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório.' });
      }

      const user = await prisma.user.findUnique({
        where: { email: String(email) },
        select: { id: true, name: true, email: true } // Cuidado para nunca retornar a senha aqui!
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
  }

  // 2. Carrega o perfil completo do usuário (com filmes e músicas)
  async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const userProfile = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          favoriteMovies: {
            orderBy: { created_at: 'desc' } // Traz os filmes mais recentes primeiro
          },
          favoriteSongs: {
            orderBy: { created_at: 'desc' }
          }
        }
      });

      if (!userProfile) {
        return res.status(404).json({ error: 'Perfil não encontrado.' });
      }

      return res.json(userProfile);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao carregar perfil.' });
    }
  }
}

export default new UserController();