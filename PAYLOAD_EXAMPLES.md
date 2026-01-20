# Exemplos de Payloads - WTBotBuilder Meta CAPI Integration

Este documento contém exemplos práticos de payloads para cada tipo de evento.

---

## 1. Evento de LEAD

**Quando disparar:** Primeira mensagem recebida do contato via WhatsApp

**Exemplo de Payload:**

```json
{
  "event_type": "lead",
  "contact": {
    "phone": "+55 11 98765-4321",
    "name": "João Silva",
    "email": "joao.silva@example.com"
  },
  "event_data": {
    "timestamp": 1737300000,
    "session_id": "sess_abc123def456",
    "status": "novo_lead"
  },
  "campaign": {
    "fbclid": "IwAR2xB5vC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9z",
    "click_id": "click_20260120_001"
  }
}
```

**Resposta Esperada:**

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

**Teste com cURL:**

```bash
curl -X POST http://localhost:3000/api/meta-capi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "lead",
    "contact": {
      "phone": "+55 11 98765-4321",
      "name": "João Silva",
      "email": "joao.silva@example.com"
    },
    "event_data": {
      "timestamp": 1737300000,
      "session_id": "sess_abc123def456",
      "status": "novo_lead"
    }
  }'
```

---

## 2. Evento de AGENDA (CompleteRegistration)

**Quando disparar:** Quando o agendamento é confirmado no bot

**Exemplo de Payload:**

```json
{
  "event_type": "agenda",
  "contact": {
    "phone": "+55 11 98765-4321",
    "name": "João Silva",
    "email": "joao.silva@example.com"
  },
  "event_data": {
    "timestamp": 1737310800,
    "session_id": "sess_abc123def456",
    "scheduled_time": "2026-01-25 14:30",
    "status": "agendamento_confirmado"
  },
  "campaign": {
    "fbclid": "IwAR2xB5vC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9z"
  }
}
```

**Resposta Esperada:**

```json
{
  "success": true,
  "message": "Evento CompleteRegistration enviado com sucesso para Meta CAPI",
  "data": {
    "eventName": "CompleteRegistration",
    "metaResponse": {
      "events_received": 1
    }
  }
}
```

**Teste com cURL:**

```bash
curl -X POST http://localhost:3000/api/meta-capi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "agenda",
    "contact": {
      "phone": "+55 11 98765-4321",
      "name": "João Silva",
      "email": "joao.silva@example.com"
    },
    "event_data": {
      "timestamp": 1737310800,
      "session_id": "sess_abc123def456",
      "scheduled_time": "2026-01-25 14:30",
      "status": "agendamento_confirmado"
    }
  }'
```

---

## 3. Evento de VENDA (Purchase)

**Quando disparar:** Quando o pedido/pagamento é confirmado

**Exemplo de Payload:**

```json
{
  "event_type": "venda",
  "contact": {
    "phone": "+55 11 98765-4321",
    "name": "João Silva",
    "email": "joao.silva@example.com"
  },
  "event_data": {
    "timestamp": 1737325200,
    "session_id": "sess_abc123def456",
    "order_id": "ORD-2026-001234",
    "value": 299.90,
    "currency": "BRL",
    "status": "venda_confirmada"
  },
  "campaign": {
    "fbclid": "IwAR2xB5vC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9z",
    "click_id": "click_20260120_001"
  }
}
```

**Resposta Esperada:**

```json
{
  "success": true,
  "message": "Evento Purchase enviado com sucesso para Meta CAPI",
  "data": {
    "eventName": "Purchase",
    "metaResponse": {
      "events_received": 1
    }
  }
}
```

**Teste com cURL:**

```bash
curl -X POST http://localhost:3000/api/meta-capi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "venda",
    "contact": {
      "phone": "+55 11 98765-4321",
      "name": "João Silva",
      "email": "joao.silva@example.com"
    },
    "event_data": {
      "timestamp": 1737325200,
      "session_id": "sess_abc123def456",
      "order_id": "ORD-2026-001234",
      "value": 299.90,
      "currency": "BRL",
      "status": "venda_confirmada"
    }
  }'
```

---

## 4. Fluxo Completo: Lead → Agenda → Venda

Este exemplo mostra como os três eventos se relacionam em um fluxo real:

### Passo 1: Contato entra no funil (LEAD)

```json
{
  "event_type": "lead",
  "contact": {
    "phone": "+55 21 99876-5432",
    "name": "Maria Santos",
    "email": "maria.santos@example.com"
  },
  "event_data": {
    "timestamp": 1737300000,
    "session_id": "sess_maria_001",
    "status": "novo_lead"
  }
}
```

### Passo 2: Contato agenda atendimento (AGENDA)

```json
{
  "event_type": "agenda",
  "contact": {
    "phone": "+55 21 99876-5432",
    "name": "Maria Santos",
    "email": "maria.santos@example.com"
  },
  "event_data": {
    "timestamp": 1737310800,
    "session_id": "sess_maria_001",
    "scheduled_time": "2026-01-22 10:00",
    "status": "agendamento_confirmado"
  }
}
```

### Passo 3: Contato realiza compra (VENDA)

```json
{
  "event_type": "venda",
  "contact": {
    "phone": "+55 21 99876-5432",
    "name": "Maria Santos",
    "email": "maria.santos@example.com"
  },
  "event_data": {
    "timestamp": 1737325200,
    "session_id": "sess_maria_001",
    "order_id": "ORD-2026-005678",
    "value": 1299.00,
    "currency": "BRL",
    "status": "venda_confirmada"
  }
}
```

**Resultado no Meta Events Manager:**

Meta verá que Maria:
1. Clicou no anúncio de WhatsApp
2. Virou um lead
3. Agendou um atendimento
4. Realizou uma compra de R$ 1.299,00

Isso permite que Meta encontre mais pessoas como Maria para suas campanhas futuras!

---

## 5. Variações de Dados

### Payload Mínimo (Apenas Obrigatório)

```json
{
  "event_type": "lead",
  "contact": {
    "phone": "+55 11 98765-4321"
  },
  "event_data": {
    "timestamp": 1737300000
  }
}
```

### Payload com Dados Incompletos

```json
{
  "event_type": "agenda",
  "contact": {
    "phone": "+55 11 98765-4321",
    "name": "João Silva"
  },
  "event_data": {
    "timestamp": 1737310800,
    "scheduled_time": "2026-01-25 14:30"
  }
}
```

### Payload com Todos os Campos

```json
{
  "event_type": "venda",
  "contact": {
    "phone": "+55 11 98765-4321",
    "name": "João Silva",
    "email": "joao.silva@example.com"
  },
  "event_data": {
    "timestamp": 1737325200,
    "session_id": "sess_abc123def456",
    "order_id": "ORD-2026-001234",
    "value": 299.90,
    "currency": "BRL",
    "status": "venda_confirmada",
    "scheduled_time": "2026-01-25 14:30"
  },
  "campaign": {
    "fbclid": "IwAR2xB5vC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9z",
    "click_id": "click_20260120_001",
    "utm_source": "facebook",
    "utm_medium": "cpc",
    "utm_campaign": "whatsapp_leads"
  }
}
```

---

## 6. Testes de Erro

### Erro: Falta event_type

```json
{
  "contact": {
    "phone": "+55 11 98765-4321"
  },
  "event_data": {
    "timestamp": 1737300000
  }
}
```

**Resposta:**

```json
{
  "success": false,
  "message": "Payload inválido",
  "error": "event_type é obrigatório"
}
```

### Erro: Falta telefone

```json
{
  "event_type": "lead",
  "contact": {
    "name": "João Silva"
  },
  "event_data": {
    "timestamp": 1737300000
  }
}
```

**Resposta:**

```json
{
  "success": false,
  "message": "Payload inválido",
  "error": "contact.phone é obrigatório"
}
```

### Erro: Falta timestamp

```json
{
  "event_type": "lead",
  "contact": {
    "phone": "+55 11 98765-4321"
  },
  "event_data": {}
}
```

**Resposta:**

```json
{
  "success": false,
  "message": "Payload inválido",
  "error": "event_data.timestamp é obrigatório"
}
```

---

## 7. Script de Teste Completo (Node.js)

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/meta-capi';

async function testCompleteFlow() {
  try {
    console.log('🧪 Iniciando testes...\n');

    // Teste 1: Health Check
    console.log('1️⃣ Verificando saúde do serviço...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Serviço operacional\n');

    // Teste 2: Lead
    console.log('2️⃣ Enviando evento de LEAD...');
    const leadResponse = await axios.post(`${BASE_URL}/webhook`, {
      event_type: 'lead',
      contact: {
        phone: '+55 11 98765-4321',
        name: 'João Silva',
        email: 'joao@example.com',
      },
      event_data: {
        timestamp: Math.floor(Date.now() / 1000),
        session_id: 'sess_test_001',
        status: 'novo_lead',
      },
    });
    console.log('✅ Lead enviado:', leadResponse.data.data.eventName, '\n');

    // Teste 3: Agenda
    console.log('3️⃣ Enviando evento de AGENDA...');
    const agendaResponse = await axios.post(`${BASE_URL}/webhook`, {
      event_type: 'agenda',
      contact: {
        phone: '+55 11 98765-4321',
        name: 'João Silva',
        email: 'joao@example.com',
      },
      event_data: {
        timestamp: Math.floor(Date.now() / 1000),
        session_id: 'sess_test_001',
        scheduled_time: '2026-01-25 14:00',
        status: 'agendamento_confirmado',
      },
    });
    console.log('✅ Agenda enviada:', agendaResponse.data.data.eventName, '\n');

    // Teste 4: Venda
    console.log('4️⃣ Enviando evento de VENDA...');
    const vendaResponse = await axios.post(`${BASE_URL}/webhook`, {
      event_type: 'venda',
      contact: {
        phone: '+55 11 98765-4321',
        name: 'João Silva',
        email: 'joao@example.com',
      },
      event_data: {
        timestamp: Math.floor(Date.now() / 1000),
        session_id: 'sess_test_001',
        order_id: 'ORD-TEST-001',
        value: 199.90,
        currency: 'BRL',
        status: 'venda_confirmada',
      },
    });
    console.log('✅ Venda enviada:', vendaResponse.data.data.eventName, '\n');

    console.log('🎉 Todos os testes passaram com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

testCompleteFlow();
```

---

## 8. Mapeamento de Variáveis WTBotBuilder

Use estas variáveis ao configurar webhooks no WTBotBuilder:

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `{{contact.phone}}` | Telefone do contato | +55 11 98765-4321 |
| `{{contact.name}}` | Nome do contato | João Silva |
| `{{contact.email}}` | Email do contato | joao@example.com |
| `{{session.id}}` | ID da sessão | sess_abc123 |
| `{{current_timestamp}}` | Timestamp atual | 1737300000 |
| `{{appointment.datetime}}` | Data/hora do agendamento | 2026-01-25 14:00 |
| `{{order.id}}` | ID do pedido | ORD-2026-001 |
| `{{order.total}}` | Valor total do pedido | 299.90 |
| `{{campaign.fbclid}}` | Facebook Click ID | IwAR2xB5vC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9z |

---

**Última atualização:** Janeiro 2026
