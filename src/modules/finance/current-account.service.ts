import { ApiError } from '../../utils/ApiError';
import CurrentAccountRepository from './current-account.repository';
import { CreateCurrentAccountDTO, CreateTransactionDTO, CurrentAccountListQuery, UpdateCurrentAccountDTO } from './types/current-account.types';

export class CurrentAccountService {
  constructor(private readonly repo: CurrentAccountRepository) {}

  async list(tenantId: string, q: CurrentAccountListQuery) { return this.repo.list(tenantId, q); }
  async get(tenantId: string, id: string) {
    const data = await this.repo.getById(tenantId, id);
    if (!data) throw ApiError.notFound('Cari hesap bulunamadı');
    return data;
  }
  async create(tenantId: string, dto: CreateCurrentAccountDTO) { return this.repo.create(tenantId, dto); }
  async update(tenantId: string, id: string, dto: UpdateCurrentAccountDTO) {
    const data = await this.repo.update(tenantId, id, dto);
    if (!data) throw ApiError.notFound('Cari hesap bulunamadı');
    return data;
  }
  async remove(tenantId: string, id: string) { const ok = await this.repo.remove(tenantId, id); if (!ok) throw ApiError.notFound('Cari hesap bulunamadı'); return true; }

  async listTransactions(id: string, page?: number, pageSize?: number, sort?: string) {
    return this.repo.listTransactions(id, page, pageSize, sort);
  }
  async addTransaction(id: string, dto: CreateTransactionDTO) { await this.repo.addTransaction(id, dto); return true; }
  async removeTransaction(txId: string) { await this.repo.removeTransaction(txId); return true; }
}

export default CurrentAccountService;


