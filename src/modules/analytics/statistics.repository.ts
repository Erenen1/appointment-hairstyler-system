import { Op } from 'sequelize';
import { sequelize } from '../../config/database';

export class StatisticsRepository {
  private get Property() { return sequelize.models.ListingsProperty as any; }
  private get Customer() { return sequelize.models.CrmCustomer as any; }
  private get Income() { return sequelize.models.FinanceIncome as any; }
  private get Expense() { return sequelize.models.FinanceExpense as any; }
  private get Appointment() { return sequelize.models.ScheduleAppointment as any; }

  async summary(tenantId: string) {
    const where = { tenant_id: tenantId } as any;
    const [totalProperties, totalsRow, avgPriceRow, byCategory] = await Promise.all([
      this.Property.count({ where }),
      this.Property.findOne({ where, attributes: [[sequelize.fn('SUM', sequelize.col('views')), 'views'], [sequelize.fn('SUM', sequelize.col('clicks')), 'clicks']] }),
      this.Property.findOne({ where, attributes: [[sequelize.fn('AVG', sequelize.col('price')), 'avgPrice']] }),
      this.Property.findAll({ where, attributes: ['category', [sequelize.fn('COUNT', '*'), 'c']], group: ['category'] }),
    ]);
    const totalViews = Number(totalsRow?.get?.('views') || 0);
    const totalClicks = Number(totalsRow?.get?.('clicks') || 0);
    const avgPrice = Number(avgPriceRow?.get?.('avgPrice') || 0);
    const byCategoryArr = byCategory.map((r:any)=>({ category: r.get('category'), count: Number(r.get('c')) }));
    return { totalProperties, totalViews, totalClicks, avgPrice, byCategory: byCategoryArr };
  }

  async timeseries(tenantId: string, metric: string, range = '30d', groupBy: 'day' | 'week' | 'month' = 'day') {
    const now = new Date();
    const days = range === '90d' ? 90 : range === '7d' ? 7 : 30;
    const start = new Date(now.getTime() - days*24*60*60*1000);
    const fmt = groupBy === 'week' ? 'IYYY-IW' : groupBy === 'month' ? 'IYYY-MM' : 'YYYY-MM-DD';
    let table: any = this.Property; let column = 'views';
    if (metric === 'avgPrice') { column = 'price'; }
    // newCustomers için CRM tablosu
    if (metric === 'newCustomers') { table = this.Customer; column = 'id'; }
    const rows = await table.findAll({
      where: metric === 'newCustomers' ? { tenant_id: tenantId, created_at: { [Op.gte]: start } } : { tenant_id: tenantId, updated_at: { [Op.gte]: start } },
      attributes: [[sequelize.fn('to_char', sequelize.fn('date_trunc', groupBy, sequelize.col(metric === 'newCustomers' ? 'created_at' : 'updated_at')), fmt), 'label'],
        [metric === 'avgPrice' ? sequelize.fn('AVG', sequelize.col(column)) : sequelize.fn('SUM', sequelize.col(column)), 'value']
      ],
      group: [sequelize.literal('label')],
      order: [sequelize.literal('label ASC')],
      raw: true,
    });
    return {
      labels: rows.map((r:any)=>r.label),
      datasets: [{ label: metric, data: rows.map((r:any)=>Number(r.value||0)) }]
    };
  }

  async dashboardSummary(tenantId: string, range = '30d') {
    const now = new Date();
    const start = range === 'ytd' ? new Date(new Date().getFullYear(), 0, 1) : new Date(now.getTime() - (range === '90d' ? 90 : range === '7d' ? 7 : 30)*24*60*60*1000);
    const whereTenant = { tenant_id: tenantId } as any;
    const [totalProperties, activeProperties, totalCustomers, apptToday, apptWeek, apptMonth, incomeTotalRow, expenseTotalRow, topProperty] = await Promise.all([
      this.Property.count({ where: whereTenant }),
      this.Property.count({ where: { ...whereTenant, status: 'active' } }),
      this.Customer.count({ where: whereTenant }),
      this.Appointment.count({ where: { ...whereTenant, appointment_date: { [Op.eq]: new Date().toISOString().slice(0,10) } } }),
      this.Appointment.count({ where: { ...whereTenant, appointment_date: { [Op.gte]: start } } }),
      this.Appointment.count({ where: { ...whereTenant, appointment_date: { [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }),
      this.Income.findOne({ where: { ...whereTenant, date: { [Op.gte]: start } }, attributes: [[sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('amount')), 0), 'total']] }),
      this.Expense.findOne({ where: { ...whereTenant, date: { [Op.gte]: start } }, attributes: [[sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('amount')), 0), 'total']] }),
      this.Property.findOne({ where: whereTenant, order: [[sequelize.col('views'), 'DESC']], attributes: ['id', 'title', 'views', 'clicks'] }),
    ]);
    const incomeTotal = Number(incomeTotalRow?.get?.('total') || 0);
    const expenseTotal = Number(expenseTotalRow?.get?.('total') || 0);
    return {
      totals: { totalProperties, activeProperties, totalCustomers },
      appointments: { today: apptToday, thisWeek: apptWeek, thisMonth: apptMonth },
      finance: { income: incomeTotal, expense: expenseTotal, net: incomeTotal - expenseTotal },
      engagement: { whatsappActiveChats: 0, topProperty },
      range,
      generatedAt: new Date().toISOString(),
    };
  }

  async dashboardTopProperties(tenantId: string, limit = 5, range = '30d', sort: 'views' | 'clicks' | 'favorites' = 'views') {
    const order = [[sequelize.col(sort), 'DESC']];
    const where = { tenant_id: tenantId } as any;
    const items = await this.Property.findAll({ where, order, limit });
    return { items: items.map((i:any)=>({ id: i.id, title: i.title, price: i.price, type: i.type, category: i.category, area: i.area, views: i.views, clicks: i.clicks, isFeatured: i.is_featured, status: i.status, createdAt: i.created_at })), total: items.length };
  }

  async dashboardUpcomingAppointments(tenantId: string, limit = 5, from = 'today', staffId?: string) {
    const startDate = from === 'today' ? new Date().toISOString().slice(0,10) : from;
    const where: any = { tenant_id: tenantId, appointment_date: { [Op.gte]: startDate } };
    if (staffId) where.staff_id = staffId;
    const items = await this.Appointment.findAll({ where, order: [['appointment_date','ASC'], ['start_time','ASC']], limit });
    return { items: items.map((i:any)=>({ id: i.id, appointmentDate: i.appointment_date, startTime: i.start_time, endTime: i.end_time })), total: items.length };
  }

  async dashboardFinancialOverview(tenantId: string, range = '30d') {
    const now = new Date();
    const start = new Date(now.getTime() - (range === '90d' ? 90 : range === '7d' ? 7 : 30)*24*60*60*1000);
    const where = { tenant_id: tenantId, date: { [Op.gte]: start } } as any;
    const [incomeTotalRow, expenseTotalRow, byCategoryInc, byCategoryExp] = await Promise.all([
      this.Income.findOne({ where, attributes: [[sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('amount')), 0), 'total']] }),
      this.Expense.findOne({ where, attributes: [[sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('amount')), 0), 'total']] }),
      this.Income.findAll({ where, attributes: ['category_id', [sequelize.fn('SUM', sequelize.col('amount')), 'total']], group: ['category_id'] }),
      this.Expense.findAll({ where, attributes: ['category_id', [sequelize.fn('SUM', sequelize.col('amount')), 'total']], group: ['category_id'] }),
    ]);
    const incomeTotal = Number(incomeTotalRow?.get?.('total') || 0);
    const expenseTotal = Number(expenseTotalRow?.get?.('total') || 0);
    return {
      incomeTotal,
      expenseTotal,
      net: incomeTotal - expenseTotal,
      byCategory: [
        ...byCategoryInc.map((r:any)=>({ category: r.get('category_id'), total: Number(r.get('total')) })),
        ...byCategoryExp.map((r:any)=>({ category: r.get('category_id'), total: Number(r.get('total')) })),
      ],
      byMonth: []
    };
  }
}

export default StatisticsRepository;


