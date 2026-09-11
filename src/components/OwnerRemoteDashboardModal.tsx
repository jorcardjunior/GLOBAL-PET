import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const OwnerRemoteDashboardModal: React.FC = () => {
  const {
    isRemoteDashboardOpen,
    closeRemoteDashboard,
    currentUser,
    employees,
    connectionMode,
    setConnectionMode,
    remoteAccessPolicy,
    updateRemoteAccessPolicy,
    grantRemoteAccessPass,
    revokeRemoteAccessPass,
    toggleEmergencyLockdown,
    securityAuditLogs,
    caixaStatus,
    products,
    petCareQueue,
    clients,
    bills
  } = useApp();

  const [activeTab, setActiveTab] = useState<'telemetria' | 'seguranca' | 'passes' | 'auditoria'>('telemetria');
  const [selectedEmployeeForPass, setSelectedEmployeeForPass] = useState<string>(employees[1]?.id || '');
  const [passHours, setPassHours] = useState<number>(4);
  const [passReason, setPassReason] = useState<string>('Plantão noturno / Fechamento de estoque');

  if (!isRemoteDashboardOpen) return null;

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const lowStockCount = (products || []).filter(p => p && p.stock <= p.minStock).length;
  const inProgressPets = (petCareQueue || []).filter(p => p && (p.status === 'in-progress' || (p.status as string) === 'in_progress')).length;
  const totalFiado = (clients || []).reduce((acc, c) => acc + (c?.debtBalance || 0), 0);
  const totalBillsPending = (bills || []).filter(b => b && b.status !== 'pago').reduce((acc, b) => acc + (b?.value || b?.amount || 0), 0);

  const handleCreatePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeForPass) return;
    grantRemoteAccessPass(selectedEmployeeForPass, passHours, passReason);
    setPassReason('Conferência de estoque e reposição autorizada');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-gradient-to-b from-[#0f0e1a] to-[#08080e] border border-indigo-500/30 rounded-3xl shadow-2xl shadow-indigo-500/10 flex flex-col max-h-[92vh] overflow-hidden animate-fade-in my-auto">
        
        {/* TOP HEADER MODAL */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <span className="material-symbols-outlined text-[26px]">cell_tower</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Painel de Gestão & Monitoramento Remoto
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Dono 24h
                </span>
              </div>
              <p className="text-xs text-white/60">
                Gerencie sua agropecuária à distância do smartphone ou tablet com telemetria ao vivo e travas anti-fraude.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Seletor de Modo de Conexão */}
            <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setConnectionMode('local')}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  connectionMode === 'local' ? 'bg-emerald-500 text-white shadow-sm' : 'text-white/50 hover:text-white'
                }`}
                title="Simula que você está na loja física"
              >
                <span className="material-symbols-outlined text-[15px]">store</span>
                <span className="hidden sm:inline">Na Loja</span>
              </button>

              <button
                type="button"
                onClick={() => setConnectionMode('remoto')}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  connectionMode === 'remoto' ? 'bg-indigo-500 text-white shadow-sm' : 'text-white/50 hover:text-white'
                }`}
                title="Simula acesso remoto de fora da loja (4G/casa)"
              >
                <span className="material-symbols-outlined text-[15px]">public</span>
                <span className="hidden sm:inline">Remoto (4G)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={closeRemoteDashboard}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* SUB-TABS NAVIGATION */}
        <div className="flex items-center gap-1 p-2 bg-black/40 border-b border-white/5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('telemetria')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'telemetria'
                ? 'bg-white/10 text-white border-b-2 border-indigo-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">insights</span>
            <span>Telemetria da Loja</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seguranca')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'seguranca'
                ? 'bg-white/10 text-white border-b-2 border-indigo-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">lock</span>
            <span>Regras & Trava Anti-Fraude</span>
            {remoteAccessPolicy.emergencyLockdown && (
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('passes')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'passes'
                ? 'bg-white/10 text-white border-b-2 border-indigo-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">badge</span>
            <span>Passes Remotos Ativos</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-white/80">
              {remoteAccessPolicy.authorizedPasses.filter(p => p.status === 'ativo').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('auditoria')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'auditoria'
                ? 'bg-white/10 text-white border-b-2 border-indigo-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">security_update_good</span>
            <span>Auditoria de Acessos</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-white/80">
              {securityAuditLogs.length}
            </span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: TELEMETRIA AO VIVO */}
          {activeTab === 'telemetria' && (
            <div className="space-y-6">
              {/* Cards de Métricas Rápidas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-white/50 text-[11px]">
                    <span>Faturamento Hoje</span>
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">payments</span>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-emerald-400">
                    {formatBRL(caixaStatus.totalToday)}
                  </div>
                  <div className="text-[10px] text-white/40">
                    {caixaStatus.pedidosCount} vendas emitidas
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-white/50 text-[11px]">
                    <span>Caixa Físico</span>
                    <span className="material-symbols-outlined text-indigo-400 text-[18px]">point_of_sale</span>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white">
                    {caixaStatus.isOpen ? 'Aberto' : 'Encerrado'}
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    Desde as {caixaStatus.openedAt}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-white/50 text-[11px]">
                    <span>Alerta de Granel</span>
                    <span className="material-symbols-outlined text-amber-400 text-[18px]">inventory_2</span>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-amber-300">
                    {lowStockCount} itens
                  </div>
                  <div className="text-[10px] text-white/40">
                    Abaixo do estoque mínimo
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-white/50 text-[11px]">
                    <span>Banho & Tosa</span>
                    <span className="material-symbols-outlined text-purple-400 text-[18px]">pets</span>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-purple-300">
                    {inProgressPets} na mesa
                  </div>
                  <div className="text-[10px] text-white/40">
                    {petCareQueue.length} agendados hoje
                  </div>
                </div>
              </div>

              {/* Status dos Colaboradores & Hierarquia */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-400 text-[18px]">group</span>
                    Colaboradores da Loja & Níveis Hierárquicos
                  </h3>
                  <span className="text-[11px] text-white/40">
                    {employees.length} cadastrados no sistema
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {employees.map(emp => {
                    const hasPass = remoteAccessPolicy.authorizedPasses.find(
                      p => p.employeeId === emp.id && p.status === 'ativo'
                    );
                    const isOwner = emp.role === 'dono';

                    return (
                      <div
                        key={emp.id}
                        className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-white block truncate">{emp.name}</span>
                            <span className="text-[10px] text-white/50 block truncate">{emp.roleDescription}</span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          {isOwner ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                              👑 Acesso Total 24h
                            </span>
                          ) : hasPass ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                              🌐 Passe Ativo
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                              🔒 Restrito fora
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Informações Comerciais Remotas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-400 text-[17px]">book</span>
                    Caderninho de Fiado da Comunidade:
                  </span>
                  <div className="text-base font-bold text-amber-300">{formatBRL(totalFiado)}</div>
                  <p className="text-[11px] text-white/50">
                    Clientes devedores bloqueados automaticamente no PDV caso excedam o limite.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-rose-400 text-[17px]">receipt_long</span>
                    Contas de Fornecedores Pendentes:
                  </span>
                  <div className="text-base font-bold text-rose-300">{formatBRL(totalBillsPending)}</div>
                  <p className="text-[11px] text-white/50">
                    Boletos vinculados às compras de ração de atacado e moinhos agrícolas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGRAS & TRAVA DE EMERGÊNCIA */}
          {activeTab === 'seguranca' && (
            <div className="space-y-6">
              {/* BOTÃO DE PÂNICO / TRAVA DE EMERGÊNCIA */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950/40 via-red-900/20 to-black/60 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-400 text-[24px]">gpp_maybe</span>
                    <h3 className="text-base font-bold text-white">Trava de Emergência Geral</h3>
                    {remoteAccessPolicy.emergencyLockdown && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                        ATIVADA
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/70 max-w-md">
                    Suspeita de má fé ou invasão? Corte imediatamente e remotamente o acesso de todos os operadores e funcionários fora da loja com 1 clique.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleEmergencyLockdown}
                  className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                    remoteAccessPolicy.emergencyLockdown
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 border border-red-400/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {remoteAccessPolicy.emergencyLockdown ? 'lock_open' : 'lock_reset'}
                  </span>
                  <span>
                    {remoteAccessPolicy.emergencyLockdown ? 'Suspender Trava de Emergência' : 'Acionar Trava Geral de Emergência'}
                  </span>
                </button>
              </div>

              {/* POLÍTICA DE HORÁRIO COMERCIAL */}
              <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">schedule</span>
                  Horário Comercial Autorizado para Operadores
                </h3>
                <p className="text-xs text-white/50">
                  Funcionários só têm permissão para acessar o sistema durante o expediente oficial da loja. Fora desses horários, o sistema exige autorização do dono.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                    <label className="text-xs font-semibold text-white block">Início do Expediente:</label>
                    <input
                      type="time"
                      value={remoteAccessPolicy.businessHoursStart}
                      onChange={e => updateRemoteAccessPolicy({ businessHoursStart: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-lg p-2 text-white text-xs outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                    <label className="text-xs font-semibold text-white block">Fim do Expediente:</label>
                    <input
                      type="time"
                      value={remoteAccessPolicy.businessHoursEnd}
                      onChange={e => updateRemoteAccessPolicy({ businessHoursEnd: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-lg p-2 text-white text-xs outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2 text-xs">
                  <label className="flex items-center gap-2.5 text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remoteAccessPolicy.allowRemoteOperatorAccess}
                      onChange={e => updateRemoteAccessPolicy({ allowRemoteOperatorAccess: e.target.checked })}
                      className="rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-0"
                    />
                    <span>Permitir que operadores façam vendas remotas durante o horário comercial (ex: vendas externas na fazenda)</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remoteAccessPolicy.requireOwnerApproval}
                      onChange={e => updateRemoteAccessPolicy({ requireOwnerApproval: e.target.checked })}
                      className="rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-0"
                    />
                    <span>Exigir aprovação expressa do dono mesmo durante o horário comercial para logins fora do Wi-Fi</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GESTÃO DE PASSES REMOTOS */}
          {activeTab === 'passes' && (
            <div className="space-y-6">
              {/* EMISSÃO DE NOVO PASSE */}
              <form onSubmit={handleCreatePass} className="p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">add_moderator</span>
                  Emitir Novo Passe de Acesso Remoto Temporário
                </h3>
                <p className="text-xs text-white/50">
                  Libere um funcionário para fazer balanço noturno, inventário ou vendas externas em feiras agropecuárias.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-white block">Colaborador:</label>
                    <select
                      value={selectedEmployeeForPass}
                      onChange={e => setSelectedEmployeeForPass(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-white text-xs outline-none focus:border-indigo-400"
                    >
                      {employees.filter(e => e.role !== 'dono').map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.roleLabel})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-white block">Validade do Passe:</label>
                    <select
                      value={passHours}
                      onChange={e => setPassHours(parseInt(e.target.value, 10))}
                      className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-white text-xs outline-none focus:border-indigo-400"
                    >
                      <option value={2}>2 Horas (Operação Rápida)</option>
                      <option value={4}>4 Horas (Meio Turno / Plantão)</option>
                      <option value={8}>8 Horas (Turno Completo)</option>
                      <option value={24}>24 Horas (Evento Especial / Feira)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-white block">Motivo / Justificativa:</label>
                    <input
                      type="text"
                      value={passReason}
                      onChange={e => setPassReason(e.target.value)}
                      placeholder="Ex: Inventário de sacaria à noite"
                      className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-white text-xs outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Emitir Passe de Acesso</span>
                  </button>
                </div>
              </form>

              {/* LISTA DE PASSES ATIVOS */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider">
                  Passes Remotos Atuais:
                </h4>

                {remoteAccessPolicy.authorizedPasses.length === 0 ? (
                  <div className="p-8 text-center text-white/40 space-y-2">
                    <span className="material-symbols-outlined text-[36px] text-white/20">lock</span>
                    <p className="text-sm">Nenhum funcionário com passe remoto ativo no momento.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {remoteAccessPolicy.authorizedPasses.map(pass => (
                      <div
                        key={pass.id}
                        className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{pass.employeeName}</span>
                            {pass.status === 'ativo' ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                ATIVO ATÉ {pass.expiresAt}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
                                REVOGADO
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/60">
                            Autorizado por <strong className="text-white">{pass.authorizedBy}</strong> • Motivo: {pass.reason}
                          </p>
                        </div>

                        {pass.status === 'ativo' && (
                          <button
                            type="button"
                            onClick={() => revokeRemoteAccessPass(pass.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-xs font-semibold text-red-300 transition-colors cursor-pointer self-start sm:self-auto"
                          >
                            Revogar Agora
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: AUDITORIA DE SEGURANÇA */}
          {activeTab === 'auditoria' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-400">policy</span>
                    Registro de Auditoria Anti-Fraude
                  </h3>
                  <p className="text-xs text-white/50">
                    Monitore quem tentou acessar o sistema, fora de hora ou com tentativas suspeitas.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {securityAuditLogs.map(log => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white">{log.employeeName}</span>
                        <span className="text-[10px] text-white/40">{log.timestamp}</span>
                        {log.status === 'sucesso' ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            AUTORIZADO
                          </span>
                        ) : log.status === 'bloqueado' ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                            BLOQUEADO
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            ALERTA
                          </span>
                        )}
                      </div>

                      <p className="text-white/70 text-[11px]">{log.details}</p>

                      <div className="text-[10px] font-mono text-white/40">
                        Aparelho: {log.deviceInfo} • IP: {log.ipAddress}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
