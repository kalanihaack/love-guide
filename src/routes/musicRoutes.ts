import { Router } from 'express';
import { MusicController } from '../controllers/MusicController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const musicController = new MusicController();

router.use(authMiddleware);

router.get('/search', musicController.search);
router.post('/favorites', musicController.addFavorite);
router.get('/favorites', musicController.listFavorites);
router.get('/me/favorites', musicController.getFullFeed);
router.delete('/favorites/:id', musicController.removeFavorite);

export { router as musicRoutes };