import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ASSETS } from '../data';
import { copyToClipboard } from '../utils/clipboard';
import { SupervisorAuthModal } from './SupervisorAuthModal';

export const PDVScreen: React.FC = () => {
  const {
    openNewSaleModal,
    openBarcodeModal,
    setActiveTab,
    sales,
    caixaStatus,
    showToast,
    petCareQueue,
    openReceiptModal,
    orderProductSupplier,
    currentUser
  } = useApp();

  const [isSupervisorModalOpen, setIsSupervisorModalOpen] = useState(false);
  const [isTemporaryUnlocked, setIsTemporaryUnlocked] = useState(false);
  const [supervisorAuthorizer, setSupervisorAuthorizer] = useState<string | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const canViewSalesMetrics = currentUser.canViewGlobalSalesMetrics || isTemporaryUnlocked;

  return (
    <div className="flex flex-col w-full gap-5 max-w-4xl mx-auto px-4 md:px-6 py-4">
      {/* AÇÕES RÁPIDAS PRINCIPAIS (Hero touch friendly) */}
      <section className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">Terminal de Atendimento</h2>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white">
              Operações de <span className="font-semibold text-white">Balcão</span>
            </h1>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
            Online • Caixa Ativo
          </span>
        </div>

        {/* Botão Destaque: Nova Venda PDV Express */}
        <button
          onClick={openNewSaleModal}
          type="button"
          className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl p-4 md:p-5 shadow-xl shadow-indigo-500/20 border border-indigo-400/30 active:scale-[0.99] transition-all flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-4 z-10">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner border border-white/20">
              <span className="material-symbols-outlined text-[28px] text-white">point_of_sale</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-indigo-200 tracking-wider uppercase">
                Frente de Caixa
              </span>
              <span className="text-[20px] md:text-[22px] font-bold text-white leading-tight">
                Nova Venda / PDV Express
              </span>
              <span className="text-[12px] text-white/70">
                Código de barras, pesagem balança ou consulta rápida
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white flex-shrink-0 z-10 group-hover:rotate-12 transition-transform shadow-md">
            <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
          </div>
          <div className="absolute -right-6 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
        </button>

        {/* Sub-Ações Rápidas em Grid Duplo */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('granel')}
            className="glass-card-interactive flex items-center gap-3 p-3.5 text-left active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                scale
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-[13px] text-white truncate">Pesar Granel</span>
              <span className="text-[11px] text-white/50 truncate">Balança integrada</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('petcare')}
            className="glass-card-interactive flex items-center gap-3 p-3.5 text-left active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                pets
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-[13px] text-white truncate">Novo Pet</span>
              <span className="text-[11px] text-white/50 truncate">Banho & Tosa</span>
            </div>
          </button>
        </div>
      </section>

      {/* STATUS DO DIA (Métricas Chave estilo Frosted Glass) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">
              {canViewSalesMetrics ? 'Métricas Globais da Loja' : 'Métricas do Seu Turno'}
            </h2>
            {!canViewSalesMetrics && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">
                Turno Operador
              </span>
            )}
            {isTemporaryUnlocked && supervisorAuthorizer && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">key</span>
                Autorizado por {supervisorAuthorizer}
              </span>
            )}
          </div>
          <span className="text-[11px] text-white/50">Atualizado há 2 min</span>
        </div>

        {/* Card Principal de Faturamento ou Turno do Operador */}
        {canViewSalesMetrics ? (
          <div className="glass-card p-5 md:p-6 flex flex-col gap-3 shadow-lg shadow-black/20 animate-fade-in">
            <div className="flex items-center justify-between text-white/60">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">Faturamento Geral da Loja</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +14.2% vs ontem
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-1">
              <span className="text-xl font-light text-white/60">R$</span>
              <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {caixaStatus.totalToday.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#6366f1]"
                style={{ width: `${Math.min(100, Math.round((caixaStatus.totalToday / 5000) * 100))}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-[12px] text-white/60">
              <span>Meta diária: <strong className="text-white/80 font-normal">R$ 5.000,00</strong></span>
              <span className="font-semibold text-indigo-300">
                {Math.min(100, Math.round((caixaStatus.totalToday / 5000) * 100))}% atingida
              </span>
            </div>
          </div>
        ) : (
          /* Visual de Operador Comum com sigilo de faturamento da empresa */
          <div className="glass-card p-5 md:p-6 flex flex-col gap-4 shadow-lg shadow-black/20 border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">shield_lock</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[15px] text-white">Faturamento Global da Empresa</h3>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                      Sigiloso
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mt-0.5">
                    Metas financeiras e balanço geral reservados à Gerência e Diretoria.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSupervisorModalOpen(true)}
                className="h-10 px-3.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">pin</span>
                <span>Desbloquear c/ PIN</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] text-white/50 block">Seu Desempenho no Turno</span>
                <span className="text-lg font-bold text-emerald-400">
                  {caixaStatus.pedidosCount} atendimentos realizados
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] text-white/50 block">Operador Responsável</span>
                <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {currentUser.name} ({currentUser.roleLabel})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Grade com 3 métricas secundárias */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="glass-card p-3.5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Pedidos</span>
              <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white my-1">{caixaStatus.pedidosCount}</div>
            <span className="text-[10px] text-emerald-400">+3 na última hora</span>
          </div>

          <div className="glass-card p-3.5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                {canViewSalesMetrics ? 'Ticket Médio' : 'Itens / Pedido'}
              </span>
              <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
                <span className="material-symbols-outlined text-[16px]">
                  {canViewSalesMetrics ? 'analytics' : 'shopping_basket'}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white my-1">
              {canViewSalesMetrics ? (
                `R$ ${Math.round(caixaStatus.totalToday / Math.max(1, caixaStatus.pedidosCount))}`
              ) : (
                '2.8 itens'
              )}
            </div>
            <span className="text-[10px] text-purple-300">
              {canViewSalesMetrics ? 'Por compra' : 'Média no balcão'}
            </span>
          </div>

          <div className="glass-card p-3.5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Pet Care</span>
              <div className="p-1.5 bg-pink-500/10 rounded-lg text-pink-400 border border-pink-500/20">
                <span className="material-symbols-outlined text-[16px]">bathtub</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white my-1">6</div>
            <span className="text-[10px] text-pink-300">Agendados hoje</span>
          </div>
        </div>
      </section>

      {/* ALERTAS URGENTES DO DIA (Centralizados no celular e com botão X de fechar) */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_6px_#f87171]"></div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">Avisos Prioritários</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-semibold">
              {(!dismissedAlerts.includes('alerta-estoque') ? 1 : 0) +
                (!dismissedAlerts.includes('alerta-validade') ? 1 : 0) +
                (!dismissedAlerts.includes('alerta-operacional') ? 1 : 0)}{' '}
              pendências
            </span>
            {dismissedAlerts.length > 0 && (
              <button
                type="button"
                onClick={() => setDismissedAlerts([])}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
                title="Restaurar avisos dispensados"
              >
                Restaurar
              </button>
            )}
          </div>
        </div>

        {/* Carrossel de Cards de Alerta com Scroll Horizontal e Centralização */}
        {(!dismissedAlerts.includes('alerta-estoque') ||
          !dismissedAlerts.includes('alerta-validade') ||
          !dismissedAlerts.includes('alerta-operacional')) ? (
          <div className="flex gap-3 overflow-x-auto pb-1.5 -mx-4 md:-mx-6 px-4 md:px-6 no-scrollbar snap-x snap-mandatory justify-start">
            {/* Alerta 1: Estoque Crítico */}
            {!dismissedAlerts.includes('alerta-estoque') && (
              <div className="min-w-[270px] max-w-[290px] w-[82vw] sm:w-auto p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-red-500/30 text-white shadow-lg flex flex-col justify-between snap-center sm:snap-start flex-shrink-0 relative">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-red-400">inventory_2</span>
                    <span className="text-[11px] uppercase tracking-wider text-red-400 font-bold">Estoque Baixo</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/30">2 un</span>
                    {/* Botão X para fechar aviso */}
                    <button
                      type="button"
                      onClick={() => {
                        setDismissedAlerts(prev => [...prev, 'alerta-estoque']);
                        showToast('Aviso de estoque dispensado', 'check');
                      }}
                      className="w-6 h-6 rounded-lg text-white/40 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                      title="Fechar aviso (X)"
                      aria-label="Fechar aviso"
                    >
                      <span className="material-symbols-outlined text-[15px]">close</span>
                    </button>
                  </div>
                </div>
                <div className="my-2.5">
                  <h4 className="font-semibold text-[13px] text-white line-clamp-1">Golden Formula Frango 15kg</h4>
                  <p className="text-[11px] text-white/60">Atingiu reserva mínima de segurança.</p>
                </div>
                <button
                  onClick={() => orderProductSupplier('prod-3')}
                  className="w-full py-2 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                  Emitir Pedido de Reposição
                </button>
              </div>
            )}

            {/* Alerta 2: Validade Próxima */}
            {!dismissedAlerts.includes('alerta-validade') && (
              <div className="min-w-[270px] max-w-[290px] w-[82vw] sm:w-auto p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-amber-500/30 text-white shadow-lg flex flex-col justify-between snap-center sm:snap-start flex-shrink-0 relative">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-amber-400">event_upcoming</span>
                    <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">Validade Próxima</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">12 dias</span>
                    {/* Botão X para fechar aviso */}
                    <button
                      type="button"
                      onClick={() => {
                        setDismissedAlerts(prev => [...prev, 'alerta-validade']);
                        showToast('Aviso de validade dispensado', 'check');
                      }}
                      className="w-6 h-6 rounded-lg text-white/40 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                      title="Fechar aviso (X)"
                      aria-label="Fechar aviso"
                    >
                      <span className="material-symbols-outlined text-[15px]">close</span>
                    </button>
                  </div>
                </div>
                <div className="my-2.5">
                  <h4 className="font-semibold text-[13px] text-white line-clamp-1">Antipulgas Bravecto 10-20kg</h4>
                  <p className="text-[11px] text-white/60">Lote #BR-9904 com 5 caixas.</p>
                </div>
                <button
                  onClick={() => showToast('Promoção de queima ativada no PDV (-15%)!', 'local_offer')}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">local_offer</span>
                  Criar Promoção de Queima
                </button>
              </div>
            )}

            {/* Alerta 3: Se tiver acesso financeiro mostra Boleto; se for Operador mostra Alerta Pet Care Operacional */}
            {!dismissedAlerts.includes('alerta-operacional') && (
              currentUser.canAccessFinance ? (
                <div className="min-w-[270px] max-w-[290px] w-[82vw] sm:w-auto p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-indigo-500/30 text-white shadow-lg flex flex-col justify-between snap-center sm:snap-start flex-shrink-0 relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-indigo-400">schedule</span>
                      <span className="text-[11px] uppercase tracking-wider text-indigo-400 font-bold">Boleto Hoje 17h</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">R$ 1.850</span>
                      {/* Botão X para fechar aviso */}
                      <button
                        type="button"
                        onClick={() => {
                          setDismissedAlerts(prev => [...prev, 'alerta-operacional']);
                          showToast('Aviso de boleto dispensado', 'check');
                        }}
                        className="w-6 h-6 rounded-lg text-white/40 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                        title="Fechar aviso (X)"
                        aria-label="Fechar aviso"
                      >
                        <span className="material-symbols-outlined text-[15px]">close</span>
                      </button>
                    </div>
                  </div>
                  <div className="my-2.5">
                    <h4 className="font-semibold text-[13px] text-white line-clamp-1">Distribuidora Pet Brasil</h4>
                    <p className="text-[11px] text-white/60">Rações Secas e Medicamentos.</p>
                  </div>
                  <button
                    onClick={async () => {
                      await copyToClipboard('2379338128600001850020019283748291029384759');
                      showToast('Linha digitável copiada! Abrindo Gestão Financeira...', 'content_copy');
                      setActiveTab('gestao');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200 text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                    Pagar no Módulo Gestão
                  </button>
                </div>
              ) : (
                <div className="min-w-[270px] max-w-[290px] w-[82vw] sm:w-auto p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-purple-500/30 text-white shadow-lg flex flex-col justify-between snap-center sm:snap-start flex-shrink-0 relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-purple-400">pets</span>
                      <span className="text-[11px] uppercase tracking-wider text-purple-400 font-bold">Pronto Entrega</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">2 Pets</span>
                      {/* Botão X para fechar aviso */}
                      <button
                        type="button"
                        onClick={() => {
                          setDismissedAlerts(prev => [...prev, 'alerta-operacional']);
                          showToast('Aviso de entrega de pet dispensado', 'check');
                        }}
                        className="w-6 h-6 rounded-lg text-white/40 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                        title="Fechar aviso (X)"
                        aria-label="Fechar aviso"
                      >
                        <span className="material-symbols-outlined text-[15px]">close</span>
                      </button>
                    </div>
                  </div>
                  <div className="my-2.5">
                    <h4 className="font-semibold text-[13px] text-white line-clamp-1">Pipoca (Poodle) e Thor (Golden)</h4>
                    <p className="text-[11px] text-white/60">Banho e tosa concluídos. Aguardando tutor.</p>
                  </div>
                  <button
                    onClick={() => {
                      showToast('Mensagem de WhatsApp enviada para tutor avisando da retirada!', 'chat');
                      setActiveTab('petcare');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    Avisar Tutor no WhatsApp
                  </button>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-center flex items-center justify-between">
            <span className="text-xs text-white/50 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
              Todos os avisos prioritários foram revisados.
            </span>
            <button
              type="button"
              onClick={() => setDismissedAlerts([])}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
            >
              Reexibir avisos
            </button>
          </div>
        )}
      </section>

      {/* PRÓXIMOS PETS (BANHO & TOSA) */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">Fila do Banho & Tosa</h2>
            <span className="text-[11px] text-white/50">(Hoje)</span>
          </div>
          <button
            onClick={() => setActiveTab('petcare')}
            className="text-[12px] font-semibold text-indigo-400 flex items-center hover:text-indigo-300 cursor-pointer"
          >
            Ver Agenda Completa
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        {/* Carrossel de Pets */}
        <div className="flex gap-3 overflow-x-auto pb-1.5 -mx-4 md:-mx-6 px-4 md:px-6 no-scrollbar snap-x">
          {petCareQueue.slice(0, 6).map(pet => (
            <div
              key={pet.id}
              onClick={() => setActiveTab('petcare')}
              className="min-w-[220px] p-3.5 glass-card flex flex-col gap-2.5 snap-start hover:border-indigo-500/40 cursor-pointer transition-all active:scale-98"
            >
              <div className="flex items-center gap-3">
                <img
                  src={pet.image || pet.avatar || ASSETS.pipocaSalon}
                  alt={pet.petName}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-white/10"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[13px] text-white truncate">{pet.petName}</span>
                    <span className="material-symbols-outlined text-[14px] text-purple-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                      cruelty_free
                    </span>
                  </div>
                  <span className="text-[11px] text-white/50 truncate">{(pet.petBreed || pet.breed || 'Pet')} • {(Array.isArray(pet.services) ? pet.services.join(', ') : pet.service || 'Banho')}</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
                <div className="flex items-center gap-1.5 text-white/60 text-[11px]">
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  <span className="truncate max-w-[80px]">{pet.tutorName}</span>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  pet.status === 'ready'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : pet.status === 'in-progress'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}>
                  {pet.timeSlot}
                </span>
              </div>
              {pet.status === 'ready' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('petcare');
                  }}
                  className="py-1 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[13px]">chat</span>
                  <span>Pronto • Disparar WhatsApp</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* VENDAS RECENTES NO BALCÃO */}
      <section className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">Transações Recentes</h2>
            <h3 className="text-lg font-semibold text-white">Últimas Vendas Balcão</h3>
          </div>
          <button
            onClick={() => showToast('Histórico completo com ' + sales.length + ' vendas registradas!', 'receipt_long')}
            className="text-xs text-indigo-400 font-semibold hover:text-indigo-300 cursor-pointer"
          >
            Ver Todas ({sales.length})
          </button>
        </div>

        {/* Lista de Vendas em Painel Frosted Glass */}
        <div className="glass-card p-3 md:p-4 flex flex-col gap-2">
          {sales.map(sale => (
            <div
              key={sale.id}
              onClick={() => openReceiptModal(sale)}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] hover:border-indigo-500/30 border border-white/5 flex items-center justify-between gap-3 transition-all cursor-pointer group"
              title="Clique para emitir/ver o cupom de venda"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                  sale.isGranel
                    ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                    : sale.isService
                    ? 'bg-pink-500/15 border-pink-500/30 text-pink-300'
                    : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {sale.isGranel ? 'scale' : sale.isService ? 'pets' : 'shopping_bag'}
                </span>
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-white/40 font-semibold">{sale.code}</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-white/20"></span>
                  <span className="text-[11px] font-semibold text-indigo-400">{sale.paymentMethod}</span>
                  {sale.isGranel && (
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold border border-purple-500/30">
                      Granel
                    </span>
                  )}
                  {sale.clientName && sale.clientName !== 'Consumidor Final' && (
                    <span className="text-[10px] text-white/50 truncate">
                      • {sale.clientName}
                    </span>
                  )}
                </div>
                <span className="font-medium text-[13px] text-white truncate">{sale.itemsSummary}</span>
                <span className="text-[11px] text-white/40">
                  {sale.timeAgo} • {sale.location}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex flex-col items-end">
                  <span className="font-bold text-[15px] text-white">
                    R$ {(sale.total ?? 0).toFixed(2).replace('.', ',')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold">
                    {sale.status}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openReceiptModal(sale);
                  }}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                  title="Imprimir Comprovante"
                >
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ATALHO RÁPIDO DO LEITOR DE CÓDIGO DE BARRAS */}
      <div className="pt-1 pb-4">
        <div className="p-4 rounded-2xl glass-card flex items-center justify-between border border-white/10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <span className="material-symbols-outlined text-[22px]">barcode_scanner</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[13px] text-white">Consulta Rápida de Preço</span>
              <span className="text-[11px] text-white/50">Aponte a câmera para a embalagem ou digite o código</span>
            </div>
          </div>
          <button
            type="button"
            onClick={openBarcodeModal}
            className="px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">photo_camera</span>
            Escanear
          </button>
        </div>
      </div>

      {/* Supervisor Auth Modal for Unlocking Global Store Metrics */}
      <SupervisorAuthModal
        isOpen={isSupervisorModalOpen}
        onClose={() => setIsSupervisorModalOpen(false)}
        requiredRole="gerente"
        actionTitle="Desbloquear Métricas Globais da Loja"
        actionDescription="Exibe o faturamento total acumulado do dia e percentual da meta da empresa neste terminal."
        onAuthorized={(supervisor) => {
          setIsTemporaryUnlocked(true);
          setSupervisorAuthorizer(`${supervisor.name} (${supervisor.roleLabel})`);
          showToast(`Faturamento liberado por ${supervisor.name}!`, 'check_circle');
        }}
      />
    </div>
  );
};
