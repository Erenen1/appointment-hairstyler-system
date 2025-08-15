import WhatsappRepository from './whatsapp.repository';
import { WhatsappConfigDTO, WhatsappContactDTO, WhatsappMessageDTO } from './types/whatsapp.types';

export class WhatsappService {
  constructor(private readonly repo: WhatsappRepository) {}
  getConfig(tenantId: string) { return this.repo.getConfig(tenantId); }
  upsertConfig(tenantId: string, dto: WhatsappConfigDTO) { return this.repo.upsertConfig(tenantId, dto); }
  listContacts(tenantId: string, search?: string, page?: number, pageSize?: number) { return this.repo.listContacts(tenantId, search, page, pageSize); }
  getContact(tenantId: string, id: string) { return this.repo.getContact(tenantId, id); }
  createContact(tenantId: string, dto: WhatsappContactDTO) { return this.repo.createContact(tenantId, dto); }
  listMessages(tenantId: string, contactId: string, before?: string, after?: string, limit?: number) { return this.repo.listMessages(tenantId, contactId, before, after, limit); }
  sendMessage(tenantId: string, contactId: string, dto: WhatsappMessageDTO) { return this.repo.sendMessage(tenantId, contactId, dto, true); }
  stats(tenantId: string) { return this.repo.stats(tenantId); }
}

export default WhatsappService;


