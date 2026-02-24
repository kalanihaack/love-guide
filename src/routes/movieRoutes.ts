import { Router } from 'express';
import { MovieController } from '../controllers/MovieController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const movieController = new MovieController();

// Aplica a trava de segurança em todas as rotas abaixo
router.use(authMiddleware);

router.get('/search', movieController.search);
router.post('/favorites', movieController.addFavorite);
router.delete('/favorites/:id', movieController.removeFavorite);
router.patch('/favorites/:id/rating', authMiddleware, movieController.updateRating);

export { router as movieRoutes };