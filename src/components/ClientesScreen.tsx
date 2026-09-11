import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';
import { ASSETS } from '../data';
import { maskPhone, maskCpf } from '../utils/cryptoStorage';

export const ClientesScreen: React.FC = () => {
  const {
    clients,
    receiveClientPayment,
    addNewClient,
    showToast,
    isSensitiveDataMasked,
    toggleSensitiveDataMask,
    anonymizeClient,
    currentUser
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'debtors' | 'paid' | 'frequent'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Payment receipt modal state
  const [paymentModalClient, setPaymentModalClient] = useState<Client | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Dinheiro' | 'Cartão'>('PIX');

  // LGPD Anonymize modal state
  const [clientToAnonymize, setClientToAnonymize] = useState<Client | null>(null);
  const [isAnonymizing, setIsAnonymizing] = useState(false);

  // New client modal state
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCpf, setNewCpf] = useState('');
  const [newPet, setNewPet] = useState('');
  const [newLimit, setNewLimit] = useState('500.00');

  const totalFiado = clients.reduce((acc, c) => acc + c.debtBalance, 0);
  const debtorCount = clients.filter(c => c.debtBalance > 0).length;

  const filteredClients = clients.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);

    if (!matchSearch) return false;
    if (filterType === 'debtors') return c.debtBalance > 0;
    if (filterType === 'paid') return c.debtBalance === 0;
    if (filterType === 'frequent') return (c.loyaltyPoints ?? 0) > 200;
    return true;
  });

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalClient) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    receiveClientPayment(paymentModalClient.id, amount, paymentMethod);
    setPaymentModalClient(null);
    setPaymentAmount('');
  };

  const handleSaveNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    addNewClient({
      name: newName,
      phone: newPhone || '(11) 99999-0000',
      cpf: newCpf || undefined,
      avatar: ASSETS.clientMaria,
      debtBalance: 0,
      creditLimit: parseFloat(newLimit) || 500,
      status: 'Em Dia',
      pets: newPet ? [newPet] : ['Pet'],
      loyaltyPoints: 50
    });

    setIsNewClientModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewCpf('');
    setNewPet('');
  };

  return (
    <div className="flex flex-col w-full gap-5 max-w-4xl mx-auto px-4 md:px-6 py-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">
            Gestão Comunitária & Fiado
          </span>
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white flex items-center gap-2">
            Caderninho & <span className="font-semibold text-white">Carteira</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {/* LGPD Privacy Toggle */}
          <button
            type="button"
            id="btn-toggle-lgpd-privacidade-clientes"
            onClick={toggleSensitiveDataMask}
            className={`h-11 px-3.5 rounded-xl border text-[12px] font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              isSensitiveDataMasked
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
            title={isSensitiveDataMasked ? 'LGPD Ativa: CPF e telefones mascarados no balcão' : 'LGPD Desativada: Dados visíveis'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSensitiveDataMasked ? 'visibility_off' : 'visibility'}
            </span>
            <span className="hidden sm:inline">
              {isSensitiveDataMasked ? 'LGPD Mascarada' : 'Modo Visível'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewClientModalOpen(true)}
            className="h-11 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-[13px] font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer border border-indigo-400/30"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Novo Cliente</span>
          </button>
        </div>
      </div>

      {/* Caderninho Comunitário Summary Banner */}
      <div className="glass-card p-4 md:p-5 flex flex-col gap-3.5 shadow-lg border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center justify-center flex-shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-[26px]">menu_book</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">
                Total em Aberto no Caderninho (Fiado da Comunidade)
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  R$ {totalFiado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[12px] font-semibold text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                  {debtorCount} clientes com pendência
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => showToast('Disparado comprovante e chave PIX Copia-e-Cola para clientes com débitos pendentes!', 'chat')}
            className="h-10 px-4 rounded-xl glass-card-interactive text-white text-[12px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-emerald-400">chat</span>
            <span>Enviar Lembrete PIX</span>
          </button>
        </div>

        {/* Small stats badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-white/5 text-[12px]">
          <div className="flex items-center gap-2 text-white/60">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">verified_user</span>
            <span>Taxa pontualidade: <strong className="text-white">94.2%</strong></span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <span className="material-symbols-outlined text-[16px] text-indigo-400">credit_score</span>
            <span>Limite padrão: <strong className="text-white">R$ 500,00</strong></span>
          </div>
          <div className="flex items-center gap-2 text-white/60 col-span-2 sm:col-span-1">
            <span className="material-symbols-outlined text-[16px] text-purple-400">loyalty</span>
            <span>Total cadastrados: <strong className="text-white">{clients.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-[20px] text-white/40">
          search
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome, telefone ou CPF..."
          className="w-full h-12 pl-11 pr-4 bg-white/[0.04] border border-white/10 text-white rounded-xl text-[14px] placeholder:text-white/30 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 shadow-inner"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 md:-mx-6 px-4 md:px-6">
        {[
          { id: 'all', label: `Todos (${clients.length})` },
          { id: 'debtors', label: `Com Débito (${debtorCount})` },
          { id: 'paid', label: `Em Dia (${clients.length - debtorCount})` },
          { id: 'frequent', label: 'Mais Assíduos' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id as any)}
            className={`h-9 px-4 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              filterType === tab.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400/40 shadow-md shadow-indigo-500/20'
                : 'bg-white/[0.03] text-white/60 border-white/5 hover:bg-white/[0.07] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Client Cards List */}
      <div className="flex flex-col gap-3 pb-24">
        {filteredClients.map(client => {
          const debt = client.debtBalance ?? 0;
          const hasDebt = debt > 0;
          const creditLimit = client.creditLimit ?? client.debtLimit ?? 500;
          const usagePercent = Math.min(100, Math.round((debt / (creditLimit || 1)) * 100));
          const clientImg = client.avatar || client.image || ASSETS.clientMaria;

          return (
            <div
              key={client.id}
              className="glass-card p-4 md:p-5 flex flex-col gap-3.5 transition-all hover:border-white/20"
            >
              {/* Top Row: Avatar, Name, Status, Debt */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={clientImg}
                    alt={client.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-bold text-[16px] text-white leading-tight truncate flex items-center gap-2">
                      <span>{client.name}</span>
                      {client.isAnonymized && (
                        <span className="text-[10px] text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                          Anonimizado LGPD
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-[12px] text-white/50 mt-0.5">
                      <span className="font-mono text-white/70">
                        {isSensitiveDataMasked ? maskPhone(client.phone) : client.phone}
                      </span>
                      {client.cpf && (
                        <span className="font-mono text-white/40">
                          • CPF: {isSensitiveDataMasked ? maskCpf(client.cpf) : client.cpf}
                        </span>
                      )}
                      {client.pets && client.pets.length > 0 && (
                        <span className="text-[11px] text-indigo-300 bg-indigo-500/15 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                          {client.pets.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end flex-shrink-0">
                  {hasDebt ? (
                    <>
                      <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Débito Fiado</span>
                      <span className="text-[18px] font-bold text-rose-300 leading-tight">
                        R$ {debt.toFixed(2).replace('.', ',')}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Status</span>
                      <span className="text-[14px] font-bold text-emerald-300 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        Em Dia
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Debt / Credit Limit Progress Bar (if fiado enabled) */}
              <div className="bg-white/[0.03] border border-white/5 p-3 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] font-medium text-white/60">
                  <span>Limite Autorizado: R$ {creditLimit.toFixed(2).replace('.', ',')}</span>
                  <span>{usagePercent}% em aberto</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      usagePercent > 80 ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : usagePercent > 40 ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
                {client.lastPurchase && (
                  <span className="text-[11px] text-white/40 truncate">
                    Última compra: {client.lastPurchase}
                  </span>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => showToast(`Abrindo conversa WhatsApp com ${client.name} (${client.phone})...`, 'chat')}
                    className="h-9 px-3 rounded-xl glass-card-interactive text-white/80 hover:text-white text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-emerald-400">chat</span>
                    <span>WhatsApp</span>
                  </button>

                  {!client.isAnonymized && (
                    <button
                      type="button"
                      onClick={() => setClientToAnonymize(client)}
                      className="h-9 px-2.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/30 text-white/50 hover:text-rose-300 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      title="Direito de eliminação/anonimização cadastral do titular (LGPD Art. 18)"
                    >
                      <span className="material-symbols-outlined text-[15px]">shield</span>
                      <span className="hidden sm:inline">LGPD Art. 18</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {hasDebt && (
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentModalClient(client);
                        setPaymentAmount(debt.toFixed(2));
                      }}
                      className="h-9 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[12px] font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer border border-emerald-400/30"
                    >
                      <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                      <span>Receber / Quitar</span>
                    </button>
                  )}

                  {!hasDebt && (
                    <button
                      type="button"
                      onClick={() => showToast(`Histórico de compras de ${client.name} com 14 pedidos anteriores`, 'history')}
                      className="h-9 px-3.5 rounded-xl glass-card-interactive text-white/70 hover:text-white text-[12px] font-semibold transition-colors cursor-pointer"
                    >
                      Ver Histórico
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Receipt Modal */}
      {paymentModalClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0e0f1d] border border-white/15 w-full max-w-sm rounded-2xl p-5 shadow-2xl flex flex-col gap-4 animate-scale-up text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">receipt</span>
                </span>
                <div>
                  <h3 className="font-semibold text-[16px] text-white">Quitar Caderninho</h3>
                  <p className="text-[11px] text-white/50 truncate">{paymentModalClient.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalClient(null)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="flex flex-col gap-3.5">
              <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl flex flex-col gap-0.5">
                <span className="text-[11px] text-rose-300/80 font-medium uppercase tracking-wider">Débito Atual Total:</span>
                <span className="text-[22px] font-bold text-rose-300">
                  R$ {(paymentModalClient.debtBalance ?? 0).toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div>
                <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                  Valor a Receber (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  className="w-full h-12 px-3 text-[22px] font-bold text-center text-white bg-white/[0.04] rounded-xl border border-white/15 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                  Forma de Recebimento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['PIX', 'Dinheiro', 'Cartão'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`h-10 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1 transition-all border ${
                        paymentMethod === m
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400/40 shadow-md shadow-emerald-500/20'
                          : 'bg-white/[0.04] text-white/60 border-white/5 hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setPaymentModalClient(null)}
                  className="flex-1 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-[13px] font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[13px] font-bold shadow-lg shadow-emerald-500/25 border border-emerald-400/30"
                >
                  Confirmar Baixa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Client Modal */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0e0f1d] border border-white/15 w-full max-w-sm rounded-2xl p-5 shadow-2xl flex flex-col gap-4 animate-scale-up text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                </span>
                <h3 className="font-semibold text-[16px] text-white">Novo Cliente</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewClientModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveNewClient} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo..."
                  className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-[13px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-[13px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                  CPF (Protegido por Criptografia LGPD)
                </label>
                <input
                  type="text"
                  value={newCpf}
                  onChange={e => setNewCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-[13px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                  Nome do Pet Principal (Opcional)
                </label>
                <input
                  type="text"
                  value={newPet}
                  onChange={e => setNewPet(e.target.value)}
                  placeholder="Ex: Rex (Pastor Alemão)"
                  className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-[13px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                  Limite Autorizado p/ Fiado (R$)
                </label>
                <input
                  type="number"
                  value={newLimit}
                  onChange={e => setNewLimit(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-[13px] font-bold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewClientModalOpen(false)}
                  className="flex-1 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-[13px] font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[13px] font-bold shadow-lg shadow-indigo-500/25 border border-indigo-400/30"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Anonimização LGPD Art. 18 */}
      {clientToAnonymize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e0f1d] border border-amber-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">shield_person</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-[16px] text-white">
                  Anonimização de Dados (LGPD Art. 18)
                </h3>
                <span className="text-[12px] text-amber-300/80">Direito do Titular à Eliminação/Anonimização</span>
              </div>
            </div>

            <p className="text-[13px] text-white/70 leading-relaxed">
              Você está prestes a anonimizar os dados pessoais de <strong className="text-white">{clientToAnonymize.name}</strong> (telefone, notas, endereço e nome civil).
            </p>

            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3 text-[11px] text-white/60 flex flex-col gap-1.5">
              <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>Conformidade Fiscal Garantida:</span>
              </div>
              <p>Os registros fiscais e contábeis de compras anteriores continuam preservados sem vínculo com os dados de identificação pessoal, conforme exigido pela Lei 13.709/2018.</p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                disabled={isAnonymizing}
                onClick={() => setClientToAnonymize(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/70 text-[13px] font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isAnonymizing}
                onClick={async () => {
                  setIsAnonymizing(true);
                  await anonymizeClient(clientToAnonymize.id);
                  setIsAnonymizing(false);
                  setClientToAnonymize(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 cursor-pointer active:scale-95 transition-all"
              >
                {isAnonymizing ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span>Confirmar Anonimização</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
