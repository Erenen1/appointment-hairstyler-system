import { ApiError } from '../../utils/ApiError';
import IncomeRepository from './income.repository';
import { CreateIncomeDTO, IncomeCategoryDTO, IncomeListQuery, UpdateIncomeCategoryDTO, UpdateIncomeDTO } from './types/income.types';

export class IncomeService {
  constructor(private readonly repo: IncomeRepository) {}

  async list(_tenantId: string, q: IncomeListQuery, ownerUserId?: string) { return this.repo.list(ownerUserId as string, q); }
  async get(_tenantId: string, id: string, ownerUserId?: string) {
    const data = await this.repo.getById(ownerUserId as string, id);
    if (!data) throw ApiError.notFound('Gelir bulunamadı');
    return data;
  }
  async create(_tenantId: string, dto: CreateIncomeDTO, ownerUserId?: string) { return this.repo.create(ownerUserId as string, dto); }
  async update(_tenantId: string, id: string, dto: UpdateIncomeDTO, ownerUserId?: string) {
    const data = await this.repo.update(ownerUserId as string, id, dto);
    if (!data) throw ApiError.notFound('Gelir bulunamadı');
    return data;
  }
  async remove(_tenantId: string, id: string, ownerUserId?: string) {
    const ok = await this.repo.remove(ownerUserId as string, id);
    if (!ok) throw ApiError.notFound('Gelir bulunamadı');
    return true;
  }

  // categories
  async listCategories(ownerUserId: string) { return this.repo.listCategories(ownerUserId); }
  async createCategory(ownerUserId: string, dto: IncomeCategoryDTO) { return this.repo.createCategory(ownerUserId, dto); }
  async updateCategory(ownerUserId: string, id: string, dto: UpdateIncomeCategoryDTO) {
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

export default IncomeService;


