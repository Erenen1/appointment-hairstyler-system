import { ApiError } from '../../utils/ApiError';
import ListingsRepository from './listings.repository';
import { CreatePropertyDTO, CreatePropertyEventDTO, CreatePropertyImageDTO, PropertyListQuery, UpdatePropertyDTO } from './types/listings.types';

export class ListingsService {
  constructor(private readonly repo: ListingsRepository) {}

  async list(q: PropertyListQuery, ownerUserId?: string) { return this.repo.list(q, ownerUserId); }
  async get(id: string, ownerUserId?: string) { const p = await this.repo.getById(id, ownerUserId); if (!p) throw ApiError.notFound('İlan bulunamadı'); return p; }
  async create(dto: CreatePropertyDTO, ownerUserId?: string) { return this.repo.create(dto, ownerUserId); }
  async update(id: string, dto: UpdatePropertyDTO, ownerUserId?: string) { const p = await this.repo.update(id, dto, ownerUserId); if (!p) throw ApiError.notFound('İlan bulunamadı'); return p; }
  async remove(id: string, ownerUserId?: string) { const ok = await this.repo.remove(id, ownerUserId); if (!ok) throw ApiError.notFound('İlan bulunamadı'); return true; }

  async addImages(id: string, images: CreatePropertyImageDTO[]) { return this.repo.addImages(id, images); }
  async setTags(id: string, tags: string[]) { await this.repo.setTags(id, id, tags); return { ok: true }; }
  async setAmenities(id: string, names: string[]) { await this.repo.setAmenities(id, id, names); return { ok: true }; }
  async listEvents(id: string, type?: string) { 
    const items = await this.repo.listEvents(id, id, type); 
    return { items }; 
  }
  async addEvent(id: string, dto: CreatePropertyEventDTO, customerId?: string) { 
    return this.repo.addEvent(id, id, dto, customerId); 
  }
}

export default ListingsService;


