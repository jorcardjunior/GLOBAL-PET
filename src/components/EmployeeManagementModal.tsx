import React from 'react';
import { useApp } from '../context/AppContext';
import { EquipeScreen } from './EquipeScreen';

export const EmployeeManagementModal: React.FC = () => {
  const { isEmployeeManagementOpen, closeEmployeeManagement } = useApp();

  if (!isEmployeeManagementOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f1017] border border-white/15 rounded-3xl w-full max-w-5xl h-[92vh] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col">
        {/* Top bar with close */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">badge</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Módulo Administrativo de Recursos Humanos
              </h2>
              <p className="text-xs text-white/50">
                Cadastro de Funcionários, Categorias e Atribuição de Acessos
              </p>
            </div>
          </div>
          <button
            id="btn-close-employee-mgmt-modal"
            type="button"
            onClick={closeEmployeeManagement}
            aria-label="Fechar"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Content with EquipeScreen */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <EquipeScreen />
        </div>
      </div>
    </div>
  );
};
