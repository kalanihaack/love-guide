import { Router } from 'express';
import friendshipController from '../controllers/FriendshipController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Rota para enviar o convite de amizade
router.post('/friends/request', authMiddleware, friendshipController.sendRequest);
router.post('/friends/request', authMiddleware, friendshipController.sendRequest);
router.get('/friends/requests', authMiddleware, friendshipController.getPendingRequests);
router.patch('/friends/requests/:id', authMiddleware, friendshipController.respondToRequest);

export default router;
export default router;