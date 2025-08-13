import { ApiError } from '../../utils/ApiError';
import ExpenseRepository from './expense.repository';
import { CreateExpenseDTO, ExpenseCategoryDTO, ExpenseListQuery, UpdateExpenseCategoryDTO, UpdateExpenseDTO } from './types/expense.types';

export class ExpenseService {
  constructor(private readonly repo: ExpenseRepository) {}

  async list(tenantId: string, q: ExpenseListQuery) { return this.repo.list(tenantId, q); }
  async get(tenantId: string, id: string) {
    const data = await this.repo.getById(tenantId, id);
    if (!data) throw ApiError.notFound('Gider bulunamadı');
    return data;
  }
  async create(tenantId: string, dto: CreateExpenseDTO) { return this.repo.create(tenantId, dto); }
  async update(tenantId: string, id: string, dto: UpdateExpenseDTO) {
    const data = await this.repo.update(tenantId, id, dto);
    if (!data) throw ApiError.notFound('Gider bulunamadı');
    return data;
  }
  async remove(tenantId: string, id: string) {
    const ok = await this.repo.remove(tenantId, id);
    if (!ok) throw ApiError.notFound('Gider bulunamadı');
    return true;
  }

  // categories
  async listCategories(tenantId: string) { return this.repo.listCategories(tenantId); }
  async createCategory(tenantId: string, dto: ExpenseCategoryDTO) { return this.repo.createCategory(tenantId, dto); }
  async updateCategory(tenantId: string, id: string, dto: UpdateExpenseCategoryDTO) {
    const data = await this.repo.updateCategory(tenantId, id, dto);
    if (!data) throw ApiError.notFound('Kategori bulunamadı');
    return data;
  }
  async removeCategory(tenantId: string, id: string) {
    const ok = await this.repo.removeCategory(tenantId, id);
    if (!ok) throw ApiError.notFound('Kategori bulunamadı');
    return true;
  }
}

export default ExpenseService;


