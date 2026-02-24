import { Router } from 'express';
import userController from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Só quem está logado pode pesquisar outras pessoas
router.get('/users/search', authMiddleware, userController.searchByEmail);
router.get('/users/:id/profile', authMiddleware, userController.getProfile);

export default router;