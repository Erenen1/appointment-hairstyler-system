import { sequelize } from '../../config/database';

export class HomeRepository {
  private get Property() { return sequelize.models.ListingsProperty as any; }
  private get Customer() { return sequelize.models.CrmCustomer as any; }
  private get Appointment() { return sequelize.models.ScheduleAppointment as any; }

  async featuredProperties(ownerUserId: string, limit = 6) {
    const items = await this.Property.findAll({ where: { owner_user_id: ownerUserId, is_featured: true, status: 'active' }, order: [['updated_at','DESC']], limit });
    return items.map((i:any)=>({ id: i.id, title: i.title, price: i.price, type: i.type, category: i.category, area: i.area, district: i.district_name, isFeatured: i.is_featured }));
  }

  async quickStats(ownerUserId: string) {
    const [totalProperties, activeCustomers, todayAppointments] = await Promise.all([
      this.Property.count({ where: { owner_user_id: ownerUserId } }),
      this.Customer.count({ where: { owner_user_id: ownerUserId, is_active: true } }),
      this.Appointment.count({ where: { owner_user_id: ownerUserId, appointment_date: new Date().toISOString().slice(0,10) } }),
    ]);
    return { totalProperties, activeCustomers, todayAppointments };
  }
}

export default HomeRepository;


