import { Response, NextFunction } from 'express';
import { ApiSuccess } from '../../utils/ApiResponse';
import WhatsappService from './whatsapp.service';
import { AuthRequest } from '../../middleware/auth';

export class WhatsappController {
  constructor(private readonly service: WhatsappService) {}

  getConfig = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.getConfig(req.user?.userId as string); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
  upsertConfig = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.upsertConfig(req.user?.userId as string, req.body); res.json(ApiSuccess.updated(data)); } catch (err) { next(err); }
  };

  listContacts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { search, page, pageSize } = req.query as any;
      const result = await this.service.listContacts(req.user?.userId as string, search, Number(page), Number(pageSize));
      const pagination = {
        currentPage: result.pagination.page,
        itemsPerPage: result.pagination.pageSize,
        totalItems: result.pagination.total,
        totalPages: Math.ceil(result.pagination.total / result.pagination.pageSize),
      };
      res.json(ApiSuccess.list(result.items, pagination));
    } catch (err) { next(err); }
  };
  getContact = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.getContact(req.user?.userId as string, req.params.id); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
  createContact = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.createContact(req.user?.userId as string, req.body); res.status(201).json(ApiSuccess.created(data)); } catch (err) { next(err); }
  };

  listMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const { before, after, limit } = req.query as any; const items = await this.service.listMessages(req.user?.userId as string, req.params.id, before, after, Number(limit)||50); res.json(ApiSuccess.item({ items })); } catch (err) { next(err); }
  };
  sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.sendMessage(req.user?.userId as string, req.params.id, req.body); res.status(201).json(ApiSuccess.created(data)); } catch (err) { next(err); }
  };

  stats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.stats(req.user?.userId as string); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
}

export default WhatsappController;


