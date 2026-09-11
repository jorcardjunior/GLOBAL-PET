import React, { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const {
    products,
    bills,
    petCareQueue,
    clients,
    setActiveTab,
    showToast,
    currentUser
  } = useApp();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Gather real-time notifications
  const lowStockItems = products.filter(p => p.stock <= p.minStock);
  const billsToday = bills.filter(b => b.status === 'hoje');
  const readyPets = petCareQueue.filter(p => p.status === 'ready');
  const debtClients = clients.filter(c => c.debtBalance > 0);

  const totalAlerts = lowStockItems.length + billsToday.length + readyPets.length + (debtClients.length > 0 ? 1 : 0);

  return (
    <>
      {/* Mobile backdrop for focus, contrast, and easy tap-outside to close */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 sm:hidden transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dropdownRef}
        id="notification-dropdown-menu"
        className="fixed left-1/2 -translate-x-1/2 top-20 w-[calc(100vw-24px)] max-w-[420px] sm:translate-x-0 sm:left-auto sm:right-0 sm:top-13 md:top-14 sm:w-[400px] sm:max-w-none sm:absolute z-50 bg-[#0d0e15] border border-white/20 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header com botão X de fechar destacado */}
        <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[19px]">notifications_active</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">Avisos & Alertas</h3>
              <p className="text-[11px] text-white/50">{totalAlerts} avisos operacionais hoje</p>
            </div>
          </div>
          {/* Botão X para fechar com área de toque ergonômica */}
          <button
            type="button"
            id="btn-fechar-notificacoes-header"
            onClick={onClose}
            className="w-10 h-10 sm:w-8 sm:h-8 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15 shadow-sm active:scale-95"
            title="Fechar avisos (X)"
            aria-label="Fechar avisos"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

      {/* Notifications List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5 p-2 space-y-1">
        {/* Low Stock Warning */}
        {lowStockItems.map(item => (
          <div
            key={item.id}
            className="p-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-start gap-3 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Estoque Crítico</span>
                <span className="text-[10px] text-white/40">Urgente</span>
              </div>
              <p className="text-xs font-medium text-white/90 truncate">{item.name}</p>
              <p className="text-[11px] text-white/50 mt-0.5">
                Resta apenas <strong className="text-amber-300 font-semibold">{item.stock} {item.unit}</strong> (Mínimo: {item.minStock})
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('fornecedores');
                    onClose();
                  }}
                  className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-medium flex items-center gap-1 transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                  Cotar com Fornecedor
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Bills due today (Only for users allowed to see finance) */}
        {billsToday.map(bill => (
          <div
            key={bill.id}
            className="p-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-start gap-3 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Boleto Vence Hoje</span>
                <span className="text-[10px] text-rose-300 font-bold">R$ {(bill.amount || bill.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <p className="text-xs font-medium text-white/90 truncate">{bill.supplier}</p>
              <p className="text-[11px] text-white/50 mt-0.5">{bill.description}</p>
              <div className="mt-2 flex items-center gap-2">
                {currentUser.canAccessFinance ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('gestao');
                      onClose();
                    }}
                    className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-[11px] font-medium flex items-center gap-1 transition-all"
                  >
                    <span className="material-symbols-outlined text-[14px]">payments</span>
                    Ver no DRE & Boletos
                  </button>
                ) : (
                  <span className="text-[10px] text-white/40 italic flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">lock</span>
                    Aviso enviado ao Gerente/Dono
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Pet Ready for Pickup */}
        {readyPets.map(pet => (
          <div
            key={pet.id}
            className="p-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-start gap-3 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">pets</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Pet Pronto no Banho</span>
                <span className="text-[10px] text-emerald-300 font-semibold">Aguardando</span>
              </div>
              <p className="text-xs font-medium text-white/90 truncate">{pet.petName} ({pet.petBreed || pet.breed || 'Pet'})</p>
              <p className="text-[11px] text-white/50 mt-0.5">Tutor(a): {pet.tutorName || pet.ownerName || 'Cliente'} • {Array.isArray(pet.services) ? pet.services.join(', ') : pet.service || 'Banho e Tosa'}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('petcare');
                    onClose();
                  }}
                  className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 text-[11px] font-medium flex items-center gap-1 transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">chat</span>
                  Notificar Tutor WhatsApp
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Fiado / Pending Debts alert */}
        {debtClients.length > 0 && (
          <div className="p-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-start gap-3 text-left group">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Caderninho de Fiado</span>
                <span className="text-[10px] text-indigo-300 font-semibold">{debtClients.length} em aberto</span>
              </div>
              <p className="text-xs font-medium text-white/90">Clientes com saldo devedor</p>
              <p className="text-[11px] text-white/50 mt-0.5">
                Total a receber acumulado: <strong className="text-indigo-300">R$ {debtClients.reduce((acc, c) => acc + c.debtBalance, 0).toFixed(2)}</strong>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('clientes');
                    onClose();
                  }}
                  className="px-2 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 text-[11px] font-medium flex items-center gap-1 transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  Acessar Fiados
                </button>
              </div>
            </div>
          </div>
        )}

        {totalAlerts === 0 && (
          <div className="py-8 text-center text-white/40">
            <span className="material-symbols-outlined text-3xl mb-1 text-emerald-400">task_alt</span>
            <p className="text-xs">Nenhum aviso pendente no momento!</p>
            <p className="text-[11px] text-white/30">Todos os produtos e contas estão em dia.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 bg-white/5 border-t border-white/10 flex items-center justify-between text-[11px] gap-2">
        <button
          type="button"
          onClick={onClose}
          className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/15 active:bg-white/20 text-white/80 hover:text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
          title="Fechar janela de avisos"
        >
          <span className="material-symbols-outlined text-[15px]">close</span>
          <span>Fechar</span>
        </button>

        <button
          type="button"
          onClick={() => {
            showToast('Avisos verificados e sincronizados!', 'sync');
            onClose();
          }}
          className="h-8 px-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 active:bg-indigo-600/70 text-indigo-200 hover:text-white border border-indigo-500/40 font-semibold transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
        >
          <span className="material-symbols-outlined text-[15px]">done_all</span>
          <span>Marcar como lidos</span>
        </button>
      </div>
    </div>
  </>
  );
};
