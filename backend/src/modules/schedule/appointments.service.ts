import { ApiError } from '../../utils/ApiError';
import AppointmentsRepository from './appointments.repository';
import { AppointmentListQuery, CreateAppointmentDTO, UpdateAppointmentDTO } from './types/appointments.types';

export class AppointmentsService {
  constructor(private readonly repo: AppointmentsRepository) {}

  async list(tenantId: string, q: AppointmentListQuery) {
    return this.repo.list(tenantId, q);
  }
  async get(tenantId: string, id: string) {
    const data = await this.repo.getById(tenantId, id);
    if (!data) throw ApiError.notFound('Randevu bulunamadı');
    return data;
  }
  async create(tenantId: string, dto: CreateAppointmentDTO) {
    return this.repo.create(tenantId, dto);
  }
  async update(tenantId: string, id: string, dto: UpdateAppointmentDTO) {
    const data = await this.repo.update(tenantId, id, dto);
    if (!data) throw ApiError.notFound('Randevu bulunamadı');
    return data;
  }
  async remove(tenantId: string, id: string) {
    const ok = await this.repo.remove(tenantId, id);
    if (!ok) throw ApiError.notFound('Randevu bulunamadı');
    return true;
  }
  async history(id: string) {
    return this.repo.getHistory(id);
  }
  async addHistory(id: string, toStatusId: string, userId?: string, note?: string) {
    return this.repo.addHistory(id, toStatusId, userId, note);
  }
  async listServices(tenantId: string) { return this.repo.listServices(tenantId); }
  async listStaff(tenantId: string) { return this.repo.listStaff(tenantId); }
  async listStatuses(tenantId: string) { return this.repo.listStatuses(tenantId); }
}

export default AppointmentsService;


