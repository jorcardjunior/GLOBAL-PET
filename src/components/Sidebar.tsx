import React from 'react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, clients, currentUser, openAjustesModal, pendingOnlineOrdersCount } = useApp();

  const fiadoCount = (clients || []).filter(c => c && c.debtBalance > 0).length;

  const navItems: { id: TabType; label: string; icon: string; badge?: number; isRestricted?: boolean }[] = [
    { id: 'pdv', label: 'PDV', icon: 'point_of_sale' },
    { id: 'granel', label: 'Granel', icon: 'scale' },
    { id: 'petcare', label: 'Pet Care', icon: 'pets' },
    { id: 'bot', label: 'Robô IA', icon: 'smart_toy', badge: pendingOnlineOrdersCount },
    { id: 'clientes', label: 'Clientes', icon: 'group', badge: fiadoCount },
    { id: 'fornecedores', label: 'Fornec.', icon: 'local_shipping' },
    { id: 'entradas', label: 'Entradas', icon: 'inventory_2' },
    { id: 'gestao', label: 'Gestão', icon: 'bar_chart', isRestricted: !currentUser?.canAccessFinance }
  ];

  return (
    <>
      {/* DESKTOP / TABLET LEFT SIDEBAR RAIL (w-[68px]) */}
      <aside
        aria-label="Navegação Lateral Principal"
        className="hidden md:flex fixed left-0 top-16 bottom-0 w-[68px] z-40 bg-[#050508]/60 backdrop-blur-xl border-r border-white/10 flex-col items-center justify-between py-3 select-none shadow-[4px_0_24px_rgba(0,0,0,0.3)]"
      >
        <nav className="flex flex-col items-center gap-2 w-full px-1.5">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`btn-nav-desktop-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all relative group cursor-pointer ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold shadow-sm border-l-[3px] border-[#818cf8]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                title={item.isRestricted ? `${item.label} (Acesso Restrito - Requer Gerente/Dono)` : item.label}
              >
                <div
                  className={`w-9 h-7 rounded-lg flex items-center justify-center transition-colors relative ${
                    isActive ? 'text-indigo-400' : 'group-hover:text-white'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  {item.isRestricted && (
                    <span className="absolute -top-1 -right-1 text-[11px] text-amber-400 bg-black/80 rounded-full px-0.5" title="Acesso Restrito">
                      🔒
                    </span>
                  )}
                </div>
                <span className={`text-[10px] leading-tight text-center truncate max-w-[60px] mt-0.5 ${isActive ? 'text-white font-bold' : ''}`}>
                  {item.label}
                </span>

                {/* Optional notification badge for fiado/alerts */}
                {item.badge && item.badge > 0 && (
                  <span className="absolute right-2 top-2 w-2 h-2 rounded-full bg-red-400 shadow-[0_0_6px_#f87171] ring-1 ring-[#050508]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Utility / Settings */}
        <div className="flex flex-col items-center w-full px-1.5 pt-2 border-t border-white/10">
          <button
            type="button"
            id="btn-ajustes-sistema-sidebar"
            aria-label="Configurações e Ajustes do Sistema"
            onClick={openAjustesModal}
            className="w-full flex flex-col items-center justify-center py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors active:scale-95 cursor-pointer group"
            title="Ajustes do Sistema (Hierarquia de Permissões)"
          >
            <div className="w-9 h-7 rounded-lg flex items-center justify-center text-indigo-400 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">tune</span>
            </div>
            <span className="text-[10px] leading-tight text-center truncate max-w-[60px]">Ajustes</span>
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR (Fully Responsive with Touch Targets >= 44px) */}
      <nav
        aria-label="Navegação Inferior Mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe bg-[#050508]/85 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.5)] select-none"
      >
        <div className="flex items-center justify-between h-16 px-1 overflow-x-auto no-scrollbar">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`btn-nav-mobile-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 min-w-[48px] max-w-[64px] h-13 gap-0.5 transition-all relative shrink-0 cursor-pointer active:scale-95 ${
                  isActive ? 'text-white font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-7 rounded-full transition-colors relative ${
                    isActive ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : ''
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  {item.isRestricted && (
                    <span className="absolute -top-1 -right-1 text-[10px]">🔒</span>
                  )}
                </div>
                <span className={`text-[10px] leading-tight text-center truncate w-full px-0.5 ${isActive ? 'text-indigo-300 font-semibold' : ''}`}>
                  {item.label}
                </span>

                {item.badge && item.badge > 0 && (
                  <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-400 shadow-[0_0_6px_#f87171] ring-1 ring-[#050508]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
