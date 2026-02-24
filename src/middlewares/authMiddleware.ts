import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Tipagem para o que tem dentro do nosso token
interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
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
    const decoded = jwt.verify(token, secret);
    
    // Extrai o ID do usuário de dentro do token
    const { id } = decoded as TokenPayload;

    // "Injeta" o ID do usuário na requisição. 
    // Assim, na hora de salvar a música, já sabemos de quem é!
    (req as any).userId = id;

    // Libera a passagem para a rota final
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}