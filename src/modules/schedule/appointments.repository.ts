import { Op } from 'sequelize';
import { sequelize } from '../../config/database';
import { AppointmentListQuery, CreateAppointmentDTO, UpdateAppointmentDTO } from './types/appointments.types';

export class AppointmentsRepository {
  private get Appointment() { return sequelize.models.ScheduleAppointment as any; }
  private get Status() { return sequelize.models.ScheduleAppointmentStatus as any; }
  private get Service() { return sequelize.models.ScheduleService as any; }
  private get Staff() { return sequelize.models.ScheduleStaff as any; }
  private get Customer() { return sequelize.models.CrmCustomer as any; }
  private get History() { return sequelize.models.ScheduleAppointmentHistory as any; }

  async list(tenantId: string, q: AppointmentListQuery) {
    const page = q.page && q.page > 0 ? q.page : 1;
    const pageSize = q.pageSize && q.pageSize > 0 ? q.pageSize : 20;
    const where: any = { tenant_id: tenantId };
    if (q.startDate) where.appointment_date = { [Op.gte]: q.startDate };
    if (q.endDate) where.appointment_date = { ...(where.appointment_date || {}), [Op.lte]: q.endDate };
    if (q.customerId) where.customer_id = q.customerId;
    if (q.serviceId) where.service_id = q.serviceId;
    if (q.staffId) where.staff_id = q.staffId;
    if (q.statusId) where.status_id = q.statusId;
    const sort = q.sort === '-appointmentDate' ? ['appointment_date', 'DESC'] : ['appointment_date', 'ASC'];

    const { rows, count } = await this.Appointment.findAndCountAll({ where, order: [sort as any], offset: (page-1)*pageSize, limit: pageSize });
    return { items: rows.map((r: any)=>r.toJSON()), pagination: { page, pageSize, total: count } };
  }

  async getById(tenantId: string, id: string) {
    const a = await this.Appointment.findOne({ where: { id, tenant_id: tenantId } });
    return a ? a.toJSON() : null;
  }

  async create(tenantId: string, dto: CreateAppointmentDTO) {
    const created = await this.Appointment.create({
      tenant_id: tenantId,
      customer_id: dto.customerId,
      staff_id: dto.staffId,
      service_id: dto.serviceId,
      status_id: dto.statusId,
      appointment_date: dto.appointmentDate,
      start_time: dto.startTime,
      end_time: dto.endTime,
      notes: dto.notes,
      price: dto.price,
    });
    return this.getById(tenantId, created.id);
  }

  async update(tenantId: string, id: string, dto: UpdateAppointmentDTO) {
    const existing = await this.Appointment.findOne({ where: { id, tenant_id: tenantId } });
    if (!existing) return null;
    await existing.update({
      customer_id: dto.customerId ?? existing.customer_id,
      staff_id: dto.staffId ?? existing.staff_id,
      service_id: dto.serviceId ?? existing.service_id,
      status_id: dto.statusId ?? existing.status_id,
      appointment_date: dto.appointmentDate ?? existing.appointment_date,
      start_time: dto.startTime ?? existing.start_time,
      end_time: dto.endTime ?? existing.end_time,
      notes: dto.notes ?? existing.notes,
      price: dto.price ?? existing.price,
    });
    return this.getById(tenantId, id);
  }

  async remove(tenantId: string, id: string) {
    const existing = await this.Appointment.findOne({ where: { id, tenant_id: tenantId } });
    if (!existing) return false;
    await existing.destroy();
    return true;
  }

  async getHistory(id: string) {
    const items = await this.History.findAll({ where: { appointment_id: id }, order: [['changed_at', 'DESC']] });
    return items.map((i: any) => ({
      from_status_id: i.from_status_id,
      to_status_id: i.to_status_id,
      changed_by: i.changed_by,
      changed_at: i.changed_at,
      note: i.note,
    }));
  }

  async addHistory(id: string, toStatusId: string, userId?: string, note?: string) {
    const last = await this.History.findOne({ where: { appointment_id: id }, order: [['changed_at','DESC']] });
    await this.History.create({ appointment_id: id, from_status_id: last?.to_status_id, to_status_id: toStatusId, changed_by: userId, note });
    return this.getHistory(id);
  }

  async listServices(tenantId: string) {
    const items = await this.Service.findAll({ where: { tenant_id: tenantId }, order: [['title', 'ASC']] });
    return items.map((i: any) => ({ id: i.id, title: i.title, price: i.price, duration: i.duration_mins }));
  }
  async listStaff(tenantId: string) {
    const items = await this.Staff.findAll({ where: { tenant_id: tenantId, is_active: true }, order: [['full_name', 'ASC']] });
    return items.map((i: any) => ({ id: i.id, fullName: i.full_name }));
  }
  async listStatuses(tenantId: string) {
    const items = await this.Status.findAll({ where: { tenant_id: tenantId }, order: [['display_name', 'ASC']] });
    return items.map((i: any) => ({ id: i.id, displayName: i.display_name, color: i.color }));
  }
}

export default AppointmentsRepository;


