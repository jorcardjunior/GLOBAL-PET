import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EmployeeUser } from '../types';

interface SupervisorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actionTitle?: string;
  actionDescription: string;
  requiredRole?: 'gerente' | 'dono' | 'admin';
  onAuthorized: (supervisor: EmployeeUser) => void;
}

export const SupervisorAuthModal: React.FC<SupervisorAuthModalProps> = ({
  isOpen,
  onClose,
  title,
  actionTitle,
  actionDescription,
  requiredRole = 'gerente',
  onAuthorized
}) => {
  const displayTitle = title || actionTitle || 'Autorização de Supervisor';
  const { verifySupervisorPin } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin || isLoading) {
      if (!pin) setError('Por favor, informe o PIN de autorização.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-supervisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, requiredRole })
      });
      const data = await res.json();

      if (data.success && data.supervisor) {
        onAuthorized(data.supervisor);
        setPin('');
        setError('');
        onClose();
        return;
      } else if (res.status === 429) {
        setError(data.message || 'Muitas tentativas. Aguarde alguns minutos.');
        setPin('');
        return;
      }
    } catch {
      // Fallback para validação local em caso de instabilidade na rede
      const localRes = verifySupervisorPin(pin, requiredRole);
      if (localRes.success && localRes.supervisor) {
        onAuthorized(localRes.supervisor);
        setPin('');
        setError('');
        onClose();
        return;
      } else {
        setError(localRes.message);
        setPin('');
        return;
      }
    } finally {
      setIsLoading(false);
    }

    // Caso o endpoint retorne insucesso
    const fallbackRes = verifySupervisorPin(pin, requiredRole);
    setError(fallbackRes.message || 'PIN incorreto ou não autorizado.');
    setPin('');
  };

  const handleKeyClick = (digit: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + digit);
      setError('');
    }
  };

  const handleDeleteDigit = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-[#0a0a14] border border-indigo-500/30 text-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-b from-indigo-950/40 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <span className="material-symbols-outlined text-[22px]">shield_lock</span>
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-white leading-tight">{displayTitle}</h3>
              <p className="text-[11px] text-white/50">Alçada Hierárquica de Segurança</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4">
          {/* Action context box */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Ação Requer Autorização
            </span>
            <p className="text-xs text-white/80 leading-relaxed">
              {actionDescription}
            </p>
            <div className="flex items-center gap-1.5 mt-1 pt-1.5 border-t border-white/5 text-[11px] text-white/50">
              <span className="material-symbols-outlined text-[14px] text-indigo-400">admin_panel_settings</span>
              <span>
                {requiredRole === 'admin'
                  ? 'Exclusivo Admin (9999)'
                  : requiredRole === 'dono'
                  ? 'Exige Dono (1234) ou Admin (9999)'
                  : 'Gerente (2222), Dono (1234) ou Admin (9999)'}
              </span>
            </div>
          </div>

          {/* PIN display field */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={e => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="••••"
                className="w-full h-12 rounded-2xl bg-black/50 border border-white/20 text-center tracking-[0.4em] text-xl font-mono text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-xs text-rose-400 text-center font-medium bg-rose-500/10 border border-rose-500/20 py-1.5 px-2 rounded-xl">
                {error}
              </p>
            )}

            {/* Quick Virtual Keypad */}
            <div className="grid grid-cols-3 gap-1.5 mt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyClick(num)}
                  className="h-11 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-white font-bold text-base transition-all border border-white/5"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin('')}
                className="h-11 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-white/60 font-semibold text-xs transition-all border border-white/5"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={() => handleKeyClick('0')}
                className="h-11 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-white font-bold text-base transition-all border border-white/5"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDeleteDigit}
                className="h-11 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-white/60 flex items-center justify-center transition-all border border-white/5"
              >
                <span className="material-symbols-outlined text-[20px]">backspace</span>
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-semibold text-xs transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                Validar PIN
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
