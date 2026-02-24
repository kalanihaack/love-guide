import { Request, Response } from 'express';
import { prisma } from '../config/db';

class FriendshipController {
  // Envia um pedido de amizade
  async sendRequest(req: Request, res: Response) {
    try {
      const sender_id = (req as any).userId; // Quem está a enviar (você)
      const { receiver_id } = req.body;      // Quem vai receber (o perfil que está a ver)

      // 1. Não pode adicionar-se a si mesmo
      if (sender_id === receiver_id) {
        return res.status(400).json({ error: 'Não pode adicionar-se a si mesmo.' });
      }

      // 2. Verificar se já existe um convite ou amizade entre as duas pessoas
      const existingFriendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { sender_id: sender_id, receiver_id: receiver_id },
            { sender_id: receiver_id, receiver_id: sender_id }
          ]
        }
      });

      if (existingFriendship) {
        return res.status(400).json({ error: 'Já existe um convite ou amizade com este utilizador.' });
      }

      // 3. Criar o pedido de amizade na base de dados
      const friendship = await prisma.friendship.create({
        data: {
          sender_id,
          receiver_id,
          status: 'PENDING'
        }
      });

      return res.json({ message: 'Convite de amizade enviado!', friendship });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao enviar convite de amizade.' });
    }
  }
  // Lista os convites recebidos que estão pendentes
  async getPendingRequests(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      const requests = await prisma.friendship.findMany({
        where: {
          receiver_id: userId,
          status: 'PENDING'
        },
        include: {
          sender: {
            select: { id: true, name: true, email: true } // Traz os dados de quem enviou
          }
        }
      });

      return res.json(requests);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar convites.' });
    }
  }

  // Aceita ou rejeita um convite
  async respondToRequest(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params; // ID da relação de amizade
      const { action } = req.body; // 'ACCEPTED' ou 'REJECTED'

      // Verifica se o convite existe, se é para este usuário e se está pendente
      const friendship = await prisma.friendship.findFirst({
        where: { id: id, receiver_id: userId, status: 'PENDING' }
      });

      if (!friendship) {
        return res.status(404).json({ error: 'Convite não encontrado ou já respondido.' });
      }

      if (action !== 'ACCEPTED' && action !== 'REJECTED') {
        return res.status(400).json({ error: 'Ação inválida.' });
      }

      // Atualiza o status no banco de dados
      const updatedFriendship = await prisma.friendship.update({
        where: { id },
        data: { status: action }
      });

      return res.json({ message: `Convite ${action === 'ACCEPTED' ? 'aceito' : 'rejeitado'}!`, friendship: updatedFriendship });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao responder convite.' });
    }
  }
}

export default new FriendshipController();