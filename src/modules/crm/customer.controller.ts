import { Request, Response, NextFunction } from 'express';
import { ApiSuccess } from '../../utils/ApiResponse';
import CustomerService from './customer.service';
import { AuthRequest } from '../../middleware/auth';

export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.list(req.user?.userId as string, req.query as any, req.user?.userId);
      const pagination = {
        currentPage: result.pagination.page,
        itemsPerPage: result.pagination.pageSize,
        totalItems: result.pagination.total,
        totalPages: Math.ceil(result.pagination.total / result.pagination.pageSize),
      };
      res.json(ApiSuccess.list(result.items, pagination));
    } catch (err) { next(err); }
  };

  get = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.get(req.user?.userId as string, req.params.id, req.user?.userId);
      res.json(ApiSuccess.item(data));
    } catch (err) { next(err); }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.create(req.user?.userId as string, req.body, req.user?.userId);
      res.status(201).json(ApiSuccess.created(data));
    } catch (err) { next(err); }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.update(req.user?.userId as string, req.params.id, req.body, req.user?.userId);
      res.json(ApiSuccess.updated(data));
    } catch (err) { next(err); }
  };

  remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.service.remove(req.user?.userId as string, req.params.id, req.user?.userId);
      res.json(ApiSuccess.deleted());
    } catch (err) { next(err); }
  };

  getPreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getPreferences(req.user?.userId as string, req.params.id);
      res.json(ApiSuccess.item(data));
    } catch (err) { next(err); }
  };

  updatePreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.updatePreferences(req.user?.userId as string, req.params.id, req.body);
      res.json(ApiSuccess.updated(data));
    } catch (err) { next(err); }
  };

  getViewedProperties = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getViewedProperties(req.user?.userId as string, req.params.id);
      res.json(ApiSuccess.item(data));
    } catch (err) { next(err); }
  };

  addViewedProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { propertyId } = req.body as { propertyId: string };
      const data = await this.service.addViewedProperty(req.user?.userId as string, req.params.id, propertyId);
      res.json(ApiSuccess.item(data));
    } catch (err) { next(err); }
  };

  removeViewedProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { propertyId } = req.params as any;
      const data = await this.service.removeViewedProperty(req.user?.userId as string, req.params.id, propertyId);
      res.json(ApiSuccess.item(data));
    } catch (err) { next(err); }
  };

  getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getStats(req.user?.userId as string);
      res.json(ApiSuccess.item(data));
    } catch (err) { next(err); }
  };
}

export default CustomerController;


