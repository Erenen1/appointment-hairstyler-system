import { Request, Response, NextFunction } from 'express';
import { ApiSuccess } from '../../utils/ApiResponse';
import CustomerService from './customer.service';
import { AuthRequest } from '../../middleware/auth';

export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId as string;
      const result = await this.service.list(tenantId, req.query as any, req.user?.userId);
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
      const tenantId = req.user?.tenantId as string;
      const data = await this.service.get(tenantId, req.params.id, req.user?.userId);
      res.json(ApiSuccess.item(data));
    } catch (err) { next(err); }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId as string;
      const data = await this.service.create(tenantId, req.body, req.user?.userId);
      res.status(201).json(ApiSuccess.created(data));
    } catch (err) { next(err); }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId as string;
      const data = await this.service.update(tenantId, req.params.id, req.body, req.user?.userId);
      res.json(ApiSuccess.updated(data));
    } catch (err) { next(err); }
  };

  remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId as string;
      await this.service.remove(tenantId, req.params.id, req.user?.userId);
      res.json(ApiSuccess.deleted());
    } catch (err) { next(err); }
  };

  getPreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId as string;
      const data = await this.service.getPreferences(tenantId, req.params.id);
      res.json(ApiSuccess.item(data));
    } catch (err) { next(err); }
  };

  updatePreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId as string;
      const data = await this.service.updatePreferences(tenantId, req.params.id, req.body);
      res.json(ApiSuccess.updated(data));
    } catch (err) { next(err); }
  };

  getViewedProperties = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId as string;
      const data = await this.service.getViewedProperties(tenantId, req.params.id);
      res.json(ApiSuccess.item(data));
    } catch (err) { next(err); }
  };

  addViewedProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId as string;
      const { propertyId } = req.body as { propertyId: string };
      const data = await this.service.addViewedProperty(tenantId, req.params.id, propertyId);
      res.json(ApiSuccess.item(data));
    } catch (err) { next(err); }
  };

  removeViewedProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId as string;
      const { propertyId } = req.params as any;
      const data = await this.service.removeViewedProperty(tenantId, req.params.id, propertyId);
      res.json(ApiSuccess.item(data));
    } catch (err) { next(err); }
  };

  getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId as string;
      const data = await this.service.getStats(tenantId);
      res.json(ApiSuccess.item(data));
    } catch (err) { next(err); }
  };
}

export default CustomerController;


