import { Op, literal } from 'sequelize';
import { sequelize } from '../../config/database';
import { AnalyticsListQuery, AnalyticsStatsQuery, AnalyticsTimeseriesQuery, CreateEventDTO } from './types/analytics.types';

export class AnalyticsRepository {
  private get Property() { return sequelize.models.ListingsProperty as any; }
  private get Event() { return sequelize.models.ListingsPropertyEvent as any; }

  async list(ownerUserId: string, q: AnalyticsListQuery) {
    const page = q.page && q.page > 0 ? q.page : 1;
    const pageSize = q.pageSize && q.pageSize > 0 ? q.pageSize : 20;
    const where: any = { owner_user_id: ownerUserId };
    const toArr = (v?: string | string[]) => v ? (Array.isArray(v) ? v : [v]) : undefined;
    if (q.type) where.type = { [Op.in]: toArr(q.type) };
    if (q.category) where.category = { [Op.in]: toArr(q.category) };
    if (q.status) where.status = { [Op.in]: toArr(q.status) };
    if (q.priceMin !== undefined) where.price = { [Op.gte]: q.priceMin };
    if (q.priceMax !== undefined) where.price = { ...(where.price || {}), [Op.lte]: q.priceMax };
    if (q.areaMin !== undefined) where.area = { [Op.gte]: q.areaMin };
    if (q.areaMax !== undefined) where.area = { ...(where.area || {}), [Op.lte]: q.areaMax };
    const order = q.sort === 'price' ? ['price','ASC']
      : q.sort === '-price' ? ['price','DESC']
      : q.sort === 'clicks' ? ['clicks','ASC']
      : q.sort === '-clicks' ? ['clicks','DESC']
      : q.sort === 'views' ? ['views','ASC']
      : ['views','DESC'];
    const { rows, count } = await this.Property.findAndCountAll({ where, order: [order as any], offset: (page-1)*pageSize, limit: pageSize });
    const items = rows.map((r:any)=>({
      id: r.id,
      title: r.title,
      price: r.price,
      type: r.type,
      category: r.category,
      area: r.area,
      rooms: r.rooms_label,
      district: r.district_name,
      views: r.views,
      clicks: r.clicks,
      isFeatured: r.is_featured,
      status: r.status,
      createdAt: r.created_at,
    }));
    return { items, pagination: { page, pageSize, total: count } };
  }

  async stats(ownerUserId: string, q: AnalyticsStatsQuery) {
    const where: any = { owner_user_id: ownerUserId };
    const [totalProperties, activeProperties, soldProperties, rentedProperties, avgPriceRow] = await Promise.all([
      this.Property.count({ where }),
      this.Property.count({ where: { ...where, status: 'active' } }),
      this.Property.count({ where: { ...where, status: 'sold' } }),
      this.Property.count({ where: { ...where, status: 'rented' } }),
      this.Property.findOne({ where, attributes: [[sequelize.fn('AVG', sequelize.col('price')), 'avgPrice']] }),
    ]);
    const avgPrice = Number(avgPriceRow?.get?.('avgPrice') || 0);
    // distributions
    const typeCounts = await this.Property.findAll({ where, attributes: ['type', [sequelize.fn('COUNT', '*'), 'c']], group: ['type'] });
    const categoryCounts = await this.Property.findAll({ where, attributes: ['category', [sequelize.fn('COUNT', '*'), 'c']], group: ['category'] });
    const type: Record<string, number> = {};
    for (const r of typeCounts) type[r.get('type')] = Number(r.get('c'));
    const category: Record<string, number> = {};
    for (const r of categoryCounts) category[r.get('category')] = Number(r.get('c'));
    // totals
    const totalsRow = await this.Property.findOne({ where, attributes: [[sequelize.fn('SUM', sequelize.col('views')), 'views'], [sequelize.fn('SUM', sequelize.col('clicks')), 'clicks']] });
    const totals = { views: Number(totalsRow?.get?.('views') || 0), clicks: Number(totalsRow?.get?.('clicks') || 0) };
    return { totalProperties, activeProperties, soldProperties, rentedProperties, totals, avgPrice, distributions: { type, category } };
  }

  async timeseries(ownerUserId: string, q: AnalyticsTimeseriesQuery) {
    const now = new Date();
    const days = q.range === '90d' ? 90 : q.range === '7d' ? 7 : 30;
    const start = new Date(now.getTime() - days*24*60*60*1000);
    // Bu örnekte property table üzerindeki toplamlar yerine events'ten türetmek de mümkün
    const group = q.groupBy || 'day';
    const fmt = group === 'week' ? 'IYYY-IW' : group === 'month' ? 'IYYY-MM' : 'YYYY-MM-DD';
    const metricCol = q.metric === 'clicks' ? 'clicks' : q.metric === 'favorites' ? 'favorites' : 'views';
    const rows = await this.Property.findAll({
      where: { owner_user_id: ownerUserId, updated_at: { [Op.gte]: start } },
      attributes: [[sequelize.fn('to_char', sequelize.fn('date_trunc', group, sequelize.col('updated_at')), fmt), 'label'], [sequelize.fn('SUM', sequelize.col(metricCol)), 'value']],
      group: [literal('label')],
      order: [literal('label ASC')],
      raw: true,
    });
    const labels = rows.map((r:any)=>r.label);
    const datasets = [{ label: q.metric, data: rows.map((r:any)=>Number(r.value||0)) }];
    return { labels, datasets };
  }

  async listEvents(ownerUserId: string, propertyId: string, type?: string) {
    const where: any = { owner_user_id: ownerUserId, property_id: propertyId };
    if (type) where.event_type = type;
    const items = await this.Event.findAll({ where, order: [['occurred_at','DESC']], limit: 200 });
    return items.map((i:any)=>({ id: i.id, eventType: i.event_type, occurredAt: i.occurred_at, metadata: i.metadata }));
  }

  async addEvent(ownerUserId: string, propertyId: string, dto: CreateEventDTO, customerId?: string) {
    const e = await this.Event.create({ owner_user_id: ownerUserId, property_id: propertyId, customer_id: customerId, event_type: dto.eventType, metadata: dto.metadata });
    return { id: e.id, eventType: e.event_type, occurredAt: e.occurred_at };
  }
}

export default AnalyticsRepository;


