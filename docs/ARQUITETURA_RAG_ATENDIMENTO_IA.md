# Documentação Técnica e Arquitetural: Módulo RAG & Atendente Virtual IA (WhatsApp & Pedidos Online)
**Sistema:** Global Pet - AgroRação Pro  
**Nível:** Portfólio de Alta Engenharia / Padrão Enterprise  
**Versão:** 2.0.0 (RAG & Multi-Channel AI Assistant)  
**Data:** 2026-09-06  

---

## 1. Visão Executiva & Proposta de Valor
O módulo de **Atendimento Inteligente com RAG (Retrieval-Augmented Generation)** foi desenvolvido para solucionar uma das maiores dores das lojas de agropecuária, pet shops e clínicas veterinárias: **a perda de clientes e vendas fora do horário comercial (noites, domingos e feriados) e durante picos de atendimento no balcão físico**.

### Principais Ganhos para o Lojista:
1. **Atendimento Imediato 24/7 sem Custo Adicional de Plantonista:**
   - Respostas humanizadas, consultivas e precisas em menos de 2 segundos no WhatsApp e Web.
2. **Zero Alucinação de Preços e Estoque (Garantia RAG):**
   - A IA consulta o estoque real cadastrado no sistema (incluindo preço exato por quilo da ração a granel, medicamentos veterinários e tabela de banho/tosa por porte) antes de responder qualquer cliente.
3. **Conversão de Dúvidas em Pedidos Reais:**
   - Ao identificar a intenção de compra, a IA coleta nome, endereço, forma de pagamento (PIX, Cartão na Entrega ou Dinheiro com troco) e gera um **Pedido Online Estruturado**.
4. **Integração Fluida com o Caixa Físico (PDV):**
   - O operador da loja recebe alerta sonoro e visual instantâneo e, com **apenas 1 clique no botão "Importar para PDV"**, os itens do pedido online vão para o carrinho do caixa, prontos para separação e emissão do cupom térmico.

---

## 2. Arquitetura da Solução & Pipeline RAG

```
┌────────────────────────┐         ┌─────────────────────────┐
│ Cliente no WhatsApp ou │  HTTP   │ Backend Server (Node.js)│
│ Simulador Web da Loja  │────────>│      /server.ts         │
└────────────────────────┘         └────────────┬────────────┘
                                                │
                                    ┌───────────┴───────────┐
                                    │ Pipeline de RAG:      │
                                    │ 1. Ingestão de Dados  │
                                    │ 2. Context Builder    │
                                    └───────────┬───────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 ▼                              ▼                              ▼
     ┌───────────────────────┐      ┌───────────────────────┐      ┌───────────────────────┐
     │ Catálogo & Granel     │      │ Tabela Pet Care       │      │ Políticas da Loja     │
     │ Preço/kg, estoque real│      │ Porte, tosa, táxi dog │      │ Bairros, frete e PIX  │
     └───────────────────────┘      └───────────────────────┘      └───────────────────────┘
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │ System Prompt Grounded│
                                    │ + Histórico Recente   │
                                    └───────────┬───────────┘
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │ Google Gen AI SDK     │
                                    │ (gemini-2.5-flash)    │
                                    └───────────┬───────────┘
                                                │
                   ┌────────────────────────────┴────────────────────────────┐
                   ▼                                                         ▼
       [Resposta Texto Humanizada]                              [JSON orderProposal Estruturado]
                   │                                                         │
                   ▼                                                         ▼
       Envio via WhatsApp ao Tutor                              Registro na Fila de Pedidos Online
                                                                (Disponível p/ Carregar no PDV)
```

---

## 3. Estrutura de Dados & Modelos TypeScript

Os tipos foram declarados em `/src/types.ts`:

### A. Configurações do Robô (`BotSettings`)
- `enabled`: Booleano para ligar/desligar o robô instantaneamente sem desligar o servidor.
- `botName`: Nome amigável exibido no chat (ex: *"Tobi - Assistente Global Pet"*).
- `tone`: `'caloroso'` | `'comercial'` | `'tecnico'`.
- `operatingHours`: Atendimento 24 horas ou restrito a horários fora do expediente da loja.
- `deliveryFee`: Valor base do frete para entregas (ex: R$ 7,00).
- `freeDeliveryThreshold`: Valor mínimo de compras para frete grátis (ex: R$ 80,00).
- `deliveryNeighborhoods`: Lista de bairros atendidos pelo motoboy da loja.
- `pixKey`: Chave PIX fornecida pela IA caso o cliente queira pagar via PIX.
- `faqCustomInfo`: Regras especiais (vacinas obrigatórias para banho, agendamento de táxi dog).

### B. Pedidos Online Fechados pela IA (`OnlineOrder`)
- `id`: Identificador único (`ord-online-...`).
- `orderNumber`: Código legível para cupom e operador (ex: `#ON-8412`).
- `customerName`, `customerPhone`, `customerAddress`, `neighborhood`, `petName`.
- `items`: Lista de itens (`OnlineOrderItem`) com produto, quantidade, unidade (KG ou UN), preço unitário e subtotal.
- `subtotal`, `deliveryFee`, `total`.
- `paymentMethod`: `'pix'` | `'cartao_entrega'` | `'dinheiro'`.
- `status`: `'pendente'` | `'em_separacao'` | `'saiu_entrega'` | `'concluido'` | `'cancelado'`.
- `source`: `'whatsapp_bot'` | `'web_chat'`.

---

## 4. Endpoints de API Implementados

### 1. Endpoint do Chat RAG: `POST /api/rag-chat`
- **Função:** Recebe a mensagem do cliente, compila o catálogo vivo e regras de negócio da loja, executa a inferência no Gemini e devolve a resposta + proposta estruturada de pedido (se houver).
- **Entrada (JSON):**
  ```json
  {
    "message": "Quero 3kg de ração a granel Premier filhote para entregar no Centro",
    "history": [],
    "botSettings": { ... },
    "storeSettings": { ... },
    "products": [ ... ]
  }
  ```
- **Saída (JSON):**
  ```json
  {
    "success": true,
    "data": {
      "reply": "Perfeito! A Premier Filhotes está R$ 28,90/kg...",
      "intent": "pedido_compra",
      "ragSources": ["Rações Granel: Premier", "Taxas de Entrega"],
      "orderProposal": {
        "isReadyToCreate": true,
        "customerName": "Cliente WhatsApp",
        "customerAddress": "Rua das Flores, 120",
        "neighborhood": "Centro",
        "items": [...],
        "total": 93.70,
        "paymentMethod": "pix"
      }
    }
  }
  ```

### 2. Receptor de Webhooks: `POST /api/whatsapp-webhook`
- **Função:** Ponto de entrada para integração com APIs oficiais do WhatsApp (Meta Cloud API, Evolution API, Z-API ou Baileys).
- **Compatibilidade:** Trata payloads comuns de mensagens recebidas, repassando ao motor RAG e retornando o status de processamento imediato.

---

## 5. Mapeamento de Arquivos e Código

| Arquivo | Função no Sistema |
| :--- | :--- |
| `/server.ts` | Backend Express com rotas `/api/rag-chat`, `/api/whatsapp-webhook` e fallback heurístico |
| `/src/types.ts` | Interfaces TypeScript: `BotSettings`, `OnlineOrder`, `OnlineOrderItem`, `BotChatMessage` e aba `'bot'` |
| `/src/data.ts` | Valores padrão e mock de inicialização: `INITIAL_BOT_SETTINGS`, `INITIAL_ONLINE_ORDERS`, `INITIAL_DEMO_CHAT_MESSAGES` |
| `/src/context/AppContext.tsx` | Gerenciamento de estado reativo, persistência em `localStorage`, handlers de pedidos e áudio de alerta |
| `/src/components/AtendimentoIAScreen.tsx` | Tela completa com Simulador WhatsApp, Gestão de Pedidos da IA, Base RAG e Guia de Integração |
| `/src/components/OnlineOrdersModal.tsx` | Modal flutuante acessível pelo Header para importar pedidos online rapidamente para o PDV |
| `/src/components/Sidebar.tsx` | Item de menu lateral *"Robô IA"* com badge dinâmico de novos pedidos pendentes |
| `/src/components/Header.tsx` | Botão rápido *"Pedidos IA"* no cabeçalho com alerta pulsante |
| `/src/components/ManualModal.tsx` | Adição do Módulo 7 no Manual Lúdico do Operador |
| `/metadata.json` & `/index.html` | Atualização das meta-tags e descrição institucional do sistema |

---

## 6. Guia para Manutenção, Refatoração e Rollback

### Como Desativar o Robô Temporariamente (Sem Alteração de Código):
1. Acesse a aba **"Robô IA"** na navegação lateral.
2. Clique na aba **"Base RAG da Loja"**.
3. Desative o interruptor **"Ativo 24h"**. O robô responderá apenas orientando o cliente sobre o horário da loja ou não aceitará novos pedidos automáticos.

### Como Alterar a Personalidade ou Regras do RAG:
- As instruções de tom de voz, bairros atendidos, valores de frete grátis e regras especiais (ex: vacinas para banho) podem ser editadas diretamente na interface em **"Base RAG da Loja"** ou no arquivo `/src/data.ts` na constante `INITIAL_BOT_SETTINGS`.

### Como Fazer Rollback Completo do Módulo (Reverter ao Estado Anterior):
Caso necessite retornar ao estado anterior sem o módulo de IA:
1. Em `/src/types.ts`: Remova `'bot'` do tipo `TabType` e as interfaces do bot.
2. Em `/src/context/AppContext.tsx`: Remova as variáveis e métodos do `AppContextType` e Provider.
3. Em `/src/App.tsx`: Remova a importação de `AtendimentoIAScreen` e `OnlineOrdersModal`.
4. Em `/src/components/Sidebar.tsx`: Remova o item `{ id: 'bot', ... }` do array `navItems`.
5. Em `/server.ts`: Remova as rotas `/api/rag-chat` e `/api/whatsapp-webhook`.

---
*Documentação gerada com padrão profissional para portfólio de engenharia de software e comercialização de SaaS Agropecuário.*
