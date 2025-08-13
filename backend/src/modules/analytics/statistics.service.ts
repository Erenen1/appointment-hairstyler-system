import StatisticsRepository from './statistics.repository';

export class StatisticsService {
  constructor(private readonly repo: StatisticsRepository) {}
  summary(tenantId: string) { return this.repo.summary(tenantId); }
  timeseries(tenantId: string, q: any) { return this.repo.timeseries(tenantId, q.metric, q.range, q.groupBy); }
  breakdowns(tenantId: string, q: any) { return this.repo.summary(tenantId); }
  dashboardSummary(tenantId: string, range?: string) { return this.repo.dashboardSummary(tenantId, range); }
  dashboardTopProperties(tenantId: string, limit?: number, range?: string, sort?: any) { return this.repo.dashboardTopProperties(tenantId, limit, range, sort); }
  dashboardUpcomingAppointments(tenantId: string, limit?: number, from?: string, staffId?: string) { return this.repo.dashboardUpcomingAppointments(tenantId, limit, from, staffId); }
  dashboardFinancialOverview(tenantId: string, range?: string) { return this.repo.dashboardFinancialOverview(tenantId, range); }
}

export default StatisticsService;


