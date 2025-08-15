import StatisticsRepository from './statistics.repository';

export class StatisticsService {
  constructor(private readonly repo: StatisticsRepository) {}
  summary(ownerUserId: string) { return this.repo.summary(ownerUserId); }
  timeseries(ownerUserId: string, q: any) { return this.repo.timeseries(ownerUserId, q.metric, q.range, q.groupBy); }
  breakdowns(ownerUserId: string, q: any) { return this.repo.summary(ownerUserId); }
  dashboardSummary(ownerUserId: string, range?: string) { return this.repo.dashboardSummary(ownerUserId, range); }
  dashboardTopProperties(ownerUserId: string, limit?: number, range?: string, sort?: any) { return this.repo.dashboardTopProperties(ownerUserId, limit, range, sort); }
  dashboardUpcomingAppointments(ownerUserId: string, limit?: number, from?: string, staffId?: string) { return this.repo.dashboardUpcomingAppointments(ownerUserId, limit, from, staffId); }
  dashboardFinancialOverview(ownerUserId: string, range?: string) { return this.repo.dashboardFinancialOverview(ownerUserId, range); }
}

export default StatisticsService;


