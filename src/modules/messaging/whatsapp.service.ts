import WhatsappRepository from './whatsapp.repository';
import { WhatsappConfigDTO, WhatsappContactDTO, WhatsappMessageDTO } from './types/whatsapp.types';

export class WhatsappService {
  constructor(private readonly repo: WhatsappRepository) {}
  getConfig(ownerUserId: string) { return this.repo.getConfig(ownerUserId); }
  upsertConfig(ownerUserId: string, dto: WhatsappConfigDTO) { return this.repo.upsertConfig(ownerUserId, dto); }
  listContacts(ownerUserId: string, search?: string, page?: number, pageSize?: number) { return this.repo.listContacts(ownerUserId, search, page, pageSize); }
  getContact(ownerUserId: string, id: string) { return this.repo.getContact(ownerUserId, id); }
  createContact(ownerUserId: string, dto: WhatsappContactDTO) { return this.repo.createContact(ownerUserId, dto); }
  listMessages(ownerUserId: string, contactId: string, before?: string, after?: string, limit?: number) { return this.repo.listMessages(ownerUserId, contactId, before, after, limit); }
  sendMessage(ownerUserId: string, contactId: string, dto: WhatsappMessageDTO) { return this.repo.sendMessage(ownerUserId, contactId, dto, true); }
  stats(ownerUserId: string) { return this.repo.stats(ownerUserId); }
}

export default WhatsappService;


