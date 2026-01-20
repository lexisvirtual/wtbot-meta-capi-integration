# WTBotBuilder Meta CAPI Integration

Uma integração completa entre o **WTBotBuilder** e a **Meta Conversions API (CAPI)** para otimizar campanhas de WhatsApp. Este projeto permite rastrear eventos de lead, agendamento e venda, melhorando o algoritmo de segmentação da Meta.

## 🎯 O que faz

Este backend Node.js/Express:

- ✅ Recebe webhooks do WTBotBuilder
- ✅ Valida e processa dados de contato
- ✅ Faz hash de dados pessoais conforme Meta CAPI requer
- ✅ Envia eventos para Meta Conversions API
- ✅ Mapeia 3 tipos de eventos: Lead, Agenda, Venda
- ✅ Fornece endpoints para teste e monitoramento

## 🚀 Quick Start

### 1. Instalação

```bash
npm install
# ou
pnpm install
```

### 2. Configurar Variáveis de Ambiente

Adicione ao seu ambiente (Manus UI ou arquivo `.env`):

```
META_PIXEL_ID=892825097869184
META_ACCESS_TOKEN=seu_token_aqui
```

### 3. Executar

```bash
npm run dev
```

### 4. Testar

```bash
curl http://localhost:3000/api/meta-capi/health
```

## 📡 Endpoints

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| POST | `/api/meta-capi/webhook` | Recebe webhook do WTBotBuilder |
| POST | `/api/meta-capi/test` | Testa integração com evento de exemplo |
| GET | `/api/meta-capi/health` | Verifica saúde do serviço |

## 📚 Documentação

- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Guia completo de integração
- **[PAYLOAD_EXAMPLES.md](./PAYLOAD_EXAMPLES.md)** - Exemplos de payloads para cada evento

## 🔑 Credenciais Configuradas

| Campo | Valor |
| :--- | :--- |
| Pixel ID | 892825097869184 |
| API Version | v18.0 |
| Action Source | business_messaging |
| Messaging Channel | whatsapp |

## 📊 Fluxo de Dados

```
WTBotBuilder (Webhook)
    ↓
Backend Node.js (Validação + Hash)
    ↓
Meta Conversions API
    ↓
Meta Ads Manager (Otimização)
```

## 🔐 Segurança

- Dados pessoais são automaticamente hasheados em SHA-256
- Telefone, email e nome são normalizados antes do hashing
- Access Token é mantido seguro em variáveis de ambiente

## 🛠️ Estrutura do Projeto

```
server/
  ├── routes/
  │   └── metaCapi.ts          # Rotas da API
  ├── services/
  │   └── metaCapiService.ts   # Lógica de integração
  ├── utils/
  │   └── hash.ts              # Funções de hashing
  └── index.ts                 # Servidor Express

shared/
  └── types.ts                 # Tipos TypeScript

INTEGRATION_GUIDE.md            # Documentação completa
PAYLOAD_EXAMPLES.md             # Exemplos de payloads
```

## 📋 Eventos Suportados

| WTBotBuilder | Meta CAPI | Quando |
| :--- | :--- | :--- |
| `lead` | Lead | Primeira mensagem recebida |
| `agenda` | CompleteRegistration | Agendamento confirmado |
| `venda` | Purchase | Pedido/venda confirmada |

## 🧪 Teste Rápido

```bash
# Health check
curl http://localhost:3000/api/meta-capi/health

# Enviar evento de teste
curl -X POST http://localhost:3000/api/meta-capi/test

# Enviar evento customizado
curl -X POST http://localhost:3000/api/meta-capi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "lead",
    "contact": {
      "phone": "+55 11 98765-4321",
      "name": "João Silva",
      "email": "joao@example.com"
    },
    "event_data": {
      "timestamp": '$(date +%s)'
    }
  }'
```

## 📈 Próximos Passos

1. **Configurar no WTBotBuilder:** Crie webhooks nos pontos de lead, agenda e venda
2. **Validar no Meta Events Manager:** Verifique se os eventos estão chegando
3. **Monitorar Campanhas:** Acompanhe o desempenho das campanhas otimizadas

## 📚 Referências

- [Meta Conversions API Docs](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [WTBotBuilder Docs](https://docs.wtbotbuilder.com)
- [Hashing Guide](https://developers.facebook.com/docs/marketing-api/conversions-api/hashing)

## 💡 Dicas

- Use timestamps Unix (segundos desde 1970)
- Telefone deve conter apenas dígitos após normalização
- Email deve ser válido
- Sempre inclua `contact.phone` e `event_data.timestamp`

## 🐛 Troubleshooting

**Erro: "Pixel ID ou Access Token não configurados"**
- Verifique as variáveis de ambiente

**Erro: "Invalid access token"**
- Gere um novo token no Meta Business Manager

**Eventos não aparecem no Events Manager**
- Aguarde 5-10 minutos
- Verifique os logs do servidor
- Valide o Pixel ID

## 📞 Suporte

Para dúvidas, consulte:
1. [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
2. [PAYLOAD_EXAMPLES.md](./PAYLOAD_EXAMPLES.md)
3. Logs do servidor

---

**Versão:** 1.0.0  
**Última atualização:** Janeiro 2026  
**Status:** ✅ Pronto para produção
