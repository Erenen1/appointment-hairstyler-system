import { ApiError } from '../../utils/ApiError';
import CustomerRepository from './customer.repository';
import { CreateCustomerDTO, CustomerListQuery, CustomerResponse, UpdateCustomerDTO } from './types/customer.types';

export class CustomerService {
  constructor(private readonly repo: CustomerRepository) {}

  async list(tenantId: string, q: CustomerListQuery, ownerUserId?: string) {
    return this.repo.list(tenantId, q, ownerUserId);
  }

  async get(tenantId: string, id: string, ownerUserId?: string) {
    const data = await this.repo.getById(tenantId, id, ownerUserId);
    if (!data) throw ApiError.notFound('Müşteri bulunamadı');
    return data as CustomerResponse;
  }

  async create(tenantId: string, dto: CreateCustomerDTO, ownerUserId?: string) {
    return this.repo.create(tenantId, dto, ownerUserId) as Promise<CustomerResponse>;
  }

  async update(tenantId: string, id: string, dto: UpdateCustomerDTO, ownerUserId?: string) {
    const data = await this.repo.update(tenantId, id, dto, ownerUserId);
    if (!data) throw ApiError.notFound('Müşteri bulunamadı');
    return data as CustomerResponse;
  }

  async remove(tenantId: string, id: string, ownerUserId?: string) {
    const ok = await this.repo.remove(tenantId, id, ownerUserId);
    if (!ok) throw ApiError.notFound('Müşteri bulunamadı');
    return true;
  }

  async getPreferences(tenantId: string, id: string) {
    // müşteri var mı kontrol
    await this.get(tenantId, id);
    return this.repo.getPreferences(tenantId, id);
  }

  async updatePreferences(tenantId: string, id: string, payload: { preferredDistricts?: string[]; requirementIds?: string[] }) {
    await this.get(tenantId, id);
    return this.repo.updatePreferences(tenantId, id, payload.preferredDistricts, payload.requirementIds);
  }

  async getViewedProperties(tenantId: string, id: string) {
    await this.get(tenantId, id);
    const items = await this.repo.getViewedProperties(id);
    return { items };
  }

  async addViewedProperty(tenantId: string, id: string, propertyId: string) {
    await this.get(tenantId, id);
    await this.repo.addViewedProperty(id, propertyId);
    return { ok: true };
  }

  async removeViewedProperty(tenantId: string, id: string, propertyId: string) {
    await this.get(tenantId, id);
    await this.repo.removeViewedProperty(id, propertyId);
    return { ok: true };
  }

  async getStats(tenantId: string) {
    return this.repo.getStats(tenantId);
  }
}

export default CustomerService;


