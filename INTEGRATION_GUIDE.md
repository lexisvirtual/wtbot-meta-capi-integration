# Guia de Integração: WTBotBuilder + Meta Conversions API

Este projeto implementa uma integração completa entre o **WTBotBuilder** e a **Meta Conversions API (CAPI)** para otimizar campanhas de WhatsApp. O fluxo permite que eventos de lead, agendamento e venda sejam rastreados pela Meta, melhorando o algoritmo de segmentação e conversão.

## 📋 Visão Geral da Arquitetura

```
WTBotBuilder (Bot)
    ↓ (Webhook)
Node.js Backend (Express)
    ↓ (Formata + Hash)
Meta Conversions API
    ↓
Meta Ads Manager (Otimiza campanhas)
```

### Fluxo de Dados

1. **Gatilho no WTBotBuilder:** Quando um contato passa por um momento-chave (lead, agenda, venda), o bot dispara um webhook.
2. **Processamento:** O backend recebe o webhook, valida os dados e faz hash dos identificadores (conforme Meta CAPI requer).
3. **Envio à Meta:** Os eventos formatados são enviados para a Meta Conversions API.
4. **Otimização:** A Meta usa esses sinais para treinar o algoritmo e encontrar usuários mais propensos a converter.

---

## 🔑 Configuração de Credenciais

As credenciais da Meta já foram configuradas. Você precisa adicionar ao seu ambiente:

```bash
META_PIXEL_ID=892825097869184
META_ACCESS_TOKEN=EAAEuUOBMTZBgBQW9SBhT394y6F3FDheqgPTVW4ZCVJIU7wB3mNt2uKICKsj7Y5RCNIkufnIrB8RTcIoDxdEQ9dGuZCXuBi8HGuTqZCU88oGl1em6ZBPit9ckz5o9ALzEiGRmx4ZBgVW7ALXEO2RxCLpDSGHpqbNxmy4k9CCFuIj7LJwrLy3KEHB5ZCq4Obdx71wnQZDZD
```

> **Importante:** Nunca compartilhe o Access Token publicamente. Mantenha-o seguro em variáveis de ambiente.

---

## 🎯 Eventos Suportados

O sistema mapeia três tipos de eventos do WTBotBuilder para eventos Meta CAPI:

| WTBotBuilder | Meta CAPI | Quando Disparar | Dados Esperados |
| :--- | :--- | :--- | :--- |
| **lead** | Lead | Primeira mensagem recebida do WhatsApp | Telefone, nome, email |
| **agenda** | CompleteRegistration | Agendamento confirmado | Telefone, horário agendado, ID da sessão |
| **venda** | Purchase | Pedido/venda confirmado | Telefone, valor, ID do pedido, moeda |

---

## 📡 Endpoints da API

### 1. POST `/api/meta-capi/webhook`

Recebe webhooks do WTBotBuilder e envia eventos para Meta CAPI.

**Request Body:**

```json
{
  "event_type": "lead",
  "contact": {
    "phone": "+55 11 98765-4321",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "event_data": {
    "timestamp": 1737300000,
    "session_id": "abc123",
    "scheduled_time": "2026-01-25 14:00",
    "order_id": "ORD-123",
    "value": 99.90,
    "currency": "BRL",
    "status": "lead_qualificado"
  },
  "campaign": {
    "fbclid": "IwAR...",
    "click_id": "click_123"
  }
}
```

**Campos Obrigatórios:**
- `event_type`: `"lead"`, `"agenda"` ou `"venda"`
- `contact.phone`: Número de telefone (com ou sem formatação)
- `event_data.timestamp`: Unix timestamp do evento

**Campos Opcionais:**
- `contact.name`: Nome do contato
- `contact.email`: Email do contato
- `event_data.value`: Valor da transação (para eventos de venda)
- `event_data.currency`: Moeda (padrão: BRL)
- `event_data.order_id`: ID do pedido
- `campaign.fbclid`: Facebook Click ID (para rastreamento)

**Response (Sucesso):**

```json
{
  "success": true,
  "message": "Evento Lead enviado com sucesso para Meta CAPI",
  "data": {
    "eventName": "Lead",
    "metaResponse": {
      "events_received": 1
    }
  }
}
```

**Response (Erro):**

```json
{
  "success": false,
  "message": "Payload inválido",
  "error": "contact.phone é obrigatório"
}
```

---

### 2. POST `/api/meta-capi/test`

Endpoint de teste para validar se a integração está funcionando corretamente.

**Request:** Sem body necessário

**Response (Sucesso):**

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

---

### 3. GET `/api/meta-capi/health`

Verifica se o serviço está operacional e se as credenciais estão configuradas.

**Response (Configurado):**

```json
{
  "success": true,
  "message": "Meta CAPI integration is operational",
  "configured": true
}
```

**Response (Não Configurado):**

```json
{
  "success": false,
  "message": "Meta CAPI credentials not configured",
  "configured": false
}
```

---

## 🔐 Segurança de Dados

A Meta CAPI requer que dados pessoais sejam enviados **hasheados em SHA-256**. Este projeto implementa automaticamente:

- **Telefone:** Normalizado (apenas dígitos) + SHA-256
- **Email:** Lowercase + SHA-256
- **Nome:** Trimmed + SHA-256

Exemplo de hashing:

```
Telefone: +55 11 98765-4321 → 5511987654321 → SHA-256 → a3f5d8...
Email: joao@example.com → joao@example.com → SHA-256 → b2e4c1...
Nome: João Silva → joão silva → SHA-256 → c9f1a2...
```

---

## 🚀 Como Configurar no WTBotBuilder

### Passo 1: Identificar Pontos de Disparo

No seu fluxo de bot, identifique os três momentos-chave:

1. **Lead:** Primeira mensagem recebida do contato
2. **Agenda:** Quando o agendamento é confirmado
3. **Venda:** Quando o pedido/pagamento é confirmado

### Passo 2: Criar Ações de Webhook

Para cada ponto, crie uma ação de webhook no WTBotBuilder:

**Configuração do Webhook:**

- **URL:** `https://seu-dominio.com/api/meta-capi/webhook`
- **Método:** POST
- **Content-Type:** application/json

### Passo 3: Mapear Variáveis do Bot

No payload do webhook, mapeie as variáveis do WTBotBuilder:

**Para evento de LEAD:**

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
  }
}
```

**Para evento de AGENDA:**

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

**Para evento de VENDA:**

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

### Passo 4: Testar a Integração

1. Faça um teste no endpoint `/api/meta-capi/test`
2. Verifique no Meta Events Manager se o evento foi recebido
3. Simule um fluxo completo no WTBotBuilder (lead → agenda → venda)

---

## 📊 Validação no Meta Events Manager

Após configurar os webhooks, valide no Meta:

1. Acesse **Meta Events Manager** (events.facebook.com)
2. Selecione seu Pixel ID: `892825097869184`
3. Vá para **Test Events**
4. Você deve ver os eventos chegando em tempo real:
   - ✅ Lead
   - ✅ CompleteRegistration
   - ✅ Purchase

---

## 🛠️ Desenvolvimento Local

### Instalação

```bash
npm install
# ou
pnpm install
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
META_PIXEL_ID=892825097869184
META_ACCESS_TOKEN=seu_token_aqui
PORT=3000
NODE_ENV=development
```

### Executar em Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### Testar Localmente

```bash
# Teste de saúde
curl http://localhost:3000/api/meta-capi/health

# Teste de evento
curl -X POST http://localhost:3000/api/meta-capi/test

# Enviar evento customizado
curl -X POST http://localhost:3000/api/meta-capi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "lead",
    "contact": {
      "phone": "+55 11 98765-4321",
      "name": "Teste Silva",
      "email": "teste@example.com"
    },
    "event_data": {
      "timestamp": '$(date +%s)',
      "status": "teste"
    }
  }'
```

---

## 📈 Monitoramento e Logs

O sistema registra todas as operações. Verifique os logs para:

- ✅ Webhooks recebidos
- ✅ Eventos enviados à Meta
- ❌ Erros de validação
- ❌ Falhas na API da Meta

Exemplo de log:

```
[MetaCapi Route] Webhook recebido: {
  eventType: 'lead',
  phone: '+55 11 98765-4321',
  timestamp: 1737300000
}
[MetaCapiService] Enviando evento Lead para Meta CAPI
[MetaCapiService] Resposta Meta CAPI: { events_received: 1 }
```

---

## 🔄 Otimização de Campanhas

Após enviar eventos consistentemente, a Meta otimizará suas campanhas de WhatsApp:

1. **Treino do Algoritmo:** Meta aprende quem são seus leads qualificados e vendas
2. **Segmentação Melhorada:** Encontra usuários mais parecidos com seus melhores clientes
3. **ROI Aumentado:** Campanhas mais eficientes com melhor taxa de conversão

### Métricas a Acompanhar

- **Funil de Conversão:** Lead → Agenda → Venda
- **Taxa de Conversão:** % de leads que viram vendas
- **Custo por Lead:** Quanto você gasta para adquirir um lead
- **Custo por Venda:** Quanto você gasta para fechar uma venda

---

## 🐛 Troubleshooting

### Erro: "Pixel ID ou Access Token não configurados"

**Solução:** Verifique se as variáveis de ambiente estão definidas:

```bash
echo $META_PIXEL_ID
echo $META_ACCESS_TOKEN
```

### Erro: "Invalid access token"

**Solução:** O token pode ter expirado. Gere um novo no Meta Business Manager.

### Erro: "User data validation failed"

**Solução:** Certifique-se de que:
- Telefone contém apenas dígitos após normalização
- Email é válido
- Nome não está vazio

### Eventos não aparecem no Events Manager

**Solução:**
1. Aguarde 5-10 minutos após enviar o evento
2. Verifique se o Pixel ID está correto
3. Valide o Access Token
4. Verifique os logs do servidor para erros

---

## 📚 Referências

- [Meta Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [WTBotBuilder Webhook Documentation](https://docs.wtbotbuilder.com)
- [SHA-256 Hashing Guide](https://developers.facebook.com/docs/marketing-api/conversions-api/hashing)

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique os logs do servidor
2. Teste o endpoint `/api/meta-capi/health`
3. Valide os dados no Events Manager da Meta
4. Consulte a documentação oficial da Meta CAPI

---

**Última atualização:** Janeiro 2026  
**Versão:** 1.0.0
