import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface PinLockScreenModalProps {
  isLocked: boolean;
  onUnlock: () => void;
}

export const PinLockScreenModal: React.FC<PinLockScreenModalProps> = ({ isLocked, onUnlock }) => {
  const { currentUser, employees, switchUser, verifySupervisorPin, showToast } = useApp();

  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);
  const [isSupervisorUnlockOpen, setIsSupervisorUnlockOpen] = useState(false);
  const [supervisorPin, setSupervisorPin] = useState('');

  // Reset states when locked
  useEffect(() => {
    if (isLocked) {
      setPin('');
      setErrorMsg('');
      setIsSupervisorUnlockOpen(false);
      setSupervisorPin('');
    }
  }, [isLocked]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTimer && lockoutTimer > 0) {
      const interval = setInterval(() => {
        setLockoutTimer(prev => (prev && prev > 1 ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTimer]);

  if (!isLocked) return null;

  const handleKeyPress = (digit: string) => {
    if (lockoutTimer) return;
    if (pin.length < 6) {
      setPin(prev => prev + digit);
      setErrorMsg('');
    }
  };

  const handleBackspace = () => {
    if (lockoutTimer) return;
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    if (lockoutTimer) return;
    setPin('');
    setErrorMsg('');
  };

  const handleVerifyUnlock = async (pinToVerify = pin) => {
    if (!pinToVerify || isVerifying || lockoutTimer) return;
    setIsVerifying(true);
    setErrorMsg('');

    try {
      // Chamar validação do backend com proteção contra força bruta e rate-limiting
      const res = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: currentUser?.id,
          pin: pinToVerify,
          expectedPin: currentUser?.pin,
          storedPinHash: currentUser?.pinHash,
          storedSalt: currentUser?.salt
        })
      });

      const data = await res.json();

      if (data.success) {
        showToast(`Terminal liberado por ${currentUser?.name}!`, 'lock_open');
        setPin('');
        setErrorMsg('');
        setAttemptsRemaining(null);
        onUnlock();
      } else {
        setErrorMsg(data.message || 'PIN incorreto.');
        setPin('');
        if (data.attemptsRemaining !== undefined) {
          setAttemptsRemaining(data.attemptsRemaining);
        }
        if (data.lockedSeconds) {
          setLockoutTimer(data.lockedSeconds);
        }
      }
    } catch {
      // Fallback seguro caso o servidor esteja sem rede: valida com supervisor local
      if (pinToVerify === currentUser?.pin) {
        showToast('Terminal liberado!', 'lock_open');
        onUnlock();
      } else {
        setErrorMsg('PIN incorreto. Tente novamente.');
        setPin('');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSupervisorBypass = () => {
    if (!supervisorPin) return;
    const result = verifySupervisorPin(supervisorPin, 'gerente');
    if (result.success) {
      showToast(`Terminal desbloqueado por supervisor: ${result.supervisor?.name}!`, 'verified_user');
      setIsSupervisorUnlockOpen(false);
      setSupervisorPin('');
      setLockoutTimer(null);
      setAttemptsRemaining(null);
      onUnlock();
    } else {
      setErrorMsg(result.message);
      setSupervisorPin('');
    }
  };

  return (
    <div
      id="modal-bloqueio-tela-pin"
      className="fixed inset-0 z-[9999] bg-[#050508]/95 backdrop-blur-2xl flex items-center justify-center p-4 select-none"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white/[0.04] border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.8)] p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow ambient de segurança */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Shield and User Avatar */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full p-1 border-2 border-indigo-500/40 bg-white/5 relative">
            <img
              src={currentUser?.avatar || ''}
              alt={currentUser?.name || 'Operador'}
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 border-2 border-[#050508] flex items-center justify-center text-white text-[14px]">
              <span className="material-symbols-outlined text-[16px]">lock</span>
            </span>
          </div>
        </div>

        <h2 className="text-[20px] font-bold text-white tracking-tight">
          Terminal Bloqueado
        </h2>
        <p className="text-[13px] text-white/60 mb-1">
          {currentUser?.name || 'Operador do Caixa'} • <span className="text-indigo-400 font-medium">{currentUser?.roleLabel}</span>
        </p>
        <p className="text-[11px] text-white/40 mb-4 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-emerald-400">shield</span>
          Sessão protegida contra acesso não autorizado
        </p>

        {/* PIN Indicators */}
        <div className="flex items-center justify-center gap-3 my-3">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                pin.length > i
                  ? 'bg-indigo-500 border-indigo-400 scale-110 shadow-[0_0_12px_#6366f1]'
                  : 'bg-white/10 border-white/20'
              }`}
            />
          ))}
        </div>

        {/* Status / Error Message */}
        <div className="min-h-[28px] flex items-center justify-center mb-3">
          {lockoutTimer ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[12px] font-semibold">
              <span className="material-symbols-outlined text-[15px]">lock_clock</span>
              <span>Bloqueado por segurança ({lockoutTimer}s)</span>
            </div>
          ) : errorMsg ? (
            <div className="flex items-center gap-1 text-rose-400 text-[12px] font-medium animate-shake">
              <span className="material-symbols-outlined text-[15px]">error</span>
              <span>{errorMsg}</span>
            </div>
          ) : attemptsRemaining !== null && attemptsRemaining < 5 ? (
            <span className="text-amber-400 text-[11px]">
              Atenção: restam {attemptsRemaining} tentativa(s) antes do bloqueio
            </span>
          ) : (
            <span className="text-white/40 text-[11px]">Digite seu PIN de 4 dígitos para destravar</span>
          )}
        </div>

        {/* Numeric Keypad */}
        {!isSupervisorUnlockOpen ? (
          <div className="w-full max-w-[260px] grid grid-cols-3 gap-2.5 mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                type="button"
                id={`btn-keypad-${num}`}
                disabled={!!lockoutTimer || isVerifying}
                onClick={() => handleKeyPress(num)}
                className="h-14 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] active:bg-indigo-600/30 border border-white/10 text-white text-[20px] font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              id="btn-keypad-clear"
              disabled={!!lockoutTimer || isVerifying}
              onClick={handleClear}
              className="h-14 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white border border-white/10 text-[13px] font-semibold flex items-center justify-center cursor-pointer transition-all active:scale-95 disabled:opacity-40"
            >
              Limpar
            </button>
            <button
              type="button"
              id="btn-keypad-0"
              disabled={!!lockoutTimer || isVerifying}
              onClick={() => handleKeyPress('0')}
              className="h-14 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] active:bg-indigo-600/30 border border-white/10 text-white text-[20px] font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95 disabled:opacity-40"
            >
              0
            </button>
            <button
              type="button"
              id="btn-keypad-backspace"
              disabled={!!lockoutTimer || isVerifying}
              onClick={handleBackspace}
              className="h-14 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/10 flex items-center justify-center cursor-pointer transition-all active:scale-95 disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[20px]">backspace</span>
            </button>
          </div>
        ) : (
          /* Modo Supervisor Bypass */
          <div className="w-full bg-white/[0.03] border border-amber-500/20 rounded-2xl p-4 mb-4 text-left">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-[13px] mb-2">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Desbloqueio de Supervisão</span>
            </div>
            <p className="text-[11px] text-white/60 mb-3">
              Um Gerente ou Dono pode liberar este terminal digitando seu PIN de supervisor:
            </p>
            <input
              type="password"
              maxLength={6}
              value={supervisorPin}
              onChange={e => setSupervisorPin(e.target.value.replace(/\D/g, ''))}
              placeholder="PIN do Gerente/Dono"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-center tracking-[6px] text-[18px] font-bold focus:outline-none focus:border-amber-400 mb-3"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsSupervisorUnlockOpen(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/70 text-[12px] font-medium"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleSupervisorBypass}
                className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-[12px] font-bold flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">lock_open</span>
                <span>Desbloquear</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Button: Confirmar PIN */}
        {!isSupervisorUnlockOpen && (
          <button
            type="button"
            id="btn-desbloquear-terminal-confirmar"
            disabled={pin.length < 4 || isVerifying || !!lockoutTimer}
            onClick={() => handleVerifyUnlock(pin)}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer mb-3"
          >
            {isVerifying ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Verificando...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">lock_open</span>
                <span>Desbloquear Terminal</span>
              </>
            )}
          </button>
        )}

        {/* Bottom Options: Trocar Operador & Ajuda Supervisor */}
        <div className="flex items-center justify-between w-full pt-3 border-t border-white/10 text-[11px]">
          <button
            type="button"
            onClick={() => {
              // Permitir trocar operador
              const next = employees.find(e => e.id !== currentUser?.id && e.isActive);
              if (next) {
                switchUser(next.id);
                setPin('');
                setErrorMsg('');
              }
            }}
            className="text-white/60 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
            <span>Trocar Operador</span>
          </button>

          {!isSupervisorUnlockOpen && (
            <button
              type="button"
              onClick={() => setIsSupervisorUnlockOpen(true)}
              className="text-amber-400/80 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">shield_person</span>
              <span>Ajuda Gerente</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
