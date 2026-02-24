"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
// Uma chave secreta para assinar o token (em produção, isso vai no arquivo .env)
const JWT_SECRET = process.env.JWT_SECRET || 'super_senha_secreta_do_projeto';
class AuthController {
    // Rota de Cadastro
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            // Verifica se o email já existe
            const userExists = await db_1.prisma.user.findUnique({ where: { email } });
            if (userExists) {
                return res.status(400).json({ error: 'Este email já está em uso.' });
            }
            // Criptografa a senha antes de salvar
            const password_hash = await bcryptjs_1.default.hash(password, 8);
            // Cria o usuário no banco
            const user = await db_1.prisma.user.create({
                data: { name, email, password_hash },
            });
            return res.status(201).json({ message: 'Usuário criado com sucesso!', userId: user.id });
        }
        catch (error) {
            // Mandando o erro real direto para a resposta do JSON!
            return res.status(500).json({
                error: 'Erro ao criar usuário.',
                detalhes_do_erro: error.message || String(error)
            });
        }
    }
    // Rota de Login
    async login(req, res) {
        try {
            const { email, password } = req.body;
            // Busca o usuário pelo email
            const user = await db_1.prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }
            // Compara a senha digitada com a senha criptografada do banco
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password_hash);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Senha incorreta.' });
            }
            // Gera o Token JWT
            const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
            return res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao fazer login.' });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map