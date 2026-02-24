"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    // Pega o token de dentro dos Headers da requisição
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: 'Token não fornecido. Faça login.' });
    }
    // O token geralmente vem no formato "Bearer asdjkl123..."
    // Aqui a gente separa a palavra "Bearer" e pega só o token em si
    const [, token] = authorization.split(' ');
    try {
        // Verifica se o token é válido usando a mesma senha secreta do login
        const secret = process.env.JWT_SECRET || 'super_senha_secreta_do_projeto';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Extrai o ID do usuário de dentro do token
        const { id } = decoded;
        // "Injeta" o ID do usuário na requisição. 
        // Assim, na hora de salvar a música, já sabemos de quem é!
        req.userId = id;
        // Libera a passagem para a rota final
        return next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
}
//# sourceMappingURL=authMiddleware.js.map