import React from 'react';
import { useApp } from '../context/AppContext';
import { copyToClipboard } from '../utils/clipboard';

export const CupomModal: React.FC = () => {
  const { selectedSaleForReceipt, closeReceiptModal, showToast } = useApp();

  if (!selectedSaleForReceipt) return null;

  const sale = selectedSaleForReceipt;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWhatsApp = async () => {
    const text = `🐾 *GLOBAL PET & AGRO - CUPOM DE VENDA* 🐾\n` +
      `--------------------------------\n` +
      `Venda: ${sale.code}\n` +
      `Data: ${sale.dateTimestamp || 'Hoje'}\n` +
      `Cliente: ${sale.clientName || 'Consumidor Final'}\n` +
      `--------------------------------\n` +
      `ITENS:\n` +
      (sale.items?.map(i => `• ${i.quantity}${i.unit === 'kg' ? 'kg' : 'x'} ${i.name}: R$ ${(i.price * i.quantity).toFixed(2).replace('.', ',')}`).join('\n') || `• ${sale.itemsSummary}`) +
      `\n--------------------------------\n` +
      `*TOTAL: R$ ${sale.total.toFixed(2).replace('.', ',')}*\n` +
      `Pagamento: ${sale.paymentMethod}\n` +
      `--------------------------------\n` +
      `Obrigado pela preferência! Volte sempre!`;

    const success = await copyToClipboard(text);
    if (success) {
      showToast('Comprovante formatado copiado para o WhatsApp!', 'content_copy');
    } else {
      showToast('Comprovante pronto para visualização!', 'receipt_long');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-sm bg-[#0e0f1d] border border-white/15 text-white rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-emerald-400">receipt</span>
            <span className="font-bold text-[14px] text-white">Comprovante de Venda</span>
          </div>
          <button
            type="button"
            onClick={closeReceiptModal}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Cupom térmico estilizado (papel 80mm) */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#0a0b14] flex flex-col items-center">
          <div className="w-full bg-[#f8f9fa] text-neutral-800 p-5 rounded-lg shadow-md font-mono text-[11px] leading-tight border border-neutral-300 select-all print:border-none print:shadow-none print:w-full">
            {/* Cabeçalho do estabelecimento */}
            <div className="text-center flex flex-col gap-0.5 pb-3 border-b border-dashed border-neutral-400">
              <span className="font-bold text-[14px] tracking-wider text-neutral-900">GLOBAL PET & AGRO</span>
              <span className="text-[10px] text-neutral-600">COMÉRCIO DE RAÇÕES E PET SHOP LTDA</span>
              <span className="text-[10px] text-neutral-600">CNPJ: 38.192.481/0001-92 • IE: 104.928.371</span>
              <span className="text-[10px] text-neutral-600">Rua do Comércio, 420 - Centro</span>
              <span className="text-[10px] text-neutral-600">Tel/WhatsApp: (11) 98765-4321</span>
            </div>

            {/* Identificação da Venda */}
            <div className="py-2.5 border-b border-dashed border-neutral-400 flex flex-col gap-1 text-[10px]">
              <div className="flex justify-between">
                <span>DOC NÃO-FISCAL: <strong>{sale.code}</strong></span>
                <span>CX: 01</span>
              </div>
              <div className="flex justify-between">
                <span>DATA: {sale.dateTimestamp || 'Hoje'}</span>
                <span className="uppercase text-emerald-700 font-bold">{sale.status}</span>
              </div>
              <div className="pt-0.5">
                <span>CLIENTE: <strong>{sale.clientName || 'Consumidor Final'}</strong></span>
              </div>
            </div>

            {/* Lista de Itens */}
            <div className="py-2.5 border-b border-dashed border-neutral-400 flex flex-col gap-1.5">
              <div className="flex justify-between font-bold text-[10px] uppercase text-neutral-600 border-b border-neutral-200 pb-1">
                <span>ITEM / DESCRIÇÃO</span>
                <span>TOTAL</span>
              </div>

              {sale.items && sale.items.length > 0 ? (
                sale.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="font-medium text-[11px] truncate text-neutral-900">{item.name}</span>
                    <div className="flex justify-between text-[10px] text-neutral-600">
                      <span>{item.quantity} {item.unit} x R$ {(item.price ?? 0).toFixed(2).replace('.', ',')}</span>
                      <span className="font-bold text-neutral-900">
                        R$ {((item.price ?? 0) * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-between py-1 text-neutral-800 font-medium">
                  <span>{sale.itemsSummary}</span>
                  <span>R$ {sale.total.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
            </div>

            {/* Totais & Pagamento */}
            <div className="py-2.5 border-b border-dashed border-neutral-400 flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span>SUBTOTAL:</span>
                <span>R$ {sale.total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-[11px] text-neutral-600">
                <span>DESCONTOS:</span>
                <span>R$ 0,00</span>
              </div>
              <div className="flex justify-between font-bold text-[14px] text-neutral-900 pt-1 border-t border-neutral-300">
                <span>TOTAL A PAGAR:</span>
                <span>R$ {sale.total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-[10px] pt-1 text-neutral-700">
                <span>FORMA PGTO:</span>
                <span className="font-bold uppercase">{sale.paymentMethod}</span>
              </div>
            </div>

            {/* Mensagem Final de Agradecimento */}
            <div className="pt-3 text-center flex flex-col gap-0.5 text-[9px] text-neutral-500">
              <span className="font-semibold text-neutral-700">OBRIGADO PELA PREFERÊNCIA!</span>
              <span>Global Pet - O melhor amigo do seu animal</span>
              <span>Guarde este comprovante para eventuais trocas</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopyWhatsApp}
            className="h-9 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-400">content_copy</span>
            <span>Copiar WhatsApp</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[12px] font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Imprimir</span>
            </button>
            <button
              type="button"
              onClick={closeReceiptModal}
              className="h-9 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-[12px] font-semibold transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
