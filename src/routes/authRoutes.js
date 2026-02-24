"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const router = (0, express_1.Router)();
exports.authRoutes = router;
const authController = new AuthController_1.AuthController();
router.post('/register', authController.register);
router.post('/login', authController.login);
//# sourceMappingURL=authRoutes.js.map