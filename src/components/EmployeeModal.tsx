import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EmployeeUser } from '../types';

export const EmployeeModal: React.FC = () => {
  const {
    isEmployeeModalOpen,
    closeEmployeeModal,
    openEmployeeManagement,
    openEmployeeForm,
    navigateToEquipe,
    currentUser,
    employees,
    switchUser,
    showToast
  } = useApp();

  const [selectedEmp, setSelectedEmp] = useState<EmployeeUser | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  if (!isEmployeeModalOpen) return null;

  const handleSelectEmployee = (emp: EmployeeUser) => {
    if (emp.id === currentUser.id) {
      showToast(`Você já está operando como ${emp.name}`, 'account_circle');
      return;
    }
    setSelectedEmp(emp);
    setPinInput('');
    setPinError('');
  };

  const handleConfirmSwitch = (emp: EmployeeUser, direct = false) => {
    if (direct) {
      const result = switchUser(emp.id);
      if (result.success) {
        closeEmployeeModal();
        setSelectedEmp(null);
      }
      return;
    }

    if (!pinInput) {
      setPinError('Digite o PIN de 4 dígitos do funcionário.');
      return;
    }

    const result = switchUser(emp.id, pinInput);
    if (result.success) {
      closeEmployeeModal();
      setSelectedEmp(null);
      setPinInput('');
    } else {
      setPinError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f1017] border border-white/15 rounded-3xl w-full max-w-xl overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">manage_accounts</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Trocar Funcionário / Operador
              </h2>
              <p className="text-xs text-white/50">
                Controle de Acesso Hierárquico por Função & Privilégios
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeEmployeeModal}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Current Active Employee Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Operador Ativo no Terminal
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentUser.badgeColor}`}>
                {currentUser.roleLabel}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-lg"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white truncate">{currentUser.name}</h3>
                <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                  {currentUser.roleDescription}
                </p>
              </div>
            </div>

            {/* Permissions Summary Matrix */}
            <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-white/80">
                <span className={`material-symbols-outlined text-[16px] ${currentUser.canAccessFinance ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {currentUser.canAccessFinance ? 'check_circle' : 'block'}
                </span>
                <span>DRE & Balanços: {currentUser.canAccessFinance ? 'Liberado' : 'Bloqueado'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <span className={`material-symbols-outlined text-[16px] ${currentUser.canCloseCashier ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {currentUser.canCloseCashier ? 'check_circle' : 'block'}
                </span>
                <span>Fechar Caixa: {currentUser.canCloseCashier ? 'Liberado' : 'Bloqueado'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <span className={`material-symbols-outlined text-[16px] ${currentUser.canModifySettings ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {currentUser.canModifySettings ? 'check_circle' : 'block'}
                </span>
                <span>Ajustes Loja: {currentUser.canModifySettings ? 'Liberado' : 'Bloqueado'}</span>
              </div>
            </div>
          </div>

          {/* List of Available Employees to switch */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3 flex items-center justify-between">
              <span>Selecione para Trocar de Usuário:</span>
              <span className="text-[11px] font-normal text-white/40">Clique no card para autenticar</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(employees || []).map(emp => {
                if (!emp) return null;
                const isCurrent = emp.id === currentUser?.id;
                const isSelected = selectedEmp?.id === emp.id;

                return (
                  <div
                    key={emp.id}
                    onClick={() => handleSelectEmployee(emp)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left relative ${
                      isCurrent
                        ? 'bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/30'
                        : isSelected
                        ? 'bg-white/10 border-white/30 shadow-lg'
                        : 'bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={emp.avatar || ''}
                        alt={emp.name || 'Colaborador'}
                        className="w-11 h-11 rounded-xl object-cover ring-1 ring-white/20"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-white truncate">{emp.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${emp.badgeColor || 'border-white/20 text-white/70'}`}>
                            {(emp.roleLabel || 'Colaborador').split(' / ')[0]}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/50 truncate mt-0.5">{emp.roleLabel}</p>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-white/40 flex items-center gap-1 font-mono">
                            <span className="material-symbols-outlined text-[13px]">pin</span>
                            PIN: {emp.pin}
                          </span>
                          
                          {isCurrent ? (
                            <span className="text-[10px] text-indigo-400 font-bold">Ativo Agora</span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirmSwitch(emp, true);
                              }}
                              className="px-2 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 text-[11px] font-semibold transition-colors"
                            >
                              Trocar Rápido
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PIN Confirmation Section if an employee is selected */}
          {selectedEmp && selectedEmp.id !== currentUser.id && (
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Confirmar troca para: {selectedEmp.name}
                  </h4>
                  <p className="text-xs text-white/60">
                    Função: {selectedEmp.roleLabel} • Digite o PIN de 4 dígitos ou confirme abaixo
                  </p>
                </div>
                <span className="text-xs text-indigo-300 font-mono bg-indigo-500/20 px-2 py-1 rounded-lg border border-indigo-500/30">
                  Dica: {selectedEmp.pin}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={e => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  placeholder="PIN (4 dígitos)"
                  className="w-36 h-10 px-3 rounded-xl bg-white/10 border border-white/20 text-center tracking-widest text-lg font-mono text-white focus:outline-none focus:border-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => handleConfirmSwitch(selectedEmp, false)}
                  className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[17px]">login</span>
                  Confirmar PIN
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmSwitch(selectedEmp, true)}
                  className="h-10 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-xs transition-colors"
                >
                  Entrar Direto
                </button>
              </div>

              {pinError && (
                <p className="text-xs text-rose-400 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {pinError}
                </p>
              )}

              {/* Informative notice if switching to a common user */}
              {!selectedEmp.canAccessFinance && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-amber-400">info</span>
                  <span>
                    <strong>Perfil Operador:</strong> Este usuário não tem privilégios para visualizar a aba de Gestão (DRE, Balanços de Lucro e Fechamento Financeiro).
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-white/5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5 text-xs text-white/50">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-cadastrar-novo-funcionario-modal"
              type="button"
              onClick={() => {
                closeEmployeeModal();
                openEmployeeForm(null);
              }}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-[11px] flex items-center gap-1.5 shadow-md shadow-indigo-500/25 border border-indigo-400/30 transition-all active:scale-95 cursor-pointer"
              title="Abrir formulário para cadastrar novo colaborador"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>+ Cadastrar Novo Funcionário</span>
            </button>

            <button
              id="btn-ver-equipe-modal"
              type="button"
              onClick={() => {
                closeEmployeeModal();
                navigateToEquipe();
              }}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-300 hover:text-white border border-indigo-500/30 font-semibold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Ver painel completo de gestão da equipe e permissões"
            >
              <span className="material-symbols-outlined text-[16px]">groups</span>
              <span>Ver Equipe & Escalas</span>
            </button>
          </div>

          <button
            type="button"
            onClick={closeEmployeeModal}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition-colors cursor-pointer ml-auto"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
