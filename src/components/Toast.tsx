import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  if (!toast.visible) return null;

  return (
    <aside
      aria-label="Notificação do Sistema"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 z-50 flex items-center justify-center pointer-events-none md:pl-[68px]"
    >
      <div className="bg-[#0e0f1d]/90 backdrop-blur-md border border-white/20 text-white px-4 py-3 rounded-2xl shadow-2xl shadow-indigo-500/15 flex items-center gap-3 max-w-md pointer-events-auto transition-all animate-bounce-short">
        <span className="material-symbols-outlined text-emerald-400 text-[22px] flex-shrink-0">
          {toast.icon || 'check_circle'}
        </span>
        <span className="text-[13px] font-medium leading-tight text-white/90">{toast.message}</span>
        <button
          onClick={hideToast}
          className="ml-auto w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
          aria-label="Fechar notificação"
          title="Fechar aviso (X)"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </aside>
  );
};
