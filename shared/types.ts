/**
 * Tipos compartilhados para integração WTBotBuilder + Meta CAPI
 */

export type EventType = 'lead' | 'agenda' | 'venda';

export interface WebhookPayload {
  event_type: EventType;
  contact: {
    phone: string;
    name?: string;
    email?: string;
  };
  event_data: {
    timestamp: number;
    session_id?: string;
    scheduled_time?: string;
    order_id?: string;
    value?: number;
    currency?: string;
    status?: string;
  };
  campaign?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    click_id?: string;
    fbclid?: string;
  };
}

export interface MetaUserData {
  ph?: string[]; // Telefone hasheado
  em?: string[]; // Email hasheado
  fn?: string[]; // Nome hasheado
  ln?: string[]; // Sobrenome hasheado
  ct?: string[]; // Cidade hasheada
  st?: string[]; // Estado hasheado
  zp?: string[]; // CEP hasheado
  country?: string[]; // País hasheado
  external_id?: string[]; // ID externo
}

export interface MetaCustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_type?: string;
  content_id?: string;
  status?: string;
}

export interface MetaEventPayload {
  data: Array<{
    event_name: 'Lead' | 'CompleteRegistration' | 'Purchase';
    event_time: number;
    action_source: 'business_messaging';
    messaging_channel: 'whatsapp';
    user_data: MetaUserData;
    custom_data: MetaCustomData;
  }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
