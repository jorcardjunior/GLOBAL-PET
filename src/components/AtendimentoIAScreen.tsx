import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BotSettings, OnlineOrder, BotChatMessage } from '../types';

export const AtendimentoIAScreen: React.FC = () => {
  const {
    botSettings,
    updateBotSettings,
    onlineOrders,
    updateOnlineOrderStatus,
    importOnlineOrderToPDV,
    chatMessages,
    sendChatMessage,
    clearChatMessages,
    products,
    storeSettings
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'simulador' | 'pedidos' | 'base_conhecimento' | 'integracao'>('simulador');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedOrderFilter, setSelectedOrderFilter] = useState<'todos' | 'pendentes' | 'em_separacao' | 'saiu_entrega' | 'concluido'>('todos');
  const [formSettings, setFormSettings] = useState<BotSettings>(botSettings);
  const [newNeighborhood, setNewNeighborhood] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormSettings(botSettings);
  }, [botSettings]);

  useEffect(() => {
    if (activeSubTab === 'simulador') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeSubTab, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    setInputText('');
    setIsTyping(true);

    try {
      await sendChatMessage(text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateBotSettings(formSettings);
  };

  const handleAddNeighborhood = () => {
    if (!newNeighborhood.trim()) return;
    if (formSettings.deliveryNeighborhoods.includes(newNeighborhood.trim())) return;
    setFormSettings(prev => ({
      ...prev,
      deliveryNeighborhoods: [...prev.deliveryNeighborhoods, newNeighborhood.trim()]
    }));
    setNewNeighborhood('');
  };

  const handleRemoveNeighborhood = (neighborhood: string) => {
    setFormSettings(prev => ({
      ...prev,
      deliveryNeighborhoods: prev.deliveryNeighborhoods.filter(n => n !== neighborhood)
    }));
  };

  const filteredOrders = onlineOrders.filter(order => {
    if (selectedOrderFilter === 'todos') return true;
    if (selectedOrderFilter === 'pendentes') return order.status === 'pendente';
    if (selectedOrderFilter === 'em_separacao') return order.status === 'em_separacao';
    if (selectedOrderFilter === 'saiu_entrega') return order.status === 'saiu_entrega';
    if (selectedOrderFilter === 'concluido') return order.status === 'concluido';
    return true;
  });

  const pendingCount = onlineOrders.filter(o => o.status === 'pendente' || o.status === 'em_separacao').length;

  const quickPrompts = [
    { label: '🥩 Ração Granel Premier', prompt: 'Vocês vendem ração Premier Filhotes a granel? Quanto tá o quilo?' },
    { label: '🐩 Banho Golden Retriever', prompt: 'Qual o valor do banho e tosa para Golden Retriever? Tem Táxi Dog?' },
    { label: '💊 Antipulgas Simparic', prompt: 'Tem remédio antipulgas Simparic para cão de 10 a 20kg? Quanto custa?' },
    { label: '🛵 Fechar Pedido Delivery', prompt: 'Quero fechar um pedido de 3kg de ração a granel para entregar na Rua das Flores, 120 no Centro. Vou pagar no PIX.' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0a12] text-white">
      {/* TOP SUB-HEADER / BANNER */}
      <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-[#121124] via-[#10101d] to-[#0c0c16] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <span className="material-symbols-outlined text-[28px]">smart_toy</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Atendimento IA & RAG WhatsApp
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                botSettings.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${botSettings.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                {botSettings.enabled ? 'RAG Ativo 24h' : 'Pausado'}
              </span>
            </div>
            <p className="text-xs text-white/50">
              Vendas automatizadas, consulta de estoque em tempo real e agendamento de Pet Care via WhatsApp
            </p>
          </div>
        </div>

        {/* NAVIGATION SUB-TABS */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveSubTab('simulador')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'simulador'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            Simulador WhatsApp
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('pedidos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all relative cursor-pointer ${
              activeSubTab === 'pedidos'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
            Pedidos Fechados
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-black animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('base_conhecimento')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'base_conhecimento'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            Base RAG da Loja
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('integracao')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'integracao'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">webhook</span>
            API & WhatsApp
          </button>
        </div>
      </div>

      {/* SUBTAB 1: WHATSAPP WEB SIMULATOR */}
      {activeSubTab === 'simulador' && (
        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden p-3 sm:p-5 gap-4">
          {/* LEFT: WHATSAPP MOCK INTERFACE */}
          <div className="flex-1 flex flex-col bg-[#0b141a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
            {/* WHATSAPP TOP BAR */}
            <div className="px-4 py-3 bg-[#202c33] border-b border-[#2a3942] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-base shadow">
                    🐾
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#202c33] rounded-full" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#e9edef] leading-tight flex items-center gap-1.5">
                    {botSettings.botName}
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-normal">
                      Bot Verificado
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#8696a0]">
                    {isTyping ? 'digitando...' : 'Online • Respostas imediatas 24/7'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearChatMessages}
                  className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reiniciar Simulação de Conversa"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  Reiniciar
                </button>
              </div>
            </div>

            {/* CHIPS DE TESTE RÁPIDO */}
            <div className="px-3 py-2 bg-[#111b21] border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[11px] text-[#8696a0] flex-shrink-0 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">touch_app</span>
                Testes Rápidos:
              </span>
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(q.prompt)}
                  className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#2a3942] text-[#d1d7db] text-[11px] whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer border border-white/5"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* CHAT MESSAGES SCROLL CONTAINER */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]"
              style={{ backgroundColor: '#0b141a' }}
            >
              {chatMessages.map(msg => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%] ${isUser ? 'ml-auto' : 'mr-auto'}`}
                  >
                    <div
                      className={`p-3.5 rounded-2xl relative shadow-md ${
                        isUser
                          ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                          : 'bg-[#202c33] text-[#d1d7db] rounded-tl-none border border-white/5'
                      }`}
                    >
                      <p className="text-[13px] leading-relaxed whitespace-pre-line break-words">
                        {msg.text}
                      </p>

                      {/* RAG SOURCES RETRIEVED BADGE */}
                      {!isUser && msg.metadata?.ragSources && msg.metadata.ragSources.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap items-center gap-1 text-[10px] text-white/50">
                          <span className="flex items-center gap-0.5 text-purple-300 font-semibold">
                            <span className="material-symbols-outlined text-[12px]">database</span>
                            RAG Consultou:
                          </span>
                          {msg.metadata.ragSources.map((source, sIdx) => (
                            <span key={sIdx} className="bg-white/5 px-1.5 py-0.5 rounded text-white/60">
                              {source}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CARD DE PEDIDO FECHADO COM SUCESSO DENTRO DO CHAT */}
                      {!isUser && msg.metadata?.generatedOrder && (
                        <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-emerald-950/70 to-[#0e271f] border border-emerald-500/40 text-emerald-100 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              PEDIDO ONLINE REGISTRADO!
                            </span>
                            <span className="text-xs font-mono font-bold text-white bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/30">
                              {msg.metadata.generatedOrder.orderNumber}
                            </span>
                          </div>

                          <div className="text-xs space-y-1">
                            <p className="font-semibold text-white">
                              Cliente: {msg.metadata.generatedOrder.customerName}
                            </p>
                            <p className="text-white/70 text-[11px]">
                              📍 {msg.metadata.generatedOrder.customerAddress} ({msg.metadata.generatedOrder.neighborhood})
                            </p>
                            <p className="text-white/80 font-mono">
                              Total: R$ {Number(msg.metadata.generatedOrder.total || 0).toFixed(2)} ({msg.metadata.generatedOrder.paymentMethod?.toUpperCase()})
                            </p>
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (msg.metadata?.generatedOrder) {
                                  importOnlineOrderToPDV(msg.metadata.generatedOrder as OnlineOrder);
                                }
                              }}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow"
                            >
                              <span className="material-symbols-outlined text-[15px]">point_of_sale</span>
                              Importar no PDV
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveSubTab('pedidos')}
                              className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                            >
                              Ver Fila
                            </button>
                          </div>
                        </div>
                      )}

                      <span className="block text-right text-[10px] text-white/40 mt-1">
                        {msg.timestamp} {isUser && '✓✓'}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-white/50 text-xs py-2 px-3 bg-[#202c33] rounded-2xl w-fit border border-white/5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {botSettings.botName} está digitando resposta...
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* CHAT INPUT BAR */}
            <div className="p-3 bg-[#202c33] border-t border-[#2a3942] flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite como um cliente no WhatsApp (ex: 'Quanto custa 2kg de ração a granel?')..."
                className="flex-1 bg-[#2a3942] text-white placeholder-white/40 text-sm px-4 py-2.5 rounded-2xl border border-transparent focus:border-emerald-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
                className="w-11 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </div>

          {/* RIGHT: RAG RETRIEVAL TELEMETRY & LIVE STATE */}
          <div className="w-full lg:w-96 flex flex-col gap-4 overflow-y-auto">
            {/* CARD 1: MOTOR RAG EM AÇÃO */}
            <div className="glass-card p-4 rounded-3xl border border-purple-500/20 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">psychology</span>
                  Telemetria do RAG
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono">
                  Gemini Flash + Context
                </span>
              </div>
              <p className="text-xs text-white/60">
                A IA consulta o estoque real, preços de fábrica, tabela de serviços e bairros de entrega antes de formular cada resposta.
              </p>

              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <span className="text-white/70">Itens no Catálogo RAG</span>
                  <span className="font-bold text-white">{products.length} produtos</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <span className="text-white/70">Rações a Granel Vivas</span>
                  <span className="font-bold text-emerald-400">
                    {products.filter(p => p.isGranel).length} variedades
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <span className="text-white/70">Frete Padrão / Grátis</span>
                  <span className="font-bold text-white">
                    R$ {botSettings.deliveryFee.toFixed(2)} / &gt; R$ {botSettings.freeDeliveryThreshold.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <span className="text-white/70">Chave PIX da Loja</span>
                  <span className="font-mono text-[11px] text-purple-300 truncate max-w-[150px]">
                    {botSettings.pixKey}
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 2: RESUMO DOS PEDIDOS ONLINE FECHADOS */}
            <div className="glass-card p-4 rounded-3xl border border-indigo-500/20 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                  Fila de Vendas da IA
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('pedidos')}
                  className="text-[11px] text-indigo-300 hover:text-white underline cursor-pointer"
                >
                  Ver todos ({onlineOrders.length})
                </button>
              </div>

              {onlineOrders.slice(0, 3).map(order => (
                <div
                  key={order.id}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1.5 hover:border-indigo-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-white">{order.orderNumber}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      order.status === 'pendente'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : order.status === 'em_separacao'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 truncate">
                    {order.customerName} • {order.items.map(i => `${i.quantity}${i.unit === 'KG' ? 'kg' : 'x'} ${i.name}`).join(', ')}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-white/50 pt-1">
                    <span>Total: R$ {order.total.toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => importOnlineOrderToPDV(order)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">add_shopping_cart</span>
                      Carregar PDV
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: PEDIDOS FECHADOS PELA IA */}
      {activeSubTab === 'pedidos' && (
        <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* FILTERS & METRICS */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-white/60 font-medium mr-1">Filtrar por:</span>
              {(['todos', 'pendentes', 'em_separacao', 'saiu_entrega', 'concluido'] as const).map(filter => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedOrderFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                    selectedOrderFilter === filter
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {filter.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-white/60">
                Total de Pedidos Online: <strong className="text-white font-bold">{filteredOrders.length}</strong>
              </span>
              <button
                type="button"
                onClick={() => setActiveSubTab('simulador')}
                className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_comment</span>
                Simular Novo Pedido
              </button>
            </div>
          </div>

          {/* ORDERS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center p-6 glass-card rounded-3xl border border-white/10">
                <span className="material-symbols-outlined text-[48px] text-white/20 mb-2">shopping_bag</span>
                <h3 className="text-base font-bold text-white">Nenhum pedido encontrado neste filtro</h3>
                <p className="text-xs text-white/50 max-w-sm mt-1">
                  Os pedidos e agendamentos fechados pelo bot no WhatsApp aparecerão automaticamente aqui em tempo real.
                </p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="glass-card p-5 rounded-3xl border border-white/10 hover:border-indigo-500/40 flex flex-col justify-between gap-4 transition-all"
                >
                  <div className="space-y-3">
                    {/* Header do card */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono font-bold text-sm text-indigo-300">
                          {order.orderNumber}
                        </span>
                        <h4 className="font-bold text-white text-sm mt-0.5">{order.customerName}</h4>
                        <p className="text-xs text-white/50 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">call</span>
                          {order.customerPhone}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                        order.status === 'pendente'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                          : order.status === 'em_separacao'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                          : order.status === 'saiu_entrega'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Endereço & Pet */}
                    <div className="p-3 rounded-2xl bg-white/5 space-y-1 text-xs">
                      {order.petName && (
                        <p className="text-purple-300 font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">pets</span>
                          Pet: {order.petName} ({order.petBreedOrSize || 'Porte Médio'})
                        </p>
                      )}
                      <p className="text-white/70 flex items-start gap-1">
                        <span className="material-symbols-outlined text-[14px] flex-shrink-0 mt-0.5">location_on</span>
                        <span>{order.customerAddress || 'Retirada no Balcão'} - {order.neighborhood}</span>
                      </p>
                    </div>

                    {/* Itens do Pedido */}
                    <div className="space-y-1.5 text-xs">
                      <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Itens Comprados:</span>
                      {order.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex items-center justify-between text-white/80 py-0.5">
                          <span className="truncate pr-2">
                            • {item.quantity} {item.unit} {item.name}
                          </span>
                          <span className="font-mono font-medium flex-shrink-0">
                            R$ {item.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total e Pagamento */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-white/50 block text-[10px]">Forma de Pagamento</span>
                        <span className="font-bold text-white uppercase text-[11px]">
                          {order.paymentMethod === 'pix' ? '🟢 PIX' : order.paymentMethod === 'cartao_entrega' ? '💳 Cartão Entrega' : '💵 Dinheiro'}
                          {order.changeFor ? ` (Troco p/ R$ ${order.changeFor})` : ''}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-white/50 block text-[10px]">Total com Frete</span>
                        <span className="font-mono text-base font-bold text-emerald-400">
                          R$ {order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ações Rápidas */}
                  <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => importOnlineOrderToPDV(order)}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-900/30"
                    >
                      <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                      Importar p/ Caixa PDV & Imprimir Cupom
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const nextStatus = order.status === 'pendente'
                            ? 'em_separacao'
                            : order.status === 'em_separacao'
                            ? 'saiu_entrega'
                            : 'concluido';
                          updateOnlineOrderStatus(order.id, nextStatus);
                        }}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        Avançar Etapa
                      </button>

                      <a
                        href={`https://wa.me/55${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Olá ${order.customerName}! Aqui é da ${storeSettings.storeName}. Seu pedido ${order.orderNumber} no valor de R$ ${order.total.toFixed(2)} já está sendo preparado! 🐾🛵`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[15px]">chat</span>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: BASE DE CONHECIMENTO RAG */}
      {activeSubTab === 'base_conhecimento' && (
        <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 max-w-4xl mx-auto w-full">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-400">tune</span>
                    Configurações do Robô & Personalidade RAG
                  </h3>
                  <p className="text-xs text-white/50">
                    Defina o comportamento, horários e identidade do assistente nos canais digitais
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.enabled}
                    onChange={e => setFormSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/70 uppercase mb-1">Nome do Bot no Chat</label>
                  <input
                    type="text"
                    value={formSettings.botName}
                    onChange={e => setFormSettings(prev => ({ ...prev, botName: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                    placeholder="Ex: Tobi - Assistente Global Pet"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 uppercase mb-1">Tom de Voz</label>
                  <select
                    value={formSettings.tone}
                    onChange={e => setFormSettings(prev => ({ ...prev, tone: e.target.value as any }))}
                    className="w-full bg-[#161622] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="caloroso">Caloroso & Consultivo (Pet-friendly)</option>
                    <option value="comercial">Comercial & Direto ao Ponto</option>
                    <option value="tecnico">Técnico & Focado em Agropecuária</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase mb-1">Mensagem de Boas-Vindas Padrão</label>
                <textarea
                  rows={2}
                  value={formSettings.greetingMessage}
                  onChange={e => setFormSettings(prev => ({ ...prev, greetingMessage: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              {/* REGRAS DE ENTREGA E FRETE */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">two_wheeler</span>
                  Políticas de Entrega & Bairros
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/70 uppercase mb-1">Taxa de Entrega (R$)</label>
                    <input
                      type="number"
                      step="0.50"
                      value={formSettings.deliveryFee}
                      onChange={e => setFormSettings(prev => ({ ...prev, deliveryFee: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/70 uppercase mb-1">Frete Grátis a Partir de (R$)</label>
                    <input
                      type="number"
                      step="5.00"
                      value={formSettings.freeDeliveryThreshold}
                      onChange={e => setFormSettings(prev => ({ ...prev, freeDeliveryThreshold: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/70 uppercase mb-1">Chave PIX Informada ao Cliente</label>
                    <input
                      type="text"
                      value={formSettings.pixKey}
                      onChange={e => setFormSettings(prev => ({ ...prev, pixKey: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Bairros de entrega */}
                <div>
                  <label className="block text-xs font-bold text-white/70 uppercase mb-1">Bairros Atendidos</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formSettings.deliveryNeighborhoods.map(neighborhood => (
                      <span
                        key={neighborhood}
                        className="px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 text-xs flex items-center gap-1.5"
                      >
                        {neighborhood}
                        <button
                          type="button"
                          onClick={() => handleRemoveNeighborhood(neighborhood)}
                          className="hover:text-red-400 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNeighborhood}
                      onChange={e => setNewNeighborhood(e.target.value)}
                      placeholder="Adicionar novo bairro atendido..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddNeighborhood}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>

              {/* FAQ CUSTOMIZADO E REGRAS INSTITUCIONAIS */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <label className="block text-xs font-bold text-white/70 uppercase">
                  Informações Extras & FAQ Injetadas no RAG
                </label>
                <p className="text-xs text-white/50">
                  Insira detalhes sobre vacinas para banho, horários especiais, marcas parceiras e políticas de troca. A IA aprenderá essas regras automaticamente.
                </p>
                <textarea
                  rows={4}
                  value={formSettings.faqCustomInfo}
                  onChange={e => setFormSettings(prev => ({ ...prev, faqCustomInfo: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Salvar Parâmetros do RAG
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB 4: GUIA DE INTEGRAÇÃO WHATSAPP & WEBHOOKS */}
      {activeSubTab === 'integracao' && (
        <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">integration_instructions</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Conexão Oficial com WhatsApp</h3>
                <p className="text-xs text-white/50">
                  Pronto para conectar com Z-API, Evolution API, Baileys ou WhatsApp Business Cloud API
                </p>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              O backend do sistema já conta com o endpoint inteligente <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300 font-mono">POST /api/rag-chat</code> e o receptor de webhooks <code className="bg-white/10 px-1.5 py-0.5 rounded text-emerald-300 font-mono">POST /api/whatsapp-webhook</code>.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                  1. Endpoint de Atendimento RAG (JSON)
                </span>
                <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl font-mono text-xs text-white/90 border border-white/5">
                  <span>POST /api/rag-chat</span>
                  <span className="text-[10px] text-white/40">Entrada: message, history, botSettings</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  2. Webhook Receptor de Mensagens
                </span>
                <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl font-mono text-xs text-white/90 border border-white/5">
                  <span>POST /api/whatsapp-webhook</span>
                  <span className="text-[10px] text-white/40">Status: Ativo & Monitorado</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                  3. Exemplo de Requisição cURL para Integração
                </span>
                <pre className="p-3 bg-black/60 rounded-xl text-[11px] font-mono text-white/80 overflow-x-auto border border-white/5">
{`curl -X POST https://ais-dev-wngcgyxjojt5bl4ptrbtml-441172495106.us-east5.run.app/api/rag-chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Quero 5kg de ração filhote e saber se tem entrega no Centro",
    "history": []
  }'`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
