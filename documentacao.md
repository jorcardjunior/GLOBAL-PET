# 🐾 Global Pet & AgroRação Pro
## Manual Lúdico, Visual e Técnico do Sistema Integrado

> **"Tudo que uma casa de ração e pet shop precisa, na velocidade de um clique e sem complicações."**

---

### 🌟 1. O Que É o Global Pet & AgroRação Pro?

Imagine uma loja de bairro que vende ração por quilo em tambores, tem sacos de 15kg empilhados na gôndola, atende cães e gatos agitados no banho e tosa dos fundos, vende fiado para os vizinhos conhecidos de longa data e ainda precisa negociar caminhões de ração com distribuidores toda semana.

Antigamente, essa rotina exigia **quatro cadernos de papel, uma calculadora de pilha e três planilhas de Excel que travavam**.

O **Global Pet & AgroRação Pro** nasceu para reunir todo esse universo em **uma única tela intuitiva, moderna e visualmente deslumbrante**, funcionando em tempo real até mesmo offline!

---

### 🛠️ 2. Tecnologias e Ferramentas Usadas na Construção

| Camada / Função | Ferramenta / Tecnologia | Por que foi escolhida? |
| :--- | :--- | :--- |
| **Linguagem Principal** | **TypeScript 5+** | Garante código à prova de falhas de digitação, segurança extrema nos cálculos de balança e consistência em todos os dados financeiros. |
| **Interface & Componentes** | **React 18 + Vite** | Carregamento ultrarrápido, transições fluidas e reatividade instantânea ao adicionar itens no carrinho ou alternar de tela. |
| **Estilização Visual** | **Tailwind CSS 4** | Design responsivo com estética *Modern Dark Glow* (fundo escuro de alto contraste que descansa a vista dos operadores de caixa após 10 horas de trabalho). |
| **Ícones do Sistema** | **Google Material Symbols** | Mais de 40 ícones vetoriais padronizados para representar animais, balanças, sacarias, caminhões e caixas registradoras. |
| **Persistência de Dados** | **LocalStorage Engine** | Salva automaticamente produtos, estoques, clientes, pedidos de compra e vendas direto no navegador. Se faltar energia ou a página for recarregada, **nada se perde**. |
| **Gráficos e Indicadores** | **Recharts (SVG Nativo)** | Gráficos limpos e sem poluição visual para demonstrar CMV, composição de receitas e curvas semanais de vendas. |
| **Automação de WhatsApp** | **Protocolo Direct WhatsApp (wa.me)** | Disparo de mensagens com links profundos codificados para comunicação direta com os tutores sem necessidade de intermediários pagos caros. |
| **Impressão de Cupons** | **Thermal Receipt Engine (CSS Media Print)** | Formatação cirúrgica para impressoras térmicas de bobina de 80mm (Elgin, Bematech, Daruma e Epson) e cópia para área de transferência. |

---

### 🚀 3. Os 6 Grandes Módulos do Sistema

```
                    ┌─────────────────────────┐
                    │   GLOBAL PET & AGRO     │
                    │   Painel Centralizador  │
                    └────────────┬────────────┘
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
   🛒 1. PDV ÁGIL          ⚖️ 2. RAÇÃO GRANEL      🛁 3. BANHO & TOSA
   • Leitor de Código      • Balança Integrada     • Fila em Tempo Real
   • Pesagem na Tela       • Lotes e Validades     • Táxi Dog Rastreado
   • 5 Tipos Pagamento     • Rendimento do Tambor  • WhatsApp Automático
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
   📖 4. CADERNINHO        🚛 5. FORNECEDORES      📊 6. FINANCEIRO & DRE
   • Fiado Comunitário     • Catálogo de Marcas    • Faturamento do Dia
   • Limite de Crédito     • Cotação em 1 Clique   • CMV e Margens Reais
   • Abatimento Parcial    • Entrada Automática    • Contas a Pagar
```

---

#### 🛒 Módulo 1: Frente de Caixa (PDV de Balcão)
* **Objetivo:** Registrar qualquer venda em menos de 10 segundos.
* **O que faz:**
  1. Suporta produtos fechados (unidades) e granel fracionado (por quilo).
  2. Oferece botões rápidos para multiplicar quilos (1kg, 2,5kg, 5kg, 10kg).
  3. Formas de pagamento reais: **PIX**, **Dinheiro**, **Cartão de Crédito**, **Cartão de Débito** e **Caderninho de Fiado**.
  4. Ao finalizar a venda, emite o **Cupom Não-Fiscal em padrão de impressora térmica 80mm** ou gera comprovante para envio por WhatsApp.
  5. Contém alertas inteligentes no topo: avisa quando a ração favorita está acabando, alerta se há vacina perto do vencimento e lembra dos boletos do dia.

---

#### ⚖️ Módulo 2: Controle de Ração a Granel (Tambores & Balança)
* **Objetivo:** Eliminar o sumiço de ração e o desperdício de fundo de saco.
* **O que faz:**
  1. Mostra visualmente o "nível do tambor" através de barras de progresso coloridas.
  2. Calcula automaticamente quanto a loja ganha ao abrir um saco de 15kg e vendê-lo fracionado (geralmente gerando de **45% a 70% de margem**, contra apenas 20% do saco fechado).
  3. Notifica quando o tambor atinge o volume de segurança para abrir outro saco.
  4. Controla número de lote e data de validade da ração aberta.

---

#### 🛁 Módulo 3: Centro de Estética (Banho & Tosa com WhatsApp)
* **Objetivo:** Organizar a rotina dos tosadores e encantar os donos dos animais.
* **O que faz:**
  1. Fila de atendimento com 3 etapas visuais:
     - 🟡 **Aguardando Chegada**
     - 🟣 **Na Banheira / Mesa de Tosa**
     - 🟢 **Pronto para Retirada**
  2. Suporte para **Táxi Dog** (busca e entrega de pets em domicílio).
  3. **Integração Automática com WhatsApp**:
     - No exato momento em que o funcionário clica em **"Finalizar & Avisar"**, abre-se o assistente de disparo com o telefone do tutor e uma mensagem formatada com emojis:
     > *"🐾 Olá, Marcos! O Thor já terminou o banho e tosa aqui na Global Pet! Ficou super cheiroso e já está prontinho esperando você para vir buscar! 🐶✨"*
     - Permite escolher 3 modelos com um toque (*Banho Concluído*, *Táxi Dog a Caminho* ou *Carinhoso VIP*).
  4. Botão **"Lançar no PDV"** que importa o serviço do pet diretamente para a comanda do caixa com um clique.

---

#### 📖 Módulo 4: Caderninho Comunitário (Fiado Sob Controle)
* **Objetivo:** Manter a tradição de confiança com os clientes do bairro, sem perder dinheiro.
* **O que faz:**
  1. Cada cliente possui um cadastro com endereço, telefone e nomes dos seus pets.
  2. Limite de crédito máximo parametrizável (ex: limite de até R$ 350,00).
  3. Indicador de pendências em atraso com cálculo dos dias vencidos.
  4. Botões rápidos de quitação: o cliente pode pagar o valor total ou fazer pagamentos parciais (ex: abater R$ 50,00 na sexta-feira).
  5. Conexão direta com o WhatsApp do cliente para envio de extrato amigável.

---

#### 🚛 Módulo 5: Gestão de Fornecedores & Cotações
* **Objetivo:** Nunca mais deixar faltar ração e comprar pelo menor preço.
* **O que faz:**
  1. Cadastro completo das distribuidoras de ração, grãos, medicamentos e produtos de higiene (com CNPJ, marcas representadas e prazo de entrega).
  2. Cotações automáticas disparadas com 1 clique a partir dos alertas de estoque baixo do PDV.
  3. Gestão de pedidos de compra em 4 fases: *Cotação* ➔ *Enviado* ➔ *Faturado* ➔ *Entregue*.
  4. **Entrada de Mercadoria Automatizada:** ao marcar um pedido de fornecedor como *Entregue*, o sistema repõe os quilos e unidades no estoque físico imediatamente.

---

#### 📊 Módulo 6: Inteligência Financeira & Gestão da Loja
* **Objetivo:** Dar ao dono da loja a visão exata do lucro do negócio.
* **O que faz:**
  1. **Faturamento Bruto vs Líquido** apurado minuto a minuto.
  2. **DRE Gerencial Simplificada**: Receitas, Custo das Mercadorias Vendidas (CMV), Custos Operacionais e Lucro Líquido Real.
  3. **Composição da Receita**: Gráfico visual que mostra quanto veio de sacarias fechadas, quanto veio de ração a granel e quanto veio de serviços de banho & tosa.
  4. **Agenda de Boletos a Pagar**: Lista de duplicatas dos fornecedores com botão para copiar a linha digitável do código de barras diretamente para o aplicativo do banco.

---

### 🎯 4. Como Simular uma Rotina Real da Loja em 5 Minutos

1. **Abrir o Caixa**: Observe no cabeçalho o indicador verde *"Caixa Aberto #01"*.
2. **Receber um Pet no Banho & Tosa**: Vá até a aba *Pet Care*, veja o pet *Thor* em atendimento e clique no botão verde **"Finalizar & Avisar"**. O sistema abrirá a janela do WhatsApp já preenchida com o nome do Marcos e do Thor!
3. **Pesar Ração no Balcão**: Vá para o *PDV*, clique em *Nova Venda*, escolha *Ração Golden Frango*, selecione *2.5 kg* e adicione ao cupom.
4. **Fechar a Venda**: Selecione *PIX*, clique em *Confirmar Venda* e veja o **Cupom Térmico Não-Fiscal** ser gerado na tela pronto para imprimir.
5. **Ver a Baixa no Estoque**: Vá na aba *Granel* e note que os 2,5 kg foram subtraídos com precisão do tambor.
6. **Consultar o Caderninho**: Na aba *Clientes*, localize o *Seu Antônio* e dê baixa de R$ 50,00 no fiado dele.

---

### 🛡️ 5. Conclusão: Por que o Sistema Está Pronto para Uso Comercial?

- ✅ **Seguro e Resiliente**: Possui validação de dados em todas as entradas.
- ✅ **Completamente Integrado**: Os módulos conversam entre si (PDV fala com Estoque, Pet Care fala com PDV, Fornecedores abastecem o Estoque e o Financeiro consolida tudo).
- ✅ **Amigável ao Usuário**: Interface moderna, botões com feedback tátil e mensagens claras sem termos técnicos complicados.
- ✅ **Zero Custos Ocultos**: Funciona diretamente no navegador de computadores, tablets ou celulares com câmera para leitura de códigos.

---

# 🧭 GUIA HISTÓRICO DAS FASES & ARQUITETURA TÉCNICA
### (Documento de Referência para Desenvolvedores e Agentes de IA)

> **Nota para IAs e Desenvolvedores:** Esta seção documenta detalhadamente cada etapa, módulo, componente e fluxo construído no projeto. Se você for dar manutenção ou adicionar novos recursos, consulte este mapa estrutural para entender o funcionamento sem quebrar dependências existentes.

---

## 📅 Linha do Tempo das Fases Implementadas

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│ FASE 1: FUNDAÇÃO OPERACIONAL DO VAREJO                                            │
│ • PDV Balcão Rápido + Balança Fracionada + Cupom Térmico 80mm                     │
│ • Tambores de Ração a Granel com Rendimento e Estoque Mínimo                      │
│ • Banho & Tosa com Fila Visual e Disparo Automático de WhatsApp                   │
│ • Caderninho de Fiado com Limite de Crédito e Abatimento Parcial                  │
│ • Gestão de Fornecedores, Pedidos de Compra e Cotações                            │
│ • DRE Gerencial, Boletos a Pagar e Indicadores Financeiros Reais                  │
└─────────────────────────┬─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼─────────────────────────────────────────────────────────┐
│ FASE 2: ENTRADA AUTOMATIZADA DE MERCADORIAS & INTELIGÊNCIA FISCAL IA              │
│ • Parser Nativo de XML de NF-e (Chave 44 dígitos, tributos, conversão saco/kg)    │
│ • Extrator Multimodal de Romaneios em PDF/Foto via Gemini 2.5 Flash no Backend    │
│ • Monitor Fiscal SEFAZ A1 (Consulta de NF-e emitidas para o CNPJ da Loja)         │
│ • Importador e Migrador em Massa de Produtos via Planilhas CSV / Excel            │
└─────────────────────────┬─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼─────────────────────────────────────────────────────────┐
│ FASE 3: HIERARQUIA DE ACESSO, PERMISSÕES & TRAVAS ANTI-FRAUDE                     │
│ • Perfis de Usuário: Dono, Gerente, Vendedor, Operador de Caixa e Tosador         │
│ • Controle de Descontos Máximos por Operador e Proteção de Dados Financeiros      │
│ • Modal de Autorização por PIN de Supervisor (Descontos e Cancelamento de Itens)  │
│ • Cadastro e Gestão de Equipe com Horários de Turno Parametrizáveis               │
└─────────────────────────┬─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼─────────────────────────────────────────────────────────┐
│ FASE 4: TELEMETRIA & GESTÃO REMOTA DO COMERCIANTE À DISTÂNCIA                     │
│ • Painel do Dono em Tempo Real (Saldo do Caixa, Faturamento, Alertas e Fila)      │
│ • Detecção Inteligente de Rede: [🏠 Na Loja] vs [🌐 Gestão Remota]               │
│ • Bloqueio Remoto Fora do Expediente para Funcionários (Conformidade CLT)         │
│ • Passes de Acesso Remoto Temporários (2h, 4h, 8h, 24h) com PIN de Supervisor     │
│ • Trava Geral de Emergência (Lockdown Instantâneo em caso de irregularidades)     │
│ • Log de Auditoria em Tempo Real (Horário, Colaborador, Dispositivo e IP)         │
└─────────────────────────┬─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼─────────────────────────────────────────────────────────┐
│ FASE 5: RESPONSIVIDADE MULTI-DISPOSITIVO & UX MOBILE ERGONÔMICA                   │
│ • Barra Inferior Mobile com Touch Targets Ergonômicos (>= 44px) e Rolagem Suave   │
│ • Centralização Matemática do Dropdown de Avisos & Alertas no Celular com Backdrop│
│ • Botões [X] de Fechamento em Todos os Avisos, Toasts e Notificações              │
│ • Cards de Avisos Prioritários no PDV com Dispensa Individual e Botão Restaurar   │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Detalhamento das Fases e Entregas Técnicas

### 🔹 FASE 1: Fundação Operacional do Varejo Pet & Agro
1. **Frente de Caixa (PDV) - `src/components/PDVScreen.tsx`**:
   - Venda ultra-ágil de sacos fechados ou ração a granel por fração de quilos.
   - 5 formas de pagamento integradas (Dinheiro, PIX, Cartão de Crédito, Débito e Fiado/Caderninho).
   - Cálculo automático de troco e conferência de valor recebido.
   - Emissão de Cupom Não-Fiscal estilizado para impressoras térmicas de 80mm (`src/components/CupomModal.tsx`) e opção de envio por WhatsApp.
2. **Controle de Tambores a Granel - `src/components/GranelScreen.tsx`**:
   - Desdobro automático de sacos em quilos fracionados.
   - Comparativo de margem de lucro (saco fechado ~20% vs fracionado ~45% a 70%).
   - Alerta visual do nível dos tambores e histórico de aberturas de sacos.
3. **Banho & Tosa (Pet Care) - `src/components/PetCareScreen.tsx`**:
   - Kanban visual com etapas (*Aguardando*, *Em Atendimento*, *Pronto*).
   - Controle de Táxi Dog (leva e traz) e porte dos animais.
   - Integração com WhatsApp direto (`src/components/PetWhatsAppModal.tsx`) para avisar o tutor assim que o animal fica pronto.
   - Botão para lançar o serviço diretamente no carrinho do PDV com 1 clique.
4. **Caderninho de Fiado - `src/components/ClientesScreen.tsx`**:
   - Controle rigoroso de limite de crédito por cliente.
   - Registro de compras a prazo e histórico de pagamentos parciais.
5. **Fornecedores & Cotações - `src/components/FornecedoresScreen.tsx`**:
   - Catálogo de distribuidores de rações, medicamentos e acessórios.
   - Disparo de cotações automáticas a partir de itens em estoque baixo.
   - Entrada de mercadorias no estoque ao marcar pedido como *Entregue*.
6. **Inteligência Financeira & DRE - `src/components/GestaoScreen.tsx` e `FinanceiroDashboard.tsx`**:
   - DRE Gerencial simplificado (Faturamento, CMV, Despesas e Lucro Líquido).
   - Agenda de boletos bancários com cópia da linha digitável em 1 clique.
   - Gráficos de composição de faturamento usando `recharts`.

---

### 🔹 FASE 2: Entrada Automatizada de Mercadorias & IA Gemini
1. **Módulo de Entradas - `src/components/EntradasScreen.tsx`**:
   - **Importação de XML de NF-e**:
     - Parser local via DOMParser para extração de Chave de Acesso (44 dígitos), Número da Nota, Série, Dados do Emitente/Fornecedor (CNPJ, Razão Social, IE), Itens da Nota com NCM, CFOP, Quantidade, Valor Unitário, Descontos, IPI e ICMS.
     - **Conversão Automática Saco ➔ Quilos**: identifica sacarias (ex: 15kg, 20kg) e calcula o custo por quilo e a sugestão de preço de venda com base na margem configurada.
   - **Leitor de Romaneios e Faturas em PDF / Imagem com IA Multimodal**:
     - Endpoint seguro no backend: `POST /api/parse-invoice` em `server.ts`.
     - Utiliza o SDK oficial `@google/genai` com o modelo `gemini-2.5-flash` para ler fotos de notas em papel, romaneios amassados ou PDFs de distribuidores sem padrão fixo.
     - Retorna JSON estruturado pronto para conferência e gravação no estoque.
   - **Monitor Fiscal SEFAZ**:
     - Verificação do Certificado Digital Modelo A1 (.pfx/.p12).
     - Consulta simulada das notas fiscais destinadas ao CNPJ da agropecuária diretamente na SEFAZ.
   - **Migração em Massa via CSV / Planilha**:
     - Permite que lojas importem centenas de produtos de sistemas legados em segundos.

---

### 🔹 FASE 3: Hierarquia de Acesso, Perfis de Usuários & Travas Anti-Fraude
1. **Perfis Parametrizados (`EmployeeUser`)**:
   - `dono`: Acesso total e irrestrito (financeiro, estoque, cadastros, DRE e auditoria).
   - `gerente`: Gestão operacional, aprovação de descontos, compras e estornos.
   - `vendedor`: Atendimento balcão e cadastro de clientes, com limites de desconto.
   - `operador`: Operação pura de caixa PDV. Protegido contra visualização de DRE e lucros globais.
   - `tosador`: Operação focada no módulo Pet Care (banho, tosa e táxi dog).
2. **Autorização de Supervisor por PIN - `src/components/SupervisorAuthModal.tsx`**:
   - Quando um operador tenta conceder desconto acima da sua alçada (ex: acima de 5%) ou cancelar um item do cupom, o sistema exige o PIN de 4 dígitos do Gerente ou Dono para liberar a ação.
3. **Gestão de Equipe - `src/components/EmployeeModal.tsx`**:
   - Cadastro de funcionários com foto/avatar, cargo, limite de desconto, jornada de trabalho (ex: 08:00 às 18:30) e PIN pessoal criptografado em memória.

---

### 🔹 FASE 4: Telemetria & Gestão Remota do Comerciante à Distância
1. **Painel Executivo Remoto do Dono - `src/components/OwnerRemoteDashboardModal.tsx`**:
   - Permite ao comerciante acompanhar a loja de qualquer lugar pelo celular ou tablet.
   - **Telemetria ao Vivo**:
     - Saldo atual do caixa físico #01.
     - Total de faturamento do dia e quantidade de vendas concluídas.
     - Contas do dia a pagar e total acumulado no caderninho de fiado.
     - Silos de ração que atingiram nível crítico de reposição.
     - Fila de pets aguardando e em atendimento no banho e tosa.
     - Lista de colaboradores atualmente conectados com seu status e dispositivo.
2. **Detecção Inteligente do Modo de Conexão**:
   - Indicador visual no cabeçalho:
     - `[🏠 Na Loja]`: Conectado via rede interna/Wi-Fi da loja física.
     - `[🌐 Gestão Remota]`: Conectado de fora da loja (redes móveis 4G/5G ou Wi-Fi externo).
3. **Travas Anti-Fraude e Conformidade com Leis Trabalhistas (CLT)**:
   - Funcionários sem privilégio de administração (`operador`, `vendedor`, `tosador`) são **automaticamente bloqueados** se tentarem acessar o sistema remotamente fora do horário comercial da loja (ex: após as 18:30 ou aos domingos).
   - **Tela de Bloqueio de Segurança - `src/components/RemoteLockScreen.tsx`**:
     - Apresenta mensagem amigável e explicativa sobre normas de conformidade trabalhista e segurança patrimonial.
     - Permite liberação presencial de emergência via PIN do Dono/Gerente.
4. **Sistema de Passes Temporários de Acesso Remoto**:
   - O Dono ou Gerente pode emitir passes de 2h, 4h, 8h ou 24h para funcionários realizarem tarefas externas específicas (ex: inventário noturno, feiras agropecuárias ou balanço de final de semana).
5. **🚨 Trava Geral de Emergência (Emergency Lockdown)**:
   - Botão de comando no painel do dono que corta imediatamente o acesso de todos os operadores remotos em caso de suspeita de furto, invasão ou má conduta.
6. **Log de Auditoria de Segurança em Tempo Real**:
   - Registro detalhado de eventos com data, hora, colaborador, ação realizada, dispositivo (ex: *iPhone*, *Android*, *Desktop*) e endereço IP.

---

### 🔹 FASE 5: Responsividade Multi-Dispositivo & UX Mobile Ergonômica
1. **Barra de Navegação Inferior Mobile - `src/components/Sidebar.tsx`**:
   - Altura de 52px a 56px com touch-targets confortáveis (mínimo de 44px).
   - Rolagem horizontal oculta sem quebra de texto para acomodar todos os módulos em celulares estreitos (360px a 400px).
   - Indicador visual ativo com pílula de destaque e ícone de cadeado para módulos restritos ao cargo do usuário logado.
2. **Centralização Matemática do Menu de Avisos & Alertas - `src/components/NotificationDropdown.tsx`**:
   - **Problema Corrigido**: Em celulares, o menu de notificações ficava excessivamente colado à esquerda, cortando títulos e escondendo informações.
   - **Solução Aplicada**:
     - Centralização precisa em telas móveis: `fixed left-1/2 -translate-x-1/2 top-20 w-[calc(100vw-24px)] max-w-[420px]`.
     - Fundo escurecido com desfoque (*Backdrop* `bg-black/70 backdrop-blur-sm`) que foca a atenção no aviso e fecha com 1 toque fora.
     - Botão **[X]** de fechar com área de clique ergonômica no topo direito e botão secundário `[X Fechar]` no rodapé.
3. **Cartões de Avisos Prioritários no PDV - `src/components/PDVScreen.tsx`**:
   - Cada cartão de alerta do balcão (Estoque Baixo, Validade Próxima e Boletos/Pet Care) possui agora um botão **[X]** dedicado para dispensa individual.
   - Alinhamento centralizado com `snap-center` para que os cartões não sumam ou fiquem cortados à esquerda no carrossel mobile.
   - Botão de restauração rápida para reexibir alertas dispensados.
4. **Notificações Temporárias (Toasts) - `src/components/Toast.tsx`**:
   - Botão **[X]** ampliado para facilitar o descarte imediato de avisos flutuantes na tela.

---

## 📂 Mapa de Arquivos e Componentes do Projeto

```
/
├── .env.example                     # Declaração das variáveis de ambiente necessárias
├── metadata.json                    # Metadados do app (nome, descrição, permissões de câmera)
├── index.html                       # Entry point HTML com fontes Google e viewport mobile
├── server.ts                        # Backend Express + Vite middleware + API Gemini segura
├── DOCUMENTACAO.md                  # Este documento de referência arquitetural e técnica
├── src/
│   ├── main.tsx                     # Entry point React
│   ├── App.tsx                      # Componente raiz, roteador de abas e controle de tela bloqueada
│   ├── types.ts                     # Interfaces TypeScript de todos os modelos de dados
│   ├── context/
│   │   └── AppContext.tsx           # Estado global, persistência LocalStorage e regras de negócio
│   ├── components/
│   │   ├── Header.tsx               # Barra superior com status da loja, conexão remota e sino de avisos
│   │   ├── Sidebar.tsx              # Menu lateral no Desktop e barra de navegação inferior no Mobile
│   │   ├── PDVScreen.tsx            # Tela de Frente de Caixa, balcão rápido e avisos prioritários
│   │   ├── GranelScreen.tsx         # Gestão de Tambores de ração a granel e pesagem
│   │   ├── PetCareScreen.tsx        # Fila do Banho & Tosa, Táxi Dog e integração WhatsApp
│   │   ├── ClientesScreen.tsx       # Caderninho de fiado e limites de crédito
│   │   ├── FornecedoresScreen.tsx   # Fornecedores, pedidos de compra e cotações
│   │   ├── EntradasScreen.tsx       # Importador XML NF-e, Leitor PDF IA e Monitor SEFAZ A1
│   │   ├── GestaoScreen.tsx         # Fechamento de caixa, DRE Gerencial e contas a pagar
│   │   ├── FinanceiroDashboard.tsx  # Gráficos financeiros detalhados (Power BI style)
│   │   ├── NotificationDropdown.tsx # Painel centralizado de avisos operacionais do dia
│   │   ├── OwnerRemoteDashboardModal.tsx # Painel executivo de monitoramento remoto do comerciante
│   │   ├── RemoteLockScreen.tsx     # Tela de bloqueio e conformidade CLT para funcionários remotos
│   │   ├── SupervisorAuthModal.tsx  # Validação de PIN para liberação de descontos e estornos
│   │   ├── EmployeeModal.tsx        # Cadastro e gestão de colaboradores da equipe
│   │   ├── NovaVendaModal.tsx       # Modal de seleção rápida de produtos para o carrinho
│   │   ├── CupomModal.tsx           # Visualizador e impressor de cupom térmico 80mm
│   │   ├── PetWhatsAppModal.tsx     # Gerador de avisos de pet pronto para envio via WhatsApp
│   │   ├── BarcodeModal.tsx         # Scanner de código de barras via câmera do celular/computador
│   │   ├── ManualModal.tsx          # Manual lúdico interativo do sistema para novos usuários
│   │   ├── AjustesModal.tsx         # Configurações de loja, impressora, estoque mínimo e SEFAZ
│   │   └── Toast.tsx                # Notificações flutuantes com botão X de fechar
```

---

## ⚙️ Estrutura do Estado Global (`AppContext.tsx`)

O estado é gerenciado via React Context com persistência síncrona na chave `'agroracao_pro_state_v1'` do `localStorage`. Principais coleções:

| Estado | Tipo | Descrição |
| :--- | :--- | :--- |
| `products` | `Product[]` | Produtos fechados e sacos de ração para desdobro a granel. |
| `cart` | `CartItem[]` | Itens no cupom atual do PDV com quilos, unidades e descontos. |
| `sales` | `Sale[]` | Histórico de vendas finalizadas com forma de pagamento e data/hora. |
| `petCareQueue` | `PetService[]` | Fila de atendimento de banho, tosa e consultas. |
| `clients` | `Client[]` | Clientes cadastrados, limites de fiado e dívidas acumuladas. |
| `suppliers` | `Supplier[]` | Distribuidores e fornecedores homologados. |
| `purchaseOrders`| `PurchaseOrder[]` | Pedidos de compra e cotações de abastecimento. |
| `bills` | `Bill[]` | Boletos e duplicatas a pagar com linhas digitáveis. |
| `users` | `EmployeeUser[]` | Colaboradores cadastrados com cargos e PINs. |
| `currentUser` | `EmployeeUser` | Usuário atualmente operando a sessão. |
| `connectionMode` | `'local' \| 'remoto'`| Detecção de onde o usuário está acessando a aplicação. |
| `remoteAccessPolicy` | `RemoteAccessPolicy` | Configuração de expediente, passes temporários e trava de emergência. |
| `securityAuditLogs` | `SecurityAuditLog[]` | Log de acessos e tentativas de login para conferência do dono. |

---

## 🛠️ Como Estender ou Modificar o Sistema (Guia Rápido para IAs)

1. **Para Adicionar uma Nova Aba de Navegação**:
   - Declare o ID da aba no tipo `ActiveTab` em `src/types.ts`.
   - Adicione o item correspondente em `navItems` dentro de `src/components/Sidebar.tsx`.
   - Renderize a tela no `MainContent` de `src/App.tsx`.
2. **Para Modificar Regras de Acesso Remoto ou CLT**:
   - Ajuste as funções `grantTemporaryRemotePass`, `revokeTemporaryRemotePass` e `toggleEmergencyLockdown` em `src/context/AppContext.tsx`.
   - O cálculo de verificação se o usuário deve ser bloqueado está centralizado no getter `isRemoteAccessBlockedForCurrentUser`.
3. **Para Conectar um Backend com Banco de Dados em Nuvem (Firestore ou Postgres)**:
   - Substitua os métodos de carregamento inicial e `useEffect` do `localStorage` em `src/context/AppContext.tsx` por listeners assíncronos (`onSnapshot` do Firestore ou requisições `fetch('/api/...')`).
4. **Para Configurar a API do Gemini no Backend**:
   - A chave de API do Gemini deve ser injetada na variável de ambiente `GEMINI_API_KEY`.
   - O serviço server-side já está implementado em `server.ts` sob a rota `POST /api/parse-invoice` utilizando o modelo `gemini-2.5-flash`.

---
*Documento atualizado e auditado. Pronto para manutenção e expansão por qualquer desenvolvedor ou agente de Inteligência Artificial.*

