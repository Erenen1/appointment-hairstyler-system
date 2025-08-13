import { Op } from 'sequelize';
import { sequelize } from '../../config/database';
import { CreateExpenseDTO, ExpenseCategoryDTO, ExpenseListQuery, UpdateExpenseCategoryDTO, UpdateExpenseDTO } from './types/expense.types';

export class ExpenseRepository {
  private get Expense() { return sequelize.models.FinanceExpense as any; }
  private get Category() { return sequelize.models.FinanceExpenseCategory as any; }

  async list(tenantId: string, q: ExpenseListQuery) {
    const page = q.page && q.page > 0 ? q.page : 1;
    const pageSize = q.pageSize && q.pageSize > 0 ? q.pageSize : 20;
    const where: any = { tenant_id: tenantId };
    if (q.startDate) where.date = { [Op.gte]: q.startDate };
    if (q.endDate) where.date = { ...(where.date || {}), [Op.lte]: q.endDate };
    if (q.categoryId) where.category_id = q.categoryId;
    if (q.minAmount !== undefined) where.amount = { [Op.gte]: q.minAmount };
    if (q.maxAmount !== undefined) where.amount = { ...(where.amount || {}), [Op.lte]: q.maxAmount };
    const order = q.sort === 'amount' ? ['amount','ASC']
      : q.sort === '-amount' ? ['amount','DESC']
      : q.sort === '-date' ? ['date','DESC']
      : ['date','ASC'];
    const { rows, count } = await this.Expense.findAndCountAll({ where, order: [order as any], offset: (page-1)*pageSize, limit: pageSize });
    return { items: rows.map((r:any)=>r.toJSON()), pagination: { page, pageSize, total: count } };
  }

  async getById(tenantId: string, id: string) {
    const i = await this.Expense.findOne({ where: { id, tenant_id: tenantId } });
    return i ? i.toJSON() : null;
  }

  async create(tenantId: string, dto: CreateExpenseDTO) {
    const created = await this.Expense.create({
      tenant_id: tenantId,
      category_id: dto.categoryId,
      amount: dto.amount,
      date: dto.date,
      description: dto.description,
      payment_method: dto.paymentMethod,
      type: dto.type,
    });
    return this.getById(tenantId, created.id);
  }

  async update(tenantId: string, id: string, dto: UpdateExpenseDTO) {
    const existing = await this.Expense.findOne({ where: { id, tenant_id: tenantId } });
    if (!existing) return null;
    await existing.update({
      category_id: dto.categoryId ?? existing.category_id,
      amount: dto.amount ?? existing.amount,
      date: dto.date ?? existing.date,
      description: dto.description ?? existing.description,
      payment_method: dto.paymentMethod ?? existing.payment_method,
      type: dto.type ?? existing.type,
    });
    return this.getById(tenantId, id);
  }

  async remove(tenantId: string, id: string) {
    const existing = await this.Expense.findOne({ where: { id, tenant_id: tenantId } });
    if (!existing) return false;
    await existing.destroy();
    return true;
  }

  // Categories
  async listCategories(tenantId: string) {
    const items = await this.Category.findAll({ where: { tenant_id: tenantId }, order: [['name','ASC']] });
    return items.map((i:any)=>({ id: i.id, name: i.name, description: i.description, color: i.color, budget: i.budget }));
  }
  async createCategory(tenantId: string, dto: ExpenseCategoryDTO) {
    const created = await this.Category.create({ tenant_id: tenantId, name: dto.name, description: dto.description, color: dto.color, budget: dto.budget });
    return { id: created.id, name: created.name, description: created.description, color: created.color, budget: created.budget };
  }
  async updateCategory(tenantId: string, id: string, dto: UpdateExpenseCategoryDTO) {
    const existing = await this.Category.findOne({ where: { id, tenant_id: tenantId } });
    if (!existing) return null;
    await existing.update({
      name: dto.name ?? existing.name,
      description: dto.description ?? existing.description,
      color: dto.color ?? existing.color,
      budget: dto.budget ?? existing.budget,
    });
    return { id: existing.id, name: existing.name, description: existing.description, color: existing.color, budget: existing.budget };
  }
  async removeCategory(tenantId: string, id: string) {
    const existing = await this.Category.findOne({ where: { id, tenant_id: tenantId } });
    if (!existing) return false;
    await existing.destroy();
    return true;
  }
}

export default ExpenseRepository;


