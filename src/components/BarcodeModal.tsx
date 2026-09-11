import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const BarcodeModal: React.FC = () => {
  const { isBarcodeModalOpen, closeBarcodeModal, products, addToCart, showToast } = useApp();
  const [manualCode, setManualCode] = useState('');
  const [scannedProduct, setScannedProduct] = useState<any | null>(null);

  if (!isBarcodeModalOpen) return null;

  const handleScanCode = (code: string) => {
    const found = products.find(p => p.sku.toLowerCase() === code.toLowerCase() || p.name.toLowerCase().includes(code.toLowerCase()));
    if (found) {
      setScannedProduct(found);
      showToast(`Item escaneado: ${found.name}!`, 'barcode_scanner');
    } else {
      setScannedProduct(null);
      showToast('Produto não localizado pelo código de barras.', 'error');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleScanCode(manualCode.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0e0f1d] border border-white/15 text-white rounded-2xl p-5 shadow-2xl flex flex-col gap-4 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">barcode_scanner</span>
            </div>
            <div>
              <h3 className="font-semibold text-[16px] text-white">Consulta & Leitor de Código</h3>
              <p className="text-[11px] text-white/50">Aponte a câmera ou selecione amostra</p>
            </div>
          </div>
          <button
            onClick={closeBarcodeModal}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="relative w-full h-44 rounded-xl bg-black/60 overflow-hidden flex flex-col items-center justify-center border border-white/15 shadow-inner">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {/* Scanning animated laser bar */}
          <div className="w-4/5 h-0.5 bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-pulse my-auto"></div>

          <div className="absolute top-3 left-3 border-t-2 border-l-2 border-indigo-400 w-6 h-6"></div>
          <div className="absolute top-3 right-3 border-t-2 border-r-2 border-indigo-400 w-6 h-6"></div>
          <div className="absolute bottom-3 left-3 border-b-2 border-l-2 border-indigo-400 w-6 h-6"></div>
          <div className="absolute bottom-3 right-3 border-b-2 border-r-2 border-indigo-400 w-6 h-6"></div>

          <span className="absolute bottom-2 text-white/80 text-[11px] bg-black/70 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/10">
            Câmera Ativa • Leitor Laser #01
          </span>
        </div>

        {/* Quick barcode simulation buttons */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">
            Simular Códigos Rápidos de Balcão:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {products.slice(0, 4).map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleScanCode(p.sku)}
                className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-left text-[11px] flex flex-col transition-colors border border-white/10"
              >
                <span className="font-bold text-white truncate">{p.name}</span>
                <span className="font-mono text-[10px] text-indigo-300">{p.sku}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual code input */}
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-white/40">
              search
            </span>
            <input
              type="text"
              placeholder="Digitar código de barras ou SKU..."
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/[0.04] border border-white/15 text-white text-[13px] placeholder:text-white/30 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-[12px] flex items-center gap-1 active:scale-95 transition-all shadow-md shadow-indigo-500/20 cursor-pointer border border-indigo-400/30"
          >
            Buscar
          </button>
        </form>

        {/* Scanned result card */}
        {scannedProduct && (
          <div className="p-3 bg-indigo-500/15 rounded-xl border border-indigo-500/30 flex items-center justify-between gap-3 animate-fade-in">
            <img
              src={scannedProduct.image}
              alt={scannedProduct.name}
              className="w-12 h-12 rounded-lg object-cover ring-1 ring-white/20"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-[13px] text-white truncate">{scannedProduct.name}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-bold text-emerald-400 text-[15px]">
                  R$ {(scannedProduct.price ?? 0).toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] text-white/70 bg-white/10 px-1.5 py-0.2 rounded border border-white/10">
                  {scannedProduct.location}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                addToCart(scannedProduct, 1, scannedProduct.isGranel);
                closeBarcodeModal();
              }}
              className="h-9 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer border border-emerald-400/30"
            >
              <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
              Adicionar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
