"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.musicRoutes = void 0;
const express_1 = require("express");
const MusicController_1 = require("../controllers/MusicController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
exports.musicRoutes = router;
const musicController = new MusicController_1.MusicController();
router.use(authMiddleware_1.authMiddleware);
router.get('/search', musicController.search);
router.post('/favorites', musicController.addFavorite);
router.get('/favorites', musicController.listFavorites);
router.get('/me/favorites', musicController.getFullFeed);
router.delete('/favorites/:id', musicController.removeFavorite);
//# sourceMappingURL=musicRoutes.js.map