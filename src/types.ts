export type TabType = 'pdv' | 'granel' | 'petcare' | 'clientes' | 'fornecedores' | 'entradas' | 'gestao' | 'bot';

export interface ImportedItem {
  id: string;
  code: string;
  ean: string;
  name: string;
  ncm: string;
  unit: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  suggestedSalePrice: number;
  marginPercent: number;
  category: 'fechados' | 'granel' | 'farmacia' | 'petcare';
  // Fator de Conversão Pet Shop & Agropecuária
  conversionType: 'unidade' | 'fracionar_caixa' | 'despejar_granel';
  conversionFactor: number; // Ex: 12 unidades por caixa, ou 15kg por saco
  convertedQuantity: number;
  convertedUnitCost: number;
  convertedUnit: string;
  matchedProductId?: string;
  isNewProduct?: boolean;
}

export interface ImportedNFe {
  id: string;
  chaveAcesso: string;
  numeroNota: string;
  serie: string;
  dataEmissao: string;
  fornecedorNome: string;
  fornecedorCnpj: string;
  valorTotal: number;
  status: 'importada' | 'pendente_conferencia' | 'cancelada';
  sourceType: 'xml' | 'pdf_ia' | 'csv' | 'sefaz';
  items: ImportedItem[];
  boletos: {
    numero: string;
    vencimento: string;
    valor: number;
  }[];
  observacoes?: string;
  createdAt: string;
}

export interface SefazIncomingInvoice {
  id: string;
  chaveAcesso: string;
  numero: string;
  serie: string;
  emitenteNome: string;
  emitenteCnpj: string;
  dataEmissao: string;
  valor: number;
  itensCount: number;
  statusManifestacao: 'sem_manifestacao' | 'ciencia' | 'confirmada' | 'desconhecida';
  statusEntrada: 'pendente' | 'importada';
  xmlPreload?: string;
}

export interface MigrationColumnMapping {
  eanCol: number;
  nameCol: number;
  costCol: number;
  priceCol: number;
  stockCol: number;
  minStockCol: number;
  categoryCol: number;
  unitCol: number;
}


export interface Supplier {
  id: string;
  name: string;
  tradeName: string;
  cnpj: string;
  category: 'racoes' | 'graos' | 'farmacia' | 'higiene';
  categoryLabel: string;
  contactName: string;
  phone: string;
  whatsapp: string;
  email: string;
  paymentTerms: string;
  deliveryDays: string;
  minOrderValue: number;
  brands: string[];
  suppliedProductsCount: number;
  openOrdersCount: number;
  rating: number;
  notes?: string;
  lastOrderDate?: string;
  logo?: string;
}

export interface SupplierOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  expectedDelivery: string;
  status: 'cotacao' | 'enviado' | 'faturado' | 'entregue';
  itemsSummary: string;
  totalValue: number;
  paymentTerm: string;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'fechados' | 'granel' | 'farmacia' | 'petcare';
  sku: string;
  price: number;
  costPrice?: number;
  marginPercent?: number;
  unit: string;
  stock: number;
  minStock: number;
  location: string;
  image: string;
  imageAlt?: string;
  isGranel?: boolean;
  remainingKg?: number;
  maxKg?: number;
  batch?: string;
  expiration?: string;
  supplier?: string;
  margin?: string;
}

export interface PetCareAppointment {
  id: string;
  petName: string;
  petBreed: string;
  petAge: string;
  petSize: 'Porte Pequeno' | 'Porte Médio' | 'Porte Grande';
  services: string[];
  observations?: string;
  tutorName: string;
  tutorPhone?: string;
  taxiDog: boolean;
  timeSlot: string;
  price: number;
  status: 'waiting' | 'in-progress' | 'ready';
  image: string;
  imageAlt?: string;
  badge?: string;
  crossSellHint?: string;
  // Compatibilidade
  breed?: string;
  ownerName?: string;
  service?: string;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  cpf?: string;
  address?: string;
  neighborhood?: string;
  pets?: string[];
  recurringProduct?: string;
  recurringFrequency?: string;
  debtBalance: number;
  creditLimit?: number;
  debtLimit?: number;
  dueDate?: string;
  isOverdue?: boolean;
  overdueDays?: number;
  isVerified?: boolean;
  isVip?: boolean;
  loyaltyPoints?: number;
  availableDiscount?: number;
  status?: string;
  lastPurchase?: string;
  category?: 'fiado' | 'fidelidade' | 'agro';
  avatar?: string;
  image?: string;
  imageAlt?: string;
  isAnonymized?: boolean;
  anonymizedAt?: string;
  notes?: string;
}

export interface Sale {
  id: string;
  code: string;
  paymentMethod: 'PIX' | 'Dinheiro' | 'Cartão Crédito' | 'Cartão Débito' | 'Fiado';
  itemsSummary: string;
  location: string;
  timeAgo: string;
  total: number;
  status: 'Concluída' | 'Pendente';
  isGranel?: boolean;
  isService?: boolean;
  clientName?: string;
  items?: CartItem[];
  dateTimestamp?: string;
}

export interface BillPayable {
  id: string;
  supplier: string;
  description: string;
  docNumber?: string;
  dueDateText?: string;
  dueDate?: string;
  dueDays?: number;
  status: 'hoje' | 'avencer' | 'pago' | 'pendente';
  value?: number;
  amount?: number;
  barcode?: string;
  paidAt?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  isGranel?: boolean;
}

export type UserRole = 'dono' | 'admin' | 'gerente' | 'operador' | 'vendedor' | 'tosador' | 'veterinario';

export interface EmployeeWorkShift {
  startTime: string; // Ex: "08:00"
  endTime: string;   // Ex: "18:00"
  workDays: number[]; // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
}

export interface EmployeeUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  role: UserRole;
  roleLabel: string;
  roleDescription: string;
  avatar: string;
  pin: string;
  pinHash?: string;
  salt?: string;
  badgeColor: string;
  isActive?: boolean;
  createdAt?: string;
  workShift?: EmployeeWorkShift;
  maxDiscountPercent?: number; // Limite de desconto no balcão (ex: 5%)
  allowRemoteAccess?: boolean; // Se tem liberação de login remoto permanente
  // Regras Hierárquicas Empresariais (Nicho Pet Shop & Agropecuária)
  canAccessFinance: boolean;          // DRE, Lucro Líquido, Balanços, Boletos a pagar
  canViewCostPrices: boolean;         // Ver custo de compra de fábrica e margem de lucro dos produtos/ração
  canViewGlobalSalesMetrics: boolean; // Faturamento total da loja e metas gerais (vs turno do operador)
  canManageSuppliersCost: boolean;    // Ver condições financeiras, prazos faturados e faturamento de atacado
  canCreateSupplierOrders: boolean;   // Criar ordens de compra de atacado de milhares de reais
  canCloseCashier: boolean;           // Fechamento e sangria de caixa
  canApproveCredit: boolean;          // Alterar limite de fiado e liberar inadimplentes
  canApplySpecialDiscount: boolean;   // Conceder desconto > 5% no balcão sem senha de supervisor
  canModifySettings: boolean;         // Ajustes operacionais da loja
  canModifyMasterSettings: boolean;   // Dados fiscais mestres, CNPJ, Razão Social, Chave PIX
  canAdjustInventoryLoss: boolean;    // Ajustar quebra de estoque e pesagem sem supervisor
  // Campos de compatibilidade
  canManageSuppliers?: boolean;
  canApplyLargeDiscounts?: boolean;
  canAuthorizeCredit?: boolean;
}

export interface StoreSettings {
  storeName: string;
  tradeName: string;
  cnpj: string;
  phone: string;
  pixKey: string;
  defaultCreditLimit: number;
  minStockAlertDays: number;
  autoPrintReceipt: boolean;
  soundAlerts: boolean;
  quickWeights: number[];
  defaultMarkupPercent: number;
  whatsappMessageTemplate: string;
}

export type ConnectionMode = 'local' | 'remoto';

export interface RemoteAccessPass {
  id: string;
  employeeId: string;
  employeeName: string;
  authorizedBy: string;
  authorizedAt: string;
  expiresAt: string;
  reason: string;
  status: 'ativo' | 'expirado' | 'revogado';
}

export interface RemoteAccessPolicy {
  allowRemoteOperatorAccess: boolean; // Se operadores podem acessar remotamente
  requireOwnerApproval: boolean;      // Se requer autorização explícita do Dono/Gerente
  businessHoursStart: string;         // ex: "08:00"
  businessHoursEnd: string;           // ex: "18:30"
  businessDays: number[];             // [1, 2, 3, 4, 5, 6] (Seg a Sáb)
  emergencyLockdown: boolean;         // Trava geral de emergência (corta operadores remotos imediatamente)
  authorizedPasses: RemoteAccessPass[];
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  employeeId: string;
  employeeName: string;
  role: UserRole;
  action: 'login_remoto_autorizado' | 'login_remoto_bloqueado' | 'autorizacao_concedida' | 'bloqueio_emergencia' | 'tentativa_horario_invalido' | 'alteracao_politica_remota' | 'cadastro_colaborador' | 'anonimizacao_lgpd' | 'bloqueio_tela' | 'desbloqueio_tela';
  deviceInfo: string;
  ipAddress: string;
  status: 'sucesso' | 'bloqueado' | 'alerta';
  details: string;
}

// ----------------------------------------------------
// MÓDULO RAG + ATENDIMENTO IA (WHATSAPP & PEDIDOS ONLINE)
// ----------------------------------------------------

export interface BotSettings {
  enabled: boolean;
  botName: string;
  tone: 'caloroso' | 'comercial' | 'tecnico';
  greetingMessage: string;
  businessHoursOnly: boolean; // Atender só fora do expediente ou 24h
  whatsappNumber: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  deliveryNeighborhoods: string[];
  pixKey: string;
  autoConfirmOrders: boolean;
  soundAlertOnNewLead: boolean;
  storeAddress: string;
  faqCustomInfo: string;
}

export interface OnlineOrderItem {
  productId?: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  isGranel?: boolean;
}

export interface OnlineOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  neighborhood?: string;
  petName?: string;
  petBreedOrSize?: string;
  items: OnlineOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'pix' | 'cartao_entrega' | 'dinheiro' | 'fiado_aprovado';
  changeFor?: number;
  status: 'pendente' | 'em_separacao' | 'saiu_entrega' | 'concluido' | 'cancelado';
  source: 'whatsapp_bot' | 'site_online';
  createdAt: string;
  notes?: string;
  serviceType?: 'produtos' | 'petcare' | 'misto';
  petCareAppointmentId?: string;
}

export interface BotChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  metadata?: {
    suggestedProducts?: string[];
    generatedOrder?: Partial<OnlineOrder>;
    scheduledAppointment?: any;
    ragSources?: string[];
    actionTaken?: 'ORDER_CREATED' | 'PETCARE_BOOKED' | 'PRICE_QUOTED';
  };
}
