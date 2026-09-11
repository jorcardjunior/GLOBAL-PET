import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const GranelScreen: React.FC = () => {
  const {
    products,
    adjustProductWeight,
    openNewBulkSack,
    orderProductSupplier,
    openBarcodeModal,
    addToCart,
    showToast,
    currentUser,
    setActiveTab
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'todos' | 'granel' | 'fechados' | 'farmacia' | 'petcare'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);

  // Weight adjust modal state
  const [adjustModalProduct, setAdjustModalProduct] = useState<Product | null>(null);
  const [adjustWeightVal, setAdjustWeightVal] = useState<number>(7.2);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Sincronização de balança Toledo e estoque concluída!', 'sync');
    }, 900);
  };

  const filteredProducts = products.filter(p => {
    const matchCat = activeCategory === 'todos' || p.category === activeCategory;
    const matchSearch = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col w-full gap-5 max-w-4xl mx-auto px-4 md:px-6 py-4">
      {/* Top Header & Balanço Sync */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">
            Catálogo & Balanço Digital
          </span>
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white">
            Estoque da <span className="font-semibold text-white">Loja & Granel</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('entradas')}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-xl text-indigo-300 text-[13px] font-semibold transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            <span>Importar NF-e / XML</span>
          </button>
          <button
            onClick={handleSync}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 glass-card-interactive rounded-xl text-white text-[13px] font-semibold transition-all active:scale-95 cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[18px] text-indigo-400 ${isSyncing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>Sincronizar Balança</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Barcode Scanner */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar ração, SKU, lote ou código de barras..."
            className="w-full h-12 pl-10 pr-10 bg-white/[0.04] backdrop-blur-md text-white rounded-xl text-[14px] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-white/10"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
        <button
          type="button"
          aria-label="Escanear Código de Barras"
          onClick={openBarcodeModal}
          className="w-12 h-12 min-w-[48px] min-h-[48px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer border border-indigo-400/30"
        >
          <span className="material-symbols-outlined text-[24px]">barcode_scanner</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 md:-mx-6 px-4 md:px-6">
        {[
          { id: 'todos', label: 'Todos', count: '1.240', badgeColor: 'bg-white/10 text-white/80' },
          { id: 'granel', label: 'Ração Granel', count: '48', badgeColor: 'bg-purple-500/20 text-purple-300' },
          { id: 'fechados', label: 'Sacos Fechados', count: '180', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
          { id: 'farmacia', label: 'Medicamentos', count: '95', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
          { id: 'petcare', label: 'Acessórios & Pet', count: '320', badgeColor: 'bg-pink-500/20 text-pink-300' }
        ].map(tab => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-3.5 py-2 rounded-full whitespace-nowrap text-[13px] font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400/30 shadow-md shadow-indigo-500/20'
                  : 'bg-white/[0.04] text-white/60 border-white/5 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tab.badgeColor}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Operational Metric Bento Strip */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Total Value / Equity */}
        <div className="glass-card p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/40 uppercase font-bold tracking-wider">Patrimônio</span>
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              currentUser.canViewCostPrices
                ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            }`}>
              <span className="material-symbols-outlined text-[15px]">
                {currentUser.canViewCostPrices ? 'payments' : 'lock'}
              </span>
            </span>
          </div>
          <div className="mt-2 flex flex-col">
            <span className="text-xl md:text-2xl leading-tight text-white font-bold truncate">
              {currentUser.canViewCostPrices ? 'R$ 84,5k' : '••••••••'}
            </span>
            <span className="text-[11px] text-white/50 truncate">
              {currentUser.canViewCostPrices ? 'Custo em estoque' : 'Sigiloso (Gerência/Dono)'}
            </span>
          </div>
        </div>

        {/* Critical Alert (Below Min) */}
        <div className="glass-card p-3.5 flex flex-col justify-between border-red-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-red-400 uppercase font-bold tracking-wider">Abaixo do Mín.</span>
            <span className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[15px]">warning</span>
            </span>
          </div>
          <div className="mt-2 flex flex-col">
            <span className="text-xl md:text-2xl leading-tight text-red-300 font-bold">06 itens</span>
            <span className="text-[11px] text-red-400/80 truncate">Reposição urgente</span>
          </div>
        </div>

        {/* Bulk Open Bags */}
        <div className="glass-card p-3.5 flex flex-col justify-between border-purple-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-purple-300 uppercase font-bold tracking-wider">Granel</span>
            <span className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-[15px]">scale</span>
            </span>
          </div>
          <div className="mt-2 flex flex-col">
            <span className="text-xl md:text-2xl leading-tight text-purple-200 font-bold">14 tambores</span>
            <span className="text-[11px] text-purple-300/80 truncate">Em pesagem ativa</span>
          </div>
        </div>
      </div>

      {/* Product Inventory Feed */}
      <div className="flex flex-col gap-3 pb-24">
        {filteredProducts.map(product => {
          const isGranel = product.category === 'granel' || product.isGranel;
          const isLowStock = product.stock <= product.minStock;
          const remaining = product.remainingKg ?? 7.2;
          const max = product.maxKg ?? 15.0;
          const fillPercent = Math.min(100, Math.round((remaining / max) * 100));

          return (
            <div
              key={product.id}
              className="glass-card p-4 flex flex-col gap-3 transition-all hover:border-white/20"
            >
              <div className="flex gap-3.5">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10 ring-1 ring-white/10">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {isGranel && (
                    <span className="absolute top-1 left-1 bg-purple-600/90 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-md border border-purple-400/30">
                      <span className="material-symbols-outlined text-[11px]">scale</span>
                      Kg
                    </span>
                  )}
                  {product.unit.includes('15kg') && (
                    <span className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs border border-white/10">
                      15kg
                    </span>
                  )}
                  {product.unit.includes('20kg') && (
                    <span className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs border border-white/10">
                      20kg
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-1 min-w-0 justify-between">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-white/40 truncate uppercase font-semibold">
                        {isGranel ? 'Saco Aberto no Balcão' : `Cód: ${product.sku}`}
                      </span>
                      <h3 className="font-semibold text-[15px] text-white leading-snug truncate">
                        {product.name}
                      </h3>
                    </div>

                    {isLowStock ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[10px] font-bold uppercase flex items-center gap-1 flex-shrink-0 animate-pulse">
                        <span className="material-symbols-outlined text-[12px]">priority_high</span>
                        Estoque Baixo
                      </span>
                    ) : isGranel ? (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase flex items-center gap-1 flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]"></span>
                        Granel Ativo
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-[10px] font-bold uppercase flex items-center gap-1 flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"></span>
                        Em estoque
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between mt-1">
                    <div className="flex flex-col">
                      <span className="font-bold text-[17px] text-white">
                        R$ {(product.price ?? 0).toFixed(2).replace('.', ',')}
                        {isGranel && <span className="text-[12px] font-normal text-white/60"> /kg</span>}
                      </span>
                      <span className="text-[11px] text-white/40">
                        {isGranel ? `Balde #${product.batch || '04'} • Lote 88B` : product.unit}
                      </span>

                      {/* Cost price & Margin rule */}
                      {currentUser.canViewCostPrices && product.costPrice ? (
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-indigo-300 font-mono bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 w-fit">
                          <span>Custo: R$ {product.costPrice.toFixed(2).replace('.', ',')}</span>
                          <span>•</span>
                          <span>Margem: {product.marginPercent}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-white/30 font-medium">
                          <span className="material-symbols-outlined text-[11px]">lock</span>
                          <span>Custo de fábrica: Sigiloso</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      {isGranel ? (
                        <>
                          <span className="font-bold text-[16px] text-purple-300">
                            {(remaining ?? 0).toFixed(1)}
                          </span>
                          <span className="text-[12px] text-white/50"> / {max} kg</span>
                        </>
                      ) : (
                        <>
                          <span className={`font-bold text-[17px] ${isLowStock ? 'text-red-400' : 'text-white'}`}>
                            {product.stock}
                          </span>
                          <span className="text-[12px] text-white/50"> {product.stock === 1 ? 'saco rest.' : 'sacos'}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Granel Bar & Actions */}
              {isGranel && (
                <div className="flex flex-col gap-2 mt-1 bg-white/[0.03] rounded-xl p-3 border border-white/5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Capacidade do tambor</span>
                    <span className="text-purple-300 font-bold">{fillPercent}% restante {((remaining ?? 0)).toFixed(1)} kg)</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500 shadow-[0_0_8px_#a855f7]"
                      style={{ width: `${fillPercent}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setAdjustModalProduct(product);
                        setAdjustWeightVal(product.remainingKg ?? 7.2);
                      }}
                      className="h-9 px-2 rounded-lg glass-card-interactive text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-purple-400">tune</span>
                      Ajustar Pesagem
                    </button>
                    <button
                      type="button"
                      onClick={() => openNewBulkSack(product.id)}
                      className="h-9 px-2 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-[12px] font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_circle</span>
                      Abrir Novo Saco
                    </button>
                  </div>
                </div>
              )}

              {/* Low Stock Warning Row */}
              {isLowStock && !isGranel && (
                <div className="flex items-center gap-2 pt-1 mt-1">
                  <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-300 text-[12px] font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-red-400">local_shipping</span>
                    <span className="truncate">Fornecedor: {product.supplier || 'Distribuidora Pet'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => orderProductSupplier(product.id)}
                    className="h-9 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                    + Pedir
                  </button>
                </div>
              )}

              {/* Pharmacy or Standard Footer Location & Fast Add */}
              {!isGranel && !isLowStock && (
                <div className="flex items-center justify-between pt-1 mt-0.5 bg-white/[0.02] border border-white/5 rounded-lg p-2 text-[12px]">
                  <div className="flex items-center gap-2 text-white/50 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-indigo-400">inventory_2</span>
                    <span>{product.location}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart(product, 1)}
                    className="h-8 px-3 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/30 border border-indigo-500/30 flex items-center gap-1 text-[11px] font-semibold text-indigo-200 transition-colors cursor-pointer"
                    title="Adicionar ao Caixa"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Lançar no PDV
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Action Button (FAB): Entry / New Product */}
      <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40">
        <button
          onClick={() => setIsEntrySheetOpen(true)}
          type="button"
          className="h-14 px-5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full shadow-[0_8px_30px_rgba(99,102,241,0.4)] border border-indigo-400/40 flex items-center gap-2.5 active:scale-95 transition-all font-bold text-[13px] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">post_add</span>
          <span className="tracking-wide">Entrada NF-e / Item</span>
        </button>
      </div>

      {/* Bottom Sheet Modal: New Entry */}
      {isEntrySheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-md transition-opacity">
          <div className="bg-[#0e0f1d] border-t border-white/15 rounded-t-3xl p-5 flex flex-col gap-4 max-h-[85vh] overflow-y-auto shadow-2xl max-w-lg mx-auto w-full animate-slide-up text-white">
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-1"></div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Estoque Ágil</span>
                <h3 className="text-[18px] font-bold text-white">Entrada de Mercadoria</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEntrySheetOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white active:scale-95 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEntrySheetOpen(false);
                  showToast('Câmera ativada: Aponte para o código da NF-e / DANFE', 'document_scanner');
                }}
                className="p-3.5 glass-card-interactive rounded-xl flex flex-col items-center text-center gap-2 transition-colors cursor-pointer active:scale-95 border border-white/10"
              >
                <span className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">document_scanner</span>
                </span>
                <span className="font-semibold text-[13px] text-white">Importar XML / Danfe</span>
                <span className="text-[11px] text-white/50 leading-tight">Leitura automática de tributos e custos</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEntrySheetOpen(false);
                  showToast('Formulário manual de cadastro de lote aberto', 'edit_note');
                }}
                className="p-3.5 glass-card-interactive rounded-xl flex flex-col items-center text-center gap-2 transition-colors cursor-pointer active:scale-95 border border-white/10"
              >
                <span className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">edit_note</span>
                </span>
                <span className="font-semibold text-[13px] text-white">Cadastro Manual</span>
                <span className="text-[11px] text-white/50 leading-tight">Cadastrar granel, fardo ou vacina</span>
              </button>
            </div>

            <div className="glass-card p-3.5 flex flex-col gap-2 mt-1">
              <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider">Últimas Notas Importadas</span>
              <div className="flex items-center justify-between text-[12px]">
                <div className="flex flex-col">
                  <span className="font-semibold text-white">NF 104.892 • PremieR Pet</span>
                  <span className="text-[11px] text-white/50">Ontem, 16:40 • 42 sacarias</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
                  Auditada
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEntrySheetOpen(false)}
              className="w-full h-12 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl font-semibold text-[13px] mt-2 transition-colors cursor-pointer"
            >
              Fechar Janela
            </button>
          </div>
        </div>
      )}

      {/* Adjust Weight Modal */}
      {adjustModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0e0f1d] border border-white/15 rounded-2xl p-5 w-full max-w-sm shadow-2xl flex flex-col gap-4 animate-scale-up text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <span className="material-symbols-outlined text-[18px]">scale</span>
                </span>
                <h4 className="font-semibold text-[16px] text-white">Ajustar Pesagem</h4>
              </div>
              <button
                type="button"
                onClick={() => setAdjustModalProduct(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[13px] text-white/70">
                {adjustModalProduct.name}
              </span>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={adjustModalProduct.maxKg || 15}
                  value={adjustWeightVal}
                  onChange={e => setAdjustWeightVal(parseFloat(e.target.value) || 0)}
                  className="flex-1 h-12 px-3 text-[22px] text-white font-bold bg-white/[0.05] rounded-xl border border-white/15 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
                />
                <span className="text-[18px] font-bold text-white/60">kg</span>
              </div>
              <span className="text-[11px] text-white/40 text-center mt-1">
                Capacidade do tambor: {adjustModalProduct.maxKg || 15.0} kg
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setAdjustModalProduct(null)}
                className="h-11 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-[13px] font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  adjustProductWeight(adjustModalProduct.id, adjustWeightVal);
                  setAdjustModalProduct(null);
                }}
                className="h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[13px] font-bold shadow-lg shadow-purple-500/20 border border-purple-400/30 transition-colors cursor-pointer"
              >
                Salvar Peso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
