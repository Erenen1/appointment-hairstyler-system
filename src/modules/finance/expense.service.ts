import { ApiError } from '../../utils/ApiError';
import ExpenseRepository from './expense.repository';
import { CreateExpenseDTO, ExpenseCategoryDTO, ExpenseListQuery, UpdateExpenseCategoryDTO, UpdateExpenseDTO } from './types/expense.types';

export class ExpenseService {
  constructor(private readonly repo: ExpenseRepository) {}

  async list(tenantId: string, q: ExpenseListQuery, ownerUserId?: string) { return this.repo.list(tenantId, q, ownerUserId); }
  async get(tenantId: string, id: string, ownerUserId?: string) {
    const data = await this.repo.getById(tenantId, id, ownerUserId);
    if (!data) throw ApiError.notFound('Gider bulunamadı');
    return data;
  }
  async create(tenantId: string, dto: CreateExpenseDTO, ownerUserId?: string) { return this.repo.create(tenantId, dto, ownerUserId); }
  async update(tenantId: string, id: string, dto: UpdateExpenseDTO, ownerUserId?: string) {
    const data = await this.repo.update(tenantId, id, dto, ownerUserId);
    if (!data) throw ApiError.notFound('Gider bulunamadı');
    return data;
  }
  async remove(tenantId: string, id: string, ownerUserId?: string) {
    const ok = await this.repo.remove(tenantId, id, ownerUserId);
    if (!ok) throw ApiError.notFound('Gider bulunamadı');
    return true;
  }

  // categories
  async listCategories(ownerUserId: string) { return this.repo.listCategories(ownerUserId); }
  async createCategory(ownerUserId: string, dto: ExpenseCategoryDTO) { return this.repo.createCategory(ownerUserId, dto); }
  async updateCategory(ownerUserId: string, id: string, dto: UpdateExpenseCategoryDTO) {
    const data = await this.repo.updateCategory(ownerUserId, id, dto);
    if (!data) throw ApiError.notFound('Kategori bulunamadı');
    return data;
  }
  async removeCategory(ownerUserId: string, id: string) {
    const ok = await this.repo.removeCategory(ownerUserId, id);
    if (!ok) throw ApiError.notFound('Kategori bulunamadı');
    return true;
  }
}

export default ExpenseService;


