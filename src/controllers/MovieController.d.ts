import { Request, Response } from 'express';
export declare class MovieController {
    search(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    addFavorite(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    removeFavorite(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=MovieController.d.ts.map