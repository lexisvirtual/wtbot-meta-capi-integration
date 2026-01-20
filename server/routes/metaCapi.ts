import { Router, Request, Response } from 'express';
import { MetaCapiService } from '../services/metaCapiService';
import { WebhookPayload, ApiResponse } from '../../shared/types';

const router = Router();

// Instancia o serviço Meta CAPI com credenciais do ambiente
const metaCapiService = new MetaCapiService({
  pixelId: process.env.META_PIXEL_ID || '',
  accessToken: process.env.META_ACCESS_TOKEN || '',
});

/**
 * POST /meta-capi/webhook
 * Recebe webhook do WTBotBuilder e envia evento para Meta CAPI
 *
 * Body esperado:
 * {
 *   "event_type": "lead" | "agenda" | "venda",
 *   "contact": {
 *     "phone": "+55 11 98765-4321",
 *     "name": "João Silva",
 *     "email": "joao@example.com"
 *   },
 *   "event_data": {
 *     "timestamp": 1737300000,
 *     "session_id": "abc123",
 *     "scheduled_time": "2026-01-25 14:00",
 *     "order_id": "ORD-123",
 *     "value": 99.90,
 *     "currency": "BRL",
 *     "status": "lead_qualificado"
 *   },
 *   "campaign": {
 *     "fbclid": "IwAR...",
 *     "click_id": "click_123"
 *   }
 * }
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const payload: WebhookPayload = req.body;

    // Validação básica do payload
    const validation = MetaCapiService.validatePayload(payload);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Payload inválido',
        error: validation.errors.join('; '),
      } as ApiResponse);
    }

    console.log('[MetaCapi Route] Webhook recebido:', {
      eventType: payload.event_type,
      phone: payload.contact.phone,
      timestamp: payload.event_data.timestamp,
    });

    // Envia evento para Meta CAPI
    const result = await metaCapiService.sendEvent(payload);

    return res.status(200).json({
      success: true,
      message: `Evento ${result.eventName} enviado com sucesso para Meta CAPI`,
      data: {
        eventName: result.eventName,
        metaResponse: result.metaResponse,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('[MetaCapi Route] Erro:', error);

    const errorResponse = error as any;
    return res.status(errorResponse.status || 500).json({
      success: false,
      message: 'Erro ao processar webhook',
      error: errorResponse.error || 'Unknown error',
    } as ApiResponse);
  }
});

/**
 * POST /meta-capi/test
 * Endpoint de teste para validar configuração
 */
router.post('/test', async (req: Request, res: Response) => {
  try {
    const testPayload: WebhookPayload = {
      event_type: 'lead',
      contact: {
        phone: '+55 11 98765-4321',
        name: 'Teste Silva',
        email: 'teste@example.com',
      },
      event_data: {
        timestamp: Math.floor(Date.now() / 1000),
        status: 'test_event',
      },
    };

    const result = await metaCapiService.sendEvent(testPayload);

    return res.status(200).json({
      success: true,
      message: 'Evento de teste enviado com sucesso',
      data: result,
    } as ApiResponse);
  } catch (error) {
    console.error('[MetaCapi Route] Erro no teste:', error);

    const errorResponse = error as any;
    return res.status(errorResponse.status || 500).json({
      success: false,
      message: 'Erro ao enviar evento de teste',
      error: errorResponse.error || 'Unknown error',
    } as ApiResponse);
  }
});

/**
 * GET /meta-capi/health
 * Verifica se o serviço está operacional
 */
router.get('/health', (req: Request, res: Response) => {
  const isConfigured =
    process.env.META_PIXEL_ID && process.env.META_ACCESS_TOKEN;

  return res.status(isConfigured ? 200 : 503).json({
    success: isConfigured,
    message: isConfigured
      ? 'Meta CAPI integration is operational'
      : 'Meta CAPI credentials not configured',
    configured: isConfigured,
  });
});

export default router;
