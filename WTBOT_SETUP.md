# Guia de Configuração no WTBotBuilder

Este documento detalha como configurar os webhooks no WTBotBuilder para enviar eventos para a integração Meta CAPI.

## 📋 Pré-requisitos

- ✅ Backend Node.js/Express rodando (seu domínio ou localhost)
- ✅ Pixel ID e Access Token da Meta configurados
- ✅ Fluxos de bot criados no WTBotBuilder

## 🔧 Configuração Geral

### URL Base do Webhook

Substitua `seu-dominio.com` pela URL do seu servidor:

```
https://seu-dominio.com/api/meta-capi/webhook
```

**Em desenvolvimento (localhost):**
```
http://localhost:3000/api/meta-capi/webhook
```

### Headers Obrigatórios

```
Content-Type: application/json
```

---

## 1️⃣ Configurar Webhook de LEAD

**Quando disparar:** Quando o contato envia a primeira mensagem para o bot

### Passo 1: Criar Ação de Webhook no Bloco Inicial

1. No seu fluxo de bot, vá ao **bloco inicial** (onde o bot recebe a primeira mensagem)
2. Clique em **+ Adicionar Ação**
3. Selecione **Webhook**

### Passo 2: Configurar Webhook

**URL:**
```
https://seu-dominio.com/api/meta-capi/webhook
```

**Método:** POST

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "event_type": "lead",
  "contact": {
    "phone": "{{contact.phone}}",
    "name": "{{contact.name}}",
    "email": "{{contact.email}}"
  },
  "event_data": {
    "timestamp": "{{current_timestamp}}",
    "session_id": "{{session.id}}",
    "status": "novo_lead"
  },
  "campaign": {
    "fbclid": "{{campaign.fbclid}}",
    "click_id": "{{campaign.click_id}}"
  }
}
```

### Passo 3: Testar

1. Envie uma mensagem de teste para o bot
2. Verifique nos logs do servidor se o webhook foi recebido
3. Confirme no Meta Events Manager se o evento "Lead" apareceu

---

## 2️⃣ Configurar Webhook de AGENDA

**Quando disparar:** Quando o agendamento é confirmado

### Passo 1: Localizar Bloco de Agendamento

No seu fluxo, encontre o bloco onde o agendamento é confirmado (geralmente após o contato confirmar data/hora).

### Passo 2: Adicionar Ação de Webhook

1. Clique em **+ Adicionar Ação** no bloco de confirmação
2. Selecione **Webhook**

### Passo 3: Configurar Webhook

**URL:**
```
https://seu-dominio.com/api/meta-capi/webhook
```

**Método:** POST

**Body (JSON):**
```json
{
  "event_type": "agenda",
  "contact": {
    "phone": "{{contact.phone}}",
    "name": "{{contact.name}}",
    "email": "{{contact.email}}"
  },
  "event_data": {
    "timestamp": "{{current_timestamp}}",
    "session_id": "{{session.id}}",
    "scheduled_time": "{{appointment.datetime}}",
    "status": "agendamento_confirmado"
  }
}
```

### Variáveis Esperadas

- `{{appointment.datetime}}` - Data e hora do agendamento (ex: "2026-01-25 14:30")
- `{{appointment.id}}` - ID do agendamento (opcional)

### Passo 4: Testar

1. Simule um agendamento completo no bot
2. Verifique se o webhook foi enviado
3. Confirme no Meta Events Manager se o evento "CompleteRegistration" apareceu

---

## 3️⃣ Configurar Webhook de VENDA

**Quando disparar:** Quando o pedido/pagamento é confirmado

### Passo 1: Localizar Bloco de Confirmação de Venda

No seu fluxo, encontre o bloco onde a venda é finalizada (após pagamento aprovado ou pedido confirmado).

### Passo 2: Adicionar Ação de Webhook

1. Clique em **+ Adicionar Ação** no bloco de confirmação
2. Selecione **Webhook**

### Passo 3: Configurar Webhook

**URL:**
```
https://seu-dominio.com/api/meta-capi/webhook
```

**Método:** POST

**Body (JSON):**
```json
{
  "event_type": "venda",
  "contact": {
    "phone": "{{contact.phone}}",
    "name": "{{contact.name}}",
    "email": "{{contact.email}}"
  },
  "event_data": {
    "timestamp": "{{current_timestamp}}",
    "session_id": "{{session.id}}",
    "order_id": "{{order.id}}",
    "value": "{{order.total}}",
    "currency": "BRL",
    "status": "venda_confirmada"
  }
}
```

### Variáveis Esperadas

- `{{order.id}}` - ID único do pedido
- `{{order.total}}` - Valor total da venda (ex: "299.90")
- `{{order.items}}` - Itens do pedido (opcional)

### Passo 4: Testar

1. Simule uma compra completa no bot
2. Verifique se o webhook foi enviado
3. Confirme no Meta Events Manager se o evento "Purchase" apareceu

---

## 🔍 Mapeamento de Variáveis WTBotBuilder

Estas são as variáveis que você pode usar nos webhooks:

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `{{contact.phone}}` | Telefone do contato | +55 11 98765-4321 |
| `{{contact.name}}` | Nome do contato | João Silva |
| `{{contact.email}}` | Email do contato | joao@example.com |
| `{{contact.id}}` | ID único do contato | contact_123 |
| `{{session.id}}` | ID da sessão de conversa | sess_abc123 |
| `{{current_timestamp}}` | Timestamp Unix atual | 1737300000 |
| `{{appointment.datetime}}` | Data/hora do agendamento | 2026-01-25 14:30 |
| `{{appointment.id}}` | ID do agendamento | appt_456 |
| `{{order.id}}` | ID do pedido | ORD-2026-001 |
| `{{order.total}}` | Valor total do pedido | 299.90 |
| `{{order.items}}` | Itens do pedido | item1, item2 |
| `{{campaign.fbclid}}` | Facebook Click ID | IwAR2xB5vC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9z |
| `{{campaign.click_id}}` | Click ID customizado | click_20260120_001 |
| `{{campaign.utm_source}}` | UTM Source | facebook |
| `{{campaign.utm_medium}}` | UTM Medium | cpc |
| `{{campaign.utm_campaign}}` | UTM Campaign | whatsapp_leads |

> **Nota:** Se uma variável não existir no seu fluxo, o WTBotBuilder enviará `null` ou vazio.

---

## ✅ Checklist de Configuração

- [ ] URL base do webhook configurada corretamente
- [ ] Headers `Content-Type: application/json` definidos
- [ ] Bloco de LEAD com webhook configurado
- [ ] Bloco de AGENDA com webhook configurado
- [ ] Bloco de VENDA com webhook configurado
- [ ] Variáveis de contato mapeadas corretamente
- [ ] Teste de lead enviado com sucesso
- [ ] Teste de agenda enviado com sucesso
- [ ] Teste de venda enviado com sucesso
- [ ] Eventos aparecem no Meta Events Manager
- [ ] Logs do servidor mostram webhooks recebidos

---

## 🧪 Teste Passo a Passo

### Teste 1: Verificar Saúde do Serviço

```bash
curl http://seu-dominio.com/api/meta-capi/health
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Meta CAPI integration is operational",
  "configured": true
}
```

### Teste 2: Enviar Evento de Teste

```bash
curl -X POST http://seu-dominio.com/api/meta-capi/test
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Evento de teste enviado com sucesso",
  "data": {
    "success": true,
    "eventName": "Lead",
    "metaResponse": {
      "events_received": 1
    }
  }
}
```

### Teste 3: Simular Fluxo Completo

1. Envie uma mensagem para o bot (dispara webhook de LEAD)
2. Complete um agendamento (dispara webhook de AGENDA)
3. Finalize uma compra (dispara webhook de VENDA)
4. Verifique os logs do servidor
5. Confirme no Meta Events Manager

---

## 🐛 Troubleshooting

### Webhook não está sendo enviado

**Verificar:**
1. A ação de webhook está ativada no bloco?
2. A URL está correta?
3. O servidor está rodando?

**Solução:**
- Verifique os logs do WTBotBuilder
- Teste a URL manualmente com cURL
- Confirme que o servidor está respondendo

### Erro "Connection refused"

**Causa:** Servidor não está acessível

**Solução:**
- Verifique se o servidor está rodando
- Confirme a URL (localhost vs domínio)
- Verifique firewall/permissões

### Erro "Invalid JSON"

**Causa:** Formato do JSON inválido

**Solução:**
- Verifique se todas as aspas estão corretas
- Confirme que não há quebras de linha indevidas
- Use um validador JSON online

### Eventos não aparecem no Meta Events Manager

**Verificar:**
1. Pixel ID está correto?
2. Access Token é válido?
3. Eventos foram realmente enviados (verifique logs)?

**Solução:**
- Aguarde 5-10 minutos (Meta leva tempo para processar)
- Verifique os logs do servidor para erros
- Teste o endpoint `/api/meta-capi/test`
- Valide o token no Meta Business Manager

### Dados de contato vazios

**Causa:** Variáveis não mapeadas corretamente

**Solução:**
- Verifique se as variáveis existem no seu fluxo
- Use `{{contact.phone}}` em vez de `{{phone}}`
- Confirme que os dados estão sendo capturados

---

## 📊 Validação no Meta Events Manager

Após configurar tudo, valide no Meta:

1. Acesse [events.facebook.com](https://events.facebook.com)
2. Selecione seu Pixel ID: **892825097869184**
3. Vá para **Test Events**
4. Você deve ver:
   - ✅ Eventos "Lead"
   - ✅ Eventos "CompleteRegistration"
   - ✅ Eventos "Purchase"

---

## 📈 Próximos Passos

1. **Validar Eventos:** Confirme que todos os 3 tipos de eventos estão chegando
2. **Monitorar Campanhas:** Acompanhe o desempenho das campanhas no Ads Manager
3. **Otimizar:** Ajuste seus fluxos baseado nos dados de conversão
4. **Escalar:** Expanda para outras campanhas e canais

---

## 💡 Dicas

- **Teste primeiro em desenvolvimento:** Use localhost para testar antes de ir para produção
- **Monitore os logs:** Sempre verifique os logs do servidor para erros
- **Valide os dados:** Certifique-se de que os dados estão sendo capturados corretamente
- **Aguarde processamento:** Meta leva alguns minutos para processar eventos
- **Use IDs únicos:** Sempre envie IDs únicos para rastreamento

---

## 📞 Suporte

Se tiver problemas:

1. Verifique os logs do servidor
2. Teste o endpoint `/api/meta-capi/health`
3. Consulte [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
4. Consulte [PAYLOAD_EXAMPLES.md](./PAYLOAD_EXAMPLES.md)

---

**Última atualização:** Janeiro 2026
