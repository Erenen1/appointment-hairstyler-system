import { ApiError } from '../../utils/ApiError';
import ListingsRepository from './listings.repository';
import { CreatePropertyDTO, CreatePropertyEventDTO, CreatePropertyImageDTO, PropertyListQuery, UpdatePropertyDTO } from './types/listings.types';

export class ListingsService {
  constructor(private readonly repo: ListingsRepository) {}

  async list(tenantId: string, q: PropertyListQuery) { return this.repo.list(tenantId, q); }
  async get(tenantId: string, id: string) { const p = await this.repo.getById(tenantId, id); if (!p) throw ApiError.notFound('İlan bulunamadı'); return p; }
  async create(tenantId: string, dto: CreatePropertyDTO) { return this.repo.create(tenantId, dto); }
  async update(tenantId: string, id: string, dto: UpdatePropertyDTO) { const p = await this.repo.update(tenantId, id, dto); if (!p) throw ApiError.notFound('İlan bulunamadı'); return p; }
  async remove(tenantId: string, id: string) { const ok = await this.repo.remove(tenantId, id); if (!ok) throw ApiError.notFound('İlan bulunamadı'); return true; }

  async addImages(_tenantId: string, id: string, images: CreatePropertyImageDTO[]) { return this.repo.addImages(id, images); }
  async setTags(tenantId: string, id: string, tags: string[]) { await this.repo.setTags(tenantId, id, tags); return { ok: true }; }
  async setAmenities(tenantId: string, id: string, names: string[]) { await this.repo.setAmenities(tenantId, id, names); return { ok: true }; }
  async listEvents(tenantId: string, id: string, type?: string) { const items = await this.repo.listEvents(tenantId, id, type); return { items }; }
  async addEvent(tenantId: string, id: string, dto: CreatePropertyEventDTO, customerId?: string) { return this.repo.addEvent(tenantId, id, dto, customerId); }
}

export default ListingsService;


