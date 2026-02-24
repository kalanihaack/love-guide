import { Request, Response } from 'express';
import { prisma } from '../config/db';

export class MovieController {
  // Busca filmes no TMDB
  async search(req: Request, res: Response) {
    try {
      const { query } = req.query;
      const apiKey = process.env.TMDB_API_KEY;

      if (!query) {
        return res.status(400).json({ error: 'Informe o nome do filme para busca.' });
      }

      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(String(query))}&language=pt-BR`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            accept: 'application/json'
          }
        }
      );

      const data = await response.json();
      
      const movies = data.results.map((movie: any) => ({
        api_id: String(movie.id),
        title: movie.title,
        overview: movie.overview,
        poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
        release_date: movie.release_date
      }));

      return res.json(movies);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao conectar com a API do TMDB.' });
    }
  }

  // Adiciona o filme aos favoritos
  async addFavorite(req: Request, res: Response) {
    try {
      const userId = (req as any).userId; 
      const { movie_api_id, title, poster_url, overview } = req.body;

      const favorite = await prisma.favoriteMovie.create({
        data: {
          movie_api_id: String(movie_api_id),
          title,
          cover_url: poster_url, // <-- O SEGREDO ESTÁ AQUI! Passamos o valor de 'poster_url' para a coluna 'cover_url'
          overview,
          user_id: userId,
        },
      });

      return res.status(201).json({ message: 'Filme adicionado aos favoritos!', favorite });
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao salvar filme.', detalhes: error.message });
    }
  }
  // Remove o filme dos favoritos
  async removeFavorite(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;

      await prisma.favoriteMovie.deleteMany({
        where: { id: id, user_id: userId },
      });

      return res.json({ message: 'Filme removido!' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover filme.' });
    }
  }
// Atualiza a nota do filme
  async updateRating(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const { rating } = req.body;

      const updatedMovie = await prisma.favoriteMovie.updateMany({
        where: { id: id, user_id: userId },
        data: { rating: Number(rating) }
      });

      return res.json({ message: 'Nota atualizada!', updatedMovie });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao dar nota.' });
    }
  }
} // <-- A chave que estava faltando para fechar a classe!
