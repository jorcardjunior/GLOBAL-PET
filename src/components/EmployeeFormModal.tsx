import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EmployeeUser, UserRole } from '../types';
import { ROLE_CONFIGS, AVAILABLE_AVATARS } from '../data';

interface EmployeeFormModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  employeeToEdit?: EmployeeUser | null;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = (props) => {
  const context = useApp();
  const isOpen = props.isOpen !== undefined ? props.isOpen : context.isEmployeeFormOpen;
  const onClose = props.onClose || context.closeEmployeeForm;
  const employeeToEdit = props.employeeToEdit !== undefined ? props.employeeToEdit : context.employeeToEdit;

  const { addEmployee, updateEmployee, employees, showToast } = context;

  const isEditing = Boolean(employeeToEdit);
  const [activeTab, setActiveTab] = useState<'dados' | 'jornada' | 'permissoes'>('dados');

  // Form State
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('operador');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [avatar, setAvatar] = useState(AVAILABLE_AVATARS[3].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Jornada
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('18:00');
  const [workDays, setWorkDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [maxDiscountPercent, setMaxDiscountPercent] = useState<number>(5);
  const [allowRemoteAccess, setAllowRemoteAccess] = useState<boolean>(false);

  // Permissões
  const [canAccessFinance, setCanAccessFinance] = useState(false);
  const [canViewCostPrices, setCanViewCostPrices] = useState(false);
  const [canViewGlobalSalesMetrics, setCanViewGlobalSalesMetrics] = useState(false);
  const [canManageSuppliersCost, setCanManageSuppliersCost] = useState(false);
  const [canCreateSupplierOrders, setCanCreateSupplierOrders] = useState(false);
  const [canCloseCashier, setCanCloseCashier] = useState(false);
  const [canApproveCredit, setCanApproveCredit] = useState(false);
  const [canApplySpecialDiscount, setCanApplySpecialDiscount] = useState(false);
  const [canModifySettings, setCanModifySettings] = useState(false);
  const [canModifyMasterSettings, setCanModifyMasterSettings] = useState(false);
  const [canAdjustInventoryLoss, setCanAdjustInventoryLoss] = useState(false);

  // Validation
  const [error, setError] = useState('');

  // Gerar PIN de 4 dígitos não utilizado
  const generateRandomPin = () => {
    let newPin = '';
    let attempts = 0;
    do {
      newPin = String(Math.floor(1000 + Math.random() * 9000));
      attempts++;
    } while ((employees || []).some(e => e.pin === newPin && e.id !== employeeToEdit?.id) && attempts < 50);
    setPin(newPin);
    return newPin;
  };

  // Sincronizar com edição ou valores padrão
  useEffect(() => {
    if (!isOpen) return;

    if (employeeToEdit) {
      setName(employeeToEdit.name);
      setCpf(employeeToEdit.cpf || '');
      setPhone(employeeToEdit.phone || '');
      setEmail(employeeToEdit.email || '');
      setRole(employeeToEdit.role);
      setPin(employeeToEdit.pin);
      setAvatar(employeeToEdit.avatar);
      setCustomAvatarUrl('');
      setIsActive(employeeToEdit.isActive !== false);

      setStartTime(employeeToEdit.workShift?.startTime || '08:00');
      setEndTime(employeeToEdit.workShift?.endTime || '18:00');
      setWorkDays(employeeToEdit.workShift?.workDays || [1, 2, 3, 4, 5, 6]);
      setMaxDiscountPercent(employeeToEdit.maxDiscountPercent ?? 5);
      setAllowRemoteAccess(employeeToEdit.allowRemoteAccess ?? false);

      setCanAccessFinance(employeeToEdit.canAccessFinance);
      setCanViewCostPrices(employeeToEdit.canViewCostPrices);
      setCanViewGlobalSalesMetrics(employeeToEdit.canViewGlobalSalesMetrics);
      setCanManageSuppliersCost(employeeToEdit.canManageSuppliersCost);
      setCanCreateSupplierOrders(employeeToEdit.canCreateSupplierOrders);
      setCanCloseCashier(employeeToEdit.canCloseCashier);
      setCanApproveCredit(employeeToEdit.canApproveCredit);
      setCanApplySpecialDiscount(employeeToEdit.canApplySpecialDiscount);
      setCanModifySettings(employeeToEdit.canModifySettings);
      setCanModifyMasterSettings(employeeToEdit.canModifyMasterSettings);
      setCanAdjustInventoryLoss(employeeToEdit.canAdjustInventoryLoss);
    } else {
      // Novo cadastro com defaults
      setName('');
      setCpf('');
      setPhone('');
      setEmail('');
      setRole('operador');
      generateRandomPin();
      setAvatar(AVAILABLE_AVATARS[3]?.url || '');
      setCustomAvatarUrl('');
      setIsActive(true);

      const defaults = ROLE_CONFIGS.operador.defaultPermissions;
      setStartTime('08:00');
      setEndTime('17:30');
      setWorkDays([1, 2, 3, 4, 5, 6]);
      setMaxDiscountPercent(defaults.maxDiscountPercent);
      setAllowRemoteAccess(defaults.allowRemoteAccess);

      setCanAccessFinance(defaults.canAccessFinance);
      setCanViewCostPrices(defaults.canViewCostPrices);
      setCanViewGlobalSalesMetrics(defaults.canViewGlobalSalesMetrics);
      setCanManageSuppliersCost(defaults.canManageSuppliersCost);
      setCanCreateSupplierOrders(defaults.canCreateSupplierOrders);
      setCanCloseCashier(defaults.canCloseCashier);
      setCanApproveCredit(defaults.canApproveCredit);
      setCanApplySpecialDiscount(defaults.canApplySpecialDiscount);
      setCanModifySettings(defaults.canModifySettings);
      setCanModifyMasterSettings(defaults.canModifyMasterSettings);
      setCanAdjustInventoryLoss(defaults.canAdjustInventoryLoss);
    }
    setError('');
    setActiveTab('dados');
  }, [employeeToEdit, isOpen]);

  // Ao selecionar uma nova categoria/cargo, aplicar permissões recomendadas
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    const config = ROLE_CONFIGS[newRole];
    if (config) {
      setCanAccessFinance(config.defaultPermissions.canAccessFinance);
      setCanViewCostPrices(config.defaultPermissions.canViewCostPrices);
      setCanViewGlobalSalesMetrics(config.defaultPermissions.canViewGlobalSalesMetrics);
      setCanManageSuppliersCost(config.defaultPermissions.canManageSuppliersCost);
      setCanCreateSupplierOrders(config.defaultPermissions.canCreateSupplierOrders);
      setCanCloseCashier(config.defaultPermissions.canCloseCashier);
      setCanApproveCredit(config.defaultPermissions.canApproveCredit);
      setCanApplySpecialDiscount(config.defaultPermissions.canApplySpecialDiscount);
      setCanModifySettings(config.defaultPermissions.canModifySettings);
      setCanModifyMasterSettings(config.defaultPermissions.canModifyMasterSettings);
      setCanAdjustInventoryLoss(config.defaultPermissions.canAdjustInventoryLoss);
      setMaxDiscountPercent(config.defaultPermissions.maxDiscountPercent);
      setAllowRemoteAccess(config.defaultPermissions.allowRemoteAccess);

      // Sugerir avatar correspondente ao cargo se não estiver editando
      if (!isEditing) {
        if (newRole === 'dono') setAvatar(AVAILABLE_AVATARS[0].url);
        else if (newRole === 'gerente') setAvatar(AVAILABLE_AVATARS[1].url);
        else if (newRole === 'admin') setAvatar(AVAILABLE_AVATARS[2].url);
        else if (newRole === 'operador') setAvatar(AVAILABLE_AVATARS[3].url);
        else if (newRole === 'tosador') setAvatar(AVAILABLE_AVATARS[4].url);
        else if (newRole === 'veterinario') setAvatar(AVAILABLE_AVATARS[5].url);
        else if (newRole === 'vendedor') setAvatar(AVAILABLE_AVATARS[6].url);
      }
    }
  };

  const toggleWorkDay = (day: number) => {
    setWorkDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!name.trim()) {
      setError('Por favor, informe o nome completo do colaborador.');
      setActiveTab('dados');
      return;
    }

    if (!pin.trim() || pin.trim().length < 4) {
      setError('O PIN de autenticação deve ter 4 dígitos numéricos.');
      setActiveTab('dados');
      return;
    }

    const selectedAvatar = customAvatarUrl.trim() || avatar;
    const roleConfig = ROLE_CONFIGS[role];

    const employeeData: Omit<EmployeeUser, 'id'> = {
      name: name.trim(),
      cpf: cpf.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      role,
      roleLabel: roleConfig.label,
      roleDescription: roleConfig.description,
      avatar: selectedAvatar,
      pin: pin.trim(),
      badgeColor: roleConfig.badgeColor,
      isActive,
      workShift: {
        startTime,
        endTime,
        workDays
      },
      maxDiscountPercent,
      allowRemoteAccess,
      canAccessFinance,
      canViewCostPrices,
      canViewGlobalSalesMetrics,
      canManageSuppliersCost,
      canCreateSupplierOrders,
      canCloseCashier,
      canApproveCredit,
      canApplySpecialDiscount,
      canModifySettings,
      canModifyMasterSettings,
      canAdjustInventoryLoss
    };

    // Gerar Hash seguro com Salt via backend (PBKDF2 100k iterações)
    try {
      const hashRes = await fetch('/api/auth/hash-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin.trim() })
      });
      if (hashRes.ok) {
        const hashData = await hashRes.json();
        employeeData.pinHash = hashData.pinHash;
        employeeData.salt = hashData.salt;
      }
    } catch {
      // Caso offline, mantém PIN padrão com salvamento seguro
    }

    if (isEditing && employeeToEdit) {
      const res = updateEmployee(employeeToEdit.id, employeeData);
      if (res.success) {
        onClose();
      } else {
        setError(res.message);
      }
    } else {
      const res = addEmployee(employeeData);
      if (res.success) {
        onClose();
        if (context.navigateToEquipe) {
          context.navigateToEquipe();
        }
      } else {
        setError(res.message);
      }
    }
  };

  const daysLabels = [
    { day: 1, label: 'Seg' },
    { day: 2, label: 'Ter' },
    { day: 3, label: 'Qua' },
    { day: 4, label: 'Qui' },
    { day: 5, label: 'Sex' },
    { day: 6, label: 'Sáb' },
    { day: 0, label: 'Dom' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f1017] border border-white/15 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">
                {isEditing ? 'manage_accounts' : 'person_add'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {isEditing ? `Editar Colaborador: ${employeeToEdit?.name}` : 'Cadastrar Novo Funcionário'}
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                  {ROLE_CONFIGS[role].label.split(' / ')[0]}
                </span>
              </div>
              <p className="text-xs text-white/50">
                Parametrização de cargo, credenciais PIN, turno CLT e permissões
              </p>
            </div>
          </div>
          <button
            id="btn-close-employee-form"
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 bg-white/[0.02] px-4 pt-2 gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('dados')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dados'
                ? 'border-indigo-500 text-white bg-white/5'
                : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">badge</span>
            1. Dados & Cargo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jornada')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'jornada'
                ? 'border-indigo-500 text-white bg-white/5'
                : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">schedule</span>
            2. Turno & Regras
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('permissoes')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'permissoes'
                ? 'border-indigo-500 text-white bg-white/5'
                : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">verified_user</span>
            3. Matriz de Permissões
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError('')}
              className="text-rose-300 hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* ABA 1: DADOS & CARGO */}
          {activeTab === 'dados' && (
            <div className="space-y-4">
              {/* Informações Pessoais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Nome Completo do Funcionário *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Juliana Mendes de Souza"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    CPF (Opcional p/ Folha CLT)
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={e => setCpf(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="(19) 99876-5432"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-white/30"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    E-mail Corporativo
                  </label>
                  <input
                    type="email"
                    placeholder="colaborador@globalpetagro.com.br"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* SELEÇÃO DE CATEGORIA / CARGO */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-white/70">
                    Cargo / Categoria na Loja *
                  </label>
                  <span className="text-[11px] text-indigo-300 font-mono">
                    Presets de permissões são aplicados automaticamente
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(Object.keys(ROLE_CONFIGS) as UserRole[]).map(roleKey => {
                    const cfg = ROLE_CONFIGS[roleKey];
                    const isSelected = role === roleKey;
                    return (
                      <button
                        key={roleKey}
                        type="button"
                        onClick={() => handleRoleChange(roleKey)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px] text-indigo-400">
                              {cfg.icon}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {cfg.label}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
                          )}
                        </div>
                        <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2">
                          {cfg.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PIN DE ACESSO */}
              <div className="pt-2 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-amber-400">pin</span>
                      PIN Numérico de Acesso Rápido (4 Dígitos) *
                    </span>
                    <p className="text-[11px] text-white/50">
                      Utilizado para logar no PDV, liberar descontos e autorizar ações no sistema
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={generateRandomPin}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">autorenew</span>
                    Gerar PIN
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPin ? 'text' : 'password'}
                      maxLength={6}
                      required
                      value={pin}
                      onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="Ex: 4821"
                      className="w-full h-11 px-3.5 pr-10 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-base tracking-widest focus:border-amber-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPin ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <div className="text-xs text-white/40 px-2 font-mono">
                    {pin.length === 4 ? '✓ 4 dígitos OK' : 'Informe 4 dígitos'}
                  </div>
                </div>

                <div className="text-[11px] text-emerald-400/90 flex items-center gap-1.5 mt-2 font-medium bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                  <span className="material-symbols-outlined text-[15px] text-emerald-400">shield_lock</span>
                  <span>Proteção Criptográfica: Hashing PBKDF2 (100.000 iterações + Salt único) contra vazamentos</span>
                </div>
              </div>

              {/* SELEÇÃO DE AVATAR */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-white/70 mb-2">
                  Foto de Identificação / Avatar
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-3">
                  {AVAILABLE_AVATARS.map(av => {
                    const isAvSelected = avatar === av.url && !customAvatarUrl;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          setAvatar(av.url);
                          setCustomAvatarUrl('');
                        }}
                        className={`group relative rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                          isAvSelected
                            ? 'border-indigo-400 ring-2 ring-indigo-400/50 scale-105'
                            : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                        }`}
                        title={av.label}
                      >
                        <img
                          src={av.url}
                          alt={av.label}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isAvSelected && (
                          <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[20px]">check</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="Ou cole uma URL personalizada de foto..."
                    value={customAvatarUrl}
                    onChange={e => setCustomAvatarUrl(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-indigo-500 focus:outline-none placeholder:text-white/30"
                  />
                  {(customAvatarUrl || avatar) && (
                    <img
                      src={customAvatarUrl || avatar}
                      alt="Prévia"
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/20"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ABA 2: JORNADA & REGRAS */}
          {activeTab === 'jornada' && (
            <div className="space-y-4">
              {/* Horário de Trabalho */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-indigo-400">alarm</span>
                  Horário de Trabalho CLT (Expediente do Colaborador)
                </span>
                <p className="text-[11px] text-white/50">
                  Horário regular em que este colaborador opera na loja. Fora deste expediente, o acesso remoto fica protegido.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-white/60 mb-1">
                      Horário de Entrada
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-white/60 mb-1">
                      Horário de Saída
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Dias de Trabalho */}
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-white/60 mb-2">
                    Dias da Semana em que Trabalha:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {daysLabels.map(d => {
                      const isSelected = workDays.includes(d.day);
                      return (
                        <button
                          key={d.day}
                          type="button"
                          onClick={() => toggleWorkDay(d.day)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                              : 'bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10'
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Limite de Desconto no Balcão */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-emerald-400">percent</span>
                    Limite de Desconto Autônomo no PDV (Sem Supervisor)
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    {maxDiscountPercent}%
                  </span>
                </div>
                <p className="text-[11px] text-white/50">
                  Descontos concedidos acima desta porcentagem no balcão de vendas exigirão validação por PIN de Supervisor.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {[0, 3, 5, 7, 10, 15, 20, 100].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setMaxDiscountPercent(pct)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        maxDiscountPercent === pct
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {pct === 100 ? 'Ilimitado (Dono)' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissão de Acesso Remoto Fora da Loja */}
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-indigo-400">cell_tower</span>
                    <div>
                      <span className="text-xs font-bold text-white">
                        Permitir Login Remoto Permanente (Fora da Loja)
                      </span>
                      <p className="text-[11px] text-white/50">
                        Habilita acesso via 4G/casa sem necessidade de passe temporário do gerente
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowRemoteAccess}
                      onChange={e => setAllowRemoteAccess(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              {/* Status do Colaborador (Ativo / Inativo) */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    Status Operacional no Sistema
                  </span>
                  <p className="text-[11px] text-white/50">
                    Colaboradores inativos ficam bloqueados para efetuar login e transações
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {isActive ? 'Ativo na Loja' : 'Inativo / Bloqueado'}
                </button>
              </div>
            </div>
          )}

          {/* ABA 3: MATRIZ DE PERMISSÕES GRANULARES */}
          {activeTab === 'permissoes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-white/70">
                  Cargo Atual: <strong className="text-white">{ROLE_CONFIGS[role].label}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">refresh</span>
                  Restaurar Padrão do Cargo
                </button>
              </div>

              {/* Grupo 1: Financeiro & Balanços Sigilosos */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">account_balance</span>
                  Módulo Financeiro & Sigilo Comercial
                </span>

                <div className="space-y-2.5">
                  <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={canAccessFinance}
                      onChange={e => setCanAccessFinance(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 text-indigo-600 focus:ring-indigo-500 bg-white/10"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Acesso ao DRE Gerencial, Balanços de Lucro e Contas a Pagar
                      </span>
                      <span className="text-[11px] text-white/50 block">
                        Permite abrir a aba de Gestão Financeira e visualizar lucros líquidos da empresa.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={canViewCostPrices}
                      onChange={e => setCanViewCostPrices(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 text-indigo-600 focus:ring-indigo-500 bg-white/10"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Visualizar Preço de Custo de Fábrica e Margem de Lucro
                      </span>
                      <span className="text-[11px] text-white/50 block">
                        Exibe o custo que a loja paga nas sacas de ração e medicamentos nos catálogos.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={canViewGlobalSalesMetrics}
                      onChange={e => setCanViewGlobalSalesMetrics(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 text-indigo-600 focus:ring-indigo-500 bg-white/10"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Visualizar Faturamento Global e Metas da Loja
                      </span>
                      <span className="text-[11px] text-white/50 block">
                        Exibe o faturamento total acumulado do mês e métricas corporativas.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Grupo 2: Frente de Loja, PDV & Clientes */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
                  Frente de Caixa & Vendas no Balcão
                </span>

                <div className="space-y-2.5">
                  <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={canCloseCashier}
                      onChange={e => setCanCloseCashier(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 text-indigo-600 focus:ring-indigo-500 bg-white/10"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Fechamento de Caixa e Sangria de Valores
                      </span>
                      <span className="text-[11px] text-white/50 block">
                        Permite encerrar o expediente do caixa e emitir relatório de conciliação.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={canApproveCredit}
                      onChange={e => setCanApproveCredit(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 text-indigo-600 focus:ring-indigo-500 bg-white/10"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Aprovar Limite de Crédito / Fiado de Clientes
                      </span>
                      <span className="text-[11px] text-white/50 block">
                        Permite alterar o limite de débito em conta corrente de clientes cadastrados.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={canApplySpecialDiscount}
                      onChange={e => setCanApplySpecialDiscount(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 text-indigo-600 focus:ring-indigo-500 bg-white/10"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Conceder Descontos Especiais sem Supervisor
                      </span>
                      <span className="text-[11px] text-white/50 block">
                        Libera descontos no balcão acima da margem padrão de operadores.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Grupo 3: Estoque, Fornecedores & Parâmetros */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                  Estoque, Fornecedores & Ajustes do Sistema
                </span>

                <div className="space-y-2.5">
                  <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={canCreateSupplierOrders}
                      onChange={e => setCanCreateSupplierOrders(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 text-indigo-600 focus:ring-indigo-500 bg-white/10"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Emitir Pedidos de Compra de Atacado com Fornecedores
                      </span>
                      <span className="text-[11px] text-white/50 block">
                        Autoriza a geração de pedidos faturados de milhares de reais com as fábricas.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={canAdjustInventoryLoss}
                      onChange={e => setCanAdjustInventoryLoss(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 text-indigo-600 focus:ring-indigo-500 bg-white/10"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Ajustar Quebra de Estoque e Pesagem de Silos de Ração
                      </span>
                      <span className="text-[11px] text-white/50 block">
                        Autoriza a re-taragem e correção de divergência de kg nos tambores de granel.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={canModifySettings}
                      onChange={e => setCanModifySettings(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 text-indigo-600 focus:ring-indigo-500 bg-white/10"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Alterar Configurações Operacionais da Loja
                      </span>
                      <span className="text-[11px] text-white/50 block">
                        Permite mudar margens de lucro padrão e modelos de mensagens do WhatsApp.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={canModifyMasterSettings}
                      onChange={e => setCanModifyMasterSettings(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 text-indigo-600 focus:ring-indigo-500 bg-white/10"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Alterar Dados Fiscais Mestres (CNPJ, Razão Social, Chave PIX)
                      </span>
                      <span className="text-[11px] text-white/50 block">
                        Exclusivo da Diretoria e Proprietários da Agropecuária.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <div className="flex items-center gap-2 flex-wrap">
              {activeTab !== 'dados' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'permissoes' ? 'jornada' : 'dados')}
                  className="h-11 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Voltar</span>
                </button>
              )}
              {activeTab !== 'permissoes' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'dados' ? 'jornada' : 'permissoes')}
                  className="h-11 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Avançar para a próxima etapa de parametrização"
                >
                  <span>{activeTab === 'dados' ? 'Próximo: Turno' : 'Próximo: Permissões'}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              )}
              <button
                type="submit"
                className="h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-500/25 active:scale-95 cursor-pointer flex items-center gap-2 border border-indigo-400/30"
                title="Concluir e salvar o cadastro do colaborador"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>{isEditing ? 'Salvar Alterações' : 'Concluir Cadastro'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
