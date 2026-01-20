import axios from 'axios';
import {
  WebhookPayload,
  MetaEventPayload,
  MetaUserData,
  MetaCustomData,
} from '../../shared/types';
import {
  hashPhone,
  hashEmail,
  hashName,
  extractFirstName,
  extractLastName,
} from '../utils/hash';

const META_GRAPH_API_VERSION = 'v18.0';
const META_CAPI_ENDPOINT = `https://graph.facebook.com/${META_GRAPH_API_VERSION}`;

interface MetaCapiConfig {
  pixelId: string;
  accessToken: string;
}

export class MetaCapiService {
  private config: MetaCapiConfig;
  private axiosInstance;

  constructor(config: MetaCapiConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: META_CAPI_ENDPOINT,
      timeout: 10000,
    });
  }

  /**
   * Constrói dados de usuário hasheados conforme Meta CAPI
   */
  private buildUserData(payload: WebhookPayload): MetaUserData {
    const userData: MetaUserData = {};

    if (payload.contact.phone) {
      userData.ph = [hashPhone(payload.contact.phone)];
    }

    if (payload.contact.email) {
      userData.em = [hashEmail(payload.contact.email)];
    }

    if (payload.contact.name) {
      userData.fn = [hashName(extractFirstName(payload.contact.name))];
      const lastName = extractLastName(payload.contact.name);
      if (lastName) {
        userData.ln = [hashName(lastName)];
      }
    }

    return userData;
  }

  /**
   * Constrói dados customizados do evento
   */
  private buildCustomData(
    eventType: string,
    eventData: WebhookPayload['event_data']
  ): MetaCustomData {
    const customData: MetaCustomData = {
      currency: eventData.currency || 'BRL',
    };

    if (eventType === 'venda' && eventData.value) {
      customData.value = eventData.value;
    }

    if (eventData.status) {
      customData.status = eventData.status;
    }

    if (eventData.order_id) {
      customData.content_id = eventData.order_id;
    }

    return customData;
  }

  /**
   * Mapeia tipo de evento WTBotBuilder para evento Meta
   */
  private mapEventType(
    wtbotEventType: string
  ): 'Lead' | 'CompleteRegistration' | 'Purchase' {
    switch (wtbotEventType) {
      case 'lead':
        return 'Lead';
      case 'agenda':
        return 'CompleteRegistration';
      case 'venda':
        return 'Purchase';
      default:
        return 'Lead';
    }
  }

  /**
   * Envia evento para Meta Conversions API
   */
  async sendEvent(payload: WebhookPayload): Promise<any> {
    try {
      const userData = this.buildUserData(payload);
      const customData = this.buildCustomData(
        payload.event_type,
        payload.event_data
      );
      const eventName = this.mapEventType(payload.event_type);

      const metaPayload: MetaEventPayload = {
        data: [
          {
            event_name: eventName,
            event_time: payload.event_data.timestamp || Math.floor(Date.now() / 1000),
            action_source: 'business_messaging',
            messaging_channel: 'whatsapp',
            user_data: userData,
            custom_data: customData,
          },
        ],
      };

      console.log(
        `[MetaCapiService] Enviando evento ${eventName} para Meta CAPI`,
        {
          pixelId: this.config.pixelId,
          userData: Object.keys(userData),
        }
      );

      const response = await this.axiosInstance.post(
        `/${this.config.pixelId}/events`,
        metaPayload,
        {
          params: {
            access_token: this.config.accessToken,
          },
        }
      );

      console.log(`[MetaCapiService] Resposta Meta CAPI:`, response.data);

      return {
        success: true,
        eventName,
        metaResponse: response.data,
      };
    } catch (error) {
      console.error('[MetaCapiService] Erro ao enviar evento para Meta:', error);

      if (axios.isAxiosError(error)) {
        throw {
          success: false,
          error: error.response?.data || error.message,
          status: error.response?.status,
        };
      }

      throw {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Valida se o payload tem dados mínimos obrigatórios
   */
  static validatePayload(payload: any): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!payload.event_type) {
      errors.push('event_type é obrigatório');
    }

    if (!payload.contact?.phone) {
      errors.push('contact.phone é obrigatório');
    }

    if (!payload.event_data?.timestamp) {
      errors.push('event_data.timestamp é obrigatório');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
