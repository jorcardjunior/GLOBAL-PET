import React from 'react';
import { useApp } from '../context/AppContext';

export const OnlineOrdersModal: React.FC = () => {
  const {
    isOnlineOrdersModalOpen,
    closeOnlineOrdersModal,
    onlineOrders,
    importOnlineOrderToPDV,
    updateOnlineOrderStatus,
    storeSettings
  } = useApp();

  if (!isOnlineOrdersModalOpen) return null;

  const pendingOrders = onlineOrders.filter(o => o.status !== 'concluido' && o.status !== 'cancelado');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#0f0e1c] border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-500/10 flex flex-col max-h-[90vh] overflow-hidden animate-fade-in my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow">
              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                Pedidos Online & Vendas do Robô IA
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold border border-purple-500/30">
                  {pendingOrders.length} pendentes
                </span>
              </h3>
              <p className="text-xs text-white/50">Pedidos fechados via WhatsApp e canais digitais</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeOnlineOrdersModal}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3">
          {pendingOrders.length === 0 ? (
            <div className="py-12 text-center text-white/50 space-y-2">
              <span className="material-symbols-outlined text-[42px] text-white/20">check_circle</span>
              <p className="text-sm font-semibold">Nenhum pedido online pendente no momento!</p>
              <p className="text-xs text-white/40">Assim que o robô fechar uma nova venda ou agendamento no WhatsApp, ela aparecerá aqui com alerta sonoro.</p>
            </div>
          ) : (
            pendingOrders.map(order => (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-purple-300">{order.orderNumber}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      order.status === 'pendente'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-white/40">
                      {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="font-bold text-sm text-white truncate">{order.customerName}</p>
                  <p className="text-xs text-white/60 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {order.customerAddress} ({order.neighborhood})
                  </p>

                  <div className="text-xs text-white/80">
                    {order.items.map(i => `${i.quantity} ${i.unit} ${i.name}`).join(' • ')}
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div className="text-right">
                    <span className="text-[10px] text-white/40 uppercase block">Total c/ Frete</span>
                    <span className="font-mono font-bold text-emerald-400 text-base">
                      R$ {order.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        importOnlineOrderToPDV(order);
                        closeOnlineOrdersModal();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow"
                    >
                      <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                      Lançar PDV
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
