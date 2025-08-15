import { ApiError } from '../../utils/ApiError';
import AppointmentsRepository from './appointments.repository';
import { AppointmentListQuery, CreateAppointmentDTO, UpdateAppointmentDTO } from './types/appointments.types';

export class AppointmentsService {
  constructor(private readonly repo: AppointmentsRepository) {}

  async list(ownerUserId: string, q: AppointmentListQuery) {
    return this.repo.list(ownerUserId, q);
  }
  async get(ownerUserId: string, id: string) {
    const data = await this.repo.getById(ownerUserId, id);
    if (!data) throw ApiError.notFound('Randevu bulunamadı');
    return data;
  }
  async create(ownerUserId: string, dto: CreateAppointmentDTO) {
    return this.repo.create(ownerUserId, dto);
  }
  async update(ownerUserId: string, id: string, dto: UpdateAppointmentDTO) {
    const data = await this.repo.update(ownerUserId, id, dto);
    if (!data) throw ApiError.notFound('Randevu bulunamadı');
    return data;
  }
  async remove(ownerUserId: string, id: string) {
    const ok = await this.repo.remove(ownerUserId, id);
    if (!ok) throw ApiError.notFound('Randevu bulunamadı');
    return true;
  }
  async history(id: string) {
    return this.repo.getHistory(id);
  }
  async addHistory(id: string, toStatusId: string, userId?: string, note?: string) {
    return this.repo.addHistory(id, toStatusId, userId, note);
  }
  async listServices(ownerUserId: string) { return this.repo.listServices(ownerUserId); }
  async listStaff(ownerUserId: string) { return this.repo.listStaff(ownerUserId); }
  async listStatuses(ownerUserId: string) { return this.repo.listStatuses(ownerUserId); }
}

export default AppointmentsService;


