import AnalyticsRepository from './analytics.repository';

export class AnalyticsService {
  constructor(private readonly repo: AnalyticsRepository) {}
  list(tenantId: string, q: any) { return this.repo.list(tenantId, q); }
  stats(tenantId: string, q: any) { return this.repo.stats(tenantId, q); }
  timeseries(tenantId: string, q: any) { return this.repo.timeseries(tenantId, q); }
  listEvents(tenantId: string, propertyId: string, type?: string) { return this.repo.listEvents(tenantId, propertyId, type); }
  addEvent(tenantId: string, propertyId: string, dto: any, customerId?: string) { return this.repo.addEvent(tenantId, propertyId, dto, customerId); }
}

export default AnalyticsService;


