"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieRoutes = void 0;
const express_1 = require("express");
const MovieController_1 = require("../controllers/MovieController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
exports.movieRoutes = router;
const movieController = new MovieController_1.MovieController();
// Aplica a trava de segurança em todas as rotas abaixo
router.use(authMiddleware_1.authMiddleware);
router.get('/search', movieController.search);
router.post('/favorites', movieController.addFavorite);
router.delete('/favorites/:id', movieController.removeFavorite);
//# sourceMappingURL=movieRoutes.js.map