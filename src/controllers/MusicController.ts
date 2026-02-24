import { Request, Response } from 'express';
import { prisma } from '../config/db';

export class MusicController {
  // 1. Busca músicas na API do iTunes
  async search(req: Request, res: Response) {
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
      const songs = data.results.map((song: any) => ({
        api_id: String(song.trackId),
        title: song.trackName,
        artist: song.artistName,
        cover_url: song.artworkUrl100, // Capa do álbum
        preview_url: song.previewUrl   // Trecho de 30s da música (bônus para o frontend!)
      }));

      return res.json(songs);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar músicas na API externa.' });
    }
  }

  // 2. Salva a música favorita no banco de dados
  async addFavorite(req: Request, res: Response) {
    try {
      // O userId foi injetado pelo nosso authMiddleware!
      const userId = (req as any).userId;
      const { song_api_id, title, artist, cover_url } = req.body;

      // Salva no banco conectando ao usuário logado
      const favorite = await prisma.favoriteSong.create({
        data: {
          song_api_id,
          title,
          artist,
          cover_url,
          user_id: userId,
        },
      });

      return res.status(201).json({ message: 'Música adicionada aos favoritos!', favorite });
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao salvar música.', detalhes: error.message });
    }
  }

  // 3. Lista as músicas favoritas do usuário logado
  async listFavorites(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      // Busca no banco apenas as músicas deste usuário
      const favorites = await prisma.favoriteSong.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' } // Mostra as adicionadas mais recentemente primeiro
      });

      return res.json(favorites);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar favoritos.' });
    }
  }
}