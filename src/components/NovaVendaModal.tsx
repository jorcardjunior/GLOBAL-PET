import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SupervisorAuthModal } from './SupervisorAuthModal';

export const NovaVendaModal: React.FC = () => {
  const {
    isNewSaleModalOpen,
    closeNewSaleModal,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    finalizeSale,
    products,
    clients,
    currentUser,
    showToast
  } = useApp();

  const [selectedPayment, setSelectedPayment] = useState<'PIX' | 'Dinheiro' | 'Cartão Crédito' | 'Cartão Débito' | 'Fiado'>('PIX');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [searchItemTerm, setSearchItemTerm] = useState('');
  const [granelWeightInput, setGranelWeightInput] = useState<number>(2.5);

  // Commercial discount & Risk hierarchy states
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isSupervisorAuthOpen, setIsSupervisorAuthOpen] = useState(false);
  const [authReason, setAuthReason] = useState<'discount' | 'fiado'>('discount');
  const [authorizedDiscountSupervisor, setAuthorizedDiscountSupervisor] = useState<string | null>(null);
  const [authorizedFiadoSupervisor, setAuthorizedFiadoSupervisor] = useState<string | null>(null);

  if (!isNewSaleModalOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount);

  const matchedClient = clients.find(c => c.name === selectedClient);
  const hasClientDebt = (matchedClient?.debtBalance ?? 0) > 0;

  // Commercial rules: Operator limit is 5% discount
  const isLargeDiscount = discountPercent > 5;
  const requiresDiscountSupervisor = isLargeDiscount && !currentUser.canApplyLargeDiscounts && !authorizedDiscountSupervisor;

  // Credit rule: Fiado for client with existing debt requires supervisor if operator
  const requiresFiadoSupervisor = selectedPayment === 'Fiado' && hasClientDebt && !currentUser.canAuthorizeCredit && !authorizedFiadoSupervisor;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchItemTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchItemTerm.toLowerCase())
  );

  const handleSelectDiscount = (percent: number) => {
    if (percent > 5 && !currentUser.canApplyLargeDiscounts && !authorizedDiscountSupervisor) {
      setDiscountPercent(percent);
      setAuthReason('discount');
      setIsSupervisorAuthOpen(true);
      return;
    }
    setDiscountPercent(percent);
  };

  const handleFinish = () => {
    if (cart.length === 0) return;

    if (selectedPayment === 'Fiado' && !selectedClient) {
      showToast('Selecione um cliente para registrar no Caderninho!', 'warning');
      return;
    }

    if (requiresFiadoSupervisor) {
      setAuthReason('fiado');
      setIsSupervisorAuthOpen(true);
      return;
    }

    if (requiresDiscountSupervisor) {
      setAuthReason('discount');
      setIsSupervisorAuthOpen(true);
      return;
    }

    finalizeSale(selectedPayment, selectedClient || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#0e0f1d] border border-white/15 text-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
              <span className="material-symbols-outlined text-[24px]">point_of_sale</span>
            </div>
            <div>
              <h3 className="font-semibold text-[17px] text-white leading-tight">Frente de Caixa • Nova Venda PDV</h3>
              <p className="text-[11px] text-white/50">Terminal #01 • Balcão & Granel</p>
            </div>
          </div>
          <button
            onClick={closeNewSaleModal}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body with 2 scrollable areas or tabbed layout */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Fast item quick addition row */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase text-white/50 tracking-wider">
              Adicionar Produtos ao Cupom:
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-white/40">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar ração, granel, petiscos ou código..."
                value={searchItemTerm}
                onChange={e => setSearchItemTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/[0.04] border border-white/15 text-white text-[13px] placeholder:text-white/30 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Quick suggestions pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {filteredProducts.slice(0, 5).map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addToCart(p, p.isGranel ? granelWeightInput : 1, p.isGranel)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-[11px] whitespace-nowrap flex items-center gap-2 border border-white/10 active:scale-95 transition-transform cursor-pointer"
                >
                  <span className="font-semibold">{p.name.split(' ')[0]} {p.name.split(' ')[1]}</span>
                  <span className="text-emerald-400 font-bold">R$ {(p.price ?? 0).toFixed(2).replace('.', ',')}</span>
                </button>
              ))}
            </div>

            {/* Granel Quick Weight Multiplier */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[12px] mt-1">
              <div className="flex items-center gap-1.5 text-indigo-300">
                <span className="material-symbols-outlined text-[16px]">scale</span>
                <span className="font-bold">Peso Granel p/ adicionar:</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2.5, 5, 10].map(kg => (
                  <button
                    key={kg}
                    type="button"
                    onClick={() => setGranelWeightInput(kg)}
                    className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                      granelWeightInput === kg
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    {kg} kg
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cart items list */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-white/50 tracking-wider">
                Itens no Cupom ({cart.length}):
              </span>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[11px] text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">delete</span> Limpar
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="p-8 text-center bg-white/[0.02] rounded-xl border border-dashed border-white/15 flex flex-col items-center justify-center text-white/40 gap-1.5">
                <span className="material-symbols-outlined text-[32px] text-white/30">shopping_basket</span>
                <span className="text-[13px] font-semibold text-white/70">Nenhum item adicionado ainda</span>
                <span className="text-[11px]">Selecione itens acima ou use a consulta de código de barras</span>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2 shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[13px] text-white truncate">{item.name}</h4>
                      <span className="text-[11px] text-white/50">
                        {item.quantity} {item.unit} x R$ {(item.price ?? 0).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="font-bold text-[14px] text-emerald-400">
                        R$ {((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2).replace('.', ',')}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 flex items-center justify-center text-white/50 transition-colors cursor-pointer"
                        title="Remover"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Selection & Caderninho Option */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
            <label className="text-[11px] font-bold uppercase text-white/50 tracking-wider">
              Identificar Cliente (Opcional ou para Fiado):
            </label>
            <select
              value={selectedClient}
              onChange={e => setSelectedClient(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/15 text-white text-[13px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="" className="bg-[#0e0f1d] text-white">Cliente Balcão (Avulso / Não Identificado)</option>
              {clients.map(c => (
                <option key={c.id} value={c.name} className="bg-[#0e0f1d] text-white">
                  {c.name} {(c.debtBalance ?? 0) > 0 ? `(Débito: R$ ${(c.debtBalance ?? 0).toFixed(2).replace('.', ',')})` : '(Em dia)'}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase text-white/50 tracking-wider">
              Forma de Pagamento:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {[
                { id: 'PIX', label: 'PIX', icon: 'qr_code_2' },
                { id: 'Dinheiro', label: 'Dinheiro', icon: 'payments' },
                { id: 'Cartão Crédito', label: 'Crédito', icon: 'credit_card' },
                { id: 'Cartão Débito', label: 'Débito', icon: 'credit_card' },
                { id: 'Fiado', label: 'Caderninho', icon: 'book' }
              ].map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedPayment(method.id as any)}
                  className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center gap-1 transition-all border cursor-pointer ${
                    selectedPayment === method.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold border-indigo-400/40 shadow-md shadow-indigo-500/20'
                      : 'bg-white/[0.04] text-white/70 border-white/5 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{method.icon}</span>
                  <span className="text-[11px] leading-tight truncate">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* FIADO RISK CONTROL WARNING */}
          {selectedPayment === 'Fiado' && (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white/80 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-400">menu_book</span>
                  Regra de Risco do Caderninho:
                </span>
                {matchedClient ? (
                  <span className="text-[11px] text-white/50">
                    Limite: R$ {(matchedClient.creditLimit ?? 500).toFixed(2)}
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold text-[11px]">Selecione um cliente acima</span>
                )}
              </div>

              {matchedClient && hasClientDebt && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-rose-400 flex-shrink-0">warning</span>
                    <span>
                      Cliente com pendência de R$ {(matchedClient.debtBalance ?? 0).toFixed(2).replace('.', ',')}.
                      {!currentUser.canAuthorizeCredit && !authorizedFiadoSupervisor && (
                        <strong className="block text-[11px] text-rose-300">Requer liberação de Gerente/Dono com PIN.</strong>
                      )}
                    </span>
                  </div>

                  {!currentUser.canAuthorizeCredit && !authorizedFiadoSupervisor && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthReason('fiado');
                        setIsSupervisorAuthOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-[11px] font-bold flex items-center gap-1 self-start sm:self-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">pin</span>
                      Liberar c/ PIN
                    </button>
                  )}

                  {authorizedFiadoSupervisor && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span>
                      Liberado por {authorizedFiadoSupervisor}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* DESCONTO COMERCIAL (ALÇADA DE BALCÃO) */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase text-white/50 tracking-wider flex items-center gap-1.5">
                <span>Desconto Comercial:</span>
                <span className="text-[10px] font-normal text-white/40">(Alçada Operador: até 5%)</span>
              </label>
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-amber-300">
                  -R$ {discountAmount.toFixed(2).replace('.', ',')} ({discountPercent}%)
                </span>
              )}
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {[
                { percent: 0, label: '0%' },
                { percent: 3, label: '3%' },
                { percent: 5, label: '5%' },
                { percent: 10, label: '10% 🔒' },
                { percent: 15, label: '15% 🔒' }
              ].map(d => (
                <button
                  key={d.percent}
                  type="button"
                  onClick={() => handleSelectDiscount(d.percent)}
                  className={`py-1.5 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer ${
                    discountPercent === d.percent
                      ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                      : 'bg-white/[0.04] border-white/5 text-white/60 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {requiresDiscountSupervisor && (
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between gap-2 mt-1">
                <span className="text-[11px]">
                  Desconto de {discountPercent}% excede a alçada do operador (5%).
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthReason('discount');
                    setIsSupervisorAuthOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px]">pin</span>
                  Aprovar PIN
                </button>
              </div>
            )}

            {authorizedDiscountSupervisor && discountPercent > 5 && (
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[12px]">check_circle</span>
                Desconto de {discountPercent}% autorizado por {authorizedDiscountSupervisor}
              </span>
            )}
          </div>
        </div>

        {/* Modal Footer: Total & Finalize Button */}
        <div className="p-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] text-white/50 uppercase font-semibold">Total a Pagar:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-[24px] font-bold text-white leading-tight tracking-tight">
                R$ {(total ?? 0).toFixed(2).replace('.', ',')}
              </span>
              {discountPercent > 0 && (
                <span className="text-xs text-white/40 line-through">
                  R$ {subtotal.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={closeNewSaleModal}
              className="h-11 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white font-semibold text-[13px] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleFinish}
              disabled={cart.length === 0}
              className={`h-11 px-6 rounded-xl font-bold text-[14px] flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
                cart.length > 0
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25 border border-emerald-400/30 cursor-pointer'
                  : 'bg-white/10 text-white/30 border border-white/5 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>Finalizar Venda</span>
            </button>
          </div>
        </div>
      </div>

      {/* Supervisor Auth Modal for Discount / Fiado */}
      <SupervisorAuthModal
        isOpen={isSupervisorAuthOpen}
        onClose={() => setIsSupervisorAuthOpen(false)}
        requiredRole="gerente"
        actionTitle={
          authReason === 'discount'
            ? `Autorizar Desconto Comercial de ${discountPercent}%`
            : 'Autorizar Venda a Fiado com Inadimplência Pendente'
        }
        actionDescription={
          authReason === 'discount'
            ? `Desconto de ${discountPercent}% (-R$ ${discountAmount.toFixed(2)}) supera a alçada permitida para o operador (${currentUser.name}).`
            : `O cliente ${selectedClient || 'selecionado'} possui pendências anteriores no Caderninho. A liberação de crédito exige aval gerencial.`
        }
        onAuthorized={(supervisor) => {
          if (authReason === 'discount') {
            setAuthorizedDiscountSupervisor(`${supervisor.name} (${supervisor.roleLabel})`);
            showToast(`Desconto de ${discountPercent}% liberado por ${supervisor.name}!`, 'check_circle');
          } else {
            setAuthorizedFiadoSupervisor(`${supervisor.name} (${supervisor.roleLabel})`);
            showToast(`Venda a Fiado liberada por ${supervisor.name}!`, 'check_circle');
          }
        }}
      />
    </div>
  );
};
