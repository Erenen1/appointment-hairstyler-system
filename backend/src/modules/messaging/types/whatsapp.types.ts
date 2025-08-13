export interface WhatsappConfigDTO {
  instanceId: string;
  instanceName?: string;
  phoneNumber?: string;
  isActive?: boolean;
  webhookUrl?: string;
}

export interface WhatsappContactDTO {
  phoneNumber: string;
  name?: string;
}

export interface WhatsappMessageDTO {
  messageType: 'text' | 'image' | 'document';
  content?: string;
  mediaUrl?: string;
  fileName?: string;
}


