import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AjustesModal: React.FC = () => {
  const {
    isAjustesModalOpen,
    closeAjustesModal,
    storeSettings,
    updateStoreSettings,
    currentUser,
    openEmployeeModal,
    resetDemoData,
    showToast
  } = useApp();

  // Local state for edits
  const [formData, setFormData] = useState(storeSettings);
  const [activeTabSection, setActiveTabSection] = useState<'operacional' | 'gerencial' | 'mestre'>('operacional');
  const [ownerPinInput, setOwnerPinInput] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  if (!isAjustesModalOpen) return null;

  const isDono = currentUser.role === 'dono';
  const isGerenteOuDono = currentUser.role === 'gerente' || currentUser.role === 'dono';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(formData);
    closeAjustesModal();
  };

  const handleQuickWeightToggle = (weight: number) => {
    const exists = formData.quickWeights.includes(weight);
    let updatedWeights: number[];
    if (exists) {
      if (formData.quickWeights.length === 1) {
        showToast('Mantenha ao menos 1 atalho de peso!', 'warning');
        return;
      }
      updatedWeights = formData.quickWeights.filter(w => w !== weight);
    } else {
      updatedWeights = [...formData.quickWeights, weight].sort((a, b) => a - b);
    }
    setFormData({ ...formData, quickWeights: updatedWeights });
  };

  const handleResetData = () => {
    if (!isDono) {
      showToast('Apenas o Dono pode restaurar o banco de dados!', 'lock');
      return;
    }
    if (ownerPinInput !== '1234') {
      showToast('PIN do Dono incorreto (digite 1234)!', 'error');
      return;
    }
    resetDemoData();
    setIsResetConfirmOpen(false);
    closeAjustesModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0e0f17] border border-white/15 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.85)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">tune</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Ajustes & Parâmetros do Sistema
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-white/50">Operador atual:</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${currentUser.badgeColor}`}>
                  {currentUser.name} ({currentUser.roleLabel})
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAjustesModal}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Hierarchy Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-black/30 px-6 pt-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTabSection('operacional')}
            className={`pb-3 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTabSection === 'operacional'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            1. Terminal & PDV (Livre)
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('gerencial')}
            className={`pb-3 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTabSection === 'gerencial'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isGerenteOuDono ? 'bg-indigo-400' : 'bg-white/30'}`} />
            2. Loja & Fiado {!isGerenteOuDono && '🔒'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('mestre')}
            className={`pb-3 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTabSection === 'mestre'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isDono ? 'bg-amber-400' : 'bg-white/30'}`} />
            3. Empresa & Mestre {!isDono && '🔒'}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* SECTION 1: OPERACIONAL (LIVRE PARA TODOS) */}
          {activeTabSection === 'operacional' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-400">lock_open</span>
                  <strong>Acesso Livre:</strong> Todos os atendentes e operadores podem personalizar estes ajustes do terminal.
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Nível 1</span>
              </div>

              {/* Quick Weights on Granel Scale */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2">
                  Atalhos Rápidos de Peso da Balança (PDV & Granel)
                </label>
                <p className="text-[11px] text-white/50 mb-3">
                  Clique para ativar ou desativar os botões de pesagem rápida exibidos na tela de granel:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[0.5, 1, 2, 2.5, 5, 10, 15, 20].map(w => {
                    const active = formData.quickWeights.includes(w);
                    return (
                      <button
                        type="button"
                        key={w}
                        onClick={() => handleQuickWeightToggle(w)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          active
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm'
                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                        }`}
                      >
                        {w} kg {active ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Auto Print Receipt Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <h4 className="text-xs font-bold text-white">Impressão Automática de Cupom</h4>
                  <p className="text-[11px] text-white/50">Abrir visualização do cupom fiscal 80mm ao finalizar venda no PDV</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoPrintReceipt}
                    onChange={e => setFormData({ ...formData, autoPrintReceipt: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              {/* Sound Alerts Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <h4 className="text-xs font-bold text-white">Sons & Beeps de Leitor de Código de Barras</h4>
                  <p className="text-[11px] text-white/50">Emitir sinal sonoro simulado ao registrar produtos e pesagens</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.soundAlerts}
                    onChange={e => setFormData({ ...formData, soundAlerts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              {/* WhatsApp template */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Mensagem Padrão de Aviso WhatsApp (Pet Care)
                </label>
                <textarea
                  rows={2}
                  value={formData.whatsappMessageTemplate}
                  onChange={e => setFormData({ ...formData, whatsappMessageTemplate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                />
                <span className="text-[10px] text-white/40">Dica: Utilize a tag {'{petName}'} que será substituída pelo nome do pet.</span>
              </div>
            </div>
          )}

          {/* SECTION 2: GERENCIAL (REQUER GERENTE OU DONO) */}
          {activeTabSection === 'gerencial' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {!isGerenteOuDono ? (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-rose-300">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                    Acesso Restrito: Nível Gerente Requerido
                  </div>
                  <p className="leading-relaxed text-white/70">
                    Você está conectado como <strong>{currentUser.name} ({currentUser.roleLabel})</strong>. Operadores comuns não têm permissão para modificar os limites de fiado e alertas de estoque da loja.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      closeAjustesModal();
                      openEmployeeModal();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">switch_account</span>
                    Trocar para Gerente ou Dono
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-indigo-400">verified_user</span>
                    <strong>Autorizado:</strong> Parâmetros operacionais liberados para {currentUser.roleLabel}.
                  </span>
                  <span className="text-[10px] uppercase font-bold text-indigo-400">Nível 2</span>
                </div>
              )}

              <fieldset disabled={!isGerenteOuDono} className={!isGerenteOuDono ? 'opacity-40 pointer-events-none' : 'space-y-4'}>
                {/* Default Credit Limit */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Limite Padrão do Caderninho de Fiado (R$)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-white/40">R$</span>
                    <input
                      type="number"
                      step="10"
                      value={formData.defaultCreditLimit}
                      onChange={e => setFormData({ ...formData, defaultCreditLimit: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                  <span className="text-[10px] text-white/40">
                    Limite concedido automaticamente a novos clientes cadastrados no balcão.
                  </span>
                </div>

                {/* Min Stock Alert Days */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Estoque Mínimo de Alerta de Sacaria (Unidades)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.minStockAlertDays}
                    onChange={e => setFormData({ ...formData, minStockAlertDays: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-400"
                  />
                  <span className="text-[10px] text-white/40">
                    Gera notificação prioritária no sino de avisos quando o estoque atingir este valor.
                  </span>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Telefone / WhatsApp de Atendimento da Loja
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </fieldset>
            </div>
          )}

          {/* SECTION 3: MESTRE (APENAS DONO) */}
          {activeTabSection === 'mestre' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {!isDono ? (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                    Acesso Exclusivo do Dono / Proprietário
                  </div>
                  <p className="leading-relaxed text-white/70">
                    Estas são as configurações fundamentais da empresa (CNPJ, Razão Social, Chave PIX e Auditoria de Base). O Gerente e os Operadores não têm acesso para evitar alterações não autorizadas.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      closeAjustesModal();
                      openEmployeeModal();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">key</span>
                    Entrar como Carlos Eduardo (Dono)
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-amber-400">shield</span>
                    <strong>Acesso Total Master:</strong> Carlos Eduardo (Dono) autenticado.
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-400">Nível 3 (Master)</span>
                </div>
              )}

              <fieldset disabled={!isDono} className={!isDono ? 'opacity-40 pointer-events-none' : 'space-y-4'}>
                {/* Store Trade Name & Legal Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Nome Fantasia
                    </label>
                    <input
                      type="text"
                      value={formData.storeName}
                      onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Razão Social
                    </label>
                    <input
                      type="text"
                      value={formData.tradeName}
                      onChange={e => setFormData({ ...formData, tradeName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* CNPJ & PIX */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      CNPJ da Empresa
                    </label>
                    <input
                      type="text"
                      value={formData.cnpj}
                      onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Chave PIX da Empresa
                    </label>
                    <input
                      type="text"
                      value={formData.pixKey}
                      onChange={e => setFormData({ ...formData, pixKey: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Default Markup */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Markup Médio de Venda da Loja (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.defaultMarkupPercent}
                      onChange={e => setFormData({ ...formData, defaultMarkupPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full pr-8 pl-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-white/40">%</span>
                  </div>
                  <span className="text-[10px] text-white/40">
                    Utilizado para projeções contábeis e estimativa do DRE gerencial.
                  </span>
                </div>

                {/* Critical Reset Button */}
                <div className="pt-4 border-t border-white/10">
                  <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-rose-300">Restaurar Banco de Demonstração</h4>
                      <p className="text-[11px] text-white/50">Recarrega produtos, clientes e pedidos iniciais da loja.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsResetConfirmOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                      Restaurar
                    </button>
                  </div>
                </div>
              </fieldset>

              {/* Reset Confirmation Dialog */}
              {isResetConfirmOpen && (
                <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 space-y-3 animate-in fade-in duration-150">
                  <h4 className="text-sm font-bold text-rose-200">
                    Confirmação de Segurança do Dono
                  </h4>
                  <p className="text-xs text-white/70">
                    Digite o PIN de 4 dígitos do Dono (<strong>1234</strong>) para redefinir a base:
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      maxLength={4}
                      value={ownerPinInput}
                      onChange={e => setOwnerPinInput(e.target.value)}
                      placeholder="PIN do Dono"
                      className="w-32 h-9 px-3 rounded-xl bg-black/50 border border-white/20 text-center font-mono text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleResetData}
                      className="h-9 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
                    >
                      Confirmar Restauração
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsResetConfirmOpen(false)}
                      className="h-9 px-3 rounded-xl bg-white/10 text-white/70 text-xs"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Footer inside Form */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={closeAjustesModal}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px]">save</span>
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
