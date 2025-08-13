import { Op } from 'sequelize';
import { sequelize } from '../../config/database';
import { CreateCustomerDTO, CustomerListQuery, UpdateCustomerDTO } from './types/customer.types';

export class CustomerRepository {
  private get Customer() { return sequelize.models.CrmCustomer as any; }
  private get Preferred() { return sequelize.models.CrmCustomerPreferredDistrict as any; }
  private get Requirement() { return sequelize.models.CrmRequirement as any; }
  private get CustomerRequirement() { return sequelize.models.CrmCustomerRequirement as any; }
  private get Viewed() { return sequelize.models.CrmCustomerViewedProperty as any; }

  async list(tenantId: string, q: CustomerListQuery) {
    const page = q.page && q.page > 0 ? q.page : 1;
    const pageSize = q.pageSize && q.pageSize > 0 ? q.pageSize : 20;
    const where: any = { tenant_id: tenantId };
    if (q.isActive !== undefined) where.is_active = q.isActive;
    if (q.assignedAgentId) where.assigned_agent_id = q.assignedAgentId;
    if (q.preferredType) where.preferred_type = q.preferredType;
    if (q.preferredCategory) where.preferred_category = q.preferredCategory;
    if (q.search) {
      where[Op.or] = [
        { full_name: { [Op.iLike]: `%${q.search}%` } },
        { email: { [Op.iLike]: `%${q.search}%` } },
        { phone: { [Op.iLike]: `%${q.search}%` } },
      ];
    }
    const order = q.sort ? [[q.sort.split(':')[0], (q.sort.split(':')[1] || 'ASC').toUpperCase()]] : [['created_at', 'DESC']];
    const { rows, count } = await this.Customer.findAndCountAll({ where, order, offset: (page-1)*pageSize, limit: pageSize });
    return { items: rows.map((r: any) => r.toJSON()), pagination: { page, pageSize, total: count } };
  }

  async getById(tenantId: string, id: string) {
    const c = await this.Customer.findOne({ where: { id, tenant_id: tenantId } });
    return c ? c.toJSON() : null;
  }

  async create(tenantId: string, dto: CreateCustomerDTO) {
    const created = await this.Customer.create({
      tenant_id: tenantId,
      full_name: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      date_of_birth: dto.dateOfBirth,
      profession: dto.profession,
      budget: dto.budget,
      preferred_type: dto.preferredType,
      preferred_category: dto.preferredCategory,
      min_area: dto.minArea,
      max_area: dto.maxArea,
      min_rooms_label: dto.minRoomsLabel,
      is_serious_buyer: dto.isSeriousBuyer ?? false,
      customer_notes: dto.customerNotes,
      assigned_agent_id: dto.assignedAgentId,
    });
    const customer = created.toJSON();
    if (dto.preferredDistricts?.length) {
      await Promise.all(dto.preferredDistricts.map(name => this.Preferred.create({ customer_id: customer.id, district_name: name })));
    }
    if (dto.requirements?.length) {
      // create missing requirements by name
      for (const name of dto.requirements) {
        const [req] = await this.Requirement.findOrCreate({ where: { tenant_id: tenantId, name }, defaults: { tenant_id: tenantId, name } });
        await this.CustomerRequirement.findOrCreate({ where: { customer_id: customer.id, requirement_id: req.id }, defaults: { customer_id: customer.id, requirement_id: req.id } });
      }
    }
    return this.getById(tenantId, customer.id);
  }

  async update(tenantId: string, id: string, dto: UpdateCustomerDTO) {
    const existing = await this.Customer.findOne({ where: { id, tenant_id: tenantId } });
    if (!existing) return null;
    await existing.update({
      full_name: dto.fullName ?? existing.full_name,
      email: dto.email ?? existing.email,
      phone: dto.phone ?? existing.phone,
      address: dto.address ?? existing.address,
      date_of_birth: dto.dateOfBirth ?? existing.date_of_birth,
      profession: dto.profession ?? existing.profession,
      budget: dto.budget ?? existing.budget,
      preferred_type: dto.preferredType ?? existing.preferred_type,
      preferred_category: dto.preferredCategory ?? existing.preferred_category,
      min_area: dto.minArea ?? existing.min_area,
      max_area: dto.maxArea ?? existing.max_area,
      min_rooms_label: dto.minRoomsLabel ?? existing.min_rooms_label,
      is_serious_buyer: dto.isSeriousBuyer ?? existing.is_serious_buyer,
      customer_notes: dto.customerNotes ?? existing.customer_notes,
      assigned_agent_id: dto.assignedAgentId ?? existing.assigned_agent_id,
    });
    if (dto.preferredDistricts) {
      await this.Preferred.destroy({ where: { customer_id: id } });
      await Promise.all(dto.preferredDistricts.map(name => this.Preferred.create({ customer_id: id, district_name: name })));
    }
    if (dto.requirements) {
      await this.CustomerRequirement.destroy({ where: { customer_id: id } });
      for (const name of dto.requirements) {
        const [req] = await this.Requirement.findOrCreate({ where: { tenant_id: tenantId, name }, defaults: { tenant_id: tenantId, name } });
        await this.CustomerRequirement.findOrCreate({ where: { customer_id: id, requirement_id: req.id }, defaults: { customer_id: id, requirement_id: req.id } });
      }
    }
    return this.getById(tenantId, id);
  }

  async remove(tenantId: string, id: string) {
    const existing = await this.Customer.findOne({ where: { id, tenant_id: tenantId } });
    if (!existing) return false;
    await existing.destroy();
    return true;
  }

  async getPreferences(tenantId: string, customerId: string) {
    const districts = await this.Preferred.findAll({
      where: { customer_id: customerId },
      attributes: ['district_name'],
      order: [['district_name', 'ASC']]
    });
    const preferredDistricts = districts.map((d: any) => d.district_name as string);

    // join üzerinden gereksinimler
    const reqs = await this.Requirement.findAll({
      include: [{
        model: this.CustomerRequirement,
        as: undefined,
        required: true,
        where: { customer_id: customerId },
        attributes: []
      }],
      where: { tenant_id: tenantId },
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });
    const requirements = reqs.map((r: any) => ({ id: r.id, name: r.name }));
    return { preferredDistricts, requirements };
  }

  async updatePreferences(tenantId: string, customerId: string, preferredDistricts: string[] = [], requirementIds: string[] = []) {
    // districts replace
    await this.Preferred.destroy({ where: { customer_id: customerId } });
    if (preferredDistricts.length) {
      await Promise.all(preferredDistricts.map(name => this.Preferred.create({ customer_id: customerId, district_name: name })));
    }
    // requirements replace
    await this.CustomerRequirement.destroy({ where: { customer_id: customerId } });
    if (requirementIds.length) {
      await Promise.all(requirementIds.map((rid) => this.CustomerRequirement.findOrCreate({ where: { customer_id: customerId, requirement_id: rid }, defaults: { customer_id: customerId, requirement_id: rid } })));
    }
    return this.getPreferences(tenantId, customerId);
  }

  async getViewedProperties(customerId: string) {
    const items = await this.Viewed.findAll({
      where: { customer_id: customerId },
      order: [['last_viewed_at', 'DESC']],
    });
    return items.map((i: any) => ({
      propertyId: i.property_id,
      firstViewedAt: i.first_viewed_at,
      lastViewedAt: i.last_viewed_at,
      viewsCount: i.views_count,
    }));
  }

  async addViewedProperty(customerId: string, propertyId: string) {
    const existing = await this.Viewed.findOne({ where: { customer_id: customerId, property_id: propertyId } });
    if (existing) {
      await existing.update({ last_viewed_at: new Date(), views_count: (existing.views_count || 0) + 1 });
      return true;
    }
    await this.Viewed.create({ customer_id: customerId, property_id: propertyId });
    return true;
  }

  async removeViewedProperty(customerId: string, propertyId: string) {
    await this.Viewed.destroy({ where: { customer_id: customerId, property_id: propertyId } });
    return true;
  }

  async getStats(tenantId: string) {
    const whereTenant = { tenant_id: tenantId } as any;
    const [totalCustomers, activeCustomers, newCustomersThisMonth, totalBudgetRow, averageBudgetRow, topBudget] = await Promise.all([
      this.Customer.count({ where: whereTenant }),
      this.Customer.count({ where: { ...whereTenant, is_active: true } }),
      this.Customer.count({ where: { ...whereTenant, registration_date: { [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }),
      this.Customer.findOne({ where: whereTenant, attributes: [[sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('budget')), 0), 'sumBudget']] }),
      this.Customer.findOne({ where: whereTenant, attributes: [[sequelize.fn('AVG', sequelize.col('budget')), 'avgBudget']] }),
      this.Customer.findOne({ where: whereTenant, order: [[sequelize.col('budget'), 'DESC']], attributes: ['id', 'full_name', 'budget'] }),
    ]);
    const totalBudget = (totalBudgetRow?.get?.('sumBudget') as number) || 0;
    const averageBudget = Number(averageBudgetRow?.get?.('avgBudget') || 0);
    return {
      totalCustomers,
      activeCustomers,
      newCustomersThisMonth,
      totalBudget,
      averageBudget,
      topBudgetCustomer: topBudget ? { id: topBudget.id, fullName: topBudget.full_name } : null,
    };
  }
}

export default CustomerRepository;


