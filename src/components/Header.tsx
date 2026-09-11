import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ASSETS } from '../data';
import { ManualModal } from './ManualModal';
import { NotificationDropdown } from './NotificationDropdown';
import { PinLockScreenModal } from './PinLockScreenModal';

export const Header: React.FC = () => {
  const {
    caixaStatus,
    cart,
    openNewSaleModal,
    currentUser,
    openEmployeeModal,
    products,
    bills,
    petCareQueue,
    clients,
    connectionMode,
    remoteAccessPolicy,
    openRemoteDashboard,
    openOnlineOrdersModal,
    pendingOnlineOrdersCount,
    isScreenLocked,
    lockScreen,
    unlockScreen,
    isSensitiveDataMasked,
    toggleSensitiveDataMask
  } = useApp();

  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Compute alert count for the badge
  const lowStockCount = (products || []).filter(p => p && p.stock <= p.minStock).length;
  const billsTodayCount = (bills || []).filter(b => b && b.status === 'hoje').length;
  const readyPetsCount = (petCareQueue || []).filter(p => p && p.status === 'ready').length;
  const fiadoCount = (clients || []).filter(c => c && c.debtBalance > 0).length > 0 ? 1 : 0;
  const totalAlerts = lowStockCount + (currentUser?.canAccessFinance ? billsTodayCount : 0) + readyPetsCount + fiadoCount;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 pt-safe bg-[#050508]/75 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-2 max-w-7xl mx-auto">
          {/* Brand & Cashier Status */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative p-0.5 rounded-xl bg-white/5 border border-white/10 shadow-md backdrop-blur-md flex items-center justify-center overflow-hidden h-9 w-9">
              <img
                src={ASSETS.logo}
                alt="Global Pet Logo"
                className="h-8 w-8 rounded-lg object-contain flex-shrink-0"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== ASSETS.logoAlt) {
                    target.src = ASSETS.logoAlt;
                  } else {
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }
                }}
              />
              <div
                style={{ display: 'none' }}
                className="h-8 w-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 items-center justify-center text-emerald-400 font-bold text-xs"
              >
                🐾
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[18px] text-white tracking-tight truncate">
                  Global Pet
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full inline-block shadow-[0_0_8px_#34d399] ${
                    caixaStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'
                  }`}
                />
                <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                  {caixaStatus.isOpen ? 'Caixa Aberto #01' : 'Caixa Encerrado'}
                </span>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* Gestão Remota & Monitoramento do Comerciante */}
            <button
              type="button"
              id="btn-gestao-remota-header"
              onClick={openRemoteDashboard}
              className={`h-9 px-2.5 sm:px-3 rounded-full border text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer backdrop-blur-md ${
                remoteAccessPolicy.emergencyLockdown
                  ? 'bg-red-500/20 border-red-500/50 text-red-300 ring-2 ring-red-500/40 animate-pulse'
                  : connectionMode === 'remoto'
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 hover:text-white'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:text-white'
              }`}
              title="Abrir Painel de Gestão e Monitoramento Remoto da Loja (Controle à Distância)"
            >
              <span className="material-symbols-outlined text-[17px]">
                {remoteAccessPolicy.emergencyLockdown ? 'gpp_maybe' : connectionMode === 'remoto' ? 'cell_tower' : 'storefront'}
              </span>
              <span className="hidden sm:inline">
                {remoteAccessPolicy.emergencyLockdown
                  ? '🚨 Trava Ativa'
                  : connectionMode === 'remoto'
                  ? '🌐 Gestão Remota'
                  : '🏠 Na Loja'}
              </span>
              <span className="sm:hidden text-[10px] font-bold">
                {remoteAccessPolicy.emergencyLockdown ? 'Trava' : connectionMode === 'remoto' ? 'Remoto' : 'Loja'}
              </span>
            </button>

            {/* Pedidos Online do Robô IA */}
            <button
              type="button"
              id="btn-pedidos-online-header"
              onClick={openOnlineOrdersModal}
              className={`h-9 px-2.5 sm:px-3 rounded-full border text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer backdrop-blur-md ${
                pendingOnlineOrdersCount > 0
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 ring-2 ring-purple-500/30'
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
              }`}
              title="Pedidos Online e Leads do Robô IA (WhatsApp)"
            >
              <span className="material-symbols-outlined text-[17px] text-purple-400">smart_toy</span>
              <span className="hidden sm:inline">Pedidos IA</span>
              {pendingOnlineOrdersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-purple-500 text-white text-[10px] font-bold animate-pulse">
                  {pendingOnlineOrdersCount}
                </span>
              )}
            </button>

            {/* Manual do Sistema Button */}
            <button
              type="button"
              id="btn-manual-sistema"
              onClick={() => setIsManualOpen(true)}
              className="h-9 px-2.5 sm:px-3 rounded-full bg-white/5 hover:bg-white/10 border border-indigo-500/30 text-indigo-200 hover:text-white font-medium text-[12px] flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
              title="Abrir Manual Lúdico do Sistema"
            >
              <span className="material-symbols-outlined text-[17px] text-indigo-400">menu_book</span>
              <span className="hidden md:inline">Manual do Sistema</span>
            </button>

            {/* Cart launcher button if items present */}
            {cart.length > 0 && (
              <button
                type="button"
                id="btn-cart-pdv-header"
                onClick={openNewSaleModal}
                className="h-9 px-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 border border-indigo-400/30 active:scale-95 transition-transform"
                title="Ver Carrinho do PDV"
              >
                <span className="material-symbols-outlined text-[17px]">shopping_cart</span>
                <span>{cart.length} {cart.length === 1 ? 'item' : 'itens'}</span>
              </button>
            )}

            {/* Notifications button with anchored Dropdown */}
            <div className="relative">
              <button
                type="button"
                id="btn-notificacoes-header"
                aria-label="Alertas e Notificações"
                onClick={() => setIsNotificationsOpen(prev => !prev)}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all relative backdrop-blur-md cursor-pointer ${
                  isNotificationsOpen
                    ? 'bg-indigo-600/30 border-indigo-400 text-white ring-2 ring-indigo-500/40'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80 active:scale-95'
                }`}
                title="Avisos e Alertas da Loja"
              >
                <span className="material-symbols-outlined text-[21px]">notifications</span>
                {totalAlerts > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_#f87171] ring-2 ring-[#050508]">
                    {totalAlerts}
                  </span>
                )}
              </button>

              {/* Directly anchored dropdown menu */}
              <NotificationDropdown
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
              />
            </div>

            {/* LGPD Privacy Mask Toggle */}
            <button
              type="button"
              id="btn-toggle-lgpd-privacidade"
              onClick={toggleSensitiveDataMask}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                isSensitiveDataMasked
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 ring-1 ring-emerald-500/30'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/60 hover:text-white'
              }`}
              title={isSensitiveDataMasked ? 'Privacidade LGPD: Dados pessoais mascarados no balcão (Clique para desmascarar)' : 'Privacidade LGPD: Dados visíveis (Clique para mascarar)'}
            >
              <span className="material-symbols-outlined text-[19px]">
                {isSensitiveDataMasked ? 'visibility_off' : 'visibility'}
              </span>
            </button>

            {/* Lock Terminal Button */}
            <button
              type="button"
              id="btn-bloquear-terminal-header"
              onClick={lockScreen}
              className="w-10 h-10 rounded-full flex items-center justify-center border bg-white/5 hover:bg-amber-500/20 hover:border-amber-500/40 text-white/70 hover:text-amber-300 border-white/10 transition-all cursor-pointer active:scale-95"
              title="Bloquear Terminal agora (Ctrl + L ou após 5min inativo)"
            >
              <span className="material-symbols-outlined text-[19px]">lock</span>
            </button>

            {/* User profile button to switch employee */}
            <button
              type="button"
              id="btn-perfil-funcionario"
              onClick={openEmployeeModal}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer active:scale-95 transition-all text-left group"
              title="Clique para trocar de funcionário / perfil"
            >
              <div className="relative">
                <img
                  src={currentUser?.avatar || ''}
                  alt={currentUser?.name || 'Operador'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40 shadow-sm group-hover:ring-indigo-400 transition-all"
                  referrerPolicy="no-referrer"
                />
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#050508] ${
                  currentUser?.role === 'dono' ? 'bg-amber-400' : currentUser?.role === 'gerente' ? 'bg-indigo-400' : 'bg-emerald-400'
                }`} />
              </div>
              <div className="hidden md:flex flex-col min-w-0 pr-1">
                <span className="text-[12px] font-bold text-white truncate max-w-[110px] leading-tight">
                  {currentUser?.name ? currentUser.name.split(' ')[0] : 'Operador'}
                </span>
                <span className="text-[10px] text-white/50 truncate max-w-[110px] flex items-center gap-1">
                  {currentUser?.role === 'dono' ? '👑 Dono' : currentUser?.role === 'gerente' ? '⭐ Gerente' : '👤 Operador'}
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-white/40 group-hover:text-white transition-colors">
                expand_more
              </span>
            </button>
          </div>
        </div>
      </header>

      <ManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
      <PinLockScreenModal isLocked={isScreenLocked} onUnlock={unlockScreen} />
    </>
  );
};
