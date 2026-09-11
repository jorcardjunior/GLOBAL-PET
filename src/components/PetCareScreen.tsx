import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PetCareAppointment } from '../types';
import { ASSETS } from '../data';
import { PetWhatsAppModal } from './PetWhatsAppModal';

export const PetCareScreen: React.FC = () => {
  const {
    petCareQueue,
    updatePetStatus,
    importPetServiceToPDV,
    addPetAppointment,
    openNewSaleModal,
    showToast
  } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'waiting' | 'in-progress' | 'ready'>('all');
  const [selectedDay, setSelectedDay] = useState<number>(24);
  const [isNewPetModalOpen, setIsNewPetModalOpen] = useState<boolean>(false);
  const [selectedWhatsAppPet, setSelectedWhatsAppPet] = useState<PetCareAppointment | null>(null);

  // Form states for new pet
  const [newPetName, setNewPetName] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetSize, setNewPetSize] = useState<'Porte Pequeno' | 'Porte Médio' | 'Porte Grande'>('Porte Médio');
  const [newPetTutor, setNewPetTutor] = useState('');
  const [newPetPhone, setNewPetPhone] = useState('(11) 98765-4321');
  const [newPetService, setNewPetService] = useState('Banho & Tosa Higiênica');
  const [newPetPrice, setNewPetPrice] = useState('90.00');
  const [newPetTaxi, setNewPetTaxi] = useState(false);

  const days = [
    { dayNumber: 22, dayName: 'Dom', count: 2 },
    { dayNumber: 23, dayName: 'Seg', count: 5 },
    { dayNumber: 24, dayName: 'Hoje', count: 8 },
    { dayNumber: 25, dayName: 'Qua', count: 6 },
    { dayNumber: 26, dayName: 'Qui', count: 7 },
    { dayNumber: 27, dayName: 'Sex', count: 11 },
    { dayNumber: 28, dayName: 'Sáb', count: 14 }
  ];

  const filteredQueue = petCareQueue.filter(pet => {
    if (selectedFilter === 'all') return true;
    return pet.status === selectedFilter;
  });

  const handleSaveNewPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName || !newPetTutor) return;

    addPetAppointment({
      petName: newPetName,
      petBreed: newPetBreed || 'SRD',
      petAge: '2 anos',
      petSize: newPetSize,
      services: [newPetService],
      tutorName: newPetTutor,
      tutorPhone: newPetPhone || '(11) 98765-4321',
      taxiDog: newPetTaxi,
      timeSlot: '14:30',
      price: parseFloat(newPetPrice) || 85.00,
      status: 'waiting',
      image: ASSETS.bobMutt
    });

    setIsNewPetModalOpen(false);
    setNewPetName('');
    setNewPetBreed('');
    setNewPetTutor('');
    setNewPetPhone('(11) 98765-4321');
  };

  return (
    <div className="flex flex-col w-full gap-5 max-w-4xl mx-auto px-4 md:px-6 py-4">
      {/* Top Action & Search/Filter Header */}
      <section className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">
              Centro de Estética & Banho
            </span>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white flex items-center gap-2">
              Banho & Tosa <span className="font-semibold text-white">Integrado</span>
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
            </h1>
          </div>
          <button
            onClick={() => setIsNewPetModalOpen(true)}
            className="h-11 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-[13px] font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer border border-indigo-400/30"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Novo Pet</span>
          </button>
        </div>

        {/* Live Daily Metrics Summary Ribbon */}
        <div className="glass-card p-3.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                calendar_today
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-white/50 font-medium">
                {selectedDay === 24 ? 'Terça, 24 de Outubro' : `Dia ${selectedDay} de Outubro`}
              </span>
              <span className="text-[14px] text-white font-bold">
                {selectedDay === 24 ? '8 Agendamentos Hoje' : `${days.find(d => d.dayNumber === selectedDay)?.count || 5} Agendamentos`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-right">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-[11px] font-bold">
              3 Prontos
            </span>
            <span className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300 text-[11px] font-bold">
              2 Na Mesa
            </span>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-[11px] font-bold">
              3 Fila
            </span>
          </div>
        </div>

        {/* Horizontal Date Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 md:-mx-6 px-4 md:px-6">
          {days.map(d => {
            const isActive = selectedDay === d.dayNumber;
            return (
              <button
                key={d.dayNumber}
                type="button"
                onClick={() => {
                  setSelectedDay(d.dayNumber);
                  showToast(`Visualizando agendamentos de ${d.dayName} (${d.dayNumber}/10)`, 'calendar_month');
                }}
                className={`flex flex-col items-center justify-center min-w-[58px] py-2.5 px-2 rounded-xl transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400/40 shadow-lg shadow-indigo-500/20 font-bold scale-105'
                    : 'bg-white/[0.04] text-white/60 border-white/5 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <span className={`text-[10px] uppercase ${isActive ? 'text-white/80 font-bold' : ''}`}>
                  {d.dayName}
                </span>
                <span className="text-[17px] font-bold leading-tight mt-0.5">{d.dayNumber}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    isActive ? 'bg-white' : d.dayNumber === 25 ? 'bg-indigo-400' : d.dayNumber === 28 ? 'bg-purple-400' : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Status Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar -mx-4 md:-mx-6 px-4 md:px-6">
          {[
            { id: 'all', label: 'Todos (8)', dotColor: '' },
            { id: 'waiting', label: 'Aguardando Chegada (3)', dotColor: 'bg-amber-400' },
            { id: 'in-progress', label: 'Na Banheira/Mesa (2)', dotColor: 'bg-purple-400 animate-pulse' },
            { id: 'ready', label: 'Pronto p/ Retirada (3)', dotColor: 'bg-emerald-400 shadow-[0_0_6px_#34d399]' }
          ].map(filter => {
            const isActive = selectedFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedFilter(filter.id as any)}
                className={`h-8 px-3.5 rounded-full text-[12px] whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                  isActive
                    ? 'bg-white/15 text-white font-bold border-white/20 shadow-xs'
                    : 'bg-white/[0.03] text-white/50 border-white/5 hover:bg-white/[0.07] hover:text-white'
                }`}
              >
                {filter.dotColor && <span className={`w-2 h-2 rounded-full ${filter.dotColor}`} />}
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Pet Queue List */}
      <section className="flex flex-col gap-3">
        {filteredQueue.map(pet => {
          const isReady = pet.status === 'ready';
          const isInProgress = pet.status === 'in-progress';
          const isWaiting = pet.status === 'waiting';

          return (
            <article
              key={pet.id}
              className="glass-card p-4 md:p-5 flex flex-col gap-3 transition-all hover:border-white/20"
            >
              {/* Status & Timing Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isInProgress && (
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[11px] font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] animate-spin">cyclone</span>
                      Em Atendimento
                    </span>
                  )}
                  {isReady && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Pronto! Avisar Tutor
                    </span>
                  )}
                  {isWaiting && (
                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                      Aguardando Chegada
                    </span>
                  )}

                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 text-[11px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                    {pet.timeSlot}
                  </span>
                </div>

                <div className="text-[17px] font-bold text-white">
                  R$ {(pet.price ?? 0).toFixed(2).replace('.', ',')}
                </div>
              </div>

              {/* Pet Profile Row */}
              <div className="flex items-start gap-3.5 pt-0.5">
                <div className="relative flex-shrink-0">
                  <img
                    src={pet.image}
                    alt={pet.petName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/10"
                    referrerPolicy="no-referrer"
                  />
                  {pet.taxiDog && (
                    <span
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shadow-md border border-indigo-400"
                      title="Táxi Dog Ativo"
                    >
                      <span className="material-symbols-outlined text-[12px]">local_taxi</span>
                    </span>
                  )}
                  {isReady && (
                    <span
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-md border border-emerald-300"
                      title="Pronto e Perfumado"
                    >
                      <span className="material-symbols-outlined text-[12px]">spa</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[16px] text-white truncate">{pet.petName}</h2>
                    <span className="text-[11px] font-semibold text-white/60 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                      {pet.petSize}
                    </span>
                  </div>
                  <span className="text-[12px] text-white/50 truncate">
                    {pet.petBreed} • {pet.petAge}
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {pet.services.map((svc, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-white/80 text-[11px] font-medium"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Critical Alert / Observations Note if present */}
              {pet.observations && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-[12px]">
                  <span className="material-symbols-outlined text-amber-400 text-[18px] flex-shrink-0">
                    priority_high
                  </span>
                  <span className="truncate">{pet.observations}</span>
                </div>
              )}

              {/* Cross Sell Hint for feed if present */}
              {pet.crossSellHint && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-200 text-[12px]">
                  <span className="material-symbols-outlined text-indigo-400 text-[18px] flex-shrink-0">
                    storefront
                  </span>
                  <span className="truncate">{pet.crossSellHint}</span>
                </div>
              )}

              {/* Ready message action notification */}
              {isReady && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-white">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[20px] text-emerald-400">
                      notifications_active
                    </span>
                    <span className="text-[12px] font-medium text-emerald-200 truncate">Tutor aguardando aviso</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedWhatsAppPet(pet)}
                    className="h-8 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">send</span>
                    <span>Avisar WhatsApp</span>
                  </button>
                </div>
              )}

              {/* Tutor Info & Quick Actions Footer */}
              <div className="flex items-center justify-between pt-1 gap-2 border-t border-white/5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[16px] text-white/40">person</span>
                  <span className="text-[13px] font-semibold text-white/80 truncate">{pet.tutorName}</span>
                  {pet.tutorPhone && (
                    <span className="text-[11px] text-white/40 font-mono hidden sm:inline">
                      {pet.tutorPhone}
                    </span>
                  )}
                  {pet.taxiDog && (
                    <span className="text-[10px] text-indigo-300 font-bold bg-indigo-500/20 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                      Táxi Dog
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isWaiting && (
                    <button
                      type="button"
                      onClick={() => updatePetStatus(pet.id, 'in-progress')}
                      className="h-9 px-3 rounded-lg glass-card-interactive text-white flex items-center gap-1 text-[12px] font-semibold active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-indigo-400">login</span>
                      <span>Dar Entrada</span>
                    </button>
                  )}

                  {isInProgress && (
                    <button
                      type="button"
                      onClick={() => {
                        updatePetStatus(pet.id, 'ready');
                        setSelectedWhatsAppPet({ ...pet, status: 'ready' });
                      }}
                      className="h-9 px-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/40 text-white flex items-center gap-1 text-[12px] font-bold active:scale-95 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">done_all</span>
                      <span>Finalizar & Avisar</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => importPetServiceToPDV(pet)}
                    className="h-9 px-3.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center gap-1.5 text-[12px] font-bold active:scale-95 transition-all shadow-md shadow-indigo-500/20 cursor-pointer border border-indigo-400/30"
                  >
                    <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                    <span>Lançar PDV</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Financial Settlement & Cashier Integration Section */}
      <section className="flex flex-col gap-3 pt-2 pb-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-400 text-[20px]">account_balance_wallet</span>
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">Faturamento Estética Animal</h2>
          </div>
          <span className="text-[11px] text-indigo-300 font-semibold">Fechamento de Hoje</span>
        </div>

        {/* Metric Dashboard Bento Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="glass-card p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/50">
              <span className="text-[11px] font-bold uppercase tracking-wider">Faturado Hoje</span>
              <span className="material-symbols-outlined text-[16px] text-emerald-400">trending_up</span>
            </div>
            <span className="text-2xl font-bold text-white mt-1">R$ 745,00</span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">check</span> 8 serviços concluídos
            </span>
          </div>

          <div className="glass-card p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/50">
              <span className="text-[11px] font-bold uppercase tracking-wider">Ticket Médio Pet</span>
              <span className="material-symbols-outlined text-[16px] text-purple-400">pets</span>
            </div>
            <span className="text-2xl font-bold text-white mt-1">R$ 93,12</span>
            <span className="text-[11px] text-purple-300 font-semibold flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">add</span> + Ração agregada
            </span>
          </div>
        </div>

        {/* Unified Agro + Grooming POS Quick Launcher */}
        <div className="glass-card p-5 flex flex-col gap-3 border border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 via-white/[0.02] to-purple-900/20">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center flex-shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-[24px]">shopping_cart_checkout</span>
            </div>
            <div className="flex flex-col flex-1">
              <h3 className="font-bold text-[16px] text-white leading-snug">
                Venda Unificada: Banho + Ração
              </h3>
              <p className="text-[12px] text-white/60 mt-0.5">
                Junte a comanda do banho aos sacos de ração ou petiscos a granel comprados na loja e gere um único cupom fiscal.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={openNewSaleModal}
              className="flex-1 h-12 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer border border-indigo-400/30"
            >
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              <span>Abrir Caixa com Banho & Ração</span>
            </button>
          </div>
        </div>
      </section>

      {/* Modal: Novo Pet / Agendamento */}
      {isNewPetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0f1d] border border-white/15 w-full max-w-md rounded-2xl p-5 shadow-2xl flex flex-col gap-4 animate-scale-up text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">pets</span>
                </span>
                <div>
                  <h3 className="font-semibold text-[16px] text-white">Novo Agendamento Pet</h3>
                  <p className="text-[11px] text-white/50">Estética animal integrada ao PDV</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewPetModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveNewPet} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                  Nome do Pet *
                </label>
                <input
                  type="text"
                  required
                  value={newPetName}
                  onChange={e => setNewPetName(e.target.value)}
                  placeholder="Ex: Max, Mel, Pipoca..."
                  className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-[13px] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                    Raça / Espécie
                  </label>
                  <input
                    type="text"
                    value={newPetBreed}
                    onChange={e => setNewPetBreed(e.target.value)}
                    placeholder="Ex: Shih Tzu, SRD..."
                    className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-[13px] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                    Porte
                  </label>
                  <select
                    value={newPetSize}
                    onChange={e => setNewPetSize(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-xl border border-white/15 bg-[#121324] text-white text-[13px] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Porte Pequeno">Porte Pequeno</option>
                    <option value="Porte Médio">Porte Médio</option>
                    <option value="Porte Grande">Porte Grande</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                    Nome do Tutor *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPetTutor}
                    onChange={e => setNewPetTutor(e.target.value)}
                    placeholder="Ex: Carlos Oliveira"
                    className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-[13px] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-emerald-400 uppercase font-bold block mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">chat</span>
                    WhatsApp p/ Avisar
                  </label>
                  <input
                    type="text"
                    value={newPetPhone}
                    onChange={e => setNewPetPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full h-11 px-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-white font-mono text-[13px] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                    Serviço Principal
                  </label>
                  <select
                    value={newPetService}
                    onChange={e => {
                      setNewPetService(e.target.value);
                      if (e.target.value === 'Banho Completo') setNewPetPrice('65.00');
                      if (e.target.value === 'Banho & Tosa Higiênica') setNewPetPrice('90.00');
                      if (e.target.value === 'Tosa Geral da Raça') setNewPetPrice('120.00');
                      if (e.target.value === 'Hidratação Especial') setNewPetPrice('130.00');
                    }}
                    className="w-full h-11 px-3 rounded-xl border border-white/15 bg-[#121324] text-white text-[12px] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Banho Completo">Banho Completo</option>
                    <option value="Banho & Tosa Higiênica">Banho & Tosa Higiênica</option>
                    <option value="Tosa Geral da Raça">Tosa Geral da Raça</option>
                    <option value="Hidratação Especial">Hidratação Especial</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-white/50 uppercase font-bold block mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPetPrice}
                    onChange={e => setNewPetPrice(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-[13px] font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="check-taxi-dog"
                  checked={newPetTaxi}
                  onChange={e => setNewPetTaxi(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-500"
                />
                <label htmlFor="check-taxi-dog" className="text-[12px] text-white/80 cursor-pointer select-none">
                  Incluir Táxi Dog (Busca e Entrega na residência)
                </label>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewPetModalOpen(false)}
                  className="flex-1 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-[13px] font-semibold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[13px] font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-400/30"
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  Agendar Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Notification Modal */}
      <PetWhatsAppModal
        pet={selectedWhatsAppPet}
        onClose={() => setSelectedWhatsAppPet(null)}
      />
    </div>
  );
};
