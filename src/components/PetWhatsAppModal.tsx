import React, { useState, useEffect } from 'react';
import { PetCareAppointment } from '../types';
import { useApp } from '../context/AppContext';
import { copyToClipboard } from '../utils/clipboard';

interface PetWhatsAppModalProps {
  pet: PetCareAppointment | null;
  onClose: () => void;
}

export const PetWhatsAppModal: React.FC<PetWhatsAppModalProps> = ({ pet, onClose }) => {
  const { showToast } = useApp();

  const [tutorPhone, setTutorPhone] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'ready' | 'taxidog' | 'vip'>('ready');

  useEffect(() => {
    if (!pet) return;

    setTutorPhone(pet.tutorPhone || '(11) 98765-4321');
    applyTemplate('ready', pet);
  }, [pet]);

  const applyTemplate = (template: 'ready' | 'taxidog' | 'vip', targetPet: PetCareAppointment) => {
    setSelectedTemplate(template);
    const servicesText = targetPet.services.join(' + ');
    const priceText = `R$ ${(targetPet.price ?? 0).toFixed(2).replace('.', ',')}`;

    if (template === 'ready') {
      setCustomMessage(
        `🐾 *GLOBAL PET & AGRO - ESTÉTICA ANIMAL* 🐾\n\n` +
        `Olá, *${targetPet.tutorName}*! Tudo bem?\n\n` +
        `Passando para avisar que o(a) lindo(a) *${targetPet.petName}* (${targetPet.petBreed}) já finalizou os cuidados (*${servicesText}*) aqui na nossa estética! 🛁✨\n\n` +
        `Ficou super cheiroso(a), escovado(a) e está prontinho(a) esperando você para o reencontro! 🐶❤️\n\n` +
        `💰 *Valor:* ${priceText}\n` +
        `📍 *Retirada:* Rua do Comércio, 420 - Centro\n\n` +
        `Te esperamos! Qualquer dúvida, estamos à disposição!`
      );
    } else if (template === 'taxidog') {
      setCustomMessage(
        `🚕 *TÁXI DOG - GLOBAL PET* 🚕\n\n` +
        `Olá, *${targetPet.tutorName}*!\n\n` +
        `O banho do(a) *${targetPet.petName}* foi um sucesso! Ele(a) já está no Táxi Dog climatizado a caminho da sua residência! 🐕💨\n\n` +
        `Previsão de chegada: cerca de 15 a 25 minutos. Por favor, mantenha alguém disponível para recebê-lo(a).\n\n` +
        `💰 *Total com Táxi:* ${priceText}\n\n` +
        `Muito obrigado pela confiança!`
      );
    } else {
      setCustomMessage(
        `⭐ *SEU PET ESTÁ RADIANTE!* ⭐\n\n` +
        `Oi, *${targetPet.tutorName}*!\n\n` +
        `Você não tem ideia de como o(a) *${targetPet.petName}* se comportou bem hoje! Ganhou até lacinho especial e nosso petisco artesanal! 🎀🐾\n\n` +
        `Já pode vir buscá-lo(a) para receber muitos beijos e carinhos! Te aguardamos na Global Pet!`
      );
    }
  };

  if (!pet) return null;

  const handleSendWhatsApp = () => {
    // Clean phone number: keep only digits
    let digits = tutorPhone.replace(/\D/g, '');
    if (!digits) {
      digits = '11987654321';
    }
    // Prepend 55 (Brazil) if not present
    if (!digits.startsWith('55') && digits.length <= 11) {
      digits = '55' + digits;
    }

    const encodedMsg = encodeURIComponent(customMessage);
    const waUrl = `https://wa.me/${digits}?text=${encodedMsg}`;

    // Safely copy to clipboard while focus is active
    copyToClipboard(customMessage);

    // Open WhatsApp Web/Mobile
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    showToast(`WhatsApp aberto para ${pet.tutorName} avisando sobre ${pet.petName}!`, 'send');
    onClose();
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(customMessage);
    if (success) {
      showToast('Texto do aviso copiado para a área de transferência!', 'content_copy');
    } else {
      showToast('Texto selecionado para envio!', 'chat');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[#0e0f1d] border border-emerald-500/30 text-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-emerald-950/40 via-white/[0.02] to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
              <span className="material-symbols-outlined text-[24px]">chat</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[16px] text-white">Avisar Tutor no WhatsApp</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Pet Pronto
                </span>
              </div>
              <p className="text-[11px] text-white/50">Disparo automático para busca e retirada do animal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
          {/* Pet & Tutor Summary Card */}
          <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={pet.image}
                alt={pet.petName}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/30 flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[15px] text-white truncate">{pet.petName}</span>
                  <span className="text-[11px] text-white/50">({pet.petBreed})</span>
                </div>
                <span className="text-[12px] text-white/70 truncate">
                  Tutor(a): <strong className="text-white">{pet.tutorName}</strong>
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end flex-shrink-0">
              <span className="text-[10px] uppercase text-white/40 font-bold">Serviço</span>
              <span className="font-bold text-[13px] text-emerald-400">
                R$ {(pet.price ?? 0).toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Telefone WhatsApp Input */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-wider text-white/60 font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-emerald-400">phone</span>
              Número WhatsApp do Tutor:
            </label>
            <input
              type="text"
              value={tutorPhone}
              onChange={e => setTutorPhone(e.target.value)}
              placeholder="(11) 98765-4321"
              className="h-10 px-3 rounded-xl bg-white/[0.05] border border-white/15 text-white font-mono text-[13px] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Template Switcher Pills */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-white/60 font-bold">
              Modelos de Mensagem Pronta:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => applyTemplate('ready', pet)}
                className={`py-2 px-2.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  selectedTemplate === 'ready'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold shadow-sm'
                    : 'bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/[0.07] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">pets</span>
                <span>Banho Concluído</span>
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('taxidog', pet)}
                className={`py-2 px-2.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  selectedTemplate === 'taxidog'
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-bold shadow-sm'
                    : 'bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/[0.07] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">local_taxi</span>
                <span>Táxi Dog a Caminho</span>
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('vip', pet)}
                className={`py-2 px-2.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  selectedTemplate === 'vip'
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 font-bold shadow-sm'
                    : 'bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/[0.07] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">star</span>
                <span>Carinhoso VIP</span>
              </button>
            </div>
          </div>

          {/* Mensagem Preview / Editor (WhatsApp Balloon Style) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wider text-white/60 font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-emerald-400">edit_note</span>
                Mensagem Formatada (Pode editar antes de enviar):
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                Copiar
              </button>
            </div>

            <div className="relative rounded-2xl bg-[#0b141a] border border-[#202c33] p-3 shadow-inner">
              <div className="bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tr-none text-[12px] leading-relaxed font-sans shadow-md border border-emerald-500/20">
                <textarea
                  value={customMessage}
                  onChange={e => setCustomMessage(e.target.value)}
                  rows={6}
                  className="w-full bg-transparent text-white text-[12px] outline-none resize-none placeholder:text-white/40 leading-relaxed font-sans"
                />
                <div className="flex justify-end items-center gap-1 pt-1 text-[10px] text-emerald-200/80">
                  <span>Agora</span>
                  <span className="material-symbols-outlined text-[14px] text-sky-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                    done_all
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-[12px] font-semibold transition-colors cursor-pointer"
          >
            Fechar
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="h-10 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>Copiar Texto</span>
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[12px] font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer border border-emerald-400/40"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Disparar WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
