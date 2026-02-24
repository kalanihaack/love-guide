import { Router } from 'express';
import { MusicController } from '../controllers/MusicController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const musicController = new MusicController();

// Aplica o middleware de autenticação em TODAS as rotas de música
router.use(authMiddleware);

// URL final: GET /music/search?query=nome_da_musica
router.get('/search', musicController.search);

// URL final: POST /music/favorites
router.post('/favorites', musicController.addFavorite);

// URL final: GET /music/favorites
router.get('/favorites', musicController.listFavorites);

export { router as musicRoutes };