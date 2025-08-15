import { Op } from 'sequelize';
import { sequelize } from '../../config/database';
import { WhatsappConfigDTO, WhatsappContactDTO, WhatsappMessageDTO } from './types/whatsapp.types';

export class WhatsappRepository {
  private get Config() { return sequelize.models.MessagingWhatsappBotConfig as any; }
  private get Contact() { return sequelize.models.MessagingWhatsappContact as any; }
  private get Message() { return sequelize.models.MessagingWhatsappMessage as any; }

  async getConfig(ownerUserId: string) {
    const row = await this.Config.findOne({ where: { owner_user_id: ownerUserId } });
    return row ? row.toJSON() : null;
  }
  async upsertConfig(ownerUserId: string, dto: WhatsappConfigDTO) {
    const existing = await this.Config.findOne({ where: { owner_user_id: ownerUserId } });
    if (!existing) {
      const created = await this.Config.create({ owner_user_id: ownerUserId, instance_id: dto.instanceId, instance_name: dto.instanceName, phone_number: dto.phoneNumber, is_active: dto.isActive ?? true, webhook_url: dto.webhookUrl });
      return created.toJSON();
    }
    await existing.update({ instance_id: dto.instanceId ?? existing.instance_id, instance_name: dto.instanceName ?? existing.instance_name, phone_number: dto.phoneNumber ?? existing.phone_number, is_active: dto.isActive ?? existing.is_active, webhook_url: dto.webhookUrl ?? existing.webhook_url });
    return existing.toJSON();
  }

  async listContacts(ownerUserId: string, search?: string, page = 1, pageSize = 20) {
    const where: any = { owner_user_id: ownerUserId };
    if (search) where[Op.or] = [{ phone_number: { [Op.iLike]: `%${search}%` } }, { name: { [Op.iLike]: `%${search}%` } }];
    const { rows, count } = await this.Contact.findAndCountAll({ where, order: [['name','ASC']], offset: (page-1)*pageSize, limit: pageSize });
    return { items: rows.map((r:any)=>({ id: r.id, phoneNumber: r.phone_number, name: r.name })), pagination: { page, pageSize, total: count } };
  }
  async getContact(ownerUserId: string, id: string) {
    const row = await this.Contact.findOne({ where: { id, owner_user_id: ownerUserId } });
    return row ? row.toJSON() : null;
  }
  async createContact(ownerUserId: string, dto: WhatsappContactDTO) {
    const created = await this.Contact.create({ owner_user_id: ownerUserId, phone_number: dto.phoneNumber, name: dto.name });
    return { id: created.id, phoneNumber: created.phone_number, name: created.name };
  }

  async listMessages(ownerUserId: string, contactId: string, before?: string, after?: string, limit = 50) {
    const where: any = { owner_user_id: ownerUserId, contact_id: contactId };
    if (before) where.message_timestamp = { [Op.lt]: before };
    if (after) where.message_timestamp = { [Op.gt]: after };
    const items = await this.Message.findAll({ where, order: [['message_timestamp','DESC']], limit });
    return items.map((m:any)=>({ id: m.id, sender: m.sender, messageType: m.message_type, content: m.content, timestamp: m.message_timestamp, fromMe: m.from_me, status: m.status }));
  }
  async sendMessage(ownerUserId: string, contactId: string, dto: WhatsappMessageDTO, fromMe = true) {
    const created = await this.Message.create({ owner_user_id: ownerUserId, contact_id: contactId, sender: fromMe ? 'me' : 'contact', message_type: dto.messageType, content: dto.content, media_url: dto.mediaUrl, file_name: dto.fileName, from_me: fromMe, status: 'sent', message_timestamp: new Date(), raw_payload: {} });
    return created.toJSON();
  }

  async stats(ownerUserId: string) {
    const [totalMessages, totalContacts, todayMessages] = await Promise.all([
      this.Message.count({ where: { owner_user_id: ownerUserId } }),
      this.Contact.count({ where: { owner_user_id: ownerUserId } }),
      this.Message.count({ where: { owner_user_id: ownerUserId, message_timestamp: { [Op.gte]: new Date(new Date().toDateString()) } } }),
    ]);
    return { totalMessages, totalContacts, todayMessages, responseRate: 0, avgResponseTime: '0m', activeChats: 0 };
  }
}

export default WhatsappRepository;


