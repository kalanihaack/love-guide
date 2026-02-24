"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieController = void 0;
const express_1 = require("express");
const db_1 = require("../config/db");
class MovieController {
    // Busca filmes no TMDB
    async search(req, res) {
        try {
            const { query } = req.query;
            const apiKey = process.env.TMDB_API_KEY;
            if (!query) {
                return res.status(400).json({ error: 'Informe o nome do filme para busca.' });
            }
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(String(query))}&language=pt-BR`, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    accept: 'application/json'
                }
            });
            const data = await response.json();
            const movies = data.results.map((movie) => ({
                api_id: String(movie.id),
                title: movie.title,
                overview: movie.overview,
                poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                release_date: movie.release_date
            }));
            return res.json(movies);
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao conectar com a API do TMDB.' });
        }
    }
    // Adiciona o filme aos favoritos
    async addFavorite(req, res) {
        try {
            const userId = req.userId;
            const { movie_api_id, title, poster_url, overview } = req.body;
            const favorite = await db_1.prisma.favoriteMovie.create({
                data: {
                    movie_api_id: String(movie_api_id),
                    title,
                    cover_url: poster_url, // <-- O SEGREDO ESTÁ AQUI! Passamos o valor de 'poster_url' para a coluna 'cover_url'
                    overview,
                    user_id: userId,
                },
            });
            return res.status(201).json({ message: 'Filme adicionado aos favoritos!', favorite });
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao salvar filme.', detalhes: error.message });
        }
    }
    // Remove o filme dos favoritos
    async removeFavorite(req, res) {
        try {
            const userId = req.userId;
            const { id } = req.params;
            await db_1.prisma.favoriteMovie.deleteMany({
                where: { id: id, user_id: userId },
            });
            return res.json({ message: 'Filme removido!' });
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao remover filme.' });
        }
    }
} // <-- A chave que estava faltando para fechar a classe!
exports.MovieController = MovieController;
//# sourceMappingURL=MovieController.js.map