import { Op } from 'sequelize';
import { sequelize } from '../../config/database';
import { CreateIncomeDTO, IncomeListQuery, UpdateIncomeDTO, IncomeCategoryDTO, UpdateIncomeCategoryDTO } from './types/income.types';

export class IncomeRepository {
  private get Income() { return sequelize.models.FinanceIncome as any; }
  private get Category() { return sequelize.models.FinanceIncomeCategory as any; }

  async list(ownerUserId: string, q: IncomeListQuery) {
    const page = q.page && q.page > 0 ? q.page : 1;
    const pageSize = q.pageSize && q.pageSize > 0 ? q.pageSize : 20;
    const where: any = { owner_user_id: ownerUserId };
    if (q.startDate) where.date = { [Op.gte]: q.startDate };
    if (q.endDate) where.date = { ...(where.date || {}), [Op.lte]: q.endDate };
    if (q.categoryId) where.category_id = q.categoryId;
    if (q.source) where.source = { [Op.iLike]: `%${q.source}%` };
    if (q.minAmount !== undefined) where.amount = { [Op.gte]: q.minAmount };
    if (q.maxAmount !== undefined) where.amount = { ...(where.amount || {}), [Op.lte]: q.maxAmount };
    const order = q.sort === 'amount' ? ['amount','ASC']
      : q.sort === '-amount' ? ['amount','DESC']
      : q.sort === '-date' ? ['date','DESC']
      : ['date','ASC'];
    const { rows, count } = await this.Income.findAndCountAll({ where, order: [order as any], offset: (page-1)*pageSize, limit: pageSize });
    return { items: rows.map((r:any)=>r.toJSON()), pagination: { page, pageSize, total: count } };
  }

  async getById(ownerUserId: string, id: string) {
    const where: any = { id, owner_user_id: ownerUserId };
    const i = await this.Income.findOne({ where });
    return i ? i.toJSON() : null;
  }

  async create(ownerUserId: string, dto: CreateIncomeDTO) {
    const created = await this.Income.create({
      owner_user_id: ownerUserId,
      category_id: dto.categoryId,
      amount: dto.amount,
      date: dto.date,
      description: dto.description,
      payment_method: dto.paymentMethod,
      source: dto.source,
    });
    return this.getById(ownerUserId, created.id);
  }

  async update(ownerUserId: string, id: string, dto: UpdateIncomeDTO) {
    const where: any = { id, owner_user_id: ownerUserId };
    const existing = await this.Income.findOne({ where });
    if (!existing) return null;
    await existing.update({
      category_id: dto.categoryId ?? existing.category_id,
      amount: dto.amount ?? existing.amount,
      date: dto.date ?? existing.date,
      description: dto.description ?? existing.description,
      payment_method: dto.paymentMethod ?? existing.payment_method,
      source: dto.source ?? existing.source,
    });
    return this.getById(ownerUserId, id);
  }

  async remove(ownerUserId: string, id: string) {
    const where: any = { id, owner_user_id: ownerUserId };
    const existing = await this.Income.findOne({ where });
    if (!existing) return false;
    await existing.destroy();
    return true;
  }

  // Categories
  async listCategories(ownerUserId: string) {
    const items = await this.Category.findAll({ where: { owner_user_id: ownerUserId }, order: [['name','ASC']] });
    return items.map((i:any)=>({ id: i.id, name: i.name, description: i.description, color: i.color }));
  }
  async createCategory(ownerUserId: string, dto: IncomeCategoryDTO) {
    const created = await this.Category.create({ owner_user_id: ownerUserId, name: dto.name, description: dto.description, color: dto.color });
    return { id: created.id, name: created.name, description: created.description, color: created.color };
  }
  async updateCategory(ownerUserId: string, id: string, dto: UpdateIncomeCategoryDTO) {
    const existing = await this.Category.findOne({ where: { id, owner_user_id: ownerUserId } });
    if (!existing) return null;
    await existing.update({
      name: dto.name ?? existing.name,
      description: dto.description ?? existing.description,
      color: dto.color ?? existing.color,
    });
    return { id: existing.id, name: existing.name, description: existing.description, color: existing.color };
  }
  async removeCategory(ownerUserId: string, id: string) {
    const existing = await this.Category.findOne({ where: { id, owner_user_id: ownerUserId } });
    if (!existing) return false;
    await existing.destroy();
    return true;
  }
}

export default IncomeRepository;


