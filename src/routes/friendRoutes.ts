import { Router } from 'express';
import friendshipController from '../controllers/FriendshipController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// 1. Rota para enviar o convite de amizade
router.post('/friends/request', authMiddleware, friendshipController.sendRequest);

// 2. Rota para listar os convites recebidos e pendentes
router.get('/friends/requests', authMiddleware, friendshipController.getPendingRequests);

// 3. Rota para aceitar ou recusar o convite
router.patch('/friends/requests/:id', authMiddleware, friendshipController.respondToRequest);

// O "export default" deve aparecer apenas uma vez, aqui no final!
export default router;
