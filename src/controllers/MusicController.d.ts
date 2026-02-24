import { Request, Response } from 'express';
export declare class MusicController {
    search(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    addFavorite(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    listFavorites(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getFullFeed(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    removeFavorite(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=MusicController.d.ts.map