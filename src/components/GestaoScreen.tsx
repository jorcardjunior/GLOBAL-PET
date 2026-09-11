import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FinanceiroDashboard } from './FinanceiroDashboard';
import { EquipeScreen } from './EquipeScreen';

export const GestaoScreen: React.FC = () => {
  const {
    caixaStatus,
    bills,
    payBill,
    closeCaixaOfDay,
    addNewBill,
    showToast,
    currentUser,
    employees,
    openEmployeeModal,
    setActiveTab,
    switchUser,
    openRemoteDashboard,
    gestaoViewMode,
    setGestaoViewMode
  } = useApp();

  const viewMode = gestaoViewMode;
  const setViewMode = setGestaoViewMode;
  const [isCashierModalOpen, setIsCashierModalOpen] = useState(false);
  const [countedCash, setCountedCash] = useState<string>('410.50');
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [quickPin, setQuickPin] = useState('');
  const [quickPinError, setQuickPinError] = useState('');

  // New bill state
  const [supplier, setSupplier] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleQuickUnlock = () => {
    if (!quickPin) {
      setQuickPinError('Informe o PIN de autorização.');
      return;
    }
    // Check if PIN belongs to Gerente (2222) or Dono (1234)
    if (quickPin === '1234') {
      switchUser('emp-1', '1234');
      setQuickPin('');
      setQuickPinError('');
    } else if (quickPin === '2222') {
      switchUser('emp-2', '2222');
      setQuickPin('');
      setQuickPinError('');
    } else {
      setQuickPinError('PIN de autorização inválido. Utilize o PIN do Gerente (2222) ou Dono (1234).');
    }
  };

  if (!currentUser.canAccessFinance) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-lg mx-auto px-4 py-8 text-center animate-in fade-in duration-200">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
          <span className="material-symbols-outlined text-[44px]">shield_lock</span>
        </div>
        
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-amber-400 mb-2">
          Privilégio de Acesso Insuficiente
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
          Módulo Financeiro & Balanços Sigilosos
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-6">
          O DRE Gerencial, Balanço de Lucros, Margens e Boletos da Global Pet são sigilosos e de acesso exclusivo da Gerência e da Diretoria. Usuários comuns não possuem permissão de visualização.
        </p>

        {/* Current user badge */}
        <div className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between mb-5">
          <div className="flex items-center gap-3 text-left">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/20"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-xs font-bold text-white">{currentUser.name}</p>
              <p className="text-[11px] text-white/50">{currentUser.roleLabel}</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/15 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
            Acesso Restrito
          </span>
        </div>

        {/* Quick Manager PIN Unlock */}
        <div className="w-full p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 mb-5 text-left space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-indigo-400">key</span>
              Liberar com PIN do Gerente ou Dono
            </h4>
            <span className="text-[10px] text-indigo-300 font-mono">Dica: 2222 ou 1234</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="password"
              maxLength={4}
              value={quickPin}
              onChange={e => {
                setQuickPin(e.target.value);
                setQuickPinError('');
              }}
              placeholder="PIN de autorização"
              className="flex-1 h-10 px-3 rounded-xl bg-black/40 border border-white/15 text-center tracking-widest text-sm font-mono text-white focus:outline-none focus:border-indigo-400"
            />
            <button
              type="button"
              onClick={handleQuickUnlock}
              className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1"
            >
              Liberar Acesso
            </button>
          </div>
          {quickPinError && (
            <p className="text-xs text-rose-400 font-medium">{quickPinError}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            type="button"
            onClick={openEmployeeModal}
            className="w-full sm:flex-1 h-11 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            Trocar Funcionário
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pdv')}
            className="w-full sm:flex-1 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
          >
            <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
            Voltar para o PDV
          </button>
        </div>
      </div>
    );
  }

  const handleCloseCashier = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(countedCash) || 0;
    closeCaixaOfDay(val);
    setIsCashierModalOpen(false);
  };

  const handleSaveBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier || !amount) return;

    addNewBill({
      supplier,
      description: description || 'Despesa Operacional',
      amount: parseFloat(amount) || 0,
      dueDate: dueDate || 'Amanhã',
      status: 'pendente'
    });

    setIsAddBillOpen(false);
    setSupplier('');
    setDescription('');
    setAmount('');
  };

  return (
    <div className="flex flex-col w-full gap-5 max-w-4xl mx-auto px-4 md:px-6 py-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">
            Inteligência & Controladoria
          </span>
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white flex items-center gap-2">
            Fechamento & <span className="font-semibold text-white">DRE Gerencial</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={openRemoteDashboard}
            className="h-11 px-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[13px] font-semibold flex items-center gap-2 border border-indigo-500/30 transition-all cursor-pointer backdrop-blur-md"
            title="Abrir Painel de Gestão e Monitoramento Remoto da Loja"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-400">cell_tower</span>
            <span className="hidden sm:inline">Gestão Remota & Anti-Fraude</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCashierModalOpen(true)}
            className="h-11 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-[13px] font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer border border-indigo-400/30"
          >
            <span className="material-symbols-outlined text-[18px]">lock_clock</span>
            <span>Fechar Caixa #01</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Switcher (Power BI Dashboard vs Caixa Diário & Boletos vs Equipe) */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-white/[0.04] border border-white/10 rounded-2xl w-full sm:w-fit">
        <button
          id="btn-view-bi-dashboard"
          type="button"
          onClick={() => setViewMode('dashboard')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
            viewMode === 'dashboard'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">query_stats</span>
          <span>Painel Financeiro</span>
        </button>
        <button
          id="btn-view-caixa-boletos"
          type="button"
          onClick={() => setViewMode('operacional')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
            viewMode === 'operacional'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>Caixa Diário & Boletos ({bills.filter(b => b.status !== 'pago').length})</span>
        </button>
        <button
          id="btn-view-equipe"
          type="button"
          onClick={() => setViewMode('equipe')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
            viewMode === 'equipe'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">group</span>
          <span>Equipe & Funcionários ({employees.length})</span>
        </button>
      </div>

      {viewMode === 'equipe' ? (
        <EquipeScreen />
      ) : viewMode === 'dashboard' ? (
        <FinanceiroDashboard />
      ) : (
        <>
          {/* Primary Financial Overview Bento Card */}
      <div className="glass-card p-4 md:p-5 flex flex-col gap-3.5 shadow-lg border border-white/10">
        <div className="flex items-center justify-between text-white/50">
          <span className="text-[12px] font-bold uppercase tracking-wider">
            Entradas Conciliadas Hoje
          </span>
          <span className="text-[11px] text-indigo-300 font-semibold bg-indigo-500/15 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
            Terminal 01 • Jorge Silva
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-[20px] font-bold text-white/60">R$</span>
          <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {caixaStatus.totalToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Breakdown by Payment Method */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/5">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col">
            <div className="flex items-center justify-between text-[11px] text-white/50 font-medium">
              <span>PIX Instantâneo</span>
              <span className="material-symbols-outlined text-[16px] text-emerald-400">qr_code_2</span>
            </div>
            <span className="text-[16px] font-bold text-white mt-1">
              R$ {(caixaStatus?.pixTotal ?? 0).toFixed(2).replace('.', ',')}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">51% das vendas</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col">
            <div className="flex items-center justify-between text-[11px] text-white/50 font-medium">
              <span>Cartões (Maq. Integrada)</span>
              <span className="material-symbols-outlined text-[16px] text-indigo-400">credit_card</span>
            </div>
            <span className="text-[16px] font-bold text-white mt-1">
              R$ {(caixaStatus?.cardTotal ?? 0).toFixed(2).replace('.', ',')}
            </span>
            <span className="text-[10px] text-indigo-300 font-semibold mt-0.5">39% das vendas</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col">
            <div className="flex items-center justify-between text-[11px] text-white/50 font-medium">
              <span>Dinheiro Gaveta</span>
              <span className="material-symbols-outlined text-[16px] text-purple-400">payments</span>
            </div>
            <span className="text-[16px] font-bold text-white mt-1">
              R$ {(caixaStatus?.cashTotal ?? 0).toFixed(2).replace('.', ',')}
            </span>
            <span className="text-[10px] text-purple-300 font-semibold mt-0.5">10% das vendas</span>
          </div>
        </div>
      </div>

      {/* Revenue by Department (DRE Simplificado) */}
      <div className="glass-card p-4 md:p-5 flex flex-col gap-3.5 border border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[16px] text-white">Mix de Vendas por Departamento</h3>
          <span className="text-[11px] text-white/50 font-semibold">Margem & Contribuição</span>
        </div>

        <div className="flex flex-col gap-3 text-[12px]">
          <div>
            <div className="flex items-center justify-between font-semibold text-white/90 mb-1.5">
              <span>Rações (Granel & Sacarias Agro)</span>
              <span className="text-indigo-300">58% • R$ 2.227,00</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '58%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between font-semibold text-white/90 mb-1.5">
              <span>Estética Pet Care (Banho & Tosa)</span>
              <span className="text-purple-300">22% • R$ 845,00</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '22%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between font-semibold text-white/90 mb-1.5">
              <span>Farmácia & Antipulgas</span>
              <span className="text-emerald-300">14% • R$ 537,50</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '14%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between font-semibold text-white/90 mb-1.5">
              <span>Acessórios & Petiscos</span>
              <span className="text-amber-300">6% • R$ 231,00</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: '6%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Contas a Pagar / Boletos */}
      <div className="flex flex-col gap-3 pb-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-indigo-400">receipt_long</span>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">Contas a Pagar & Boletos</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsAddBillOpen(true)}
            className="text-[12px] font-semibold text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Adicionar Boleto
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {bills.map(bill => {
            const isPaid = bill.status === 'pago';
            const billDueDate = bill.dueDate || bill.dueDateText || 'A vencer';
            const isDueToday = bill.status === 'hoje' || billDueDate.toLowerCase().includes('hoje');
            const billAmount = bill.amount ?? bill.value ?? 0;

            return (
              <div
                key={bill.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  isPaid
                    ? 'glass-card opacity-60 border-white/5'
                    : isDueToday
                    ? 'glass-card border-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'glass-card border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isPaid
                        ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400'
                        : isDueToday
                        ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                        : 'bg-white/5 border border-white/10 text-white/70'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isPaid ? 'task_alt' : 'description'}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[14px] text-white truncate">
                        {bill.supplier}
                      </span>
                      {isDueToday && !isPaid && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-bold uppercase">
                          Vence Hoje
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-white/50 truncate">
                      {bill.description} • Vencimento: {billDueDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right flex flex-col">
                    <span className="font-bold text-[15px] text-white">
                      R$ {billAmount.toFixed(2).replace('.', ',')}
                    </span>
                    <span className={`text-[11px] font-semibold ${isPaid ? 'text-emerald-400' : 'text-white/40'}`}>
                      {isPaid ? 'Liquidado' : 'A Vencer'}
                    </span>
                  </div>

                  {!isPaid && (
                    <button
                      type="button"
                      onClick={() => payBill(bill.id)}
                      className="h-9 px-3.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer border border-emerald-400/30"
                    >
                      <span className="material-symbols-outlined text-[15px]">done</span>
                      Pagar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
        </>
      )}

      {/* Cashier Reconciliation Modal */}
      {isCashierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0e0f1d] border border-white/15 w-full max-w-sm rounded-2xl p-5 shadow-2xl flex flex-col gap-4 animate-scale-up text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
                </span>
                <h3 className="font-semibold text-[16px] text-white">Fechamento Cego de Caixa</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCashierModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCloseCashier} className="flex flex-col gap-3.5">
              <div className="bg-white/[0.03] border border-white/10 p-3 rounded-xl flex flex-col gap-1.5 text-[12px]">
                <div className="flex justify-between text-white/60">
                  <span>Troco de Abertura:</span>
                  <span className="font-bold text-white">R$ 200,00</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Vendas Dinheiro Registradas:</span>
                  <span className="font-bold text-white">
                    R$ {(caixaStatus?.cashTotal ?? 0).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between text-indigo-300 font-bold pt-1.5 border-t border-white/10">
                  <span>Total Esperado na Gaveta:</span>
                  <span>R$ {(200 + (caixaStatus?.cashTotal ?? 0)).toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                  Dinheiro Físico Contado na Gaveta (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={countedCash}
                  onChange={e => setCountedCash(e.target.value)}
                  className="w-full h-12 px-3 text-[22px] font-bold text-center text-white bg-white/[0.04] rounded-xl border border-white/15 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCashierModalOpen(false)}
                  className="flex-1 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-[13px] font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[13px] font-bold shadow-lg shadow-indigo-500/25 border border-indigo-400/30"
                >
                  Encerrar Caixa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Bill Modal */}
      {isAddBillOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0e0f1d] border border-white/15 w-full max-w-sm rounded-2xl p-5 shadow-2xl flex flex-col gap-4 animate-scale-up text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-semibold text-[16px] text-white">Novo Boleto a Pagar</h3>
              <button
                type="button"
                onClick={() => setIsAddBillOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveBill} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                  Fornecedor / Beneficiário *
                </label>
                <input
                  type="text"
                  required
                  value={supplier}
                  onChange={e => setSupplier(e.target.value)}
                  placeholder="Ex: Golden Alimentos..."
                  className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-[13px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                  Descrição dos Itens
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex: Lote Ração 15kg"
                  className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-[13px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                    Valor (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-[13px] font-bold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                    Vencimento
                  </label>
                  <input
                    type="text"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    placeholder="Ex: 30/10"
                    className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-[13px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddBillOpen(false)}
                  className="flex-1 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-[13px] font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[13px] font-bold shadow-lg shadow-indigo-500/25 border border-indigo-400/30"
                >
                  Salvar Boleto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
