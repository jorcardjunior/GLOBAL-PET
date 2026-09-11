import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Supplier, SupplierOrder } from '../types';
import { SupervisorAuthModal } from './SupervisorAuthModal';

export const FornecedoresScreen: React.FC = () => {
  const {
    suppliers,
    supplierOrders,
    products,
    bills,
    addNewSupplier,
    deleteSupplier,
    addNewSupplierOrder,
    updateSupplierOrderStatus,
    showToast,
    setActiveTab,
    currentUser
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'catalogo' | 'pedidos' | 'sugestao'>('catalogo');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Hierarchy Authorization state
  const [isSupervisorAuthOpen, setIsSupervisorAuthOpen] = useState(false);
  const [pendingSupervisorAction, setPendingSupervisorAction] = useState<{
    type: 'new_order' | 'new_supplier' | 'view_orders';
    supplier?: Supplier;
  } | null>(null);
  const [isOrdersUnlockedBySupervisor, setIsOrdersUnlockedBySupervisor] = useState(false);

  // Modals state
  const [isNewSupplierModalOpen, setIsNewSupplierModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedSupplierForOrder, setSelectedSupplierForOrder] = useState<Supplier | null>(null);

  // New Supplier Form State
  const [newSupplierForm, setNewSupplierForm] = useState({
    name: '',
    tradeName: '',
    cnpj: '',
    category: 'racoes' as Supplier['category'],
    categoryLabel: 'Rações & Nutrição Super Premium',
    contactName: '',
    phone: '',
    whatsapp: '',
    email: '',
    paymentTerms: 'Boleto 28 DDL',
    deliveryDays: 'Semanal',
    minOrderValue: 1000,
    brands: '',
    notes: ''
  });

  // New Order Form State
  const [newOrderForm, setNewOrderForm] = useState({
    supplierId: '',
    itemsSummary: '',
    totalValue: 1200,
    expectedDelivery: 'Em 3 dias',
    paymentTerm: 'Boleto 28 DDL',
    notes: ''
  });

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(sup => {
      const matchesCategory = selectedCategory === 'todos' || sup.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        sup.tradeName.toLowerCase().includes(q) ||
        sup.name.toLowerCase().includes(q) ||
        sup.contactName.toLowerCase().includes(q) ||
        sup.cnpj.includes(q) ||
        sup.brands.some(b => b.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [suppliers, selectedCategory, searchQuery]);

  // Critical stock products (stock <= minStock or remainingKg < 5)
  const lowStockProducts = useMemo(() => {
    return products.filter(p => {
      if (p.isGranel) {
        return (p.remainingKg || 0) <= 6;
      }
      return p.stock <= p.minStock;
    });
  }, [products]);

  // Format currency
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Open order modal for a specific supplier
  const handleOpenOrderModal = (supplier?: Supplier) => {
    if (!currentUser.canManageSuppliers) {
      setPendingSupervisorAction({ type: 'new_order', supplier });
      setIsSupervisorAuthOpen(true);
      return;
    }
    const target = supplier || suppliers[0];
    if (target) {
      setSelectedSupplierForOrder(target);
      setNewOrderForm({
        supplierId: target.id,
        itemsSummary: '',
        totalValue: target.minOrderValue || 1000,
        expectedDelivery: `Próxima entrega: ${target.deliveryDays}`,
        paymentTerm: target.paymentTerms,
        notes: ''
      });
      setIsNewOrderModalOpen(true);
    }
  };

  const handleOpenNewSupplierModal = () => {
    if (!currentUser.canManageSuppliers) {
      setPendingSupervisorAction({ type: 'new_supplier' });
      setIsSupervisorAuthOpen(true);
      return;
    }
    setIsNewSupplierModalOpen(true);
  };

  // Quick WhatsApp trigger
  const handleOpenWhatsApp = (sup: Supplier, customMsg?: string) => {
    const cleanNumber = sup.whatsapp.replace(/\D/g, '');
    const defaultMsg = customMsg || `Olá ${sup.contactName}! Aqui é do setor de compras da Global Pet. Gostaríamos de cotar e solicitar reposição para a próxima entrega (${sup.deliveryDays}).`;
    const url = `https://wa.me/55${cleanNumber}?text=${encodeURIComponent(defaultMsg)}`;
    window.open(url, '_blank');
    showToast(`Iniciando contato via WhatsApp com ${sup.contactName}...`, 'chat');
  };

  // Submit new supplier
  const handleSubmitNewSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplierForm.tradeName.trim()) {
      showToast('Informe o nome fantasia do fornecedor!', 'warning');
      return;
    }

    const brandsArray = newSupplierForm.brands
      .split(',')
      .map(b => b.trim())
      .filter(Boolean);

    addNewSupplier({
      name: newSupplierForm.name || newSupplierForm.tradeName,
      tradeName: newSupplierForm.tradeName,
      cnpj: newSupplierForm.cnpj || '00.000.000/0001-00',
      category: newSupplierForm.category,
      categoryLabel:
        newSupplierForm.category === 'racoes'
          ? 'Rações & Nutrição Pet'
          : newSupplierForm.category === 'graos'
          ? 'Grãos, Farelos & Granel'
          : newSupplierForm.category === 'farmacia'
          ? 'Farmácia Veterinária'
          : 'Higiene & Acessórios Pet',
      contactName: newSupplierForm.contactName || 'Comercial',
      phone: newSupplierForm.phone || '(00) 0000-0000',
      whatsapp: newSupplierForm.whatsapp || '00000000000',
      email: newSupplierForm.email,
      paymentTerms: newSupplierForm.paymentTerms,
      deliveryDays: newSupplierForm.deliveryDays,
      minOrderValue: Number(newSupplierForm.minOrderValue) || 500,
      brands: brandsArray.length > 0 ? brandsArray : ['Linha Geral'],
      rating: 5.0,
      notes: newSupplierForm.notes,
      suppliedProductsCount: 5,
      openOrdersCount: 0
    });

    setIsNewSupplierModalOpen(false);
    setNewSupplierForm({
      name: '',
      tradeName: '',
      cnpj: '',
      category: 'racoes',
      categoryLabel: 'Rações & Nutrição Super Premium',
      contactName: '',
      phone: '',
      whatsapp: '',
      email: '',
      paymentTerms: 'Boleto 28 DDL',
      deliveryDays: 'Semanal',
      minOrderValue: 1000,
      brands: '',
      notes: ''
    });
  };

  // Submit new order
  const handleSubmitNewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === newOrderForm.supplierId);
    if (!sup) {
      showToast('Selecione o fornecedor!', 'warning');
      return;
    }
    if (!newOrderForm.itemsSummary.trim()) {
      showToast('Descreva os itens ou sacas do pedido!', 'warning');
      return;
    }

    const orderNumber = `#PED-${Math.floor(1000 + Math.random() * 9000)}`;

    addNewSupplierOrder({
      orderNumber,
      supplierId: sup.id,
      supplierName: sup.tradeName,
      date: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      expectedDelivery: newOrderForm.expectedDelivery,
      status: 'enviado',
      itemsSummary: newOrderForm.itemsSummary,
      totalValue: Number(newOrderForm.totalValue) || 0,
      paymentTerm: newOrderForm.paymentTerm,
      notes: newOrderForm.notes
    });

    setIsNewOrderModalOpen(false);
  };

  // Category Icon helper
  const getCategoryIcon = (cat: Supplier['category']) => {
    switch (cat) {
      case 'racoes':
        return 'pets';
      case 'graos':
        return 'grain';
      case 'farmacia':
        return 'medication';
      case 'higiene':
        return 'soap';
      default:
        return 'local_shipping';
    }
  };

  const getCategoryColor = (cat: Supplier['category']) => {
    switch (cat) {
      case 'racoes':
        return 'text-amber-400 bg-amber-500/15 border-amber-500/20';
      case 'graos':
        return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20';
      case 'farmacia':
        return 'text-sky-400 bg-sky-500/15 border-sky-500/20';
      case 'higiene':
        return 'text-purple-400 bg-purple-500/15 border-purple-500/20';
      default:
        return 'text-indigo-400 bg-indigo-500/15 border-indigo-500/20';
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-6 animate-fadeIn">
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-400 text-2xl">local_shipping</span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Gestão de Fornecedores & Compras
            </h1>
          </div>
          <p className="text-sm text-white/60 mt-1">
            Controle de distribuidoras de ração, moinhos agrícolas, farmácia veterinária e pedidos de reposição.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('entradas')}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 border border-indigo-400/30 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            <span>Dar Entrada de NF-e (XML/PDF)</span>
          </button>

          <button
            id="btn-novo-pedido"
            type="button"
            onClick={() => handleOpenOrderModal()}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 border border-emerald-400/30 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            <span>Emitir Pedido de Compra</span>
          </button>

          <button
            id="btn-cadastrar-fornecedor"
            type="button"
            onClick={() => handleOpenNewSupplierModal()}
            className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 border border-indigo-400/30 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Novo Fornecedor</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip (PowerBI style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Fornecedores Ativos */}
        <div id="card-kpi-fornecedores-ativos" className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Parceiros Homologados</span>
            <span className="material-symbols-outlined text-indigo-400 text-[18px]">storefront</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {suppliers.length} Fornecedores
          </div>
          <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-[11px] text-white/60">
            <span>4 Categorias Ativas</span>
            <span className="text-emerald-400 font-semibold">100% Contato Direto</span>
          </div>
        </div>

        {/* Pedidos em Aberto */}
        <div id="card-kpi-pedidos-aberto" className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Pedidos em Trânsito / Cotação</span>
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">schedule_send</span>
          </div>
          <div className="text-2xl font-bold text-emerald-300 tracking-tight">
            {supplierOrders.filter(o => o.status !== 'entregue').length} Pedidos
          </div>
          <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-[11px] text-white/60">
            <span>Volume em Reposição:</span>
            <span className="text-white font-bold">
              {currentUser.canAccessFinance
                ? formatBRL(supplierOrders.filter(o => o.status !== 'entregue').reduce((acc, o) => acc + o.totalValue, 0))
                : 'R$ ••••••••'}
            </span>
          </div>
        </div>

        {/* Boletos de Fornecedor a Vencer */}
        <div id="card-kpi-boletos-fornecedores" className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Boletos a Pagar (Compras)</span>
            <span className="material-symbols-outlined text-amber-400 text-[18px]">
              {currentUser.canAccessFinance ? 'receipt_long' : 'lock'}
            </span>
          </div>
          <div className="text-2xl font-bold text-amber-300 tracking-tight">
            {currentUser.canAccessFinance
              ? formatBRL(bills.filter(b => b.status !== 'pago').reduce((acc, b) => acc + (b.value || b.amount || 0), 0))
              : 'R$ ••••••••'}
          </div>
          <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-[11px] text-white/60">
            <span>Prazo médio de compra:</span>
            <span className="text-amber-300 font-semibold">
              {currentUser.canAccessFinance ? '28/35 DDL' : 'Sigiloso (Gerência)'}
            </span>
          </div>
        </div>

        {/* Alerta de Estoque Baixo */}
        <div id="card-kpi-estoque-critico" className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Itens c/ Reposição Urgente</span>
            <span className="material-symbols-outlined text-rose-400 text-[18px]">warning</span>
          </div>
          <div className="text-2xl font-bold text-rose-300 tracking-tight flex items-baseline gap-1.5">
            <span>{lowStockProducts.length} Produtos</span>
            <span className="text-[11px] text-white/50 font-normal">abaixo do mín.</span>
          </div>
          <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-[11px]">
            <button
              onClick={() => setActiveSubTab('sugestao')}
              className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Ver Sugestão de Reposição</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Switcher (Tabs) */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 bg-white/[0.04] p-1 rounded-xl border border-white/10">
          <button
            id="tab-sub-catalogo"
            type="button"
            onClick={() => setActiveSubTab('catalogo')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'catalogo'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">contacts_product</span>
            <span>Catálogo de Fornecedores ({suppliers.length})</span>
          </button>

          <button
            id="tab-sub-pedidos"
            type="button"
            onClick={() => setActiveSubTab('pedidos')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'pedidos'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">local_shipping</span>
            <span>Pedidos de Compra ({supplierOrders.length})</span>
          </button>

          <button
            id="tab-sub-sugestao"
            type="button"
            onClick={() => setActiveSubTab('sugestao')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'sugestao'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">notification_important</span>
            <span>Reposição Automática ({lowStockProducts.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        {activeSubTab === 'catalogo' && (
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
              search
            </span>
            <input
              id="input-busca-fornecedores"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por marca, razão social, cnpj..."
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        )}
      </div>

      {/* VIEW 1: Catálogo de Fornecedores */}
      {activeSubTab === 'catalogo' && (
        <div className="flex flex-col gap-5">
          {/* Category Chips Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {[
              { id: 'todos', label: 'Todos os Ramos', count: suppliers.length },
              { id: 'racoes', label: 'Rações & Nutrição', count: suppliers.filter(s => s.category === 'racoes').length },
              { id: 'graos', label: 'Grãos & Granel Agro', count: suppliers.filter(s => s.category === 'graos').length },
              { id: 'farmacia', label: 'Farmácia & Vacinas', count: suppliers.filter(s => s.category === 'farmacia').length },
              { id: 'higiene', label: 'Banho & Acessórios', count: suppliers.filter(s => s.category === 'higiene').length }
            ].map(cat => (
              <button
                key={cat.id}
                id={`chip-cat-${cat.id}`}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-white/20 text-white border border-white/30 shadow'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-white/80">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Supplier Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredSuppliers.map(sup => (
              <div
                key={sup.id}
                id={`card-fornecedor-${sup.id}`}
                className="glass-card p-5 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col justify-between gap-4 group relative"
              >
                {/* Header do Card */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${getCategoryColor(sup.category)}`}>
                        <span className="material-symbols-outlined text-[24px]">
                          {getCategoryIcon(sup.category)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-[16px] tracking-tight leading-snug truncate">
                          {sup.tradeName}
                        </h3>
                        <p className="text-[11px] text-white/50 truncate">
                          {sup.name}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${getCategoryColor(sup.category)}`}>
                      {sup.categoryLabel}
                    </span>
                  </div>

                  {/* CNPJ & Ratings */}
                  <div className="flex items-center gap-3 text-[11px] text-white/50 mb-3.5 pb-2.5 border-b border-white/5">
                    <span>CNPJ: <strong className="text-white/80 font-mono">{sup.cnpj}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <span className="material-symbols-outlined text-[14px]">star</span>
                      <strong>{sup.rating.toFixed(1)}</strong>
                    </span>
                    <span>•</span>
                    <span>Último pedido: <strong className="text-white/80">{sup.lastOrderDate || 'Recentemente'}</strong></span>
                  </div>

                  {/* Detalhes Comerciais & Condições */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px] mb-3.5">
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col">
                      <span className="text-white/50 text-[10px]">Representante:</span>
                      <span className="text-white font-medium truncate">{sup.contactName}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col">
                      <span className="text-white/50 text-[10px]">Prazo / Pagamento:</span>
                      <span className="text-white font-medium truncate">
                        {currentUser.canViewCostPrices ? sup.paymentTerms : 'Sigiloso p/ Compras 🔒'}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col">
                      <span className="text-white/50 text-[10px]">Rota de Entrega:</span>
                      <span className="text-emerald-300 font-medium truncate">{sup.deliveryDays}</span>
                    </div>
                  </div>

                  {/* Brands & Lines */}
                  <div className="mb-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-white/40 block mb-1.5">
                      Principais Marcas & Linhas:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sup.brands.map((b, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[11px] text-white/80"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Observations */}
                  {sup.notes && (
                    <p className="text-[11px] text-white/50 italic bg-white/[0.02] p-2 rounded-lg border border-white/5 mt-2">
                      "{sup.notes}"
                    </p>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-white/60">Pedido Mínimo:</span>
                    <span className="text-xs font-bold text-amber-300">
                      {currentUser.canViewCostPrices ? formatBRL(sup.minOrderValue) : '•••••••• (Compras)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* WhatsApp Action */}
                    <button
                      id={`btn-wpp-${sup.id}`}
                      type="button"
                      onClick={() => handleOpenWhatsApp(sup)}
                      className="h-8 px-2.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Chamar no WhatsApp Comercial"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>

                    {/* Order action */}
                    <button
                      id={`btn-order-${sup.id}`}
                      type="button"
                      onClick={() => handleOpenOrderModal(sup)}
                      className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 border border-indigo-400/30 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">shopping_cart_checkout</span>
                      <span>Fazer Pedido</span>
                    </button>

                    {/* Delete supplier (Supervisor only) */}
                    {currentUser.canManageSuppliers && (
                      <button
                        type="button"
                        onClick={() => deleteSupplier(sup.id)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Excluir fornecedor"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSuppliers.length === 0 && (
            <div className="glass-card p-10 rounded-2xl border border-white/10 text-center flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-4xl text-white/30">inventory_2</span>
              <h3 className="font-bold text-white text-lg">Nenhum fornecedor encontrado</h3>
              <p className="text-sm text-white/50 max-w-md">
                Tente ajustar os termos de busca ou cadastrar um novo fornecedor para sua loja de ração e pet shop.
              </p>
              <button
                type="button"
                onClick={() => setIsNewSupplierModalOpen(true)}
                className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
              >
                Cadastrar Fornecedor Agora
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: Pedidos de Compra & Reposição */}
      {activeSubTab === 'pedidos' && (
        <div className="flex flex-col gap-4">
          <div className="glass-card p-4 md:p-5 rounded-2xl border border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-white text-[16px]">Histórico de Pedidos de Reposição</h3>
                <p className="text-xs text-white/50">Acompanhe remessas, notas fiscais e previsão de entrega por distribuidora</p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenOrderModal()}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Novo Pedido</span>
              </button>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Pedido</th>
                    <th className="py-3 px-3">Fornecedor / Distribuidora</th>
                    <th className="py-3 px-3">Data / Previsão</th>
                    <th className="py-3 px-3">Itens / Descrição</th>
                    <th className="py-3 px-3">Valor Total</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  {supplierOrders.map(order => {
                    const statusBadge =
                      order.status === 'entregue'
                        ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20'
                        : order.status === 'faturado'
                        ? 'text-indigo-400 bg-indigo-500/15 border-indigo-500/20'
                        : order.status === 'enviado'
                        ? 'text-sky-400 bg-sky-500/15 border-sky-500/20'
                        : 'text-amber-400 bg-amber-500/15 border-amber-500/20';

                    const statusLabel =
                      order.status === 'entregue'
                        ? 'Entregue no Estoque'
                        : order.status === 'faturado'
                        ? 'Faturado / Em Rota'
                        : order.status === 'enviado'
                        ? 'Enviado ao Fornec.'
                        : 'Em Cotação';

                    return (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-white whitespace-nowrap">
                          {order.orderNumber}
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-white whitespace-nowrap">
                          {order.supplierName}
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="text-white/90">{order.date}</div>
                          <div className="text-[10px] text-white/50">Chegada: {order.expectedDelivery}</div>
                        </td>
                        <td className="py-3.5 px-3 max-w-xs">
                          <p className="truncate text-white/70" title={order.itemsSummary}>
                            {order.itemsSummary}
                          </p>
                          {order.notes && (
                            <span className="text-[10px] text-white/40 italic block">{order.notes}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-emerald-300 whitespace-nowrap">
                          {formatBRL(order.totalValue)}
                          <div className="text-[10px] font-normal text-white/40">{order.paymentTerm}</div>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusBadge}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          {order.status !== 'entregue' ? (
                            <button
                              id={`btn-status-entregue-${order.id}`}
                              type="button"
                              onClick={() => updateSupplierOrderStatus(order.id, 'entregue')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-all cursor-pointer"
                              title="Marcar como recebido no galpão e estocar"
                            >
                              Dar Entrada
                            </button>
                          ) : (
                            <span className="text-white/40 text-[11px] flex items-center justify-end gap-1">
                              <span className="material-symbols-outlined text-[15px] text-emerald-400">check</span>
                              Concluído
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Sugestão de Reposição & Estoque Crítico */}
      {activeSubTab === 'sugestao' && (
        <div className="flex flex-col gap-4">
          <div className="glass-card p-4 md:p-5 rounded-2xl border border-rose-500/20 bg-gradient-to-r from-rose-950/20 to-purple-950/10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">notification_important</span>
              </div>
              <div>
                <h3 className="font-bold text-white text-[15px]">Central de Reposição Crítica do Estoque</h3>
                <p className="text-xs text-white/60">
                  Itens com estoque igual ou abaixo da reserva de segurança. Emita cotações diretamente com os fornecedores homologados.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {lowStockProducts.map(prod => {
              // Find matching supplier
              const matchingSupplier = suppliers.find(s =>
                s.brands.some(b => prod.name.toLowerCase().includes(b.toLowerCase()))
              ) || suppliers[0];

              return (
                <div
                  key={prod.id}
                  className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between gap-3 hover:border-rose-500/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-12 h-12 rounded-xl object-cover bg-white/5 border border-white/10 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded uppercase">
                        Estoque Baixo
                      </span>
                      <h4 className="font-bold text-white text-xs mt-1 leading-snug line-clamp-2">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-white/50 mt-0.5">
                        {prod.location}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-white/50 text-[11px]">Estoque Atual:</span>
                      <div className="font-bold text-rose-400">
                        {prod.isGranel ? `${prod.remainingKg} kg` : `${prod.stock} un.`}
                        <span className="text-[10px] text-white/40 font-normal ml-1">
                          (mín: {prod.isGranel ? '6 kg' : `${prod.minStock} un.`})
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenOrderModal(matchingSupplier)}
                      className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">local_shipping</span>
                      <span>Pedir Reposição</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: Cadastrar Novo Fornecedor */}
      {isNewSupplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="glass-card max-w-xl w-full p-5 md:p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-400 text-[22px]">domain_add</span>
                <h3 className="font-bold text-lg text-white">Cadastrar Novo Fornecedor</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewSupplierModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitNewSupplier} className="flex flex-col gap-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 font-medium block mb-1">Nome Fantasia / Marca *</label>
                  <input
                    type="text"
                    required
                    value={newSupplierForm.tradeName}
                    onChange={e => setNewSupplierForm(prev => ({ ...prev, tradeName: e.target.value }))}
                    placeholder="Ex: Premier Pet Distribuidora"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-white/60 font-medium block mb-1">Razão Social</label>
                  <input
                    type="text"
                    value={newSupplierForm.name}
                    onChange={e => setNewSupplierForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Grandfood do Brasil Ltda"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 font-medium block mb-1">CNPJ</label>
                  <input
                    type="text"
                    value={newSupplierForm.cnpj}
                    onChange={e => setNewSupplierForm(prev => ({ ...prev, cnpj: e.target.value }))}
                    placeholder="00.000.000/0001-00"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-white/60 font-medium block mb-1">Ramo de Atuação *</label>
                  <select
                    value={newSupplierForm.category}
                    onChange={e => setNewSupplierForm(prev => ({ ...prev, category: e.target.value as Supplier['category'] }))}
                    className="w-full px-3 py-2 bg-[#0d1020] border border-white/10 rounded-xl text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="racoes">Rações & Nutrição Pet</option>
                    <option value="graos">Grãos, Farelos & Granel Agro</option>
                    <option value="farmacia">Farmácia Veterinária & Antipulgas</option>
                    <option value="higiene">Higiene, Shampoos & Acessórios</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 font-medium block mb-1">Nome do Representante / Vendedor</label>
                  <input
                    type="text"
                    value={newSupplierForm.contactName}
                    onChange={e => setNewSupplierForm(prev => ({ ...prev, contactName: e.target.value }))}
                    placeholder="Ex: Marcelo Santos (Comercial)"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-white/60 font-medium block mb-1">WhatsApp Comercial (com DDD) *</label>
                  <input
                    type="text"
                    required
                    value={newSupplierForm.whatsapp}
                    onChange={e => setNewSupplierForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="Ex: 19998231144"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-white/60 font-medium block mb-1">Condição Pagto</label>
                  <input
                    type="text"
                    value={newSupplierForm.paymentTerms}
                    onChange={e => setNewSupplierForm(prev => ({ ...prev, paymentTerms: e.target.value }))}
                    placeholder="Ex: Boleto 28 DDL"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-white/60 font-medium block mb-1">Dias de Entrega</label>
                  <input
                    type="text"
                    value={newSupplierForm.deliveryDays}
                    onChange={e => setNewSupplierForm(prev => ({ ...prev, deliveryDays: e.target.value }))}
                    placeholder="Ex: Terça e Sexta"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-white/60 font-medium block mb-1">Pedido Mínimo (R$)</label>
                  <input
                    type="number"
                    value={newSupplierForm.minOrderValue}
                    onChange={e => setNewSupplierForm(prev => ({ ...prev, minOrderValue: Number(e.target.value) }))}
                    placeholder="1000"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/60 font-medium block mb-1">Principais Marcas Fornecidas (separadas por vírgula)</label>
                <input
                  type="text"
                  value={newSupplierForm.brands}
                  onChange={e => setNewSupplierForm(prev => ({ ...prev, brands: e.target.value }))}
                  placeholder="Ex: Premier Pet, Golden Fórmula, Qualiday"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-white/60 font-medium block mb-1">Observações de Negociação / Frete</label>
                <textarea
                  rows={2}
                  value={newSupplierForm.notes}
                  onChange={e => setNewSupplierForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Ex: Entrega grátis acima de R$ 2.000. Bonificação de 3 pacotes por mês."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10 mt-1">
                <button
                  type="button"
                  onClick={() => setIsNewSupplierModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 font-medium"
                >
                  Cancelar
                </button>

                <button
                  id="btn-salvar-fornecedor"
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Salvar Fornecedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Emitir Pedido de Compra / Reposição */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="glass-card max-w-lg w-full p-5 md:p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[22px]">add_shopping_cart</span>
                <h3 className="font-bold text-lg text-white">Emitir Pedido de Reposição</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewOrderModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitNewOrder} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="text-white/60 font-medium block mb-1">Fornecedor / Distribuidora *</label>
                <select
                  value={newOrderForm.supplierId}
                  onChange={e => {
                    const found = suppliers.find(s => s.id === e.target.value);
                    if (found) {
                      setSelectedSupplierForOrder(found);
                      setNewOrderForm(prev => ({
                        ...prev,
                        supplierId: found.id,
                        paymentTerm: found.paymentTerms,
                        expectedDelivery: `Próxima entrega: ${found.deliveryDays}`,
                        totalValue: found.minOrderValue || 1000
                      }));
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#0d1020] border border-white/10 rounded-xl text-white focus:border-indigo-500 outline-none"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.tradeName} ({s.categoryLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/60 font-medium block mb-1">
                  Itens e Sacas do Pedido * (Ex: 10x Premier 15kg, 5x Milho 50kg)
                </label>
                <textarea
                  rows={3}
                  required
                  value={newOrderForm.itemsSummary}
                  onChange={e => setNewOrderForm(prev => ({ ...prev, itemsSummary: e.target.value }))}
                  placeholder="Ex: 8x Premier Raças Pequenas 15kg, 6x Golden Formula 15kg, 4x Sachês Gatos..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 font-medium block mb-1">Valor Total Estimado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newOrderForm.totalValue}
                    onChange={e => setNewOrderForm(prev => ({ ...prev, totalValue: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-indigo-500 outline-none font-bold text-emerald-300"
                  />
                </div>

                <div>
                  <label className="text-white/60 font-medium block mb-1">Previsão de Entrega</label>
                  <input
                    type="text"
                    value={newOrderForm.expectedDelivery}
                    onChange={e => setNewOrderForm(prev => ({ ...prev, expectedDelivery: e.target.value }))}
                    placeholder="Ex: Quinta-feira até 12h"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/60 font-medium block mb-1">Condição de Pagamento</label>
                <input
                  type="text"
                  value={newOrderForm.paymentTerm}
                  onChange={e => setNewOrderForm(prev => ({ ...prev, paymentTerm: e.target.value }))}
                  placeholder="Ex: Boleto 28/35 DDL"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-white/60 font-medium block mb-1">Observações do Pedido</label>
                <input
                  type="text"
                  value={newOrderForm.notes}
                  onChange={e => setNewOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Ex: Entregar pela manhã. Solicitar brinde de tapete higiênico."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10 mt-1">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 font-medium"
                >
                  Cancelar
                </button>

                <button
                  id="btn-confirmar-pedido-compra"
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30"
                >
                  Emitir e Enviar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supervisor Auth Modal for Supplier / Purchase Operations */}
      <SupervisorAuthModal
        isOpen={isSupervisorAuthOpen}
        onClose={() => {
          setIsSupervisorAuthOpen(false);
          setPendingSupervisorAction(null);
        }}
        requiredRole="gerente"
        actionTitle={
          pendingSupervisorAction?.type === 'new_supplier'
            ? 'Cadastrar Novo Fornecedor Homologado'
            : 'Autorizar Emissão de Pedido de Compra'
        }
        actionDescription={
          pendingSupervisorAction?.type === 'new_supplier'
            ? 'O cadastro de fornecedores e condições comerciais é restrito à gerência ou diretoria.'
            : 'A aprovação de compras de reposição compromete o fluxo financeiro e exige aval gerencial com PIN.'
        }
        onAuthorized={(supervisor) => {
          if (pendingSupervisorAction?.type === 'new_order') {
            const target = pendingSupervisorAction.supplier || suppliers[0];
            if (target) {
              setSelectedSupplierForOrder(target);
              setNewOrderForm({
                supplierId: target.id,
                itemsSummary: '',
                totalValue: target.minOrderValue || 1000,
                expectedDelivery: `Próxima entrega: ${target.deliveryDays}`,
                paymentTerm: target.paymentTerms,
                notes: `Liberado por supervisor: ${supervisor.name}`
              });
              setIsNewOrderModalOpen(true);
            }
          } else if (pendingSupervisorAction?.type === 'new_supplier') {
            setIsNewSupplierModalOpen(true);
          } else if (pendingSupervisorAction?.type === 'view_orders') {
            setIsOrdersUnlockedBySupervisor(true);
          }
          showToast(`Operação de compras autorizada por ${supervisor.name}!`, 'check_circle');
          setPendingSupervisorAction(null);
        }}
      />
    </div>
  );
};
