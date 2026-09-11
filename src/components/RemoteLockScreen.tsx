import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const RemoteLockScreen: React.FC = () => {
  const {
    currentUser,
    remoteAccessPolicy,
    setConnectionMode,
    openEmployeeModal,
    requestRemoteAccessWithPin,
    showToast
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const handleAuthorizeWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setPinError('Digite o PIN de 4 dígitos do Gerente ou Dono.');
      return;
    }

    setIsAuthorizing(true);
    const result = requestRemoteAccessWithPin(pinInput);
    setIsAuthorizing(false);

    if (result.success) {
      setPinInput('');
      setPinError('');
      showToast(result.message, 'verified');
    } else {
      setPinError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050508]/95 backdrop-blur-2xl flex items-center justify-center p-4 select-none overflow-y-auto">
      <div className="max-w-lg w-full bg-gradient-to-b from-[#12111c] to-[#0a0a10] border border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-500/10 space-y-6 text-center animate-fade-in my-auto">
        
        {/* Shield Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400 shadow-lg shadow-red-500/20">
          <span className="material-symbols-outlined text-[36px] sm:text-[44px]">shield_lock</span>
        </div>

        {/* Title and Badge */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span>Acesso Remoto Bloqueado</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Controle de Segurança & Hierarquia
          </h1>

          <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto">
            Por conformidade trabalhista, proteção patrimonial e prevenção a fraudes ou má fé, funcionários não possuem autorização para operar o sistema remotamente fora do expediente ou sem liberação da gerência.
          </p>
        </div>

        {/* Informações do Bloqueio Atual */}
        <div className="p-4 rounded-2xl bg-black/50 border border-white/5 text-left text-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-white/50">Usuário Conectado:</span>
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {currentUser.name} ({currentUser.roleLabel})
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-white/50">Origem da Conexão:</span>
            <span className="font-semibold text-rose-300">
              Rede Externa / Acesso Remoto (Fora da Loja)
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-white/50">Horário Comercial da Loja:</span>
            <span className="font-semibold text-white">
              {remoteAccessPolicy.businessHoursStart} às {remoteAccessPolicy.businessHoursEnd} (Seg a Sáb)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/50">Status da Trava do Dono:</span>
            <span className="font-bold text-red-400">
              {remoteAccessPolicy.emergencyLockdown ? '🚨 Trava de Emergência Ativa' : 'Exige Autorização Ativa'}
            </span>
          </div>
        </div>

        {/* Formulário de Liberação por PIN de Gerente/Dono */}
        <form onSubmit={handleAuthorizeWithPin} className="space-y-3 pt-1">
          <div className="text-xs text-white/80 font-medium">
            O Gerente ou Dono está com você ou autorizou por telefone?
          </div>

          <div className="flex items-center gap-2 max-w-xs mx-auto">
            <div className="relative flex-1">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="PIN Gerente (ex: 2024)"
                className="w-full h-11 bg-black/60 border border-white/10 rounded-xl px-3 text-center text-sm font-bold tracking-widest text-white placeholder:text-white/30 focus:border-indigo-400 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isAuthorizing || pinInput.length < 4}
              className="h-11 px-4 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">vpn_key</span>
              <span>Liberar</span>
            </button>
          </div>

          {pinError && (
            <p className="text-[11px] text-rose-400 font-semibold animate-shake">
              {pinError}
            </p>
          )}
        </form>

        {/* Ações de Troca de Usuário ou Simulação Local */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={openEmployeeModal}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-indigo-400">switch_account</span>
            <span>Entrar como Dono ou Gerente</span>
          </button>

          <button
            type="button"
            onClick={() => setConnectionMode('local')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2 transition-all cursor-pointer"
            title="Simular que o dispositivo está conectado ao Wi-Fi interno da loja"
          >
            <span className="material-symbols-outlined text-[16px]">wifi</span>
            <span>Simular Conexão na Loja</span>
          </button>
        </div>

        <p className="text-[10px] text-white/40">
          Tentativas não autorizadas de login remoto são gravadas no registro de auditoria com IP, data e modelo do aparelho.
        </p>
      </div>
    </div>
  );
};
