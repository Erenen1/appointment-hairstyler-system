import { Op } from 'sequelize';
import { sequelize } from '../../config/database';
import { CreateCurrentAccountDTO, CreateTransactionDTO, CurrentAccountListQuery, UpdateCurrentAccountDTO } from './types/current-account.types';

export class CurrentAccountRepository {
  private get Account() { return sequelize.models.FinanceCurrentAccount as any; }
  private get Tx() { return sequelize.models.FinanceCurrentAccountTransaction as any; }
  private get Customer() { return sequelize.models.CrmCustomer as any; }

  async list(tenantId: string, q: CurrentAccountListQuery) {
    const page = q.page && q.page > 0 ? q.page : 1;
    const pageSize = q.pageSize && q.pageSize > 0 ? q.pageSize : 20;
    const where: any = { tenant_id: tenantId };
    if (q.customerId) where.customer_id = q.customerId;
    if (q.status) where.status = q.status;
    if (q.minAmount !== undefined) where.balance = { [Op.gte]: q.minAmount };
    if (q.maxAmount !== undefined) where.balance = { ...(where.balance || {}), [Op.lte]: q.maxAmount };
    const order = q.sort ? [q.sort.split(':')[0], (q.sort.split(':')[1] || 'ASC').toUpperCase()] : ['updated_at', 'DESC'];
    const { rows, count } = await this.Account.findAndCountAll({ where, order: [order as any], offset: (page-1)*pageSize, limit: pageSize });
    return { items: rows.map((r:any)=>r.toJSON()), pagination: { page, pageSize, total: count } };
  }

  async getById(tenantId: string, id: string) {
    const a = await this.Account.findOne({ where: { id, tenant_id: tenantId } });
    return a ? a.toJSON() : null;
  }

  async create(tenantId: string, dto: CreateCurrentAccountDTO) {
    const created = await this.Account.create({ tenant_id: tenantId, customer_id: dto.customerId, name: dto.name, phone: dto.phone, email: dto.email });
    return this.getById(tenantId, created.id);
  }

  async update(tenantId: string, id: string, dto: UpdateCurrentAccountDTO) {
    const existing = await this.Account.findOne({ where: { id, tenant_id: tenantId } });
    if (!existing) return null;
    await existing.update({ name: dto.name ?? existing.name, phone: dto.phone ?? existing.phone, email: dto.email ?? existing.email, status: dto.status ?? existing.status });
    return this.getById(tenantId, id);
  }

  async remove(tenantId: string, id: string) {
    const existing = await this.Account.findOne({ where: { id, tenant_id: tenantId } });
    if (!existing) return false;
    await existing.destroy();
    return true;
  }

  async listTransactions(id: string, page = 1, pageSize = 20, sort?: string) {
    const order = sort === 'amount' ? ['amount','ASC'] : sort === '-amount' ? ['amount','DESC'] : sort === '-date' ? ['date','DESC'] : ['date','ASC'];
    const { rows, count } = await this.Tx.findAndCountAll({ where: { account_id: id }, order: [order as any], offset: (page-1)*pageSize, limit: pageSize });
    return { items: rows.map((r:any)=>r.toJSON()), pagination: { page, pageSize, total: count } };
  }

  async addTransaction(id: string, dto: CreateTransactionDTO) {
    await this.Tx.create({ account_id: id, tx_type: dto.txType, amount: dto.amount, description: dto.description, date: dto.date, reference: dto.reference, notes: dto.notes });
    return true;
  }

  async removeTransaction(txId: string) { await this.Tx.destroy({ where: { id: txId } }); return true; }
}

export default CurrentAccountRepository;


