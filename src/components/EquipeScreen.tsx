import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EmployeeUser, UserRole } from '../types';
import { ROLE_CONFIGS } from '../data';

export const EquipeScreen: React.FC = () => {
  const {
    employees,
    currentUser,
    deleteEmployee,
    toggleEmployeeStatus,
    switchUser,
    showToast,
    openEmployeeForm
  } = useApp();

  // Estados de busca e filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativos' | 'inativos'>('todos');

  // Controle de exclusão
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeUser | null>(null);

  // Filtragem dos colaboradores
  const filteredEmployees = useMemo(() => {
    const list = Array.isArray(employees) ? employees : [];
    return list.filter(emp => {
      if (!emp) return false;
      // Busca textual
      const q = searchQuery.toLowerCase().trim();
      const name = (emp.name || '').toLowerCase();
      const roleLabel = (emp.roleLabel || '').toLowerCase();
      const email = (emp.email || '').toLowerCase();
      const phone = emp.phone || '';
      const cpf = emp.cpf || '';

      const matchesSearch =
        !q ||
        name.includes(q) ||
        roleLabel.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        cpf.includes(q);

      // Filtro de cargo
      const matchesRole =
        selectedRoleFilter === 'todos' || emp.role === selectedRoleFilter;

      // Filtro de status
      const matchesStatus =
        statusFilter === 'todos' ||
        (statusFilter === 'ativos' && emp.isActive !== false) ||
        (statusFilter === 'inativos' && emp.isActive === false);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [employees, searchQuery, selectedRoleFilter, statusFilter]);

  // Estatísticas da Equipe
  const safeList = Array.isArray(employees) ? employees : [];
  const totalEmployees = safeList.length;
  const activeEmployees = safeList.filter(e => e && e.isActive !== false).length;
  const remoteAllowedCount = safeList.filter(e => e && e.allowRemoteAccess).length;
  const supervisorsCount = safeList.filter(e => e && ['dono', 'gerente', 'admin'].includes(e.role)).length;

  const handleOpenNewEmployee = () => {
    openEmployeeForm(null);
  };

  const handleOpenEdit = (emp: EmployeeUser) => {
    openEmployeeForm(emp);
  };

  const confirmDelete = () => {
    if (!employeeToDelete) return;
    const res = deleteEmployee(employeeToDelete.id);
    if (res.success) {
      setEmployeeToDelete(null);
    } else {
      showToast(res.message, 'warning');
    }
  };

  const daysLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner & Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-transparent p-5 sm:p-6 rounded-3xl border border-indigo-500/20 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <span className="material-symbols-outlined text-[24px]">group</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Gestão da Equipe & Funcionários
              </h1>
              <p className="text-xs text-white/60">
                Cadastro CLT, controle de cargos, limites de desconto, escalas e permissões
              </p>
            </div>
          </div>
        </div>

        <button
          id="btn-add-new-employee"
          type="button"
          onClick={handleOpenNewEmployee}
          className="h-11 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/25 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-indigo-400/30 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          <span>Cadastrar Novo Funcionário</span>
        </button>
      </div>

      {/* KPI Cards Resumo da Equipe */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block">
              Total na Folha
            </span>
            <span className="text-2xl font-bold text-white font-mono mt-0.5 block">
              {totalEmployees}
            </span>
            <span className="text-[11px] text-emerald-400">
              {activeEmployees} ativos na loja
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">badge</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block">
              Supervisores
            </span>
            <span className="text-2xl font-bold text-amber-400 font-mono mt-0.5 block">
              {supervisorsCount}
            </span>
            <span className="text-[11px] text-white/40">
              Dono / Gerentes / TI
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">shield_person</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block">
              Acesso Remoto
            </span>
            <span className="text-2xl font-bold text-sky-400 font-mono mt-0.5 block">
              {remoteAllowedCount}
            </span>
            <span className="text-[11px] text-white/40">
              Login fora da loja 24h
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">cell_tower</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block">
              Operador em Sessão
            </span>
            <span className="text-base font-bold text-white truncate max-w-[120px] block mt-0.5">
              {currentUser?.name ? currentUser.name.split(' ')[0] : 'Operador'}
            </span>
            <span className="text-[11px] text-indigo-300">
              {currentUser?.roleLabel ? currentUser.roleLabel.split(' / ')[0] : 'Colaborador'}
            </span>
          </div>
          <img
            src={currentUser?.avatar || ''}
            alt={currentUser?.name || 'Operador'}
            className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/50"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Input de Busca */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nome, cargo, CPF ou tel..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 focus:border-indigo-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filtros Rápidos */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Categorias */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedRoleFilter('todos')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedRoleFilter === 'todos'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setSelectedRoleFilter('operador')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedRoleFilter === 'operador'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Caixa
            </button>
            <button
              type="button"
              onClick={() => setSelectedRoleFilter('vendedor')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedRoleFilter === 'vendedor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Balcão & Ração
            </button>
            <button
              type="button"
              onClick={() => setSelectedRoleFilter('tosador')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedRoleFilter === 'tosador'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Estética & Banho
            </button>
            <button
              type="button"
              onClick={() => setSelectedRoleFilter('veterinario')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedRoleFilter === 'veterinario'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Veterinária
            </button>
            <button
              type="button"
              onClick={() => setSelectedRoleFilter('gerente')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedRoleFilter === 'gerente'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Gerência
            </button>
          </div>

          {/* Status Ativo/Inativo */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="todos" className="bg-[#0f1017]">Status: Todos</option>
            <option value="ativos" className="bg-[#0f1017]">Apenas Ativos</option>
            <option value="inativos" className="bg-[#0f1017]">Apenas Inativos</option>
          </select>
        </div>
      </div>

      {/* Grid de Colaboradores */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEmployees.map(emp => {
          const isCurrentActive = emp.id === currentUser.id;
          const isSupervisor = ['dono', 'gerente', 'admin'].includes(emp.role);
          const workDaysFormatted = (emp.workShift?.workDays || [1, 2, 3, 4, 5, 6])
            .map(d => daysLabels[d])
            .join(', ');

          return (
            <div
              key={emp.id}
              className={`rounded-3xl border p-5 flex flex-col justify-between transition-all relative overflow-hidden backdrop-blur-md ${
                isCurrentActive
                  ? 'bg-gradient-to-br from-indigo-950/40 via-white/[0.03] to-transparent border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                  : emp.isActive === false
                  ? 'bg-white/[0.01] border-white/5 opacity-60'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
              }`}
            >
              {/* Header do Card */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/10"
                      referrerPolicy="no-referrer"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0f1017] flex items-center justify-center ${
                        emp.isActive !== false ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      title={emp.isActive !== false ? 'Colaborador Ativo' : 'Colaborador Inativo'}
                    >
                      <span className="material-symbols-outlined text-[10px] text-white">
                        {emp.isActive !== false ? 'check' : 'close'}
                      </span>
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-white">{emp.name}</h3>
                      {isCurrentActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Sessão Ativa
                        </span>
                      )}
                    </div>
                    <span
                      className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${emp.badgeColor}`}
                    >
                      {emp.roleLabel}
                    </span>
                  </div>
                </div>

                {/* Menu de Ações Rápidas */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(emp)}
                    className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Editar dados e permissões do colaborador"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmployeeToDelete(emp)}
                    disabled={isCurrentActive}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      isCurrentActive
                        ? 'opacity-30 cursor-not-allowed text-white/30'
                        : 'bg-white/5 hover:bg-rose-500/20 text-white/70 hover:text-rose-400 cursor-pointer'
                    }`}
                    title={isCurrentActive ? 'Não é possível excluir o usuário ativo' : 'Excluir colaborador'}
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              {/* Informações Operacionais */}
              <div className="space-y-2 py-3 border-y border-white/5 text-xs">
                <div className="flex items-center justify-between text-white/60">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-indigo-400">schedule</span>
                    Expediente:
                  </span>
                  <span className="font-mono text-white font-medium">
                    {emp.workShift?.startTime || '08:00'} - {emp.workShift?.endTime || '18:00'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-white/60">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-indigo-400">calendar_month</span>
                    Escala:
                  </span>
                  <span className="text-white/80 font-medium text-right truncate max-w-[160px]">
                    {workDaysFormatted}
                  </span>
                </div>

                <div className="flex items-center justify-between text-white/60">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-400">percent</span>
                    Desc. Autônomo:
                  </span>
                  <span className="font-mono text-emerald-300 font-bold">
                    {emp.maxDiscountPercent !== undefined
                      ? emp.maxDiscountPercent === 100
                        ? 'Ilimitado (Dono)'
                        : `${emp.maxDiscountPercent}%`
                      : '5%'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-white/60">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-sky-400">cell_tower</span>
                    Acesso Remoto:
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                      emp.allowRemoteAccess
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {emp.allowRemoteAccess ? 'Permanente' : 'Apenas Loja Física'}
                  </span>
                </div>

                {/* Telefone / E-mail */}
                {(emp.phone || emp.email) && (
                  <div className="pt-1 flex items-center justify-between text-[11px] text-white/40">
                    <span className="truncate">{emp.phone || 'Sem telefone'}</span>
                    <span className="truncate max-w-[140px]">{emp.email || ''}</span>
                  </div>
                )}
              </div>

              {/* Badges de Privilégios & Ação Inferior */}
              <div className="pt-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {emp.canAccessFinance && (
                    <span
                      title="Acesso a Balanços e DRE Financeiro"
                      className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/25 text-amber-300 flex items-center justify-center text-[14px]"
                    >
                      <span className="material-symbols-outlined text-[16px]">account_balance</span>
                    </span>
                  )}
                  {emp.canCloseCashier && (
                    <span
                      title="Fechamento de Caixa e Sangrias"
                      className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 flex items-center justify-center text-[14px]"
                    >
                      <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                    </span>
                  )}
                  {emp.canCreateSupplierOrders && (
                    <span
                      title="Emissão de Pedidos de Atacado com Fábricas"
                      className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 flex items-center justify-center text-[14px]"
                    >
                      <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                    </span>
                  )}
                  {emp.canModifyMasterSettings && (
                    <span
                      title="Alteração de Dados Fiscais Mestres e CNPJ"
                      className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-300 flex items-center justify-center text-[14px]"
                    >
                      <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleEmployeeStatus(emp.id)}
                    disabled={isCurrentActive}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                      isCurrentActive
                        ? 'opacity-30 cursor-not-allowed border-white/10 text-white/30'
                        : emp.isActive !== false
                        ? 'bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 border-white/10'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {emp.isActive !== false ? 'Desativar' : 'Reativar'}
                  </button>

                  {!isCurrentActive && emp.isActive !== false && (
                    <button
                      type="button"
                      onClick={() => switchUser(emp.id, emp.pin)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">login</span>
                      <span>Assumir</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="p-12 text-center bg-white/[0.02] border border-white/10 rounded-3xl space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white/5 text-white/40 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[32px]">person_search</span>
          </div>
          <h3 className="text-base font-bold text-white">Nenhum colaborador encontrado</h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            Verifique os filtros selecionados ou digite um termo diferente para localizar os funcionários cadastrados.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedRoleFilter('todos');
              setStatusFilter('todos');
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Limpar Filtros
          </button>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {employeeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0f1017] border border-white/15 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">delete_forever</span>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Excluir Colaborador?</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Tem certeza de que deseja remover o cadastro de{' '}
                <strong className="text-white">{employeeToDelete.name}</strong> ({employeeToDelete.roleLabel})?
                Esta operação removerá o PIN e credenciais do terminal.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEmployeeToDelete(null)}
                className="flex-1 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-rose-600/25 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                <span>Excluir Definitivamente</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
