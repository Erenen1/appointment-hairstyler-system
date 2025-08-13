import { ApiError } from '../../utils/ApiError';
import IncomeRepository from './income.repository';
import { CreateIncomeDTO, IncomeCategoryDTO, IncomeListQuery, UpdateIncomeCategoryDTO, UpdateIncomeDTO } from './types/income.types';

export class IncomeService {
  constructor(private readonly repo: IncomeRepository) {}

  async list(tenantId: string, q: IncomeListQuery) { return this.repo.list(tenantId, q); }
  async get(tenantId: string, id: string) {
    const data = await this.repo.getById(tenantId, id);
    if (!data) throw ApiError.notFound('Gelir bulunamadı');
    return data;
  }
  async create(tenantId: string, dto: CreateIncomeDTO) { return this.repo.create(tenantId, dto); }
  async update(tenantId: string, id: string, dto: UpdateIncomeDTO) {
    const data = await this.repo.update(tenantId, id, dto);
    if (!data) throw ApiError.notFound('Gelir bulunamadı');
    return data;
  }
  async remove(tenantId: string, id: string) {
    const ok = await this.repo.remove(tenantId, id);
    if (!ok) throw ApiError.notFound('Gelir bulunamadı');
    return true;
  }

  // categories
  async listCategories(tenantId: string) { return this.repo.listCategories(tenantId); }
  async createCategory(tenantId: string, dto: IncomeCategoryDTO) { return this.repo.createCategory(tenantId, dto); }
  async updateCategory(tenantId: string, id: string, dto: UpdateIncomeCategoryDTO) {
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

export default IncomeService;


