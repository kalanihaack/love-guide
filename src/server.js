"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = require("./routes/authRoutes");
const musicRoutes_1 = require("./routes/musicRoutes");
const movieRoutes_1 = require("./routes/movieRoutes"); // Importe aqui
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/auth', authRoutes_1.authRoutes);
app.use('/music', musicRoutes_1.musicRoutes);
app.use('/movies', movieRoutes_1.movieRoutes); // Use aqui
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
//# sourceMappingURL=server.js.map