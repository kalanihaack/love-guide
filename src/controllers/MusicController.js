"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicController = void 0;
const express_1 = require("express");
const db_1 = require("../config/db");
class MusicController {
    // 1. Busca músicas na API do iTunes
    async search(req, res) {
        try {
            // Pega o termo de busca da URL (ex: ?query=taylor swift)
            const { query } = req.query;
            if (!query) {
                return res.status(400).json({ error: 'Informe o nome da música ou artista.' });
            }
            // Consumindo a API aberta do iTunes
            const response = await fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=10`);
            const data = await response.json();
            // Formatando o retorno para ficar mais limpo para o nosso frontend
            const songs = data.results.map((song) => ({
                api_id: String(song.trackId),
                title: song.trackName,
                artist: song.artistName,
                cover_url: song.artworkUrl100, // Capa do álbum
                preview_url: song.previewUrl // Trecho de 30s da música (bônus para o frontend!)
            }));
            return res.json(songs);
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar músicas na API externa.' });
        }
    }
    // 2. Salva a música favorita no banco de dados
    async addFavorite(req, res) {
        try {
            // O userId foi injetado pelo nosso authMiddleware!
            const userId = req.userId;
            const { song_api_id, title, artist, cover_url } = req.body;
            // Salva no banco conectando ao usuário logado
            const favorite = await db_1.prisma.favoriteSong.create({
                data: {
                    song_api_id,
                    title,
                    artist,
                    cover_url,
                    user_id: userId,
                },
            });
            return res.status(201).json({ message: 'Música adicionada aos favoritos!', favorite });
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao salvar música.', detalhes: error.message });
        }
    }
    // 3. Lista as músicas favoritas do usuário logado
    async listFavorites(req, res) {
        try {
            const userId = req.userId;
            // Busca no banco apenas as músicas deste usuário
            const favorites = await db_1.prisma.favoriteSong.findMany({
                where: { user_id: userId },
                orderBy: { created_at: 'desc' } // Mostra as adicionadas mais recentemente primeiro
            });
            return res.json(favorites);
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao listar favoritos.' });
        }
    }
    // No seu controller (ex: MusicController.ts)
    async getFullFeed(req, res) {
        try {
            const userId = req.userId;
            // Busca as duas listas em paralelo para ser mais rápido
            const [songs, movies] = await Promise.all([
                db_1.prisma.favoriteSong.findMany({ where: { user_id: userId } }),
                db_1.prisma.favoriteMovie.findMany({ where: { user_id: userId } })
            ]);
            return res.json({
                songs,
                movies
            });
        }
        catch (error) {
            // Agora vamos ver a fofoca completa do erro!
            console.error(error);
            return res.status(500).json({
                error: 'Erro ao carregar o feed de favoritos.',
                detalhes: error.message || String(error)
            });
        }
    }
    // Remove a música dos favoritos
    async removeFavorite(req, res) {
        try {
            const userId = req.userId;
            const { id } = req.params; // Pega o ID da URL
            // deleteMany garante que só vai deletar se o ID existir E pertencer a este usuário
            await db_1.prisma.favoriteSong.deleteMany({
                where: { id: id, user_id: userId },
            });
            return res.json({ message: 'Música removida!' });
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao remover música.' });
        }
    }
}
exports.MusicController = MusicController;
//# sourceMappingURL=MusicController.js.map