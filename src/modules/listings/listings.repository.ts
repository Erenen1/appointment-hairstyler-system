import { Op, literal } from 'sequelize';
import { sequelize } from '../../config/database';
import { CreatePropertyDTO, CreatePropertyEventDTO, CreatePropertyImageDTO, PropertyListQuery, UpdatePropertyDTO } from './types/listings.types';

export class ListingsRepository {
  private get Property() { return sequelize.models.ListingsProperty as any; }
  private get Image() { return sequelize.models.ListingsPropertyImage as any; }
  private get Amenity() { return sequelize.models.ListingsAmenity as any; }
  private get PropertyAmenity() { return sequelize.models.ListingsPropertyAmenity as any; }
  private get Tag() { return sequelize.models.ListingsTag as any; }
  private get PropertyTag() { return sequelize.models.ListingsPropertyTag as any; }
  private get Event() { return sequelize.models.ListingsPropertyEvent as any; }

  async list(q: PropertyListQuery, ownerUserId?: string) {
    const page = q.page && q.page > 0 ? q.page : 1;
    const pageSize = q.pageSize && q.pageSize > 0 ? q.pageSize : 20;
    const where: any = {};
    if (ownerUserId) where.owner_user_id = ownerUserId;
    const toArray = (v?: string | string[]) => v ? (Array.isArray(v) ? v : [v]) : undefined;
    const types = toArray(q.type); if (types) where.type = { [Op.in]: types };
    const cats = toArray(q.category); if (cats) where.category = { [Op.in]: cats };
    if (q.priceMin !== undefined) where.price = { [Op.gte]: q.priceMin };
    if (q.priceMax !== undefined) where.price = { ...(where.price || {}), [Op.lte]: q.priceMax };
    if (q.areaMin !== undefined) where.area = { [Op.gte]: q.areaMin };
    if (q.areaMax !== undefined) where.area = { ...(where.area || {}), [Op.lte]: q.areaMax };
    const statuses = toArray(q.status); if (statuses) where.status = { [Op.in]: statuses };
    const order = q.sort === 'price' ? ['price','ASC']
      : q.sort === '-price' ? ['price','DESC']
      : q.sort === 'clicks' ? ['clicks','ASC']
      : q.sort === '-clicks' ? ['clicks','DESC']
      : q.sort === 'views' ? ['views','ASC']
      : q.sort === '-views' ? ['views','DESC']
      : q.sort === '-createdAt' ? ['created_at','DESC']
      : ['created_at','ASC'];

    const { rows, count } = await this.Property.findAndCountAll({ where, order: [order as any], offset: (page-1)*pageSize, limit: pageSize });
    return { items: rows.map((r:any)=>r.toJSON()), pagination: { page, pageSize, total: count } };
  }

  async getById(id: string, ownerUserId?: string) {
    const where: any = { id };
    if (ownerUserId) where.owner_user_id = ownerUserId;
    const p = await this.Property.findOne({ where });
    if (!p) return null;
    const images = await this.Image.findAll({ where: { property_id: id }, order: [['sort_order','ASC']] });
    return { ...p.toJSON(), images: images.map((i:any)=>({ id: i.id, url: i.url, alt: i.alt, sortOrder: i.sort_order })) };
  }

  async create(dto: CreatePropertyDTO, ownerUserId?: string) {
    const created = await this.Property.create({
      owner_user_id: ownerUserId,
      title: dto.title,
      description: dto.description,
      price: dto.price,
      type: dto.type,
      category: dto.category,
      area: dto.area,
      rooms_label: dto.roomsLabel,
      bedrooms: dto.bedrooms,
      bathrooms: dto.bathrooms,
      floor: dto.floor,
      total_floors: dto.totalFloors,
      age: dto.age,
      heating: dto.heating,
      furnished: dto.furnished,
      parking: dto.parking,
      balcony: dto.balcony,
      elevator: dto.elevator,
      district_name: dto.districtName,
      city_name: dto.cityName,
      full_address: dto.fullAddress,
      lat: dto.lat,
      lng: dto.lng,
      contact_name: dto.contactName,
      contact_phone: dto.contactPhone,
      contact_email: dto.contactEmail,
      contact_is_agent: dto.contactIsAgent,
      is_featured: dto.isFeatured,
      is_urgent: dto.isUrgent,
      is_new: dto.isNew,
      status: dto.status,
      expires_at: dto.expiresAt,
      agent_id: dto.agentId,
      owner_customer_id: dto.ownerCustomerId,
    });
    return this.getById(created.id, ownerUserId);
  }

  async update(id: string, dto: UpdatePropertyDTO, ownerUserId?: string) {
    const where: any = { id };
    if (ownerUserId) where.owner_user_id = ownerUserId;
    const existing = await this.Property.findOne({ where });
    if (!existing) return null;
    await existing.update({
      title: dto.title ?? existing.title,
      description: dto.description ?? existing.description,
      price: dto.price ?? existing.price,
      type: dto.type ?? existing.type,
      category: dto.category ?? existing.category,
      area: dto.area ?? existing.area,
      rooms_label: dto.roomsLabel ?? existing.rooms_label,
      bedrooms: dto.bedrooms ?? existing.bedrooms,
      bathrooms: dto.bathrooms ?? existing.bathrooms,
      floor: dto.floor ?? existing.floor,
      total_floors: dto.totalFloors ?? existing.total_floors,
      age: dto.age ?? existing.age,
      heating: dto.heating ?? existing.heating,
      furnished: dto.furnished ?? existing.furnished,
      parking: dto.parking ?? existing.parking,
      balcony: dto.balcony ?? existing.balcony,
      elevator: dto.elevator ?? existing.elevator,
      district_name: dto.districtName ?? existing.district_name,
      city_name: dto.cityName ?? existing.city_name,
      full_address: dto.fullAddress ?? existing.full_address,
      lat: dto.lat ?? existing.lat,
      lng: dto.lng ?? existing.lng,
      contact_name: dto.contactName ?? existing.contact_name,
      contact_phone: dto.contactPhone ?? existing.contact_phone,
      contact_email: dto.contactEmail ?? existing.contact_email,
      contact_is_agent: dto.contactIsAgent ?? existing.contact_is_agent,
      is_featured: dto.isFeatured ?? existing.is_featured,
      is_urgent: dto.isUrgent ?? existing.is_urgent,
      is_new: dto.isNew ?? existing.is_new,
      status: dto.status ?? existing.status,
      expires_at: dto.expiresAt ?? existing.expires_at,
      agent_id: dto.agentId ?? existing.agent_id,
      owner_customer_id: dto.ownerCustomerId ?? existing.owner_customer_id,
    });
    return this.getById(id, ownerUserId);
  }

  async remove(id: string, ownerUserId?: string) {
    const where: any = { id };
    if (ownerUserId) where.owner_user_id = ownerUserId;
    const existing = await this.Property.findOne({ where });
    if (!existing) return false;
    await existing.destroy();
    return true;
  }

  async addImages(propertyId: string, images: CreatePropertyImageDTO[]) {
    if (!images?.length) return [];
    const created = await Promise.all(images.map(img => this.Image.create({ property_id: propertyId, url: img.url, alt: img.alt, sort_order: img.sortOrder ?? 0 })));
    return created.map((i:any)=>i.toJSON());
  }

  async setTags(ownerUserId: string, propertyId: string, tags: string[]) {
    await this.PropertyTag.destroy({ where: { property_id: propertyId } });
    for (const name of tags) {
      const [tag] = await this.Tag.findOrCreate({ where: { tenant_id: ownerUserId, name }, defaults: { tenant_id: ownerUserId, name } });
      await this.PropertyTag.findOrCreate({ where: { property_id: propertyId, tag_id: tag.id }, defaults: { property_id: propertyId, tag_id: tag.id } });
    }
    return true;
  }

  async setAmenities(ownerUserId: string, propertyId: string, amenityNames: string[]) {
    await this.PropertyAmenity.destroy({ where: { property_id: propertyId } });
    for (const name of amenityNames) {
      const [amenity] = await this.Amenity.findOrCreate({ where: { tenant_id: ownerUserId, name }, defaults: { tenant_id: ownerUserId, name } });
      await this.PropertyAmenity.findOrCreate({ where: { property_id: propertyId, amenity_id: amenity.id }, defaults: { property_id: propertyId, amenity_id: amenity.id } });
    }
    return true;
  }

  async listEvents(ownerUserId: string, propertyId: string, type?: string) {
    const where: any = { tenant_id: ownerUserId, property_id: propertyId };
    if (type) where.event_type = type;
    const items = await this.Event.findAll({ where, order: [['occurred_at','DESC']], limit: 200 });
    return items.map((i:any)=>({ id: i.id, eventType: i.event_type, occurredAt: i.occurred_at, metadata: i.metadata }));
  }

  async addEvent(ownerUserId: string, propertyId: string, dto: CreatePropertyEventDTO, customerId?: string) {
    const e = await this.Event.create({ tenant_id: ownerUserId, property_id: propertyId, customer_id: customerId, event_type: dto.eventType, metadata: dto.metadata });
    return { id: e.id, eventType: e.event_type, occurredAt: e.occurred_at };
  }
}

export default ListingsRepository;


