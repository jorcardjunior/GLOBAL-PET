import React, { useState } from 'react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'visao' | 'modulos' | 'passo-a-passo'>('visao');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-[#0e0f1d] border border-indigo-500/30 text-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-950/50 via-white/[0.02] to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/30">
              <span className="material-symbols-outlined text-[24px]">menu_book</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[17px] text-white">Manual Prático do Sistema</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Guia do Operador
                </span>
              </div>
              <p className="text-[11px] text-white/50">Tudo sobre o Global Pet - AgroRação Pro explicado de forma simples e intuitiva</p>
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-2 bg-white/[0.02] border-b border-white/10 overflow-x-auto no-scrollbar">
          {[
            { id: 'visao', label: '1. O que é o Sistema', icon: 'storefront' },
            { id: 'modulos', label: '2. Os 6 Módulos do Pet Shop', icon: 'dashboard_customize' },
            { id: 'passo-a-passo', label: '3. Guia Prático de 5 Minutos', icon: 'play_circle' },
          ].map(tab => {
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-[12px] font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400/40 shadow-sm'
                    : 'bg-white/[0.03] text-white/60 border-white/5 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-white/90 text-[13px] leading-relaxed">
          {activeSection === 'visao' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/30 via-white/[0.02] to-purple-900/30 border border-indigo-500/20">
                <h4 className="text-[16px] font-bold text-white flex items-center gap-2 mb-2">
                  <span className="text-xl">🐾</span> Uma Solução Feita para a Realidade Brasileira
                </h4>
                <p className="text-white/80 leading-relaxed">
                  Casas de ração e pet shops têm um desafio único no comércio: em uma mesma loja, você vende ração pesada no quilo (granel), sacarias de 15kg na gôndola, atende banho & tosa nos fundos, vende fiado no caderninho para os vizinhos conhecidos e negocia pedidos semanais com grandes distribuidores.
                </p>
                <p className="text-white/80 leading-relaxed mt-2">
                  O <strong>Global Pet - AgroRação Pro</strong> foi desenhado para eliminar a confusão de anotações em papel e planilhas complexas, unificando toda a operação em um sistema visual, veloz e pronto para o dia a dia.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-[18px]">offline_bolt</span>
                  </div>
                  <h5 className="font-bold text-white text-[13px]">100% Persistente</h5>
                  <p className="text-[11px] text-white/60 mt-1">Se faltar energia ou fechar a aba, nenhuma venda ou dado se perde graças à gravação local.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </div>
                  <h5 className="font-bold text-white text-[13px]">WhatsApp Integrado</h5>
                  <p className="text-[11px] text-white/60 mt-1">Avisos automáticos de pet pronto e comprovantes de venda direto no celular do tutor.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-[18px]">print</span>
                  </div>
                  <h5 className="font-bold text-white text-[13px]">Cupom Térmico 80mm</h5>
                  <p className="text-[11px] text-white/60 mt-1">Compatível com impressoras padrão de bobina térmica para emissão de recibos na hora.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'modulos' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-indigo-300 font-bold">
                  <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
                  <span>1. PDV Ágil (Frente de Caixa)</span>
                </div>
                <p className="text-[12px] text-white/70">
                  Vendas em menos de 10 segundos com leitor de código de barras ou busca preditiva. 5 formas de pagamento (PIX, Dinheiro, Cartão Crédito, Cartão Débito e Fiado). Baixa automática de estoque e impressão de cupom térmico não-fiscal de 80mm.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <span className="material-symbols-outlined text-[20px]">scale</span>
                  <span>2. Controle de Granel (Tambores & Balança)</span>
                </div>
                <p className="text-[12px] text-white/70">
                  Gestão visual dos tambores de ração por quilo, cálculo de margem de lucro comparativo (saco fechado vs fracionado gerando de 45% a 70% de margem) e alertas de fundo de tambor e validade de lotes.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold">
                  <span className="material-symbols-outlined text-[20px]">pets</span>
                  <span>3. Estética Animal (Banho & Tosa)</span>
                </div>
                <p className="text-[12px] text-white/70">
                  Fila do dia dividida em Aguardando, Em Atendimento e Pronto. Suporte a Táxi Dog, integração com WhatsApp para aviso automático de retirada ao tutor e importação rápida do serviço para o caixa do PDV.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                  <span>4. Caderninho Comunitário (Clientes & Fiado)</span>
                </div>
                <p className="text-[12px] text-white/70">
                  Controle de crédito com limite parametrizável por cliente, acompanhamento de atrasos, amortizações parciais (ex: abater R$ 50 na sexta-feira) e envio de extrato de débitos por WhatsApp.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sky-300 font-bold">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                  <span>5. Gestão de Fornecedores & Compras</span>
                </div>
                <p className="text-[12px] text-white/70">
                  Catálogo de distribuidores de rações e medicamentos, cotação com 1 clique acionada por alertas de estoque baixo e entrada automática de estoque ao confirmar a entrega do pedido.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-rose-300 font-bold">
                  <span className="material-symbols-outlined text-[20px]">query_stats</span>
                  <span>6. Gestão Financeira & DRE</span>
                </div>
                <p className="text-[12px] text-white/70">
                  DRE simplificada em tempo real, apuração de CMV (Custo da Mercadoria Vendida), gráficos de composição de receita por categoria e agenda de boletos a pagar com cópia da linha digitável.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-purple-500/30 flex flex-col gap-2 bg-gradient-to-r from-purple-950/20 to-transparent">
                <div className="flex items-center gap-2 text-purple-300 font-bold">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                  <span>7. Robô RAG WhatsApp (Atendimento e Pedidos Online)</span>
                </div>
                <p className="text-[12px] text-white/70">
                  Inteligência Artificial generativa conectada ao catálogo real, preços de ração a granel e tabela do banho & tosa. Atende clientes de madrugada e finais de semana pelo WhatsApp, fecha pedidos delivery com frete automático e envia direto para a fila do caixa PDV.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'passo-a-passo' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <h4 className="font-bold text-emerald-300 text-[14px] flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  Roteiro de Demonstração Rápida (5 minutos)
                </h4>
                <p className="text-[12px] text-emerald-200/80">
                  Siga estes 6 passos para testar e comprovar a interligação de ponta a ponta do sistema:
                </p>
              </div>

              <ol className="space-y-3 list-decimal list-inside text-white/80 text-[12px]">
                <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-white">Avisar Tutor no Banho & Tosa:</strong> Vá na aba <em>Pet Care</em>, clique no botão <em>"Finalizar & Avisar"</em> do cãozinho Thor. Observe a abertura imediata do assistente com a mensagem personalizada pronta para envio por WhatsApp!
                </li>
                <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-white">Realizar Venda de Ração a Granel:</strong> No <em>PDV</em>, clique em <em>"Nova Venda"</em>, escolha a ração Golden Frango, selecione o atalho de <em>2.5 kg</em> e finalize via <em>PIX</em>.
                </li>
                <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-white">Imprimir Cupom da Venda:</strong> Veja o cupom térmico não-fiscal ser exibido na tela, pronto para imprimir na impressora de 80mm ou ser copiado para o WhatsApp do cliente.
                </li>
                <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-white">Conferir Baixa no Estoque:</strong> Acesse a aba <em>Granel</em> e comprove que o tambor correspondente teve seus 2,5 kg deduzidos em tempo real.
                </li>
                <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-white">Abater Fiado no Caderninho:</strong> Na aba <em>Clientes</em>, localize o <em>Seu Antônio</em> e dê baixa de R$ 50,00 no débito dele.
                </li>
                <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-white">Emitir Pedido ao Fornecedor:</strong> No card de alerta de estoque do PDV, clique em <em>"Emitir Pedido de Reposição"</em> para gerar a cotação no módulo de Fornecedores.
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white/[0.02] border-t border-white/10 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[12px] font-semibold cursor-pointer shadow-md"
          >
            Entendido, Fechar Manual
          </button>
        </div>
      </div>
    </div>
  );
};
