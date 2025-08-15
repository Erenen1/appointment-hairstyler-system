import { Response, NextFunction } from 'express';
import { ApiSuccess } from '../../utils/ApiResponse';
import HomeService from './home.service';
import { AuthRequest } from '../../middleware/auth';

export class HomeController {
  constructor(private readonly service: HomeService) {}

  hero = async (_req: AuthRequest, res: Response) => { res.json(ApiSuccess.item(this.service.hero())); };
  featured = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const userId = req.user?.userId as string; const { limit } = req.query as any; const items = await this.service.featuredProperties(userId, Number(limit)||6); res.json(ApiSuccess.item({ items })); } catch (err) { next(err); }
  };
  quickStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const userId = req.user?.userId as string; const data = await this.service.quickStats(userId); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
}

export default HomeController;


