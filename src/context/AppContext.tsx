import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  TabType, Product, PetCareAppointment, Client, Sale, BillPayable, CartItem,
  Supplier, SupplierOrder, EmployeeUser, StoreSettings, ImportedNFe, SefazIncomingInvoice,
  ConnectionMode, RemoteAccessPolicy, RemoteAccessPass, SecurityAuditLog,
  BotSettings, OnlineOrder, OnlineOrderItem, BotChatMessage
} from '../types';
import {
  INITIAL_PRODUCTS, INITIAL_PETCARE, INITIAL_CLIENTS, INITIAL_SALES, INITIAL_BILLS,
  INITIAL_SUPPLIERS, INITIAL_SUPPLIER_ORDERS, INITIAL_EMPLOYEES, INITIAL_SETTINGS,
  INITIAL_BOT_SETTINGS, INITIAL_ONLINE_ORDERS, INITIAL_DEMO_CHAT_MESSAGES
} from '../data';
import { MOCK_SEFAZ_INVOICES } from '../data/mockImportDocuments';
import { INITIAL_REMOTE_POLICY, INITIAL_SECURITY_LOGS } from '../data/mockRemoteSecurity';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved && saved !== 'null' && saved !== 'undefined') {
      const parsed = JSON.parse(saved);
      if (parsed !== null && parsed !== undefined) {
        if (Array.isArray(defaultValue) && !Array.isArray(parsed)) {
          return defaultValue;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn(`Erro ao carregar ${key} do localStorage`, e);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Erro ao salvar ${key} no localStorage`, e);
  }
}

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentUser: EmployeeUser;
  employees: EmployeeUser[];
  switchUser: (employeeId: string, enteredPin?: string) => { success: boolean; message: string };
  verifySupervisorPin: (pin: string, minRole?: 'gerente' | 'dono' | 'admin') => { success: boolean; supervisor?: EmployeeUser; message: string };
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  isAjustesModalOpen: boolean;
  openAjustesModal: () => void;
  closeAjustesModal: () => void;
  isEmployeeModalOpen: boolean;
  openEmployeeModal: () => void;
  closeEmployeeModal: () => void;
  isEmployeeManagementOpen: boolean;
  openEmployeeManagement: () => void;
  closeEmployeeManagement: () => void;
  isEmployeeFormOpen: boolean;
  employeeToEdit: EmployeeUser | null;
  openEmployeeForm: (employee?: EmployeeUser | null) => void;
  closeEmployeeForm: () => void;
  gestaoViewMode: 'dashboard' | 'operacional' | 'equipe';
  setGestaoViewMode: (mode: 'dashboard' | 'operacional' | 'equipe') => void;
  navigateToEquipe: () => void;
  addEmployee: (empData: Omit<EmployeeUser, 'id'>) => { success: boolean; message: string; employee?: EmployeeUser };
  updateEmployee: (id: string, updated: Partial<EmployeeUser>) => { success: boolean; message: string };
  deleteEmployee: (id: string) => { success: boolean; message: string };
  toggleEmployeeStatus: (id: string) => void;
  products: Product[];
  petCareQueue: PetCareAppointment[];
  clients: Client[];
  sales: Sale[];
  bills: BillPayable[];
  suppliers: Supplier[];
  supplierOrders: SupplierOrder[];
  cart: CartItem[];
  caixaStatus: {
    isOpen: boolean;
    openedAt: string;
    totalToday: number;
    pixTotal: number;
    cardTotal: number;
    cashTotal: number;
    pedidosCount: number;
  };
  toast: {
    message: string;
    icon?: string;
    visible: boolean;
  };
  showToast: (message: string, icon?: string) => void;
  hideToast: () => void;
  addToCart: (product: Product, quantity?: number, isGranel?: boolean) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  finalizeSale: (paymentMethod: 'PIX' | 'Dinheiro' | 'Cartão Crédito' | 'Cartão Débito' | 'Fiado', clientName?: string) => void;
  adjustProductWeight: (productId: string, newRemainingKg: number) => void;
  openNewBulkSack: (productId: string) => void;
  orderProductSupplier: (productId: string) => void;
  addNewSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (supplierId: string, updated: Partial<Supplier>) => void;
  deleteSupplier: (supplierId: string) => void;
  addNewSupplierOrder: (order: Omit<SupplierOrder, 'id'>) => void;
  updateSupplierOrderStatus: (orderId: string, status: SupplierOrder['status']) => void;
  updatePetStatus: (petId: string, newStatus: 'waiting' | 'in-progress' | 'ready') => void;
  addPetAppointment: (appointment: Omit<PetCareAppointment, 'id'>) => void;
  importPetServiceToPDV: (appointment: PetCareAppointment) => void;
  receiveClientPayment: (clientId: string, amount: number, method: string) => void;
  addNewClient: (client: Omit<Client, 'id'>) => void;
  payBill: (billId: string) => void;
  addNewBill: (bill: Omit<BillPayable, 'id'>) => void;
  closeCaixaOfDay: (cashCounted: number) => void;
  isBarcodeModalOpen: boolean;
  openBarcodeModal: () => void;
  closeBarcodeModal: () => void;
  isNewSaleModalOpen: boolean;
  openNewSaleModal: () => void;
  closeNewSaleModal: () => void;
  selectedSaleForReceipt: Sale | null;
  openReceiptModal: (sale: Sale) => void;
  closeReceiptModal: () => void;
  resetDemoData: () => void;
  // Gestão de Entradas, XML, PDF e SEFAZ
  sefazInvoices: SefazIncomingInvoice[];
  importedHistory: ImportedNFe[];
  manifestarSefaz: (chaveAcesso: string, status: 'ciencia' | 'confirmada' | 'desconhecida') => void;
  importNFeToInventory: (nfe: ImportedNFe, options?: { createBills?: boolean; updateCosts?: boolean }) => { importedCount: number; updatedCount: number };
  importBulkProducts: (newProducts: Product[]) => { importedCount: number; updatedCount: number };
  // Gestão e Monitoramento Remoto
  connectionMode: ConnectionMode;
  setConnectionMode: (mode: ConnectionMode) => void;
  remoteAccessPolicy: RemoteAccessPolicy;
  updateRemoteAccessPolicy: (policy: Partial<RemoteAccessPolicy>) => void;
  securityAuditLogs: SecurityAuditLog[];
  isRemoteAccessBlockedForCurrentUser: boolean;
  grantRemoteAccessPass: (employeeId: string, hoursValid: number, reason: string) => void;
  revokeRemoteAccessPass: (passId: string) => void;
  toggleEmergencyLockdown: () => void;
  requestRemoteAccessWithPin: (pin: string) => { success: boolean; message: string };
  isRemoteDashboardOpen: boolean;
  openRemoteDashboard: () => void;
  closeRemoteDashboard: () => void;
  // Módulo RAG + Atendimento IA (WhatsApp & Pedidos Online)
  botSettings: BotSettings;
  updateBotSettings: (settings: Partial<BotSettings>) => void;
  onlineOrders: OnlineOrder[];
  createOnlineOrder: (order: Omit<OnlineOrder, 'id' | 'orderNumber' | 'createdAt'>) => OnlineOrder;
  updateOnlineOrderStatus: (orderId: string, status: OnlineOrder['status']) => void;
  importOnlineOrderToPDV: (order: OnlineOrder) => void;
  chatMessages: BotChatMessage[];
  sendChatMessage: (text: string) => Promise<BotChatMessage>;
  clearChatMessages: () => void;
  isOnlineOrdersModalOpen: boolean;
  openOnlineOrdersModal: () => void;
  closeOnlineOrdersModal: () => void;
  pendingOnlineOrdersCount: number;
  // Segurança AppSec & LGPD
  isScreenLocked: boolean;
  lockScreen: () => void;
  unlockScreen: () => void;
  isSensitiveDataMasked: boolean;
  toggleSensitiveDataMask: () => void;
  anonymizeClient: (clientId: string) => Promise<{ success: boolean; message: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('pdv');
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage('agropet_products_v2', INITIAL_PRODUCTS));
  const [petCareQueue, setPetCareQueue] = useState<PetCareAppointment[]>(() => loadFromStorage('agropet_petcare_v2', INITIAL_PETCARE));
  const [clients, setClients] = useState<Client[]>(() => loadFromStorage('agropet_clients_v2', INITIAL_CLIENTS));
  const [sales, setSales] = useState<Sale[]>(() => loadFromStorage('agropet_sales_v2', INITIAL_SALES));
  const [bills, setBills] = useState<BillPayable[]>(() => loadFromStorage('agropet_bills_v2', INITIAL_BILLS));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadFromStorage('agropet_suppliers_v2', INITIAL_SUPPLIERS));
  const [supplierOrders, setSupplierOrders] = useState<SupplierOrder[]>(() => loadFromStorage('agropet_supplier_orders_v2', INITIAL_SUPPLIER_ORDERS));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState<boolean>(false);
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState<boolean>(false);
  const [selectedSaleForReceipt, setSelectedSaleForReceipt] = useState<Sale | null>(null);

  // Employees and Hierarchy
  const [employees, setEmployees] = useState<EmployeeUser[]>(() => {
    const list = loadFromStorage('agropet_employees_v2', INITIAL_EMPLOYEES);
    return Array.isArray(list) && list.length > 0 ? list : INITIAL_EMPLOYEES;
  });
  const [currentUser, setCurrentUser] = useState<EmployeeUser>(() => {
    try {
      const savedId = loadFromStorage('agropet_current_user_id_v2', 'emp-2');
      const list = loadFromStorage('agropet_employees_v2', INITIAL_EMPLOYEES);
      const safeList = Array.isArray(list) && list.length > 0 ? list : INITIAL_EMPLOYEES;
      const found = safeList.find(e => e.id === savedId) || INITIAL_EMPLOYEES.find(e => e.id === savedId);
      return found || INITIAL_EMPLOYEES[1] || INITIAL_EMPLOYEES[0];
    } catch {
      return INITIAL_EMPLOYEES[1] || INITIAL_EMPLOYEES[0];
    }
  });

  // System and Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => loadFromStorage('agropet_settings_v2', INITIAL_SETTINGS));
  const [isAjustesModalOpen, setIsAjustesModalOpen] = useState<boolean>(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState<boolean>(false);
  const [isEmployeeManagementOpen, setIsEmployeeManagementOpen] = useState<boolean>(false);
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState<boolean>(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<EmployeeUser | null>(null);
  const [gestaoViewMode, setGestaoViewMode] = useState<'dashboard' | 'operacional' | 'equipe'>('dashboard');

  // SEFAZ Monitor & Histórico de Entradas
  const [sefazInvoices, setSefazInvoices] = useState<SefazIncomingInvoice[]>(() =>
    loadFromStorage('agropet_sefaz_invoices_v2', MOCK_SEFAZ_INVOICES)
  );
  const [importedHistory, setImportedHistory] = useState<ImportedNFe[]>(() =>
    loadFromStorage('agropet_imported_history_v2', [])
  );

  // Monitoramento e Segurança de Acesso Remoto
  const [connectionMode, setConnectionModeState] = useState<ConnectionMode>(() =>
    loadFromStorage('agropet_connection_mode_v2', 'local')
  );
  const [remoteAccessPolicy, setRemoteAccessPolicy] = useState<RemoteAccessPolicy>(() =>
    loadFromStorage('agropet_remote_policy_v2', INITIAL_REMOTE_POLICY)
  );
  const [securityAuditLogs, setSecurityAuditLogs] = useState<SecurityAuditLog[]>(() =>
    loadFromStorage('agropet_security_logs_v2', INITIAL_SECURITY_LOGS)
  );
  const [isRemoteDashboardOpen, setIsRemoteDashboardOpen] = useState<boolean>(false);

  // Módulo RAG + Atendimento IA (WhatsApp & Pedidos Online)
  const [botSettings, setBotSettings] = useState<BotSettings>(() =>
    loadFromStorage('agropet_bot_settings_v2', INITIAL_BOT_SETTINGS)
  );
  const [onlineOrders, setOnlineOrders] = useState<OnlineOrder[]>(() =>
    loadFromStorage('agropet_online_orders_v2', INITIAL_ONLINE_ORDERS)
  );
  const [chatMessages, setChatMessages] = useState<BotChatMessage[]>(() =>
    loadFromStorage('agropet_bot_chat_v2', INITIAL_DEMO_CHAT_MESSAGES)
  );
  const [isOnlineOrdersModalOpen, setIsOnlineOrdersModalOpen] = useState<boolean>(false);

  // AppSec: Bloqueio de Tela por Inatividade ou Comando Manual
  const [isScreenLocked, setIsScreenLocked] = useState<boolean>(false);
  // LGPD: Mascaramento de Dados Pessoais (CPF, Telefone, Dívidas)
  const [isSensitiveDataMasked, setIsSensitiveDataMasked] = useState<boolean>(true);

  // Inactivity Auto-Lock (5 minutos sem eventos de mouse/teclado/toque)
  useEffect(() => {
    let timeoutId: any;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      // Se não estiver bloqueado, agenda bloqueio para 5 minutos de inatividade
      timeoutId = setTimeout(() => {
        setIsScreenLocked(true);
      }, 5 * 60 * 1000);
    };

    const handleKeyShortcut = (e: KeyboardEvent) => {
      // Atalho rápido: Ctrl+L ou Cmd+L bloqueia instantaneamente o terminal
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setIsScreenLocked(true);
      }
      resetTimer();
    };

    const events = ['mousedown', 'mousemove', 'touchstart', 'scroll'];
    events.forEach(ev => window.addEventListener(ev, resetTimer, { passive: true }));
    window.addEventListener('keydown', handleKeyShortcut);
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(ev => window.removeEventListener(ev, resetTimer));
      window.removeEventListener('keydown', handleKeyShortcut);
    };
  }, []);

  const lockScreen = () => {
    setIsScreenLocked(true);
  };

  const unlockScreen = () => {
    setIsScreenLocked(false);
  };

  const toggleSensitiveDataMask = () => {
    setIsSensitiveDataMasked(prev => {
      const next = !prev;
      showToast(
        next ? 'Modo Privacidade LGPD: Dados pessoais mascarados no balcão.' : 'Modo Operador: Dados cadastrais visíveis.',
        next ? 'visibility_off' : 'visibility'
      );
      return next;
    });
  };

  const anonymizeClient = async (clientId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const target = clients.find(c => c.id === clientId);
      if (!target) return { success: false, message: 'Cliente não localizado.' };

      const res = await fetch('/api/lgpd/anonymize-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: target.id,
          clientName: target.name,
          cpf: target.cpf,
          phone: target.phone
        })
      });

      const data = await res.json();
      if (data.success && data.anonymizedData) {
        setClients(prev => prev.map(c => (c.id === clientId ? { ...c, ...data.anonymizedData } : c)));

        // Trilha de Auditoria em conformidade LGPD
        const auditLog: SecurityAuditLog = {
          id: `log-${Date.now()}`,
          timestamp: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          employeeId: currentUser.id,
          employeeName: currentUser.name,
          role: currentUser.role,
          action: 'anonimizacao_lgpd',
          deviceInfo: navigator.userAgent.includes('Mobile') ? 'Smartphone' : 'Terminal PDV',
          ipAddress: '192.168.15.20 (Rede Local)',
          status: 'sucesso',
          details: `Cliente ${target.name} anonimizado sob protocolo ${data.protocol} em cumprimento ao Art. 18 da LGPD.`
        };

        setSecurityAuditLogs(logs => {
          const updated = [auditLog, ...logs];
          saveToStorage('agropet_security_logs_v2', updated);
          return updated;
        });

        // Enviar log de auditoria também para o servidor
        fetch('/api/security/audit-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'anonimizacao_lgpd',
            employeeId: currentUser.id,
            employeeName: currentUser.name,
            role: currentUser.role,
            details: `Anonimização LGPD Art. 18: ${target.name} (Protocolo: ${data.protocol})`,
            status: 'sucesso'
          })
        }).catch(() => {});

        showToast(`Cliente anonimizado! Protocolo: ${data.protocol}`, 'verified_user');
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Erro ao processar anonimização.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Falha ao conectar com serviço de anonimização LGPD.' };
    }
  };

  const [caixaStatus, setCaixaStatus] = useState(() => loadFromStorage('agropet_caixa_v2', {
    isOpen: true,
    openedAt: '07:30',
    totalToday: 3840.50,
    pixTotal: 1950.00,
    cardTotal: 1480.00,
    cashTotal: 410.50,
    pedidosCount: 38
  }));

  const [toast, setToast] = useState<{ message: string; icon?: string; visible: boolean }>({
    message: '',
    icon: 'check_circle',
    visible: false
  });

  // Persist collections to localStorage whenever state changes
  useEffect(() => { saveToStorage('agropet_products_v2', products); }, [products]);
  useEffect(() => { saveToStorage('agropet_petcare_v2', petCareQueue); }, [petCareQueue]);
  useEffect(() => { saveToStorage('agropet_clients_v2', clients); }, [clients]);
  useEffect(() => { saveToStorage('agropet_sales_v2', sales); }, [sales]);
  useEffect(() => { saveToStorage('agropet_bills_v2', bills); }, [bills]);
  useEffect(() => { saveToStorage('agropet_suppliers_v2', suppliers); }, [suppliers]);
  useEffect(() => { saveToStorage('agropet_supplier_orders_v2', supplierOrders); }, [supplierOrders]);
  useEffect(() => { saveToStorage('agropet_caixa_v2', caixaStatus); }, [caixaStatus]);
  useEffect(() => { saveToStorage('agropet_employees_v2', employees); }, [employees]);
  useEffect(() => { saveToStorage('agropet_bot_settings_v2', botSettings); }, [botSettings]);
  useEffect(() => { saveToStorage('agropet_online_orders_v2', onlineOrders); }, [onlineOrders]);
  useEffect(() => { saveToStorage('agropet_bot_chat_v2', chatMessages); }, [chatMessages]);

  const showToast = (message: string, icon = 'check_circle') => {
    setToast({ message, icon, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3200);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const addToCart = (product: Product, quantity = 1, isGranel = false) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: Number((item.quantity + quantity).toFixed(2)) } : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        unit: product.unit,
        isGranel
      }];
    });
    showToast(`"${product.name}" adicionado ao cupom!`, 'shopping_cart');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const finalizeSale = (paymentMethod: 'PIX' | 'Dinheiro' | 'Cartão Crédito' | 'Cartão Débito' | 'Fiado', clientName?: string) => {
    if (cart.length === 0) return;

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const summary = cart.map(i => `${i.quantity}${i.unit === 'kg' ? 'kg' : 'x'} ${i.name}`).slice(0, 2).join(' + ') + (cart.length > 2 ? ` (+${cart.length - 2} itens)` : '');
    const newCode = '#' + (1042 + sales.length + 1);

    const now = new Date();
    const dateFormatted = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const newSale: Sale = {
      id: 'sale-' + Date.now(),
      code: newCode,
      paymentMethod,
      itemsSummary: summary,
      location: 'Balcão 01',
      timeAgo: 'Agora mesmo',
      total,
      status: 'Concluída',
      isGranel: cart.some(i => i.isGranel || i.unit === 'kg'),
      isService: cart.some(i => i.id.startsWith('serv-')),
      clientName: clientName || 'Consumidor Final',
      items: [...cart],
      dateTimestamp: dateFormatted
    };

    setSales(prev => [newSale, ...prev]);

    // Synchronize inventory: reduce bulk kg or packaged stock
    setProducts(prevProducts => prevProducts.map(p => {
      const itemInCart = cart.find(ci => ci.id === p.id);
      if (!itemInCart) return p;
      if (p.isGranel || itemInCart.unit === 'kg') {
        const newKg = Math.max(0, Number(((p.remainingKg ?? p.maxKg ?? 15) - itemInCart.quantity).toFixed(2)));
        return { ...p, remainingKg: newKg };
      } else {
        const newStock = Math.max(0, p.stock - itemInCart.quantity);
        return { ...p, stock: newStock };
      }
    }));

    // If pet service was sold, update status to ready
    const serviceItems = cart.filter(ci => ci.id.startsWith('serv-'));
    if (serviceItems.length > 0) {
      setPetCareQueue(prev => prev.map(pet => {
        const match = serviceItems.find(si => si.id === 'serv-' + pet.id);
        if (match) {
          return { ...pet, status: 'ready' };
        }
        return pet;
      }));
    }

    // Update daily totals
    setCaixaStatus(prev => ({
      ...prev,
      totalToday: Number((prev.totalToday + total).toFixed(2)),
      pixTotal: paymentMethod === 'PIX' ? Number((prev.pixTotal + total).toFixed(2)) : prev.pixTotal,
      cardTotal: (paymentMethod === 'Cartão Crédito' || paymentMethod === 'Cartão Débito') ? Number((prev.cardTotal + total).toFixed(2)) : prev.cardTotal,
      cashTotal: paymentMethod === 'Dinheiro' ? Number((prev.cashTotal + total).toFixed(2)) : prev.cashTotal,
      pedidosCount: prev.pedidosCount + 1
    }));

    // If fiado, update client debt
    if (paymentMethod === 'Fiado' && clientName) {
      setClients(prev => prev.map(cli => {
        if (cli.name.toLowerCase().includes(clientName.toLowerCase())) {
          return {
            ...cli,
            debtBalance: Number((cli.debtBalance + total).toFixed(2)),
            lastPurchase: 'Hoje'
          };
        }
        return cli;
      }));
    }

    setCart([]);
    setIsNewSaleModalOpen(false);
    setSelectedSaleForReceipt(newSale);
    showToast(`Venda ${newCode} de R$ ${total.toFixed(2).replace('.', ',')} concluída via ${paymentMethod}!`, 'verified');
  };

  const adjustProductWeight = (productId: string, newRemainingKg: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, remainingKg: newRemainingKg };
      }
      return p;
    }));
    showToast(`Pesagem ajustada para ${newRemainingKg.toFixed(1)} kg no balcão!`, 'scale');
  };

  const openNewBulkSack = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, remainingKg: p.maxKg || 15.0 };
      }
      return p;
    }));
    showToast('Novo saco de 15kg aberto e tarado na balança!', 'add_circle');
  };

  const orderProductSupplier = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    // Match best supplier by brand or category
    const matchingSupplier = suppliers.find(s =>
      s.brands.some(b => prod.name.toLowerCase().includes(b.toLowerCase())) ||
      (prod.isGranel && s.category === 'graos') ||
      (prod.category === 'farmacia' && s.category === 'farmacia') ||
      (prod.category === 'fechados' && s.category === 'racoes')
    ) || suppliers[0];

    const orderNum = `#PED-${Math.floor(1000 + Math.random() * 9000)}`;
    const suggestedQty = prod.isGranel ? 10 : Math.max(5, (prod.minStock * 2) - prod.stock);
    const unitPrice = prod.price * 0.65;
    const orderTotal = unitPrice * suggestedQty;

    const newOrder: SupplierOrder = {
      id: 'sord-' + Date.now(),
      orderNumber: orderNum,
      supplierId: matchingSupplier.id,
      supplierName: matchingSupplier.tradeName,
      date: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      expectedDelivery: `Rota ${matchingSupplier.deliveryDays}`,
      status: 'enviado',
      itemsSummary: `Reposição de ${prod.name} (${suggestedQty} ${prod.unit})`,
      totalValue: Number(orderTotal.toFixed(2)),
      paymentTerm: matchingSupplier.paymentTerms,
      notes: 'Solicitado via alerta rápido de reposição no estoque'
    };

    setSupplierOrders(prev => [newOrder, ...prev]);
    setSuppliers(prev => prev.map(s => s.id === matchingSupplier.id ? { ...s, openOrdersCount: s.openOrdersCount + 1, lastOrderDate: 'Hoje' } : s));
    showToast(`Pedido ${orderNum} de ${prod.name} emitido para ${matchingSupplier.tradeName}!`, 'local_shipping');
    setActiveTab('fornecedores');
  };

  const updatePetStatus = (petId: string, newStatus: 'waiting' | 'in-progress' | 'ready') => {
    setPetCareQueue(prev => prev.map(pet => {
      if (pet.id === petId) {
        return { ...pet, status: newStatus };
      }
      return pet;
    }));
    const statusText = newStatus === 'in-progress' ? 'Em Atendimento' : newStatus === 'ready' ? 'Pronto p/ Retirada' : 'Aguardando Chegada';
    showToast(`Status do pet atualizado: ${statusText}!`, 'pets');
  };

  const addPetAppointment = (appointment: Omit<PetCareAppointment, 'id'>) => {
    const newAppointment: PetCareAppointment = {
      ...appointment,
      id: 'pet-' + Date.now()
    };
    setPetCareQueue(prev => [newAppointment, ...prev]);
    showToast(`Agendamento de ${appointment.petName} cadastrado com sucesso!`, 'event_available');
  };

  const importPetServiceToPDV = (appointment: PetCareAppointment) => {
    setCart(prev => [
      ...prev,
      {
        id: 'serv-' + appointment.id,
        name: `Banho & Tosa - ${appointment.petName} (${appointment.tutorName})`,
        price: appointment.price,
        quantity: 1,
        unit: 'serviço'
      }
    ]);
    setActiveTab('pdv');
    setIsNewSaleModalOpen(true);
    showToast(`Serviço de ${appointment.petName} importado no cupom do PDV!`, 'point_of_sale');
  };

  const receiveClientPayment = (clientId: string, amount: number, method: string) => {
    setClients(prev => prev.map(cli => {
      if (cli.id === clientId) {
        const newBalance = Math.max(0, Number((cli.debtBalance - amount).toFixed(2)));
        return { ...cli, debtBalance: newBalance };
      }
      return cli;
    }));

    setCaixaStatus(prev => ({
      ...prev,
      totalToday: Number((prev.totalToday + amount).toFixed(2)),
      pixTotal: method === 'PIX' ? Number((prev.pixTotal + amount).toFixed(2)) : prev.pixTotal,
      cashTotal: method === 'Dinheiro' ? Number((prev.cashTotal + amount).toFixed(2)) : prev.cashTotal,
      cardTotal: method === 'Cartão' ? Number((prev.cardTotal + amount).toFixed(2)) : prev.cardTotal
    }));

    showToast(`Recebimento de R$ ${amount.toFixed(2).replace('.', ',')} lançado no caixa via ${method}!`, 'verified');
  };

  const addNewClient = (client: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...client,
      id: 'cli-' + Date.now()
    };
    setClients(prev => [newClient, ...prev]);
    showToast(`Cliente "${client.name}" cadastrado com sucesso!`, 'person_add');
  };

  const payBill = (billId: string) => {
    setBills(prev => prev.map(bill => {
      if (bill.id === billId) {
        return { ...bill, status: 'pago' as const, paidAt: 'Hoje às 10:14' };
      }
      return bill;
    }));
    showToast('Boleto marcado como pago e conciliado no fluxo!', 'verified');
  };

  const addNewBill = (bill: Omit<BillPayable, 'id'>) => {
    const newBill: BillPayable = {
      ...bill,
      id: 'bill-' + Date.now()
    };
    setBills(prev => [newBill, ...prev]);
    showToast(`Boleto de ${bill.supplier} cadastrado no fluxo!`, 'post_add');
  };

  const addNewSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: 'sup-' + Date.now(),
      rating: 5.0,
      suppliedProductsCount: 0,
      openOrdersCount: 0,
      lastOrderDate: 'Nunca'
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    showToast(`Fornecedor "${supplier.tradeName || supplier.name}" cadastrado!`, 'local_shipping');
  };

  const updateSupplier = (supplierId: string, updated: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => (s.id === supplierId ? { ...s, ...updated } : s)));
    showToast('Dados do fornecedor atualizados!', 'check_circle');
  };

  const deleteSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
    showToast('Fornecedor removido do cadastro!', 'delete');
  };

  const addNewSupplierOrder = (order: Omit<SupplierOrder, 'id'>) => {
    const newOrder: SupplierOrder = {
      ...order,
      id: 'sord-' + Date.now()
    };
    setSupplierOrders(prev => [newOrder, ...prev]);
    setSuppliers(prev => prev.map(s => s.id === order.supplierId ? { ...s, openOrdersCount: s.openOrdersCount + 1, lastOrderDate: 'Hoje' } : s));
    showToast(`Pedido ${order.orderNumber} emitido para ${order.supplierName}!`, 'assignment_turned_in');
  };

  const updateSupplierOrderStatus = (orderId: string, status: SupplierOrder['status']) => {
    setSupplierOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
    if (status === 'entregue') {
      const order = supplierOrders.find(o => o.id === orderId);
      if (order) {
        setProducts(prevProducts => prevProducts.map(p => {
          if (order.itemsSummary.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(order.itemsSummary.toLowerCase().slice(0, 10))) {
            if (p.isGranel) {
              return { ...p, remainingKg: Math.min(p.maxKg || 15, (p.remainingKg || 0) + 15) };
            } else {
              return { ...p, stock: p.stock + 10 };
            }
          }
          return p;
        }));
      }
      showToast('Mercadoria recebida e estoque atualizado com sucesso!', 'inventory');
    } else {
      const statusLabel = status === 'faturado' ? 'Faturado c/ NF' : status === 'enviado' ? 'Enviado ao Fornecedor' : 'Em Cotação';
      showToast(`Status do pedido atualizado: ${statusLabel}!`, 'local_shipping');
    }
  };

  const closeCaixaOfDay = (cashCounted: number) => {
    setCaixaStatus(prev => ({ ...prev, isOpen: false }));
    showToast(`Caixa #01 encerrado! Dinheiro conferido: R$ ${cashCounted.toFixed(2).replace('.', ',')}. Relatório gerado!`, 'task_alt');
  };

  const resetDemoData = () => {
    localStorage.removeItem('agropet_products_v2');
    localStorage.removeItem('agropet_petcare_v2');
    localStorage.removeItem('agropet_clients_v2');
    localStorage.removeItem('agropet_sales_v2');
    localStorage.removeItem('agropet_bills_v2');
    localStorage.removeItem('agropet_suppliers_v2');
    localStorage.removeItem('agropet_supplier_orders_v2');
    localStorage.removeItem('agropet_caixa_v2');
    setProducts(INITIAL_PRODUCTS);
    setPetCareQueue(INITIAL_PETCARE);
    setClients(INITIAL_CLIENTS);
    setSales(INITIAL_SALES);
    setBills(INITIAL_BILLS);
    setSuppliers(INITIAL_SUPPLIERS);
    setSupplierOrders(INITIAL_SUPPLIER_ORDERS);
    setCaixaStatus({
      isOpen: true,
      openedAt: '07:30',
      totalToday: 3840.50,
      pixTotal: 1950.00,
      cardTotal: 1480.00,
      cashTotal: 410.50,
      pedidosCount: 38
    });
    showToast('Dados de demonstração restaurados com sucesso!', 'restart_alt');
  };

  const switchUser = (employeeId: string, enteredPin?: string): { success: boolean; message: string } => {
    const target = employees.find(e => e.id === employeeId);
    if (!target) return { success: false, message: 'Funcionário não encontrado no sistema.' };

    if (target.isActive === false) {
      return { success: false, message: 'Este colaborador está inativo. Solicite a reativação à gerência ou diretoria.' };
    }

    if (enteredPin !== undefined && enteredPin !== '' && enteredPin !== target.pin) {
      return { success: false, message: 'PIN incorreto. Tente novamente.' };
    }

    setCurrentUser(target);
    saveToStorage('agropet_current_user_id_v2', target.id);
    showToast(`Operador alterado: ${target.name} (${target.roleLabel})`, 'badge');
    return { success: true, message: `Conectado como ${target.name}` };
  };

  const verifySupervisorPin = (pin: string, minRole?: 'gerente' | 'dono' | 'admin'): {
    success: boolean;
    supervisor?: EmployeeUser;
    message: string;
  } => {
    const supervisor = employees.find(e => e.pin === pin);
    if (!supervisor) {
      return { success: false, message: 'PIN não encontrado ou inválido.' };
    }

    if (supervisor.isActive === false) {
      return { success: false, message: 'Este usuário está inativo no sistema.' };
    }

    const nonSupervisors = ['operador', 'vendedor', 'tosador'];
    if (nonSupervisors.includes(supervisor.role)) {
      return { success: false, message: 'Operadores de caixa, balconistas e esteticistas não possuem alçada de supervisão.' };
    }

    if (minRole === 'dono' && supervisor.role !== 'dono' && supervisor.role !== 'admin') {
      return { success: false, message: 'Esta ação exige liberação exclusiva do Dono ou Administrador.' };
    }

    if (minRole === 'admin' && supervisor.role !== 'admin') {
      return { success: false, message: 'Esta ação exige liberação do Administrador TI.' };
    }

    return {
      success: true,
      supervisor,
      message: `Autorizado por ${supervisor.name} (${supervisor.roleLabel})`
    };
  };

  const addEmployee = (empData: Omit<EmployeeUser, 'id'>): { success: boolean; message: string; employee?: EmployeeUser } => {
    const cleanPin = (empData.pin || '').trim();
    if (!cleanPin || cleanPin.length < 4) {
      return { success: false, message: 'O PIN numérico de acesso deve conter pelo menos 4 dígitos.' };
    }
    if (employees.some(e => e.pin === cleanPin)) {
      return { success: false, message: `O PIN "${cleanPin}" já está em uso por outro colaborador. Escolha um PIN exclusivo.` };
    }

    const newEmp: EmployeeUser = {
      ...empData,
      id: `emp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      pin: cleanPin,
      isActive: empData.isActive !== false,
      createdAt: empData.createdAt || new Date().toLocaleDateString('pt-BR')
    };

    setEmployees(prev => {
      const updated = [...prev, newEmp];
      saveToStorage('agropet_employees_v2', updated);
      return updated;
    });

    const auditLog: SecurityAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      role: currentUser.role,
      action: 'alteracao_politica_remota',
      deviceInfo: navigator.userAgent.includes('Mobile') ? 'Smartphone' : 'Computador da Loja',
      ipAddress: '192.168.15.20 (Rede Local)',
      status: 'sucesso',
      details: `Novo colaborador cadastrado: ${newEmp.name} (Cargo: ${newEmp.roleLabel}).`
    };
    setSecurityAuditLogs(prev => {
      const updatedLogs = [auditLog, ...prev];
      saveToStorage('agropet_security_logs_v2', updatedLogs);
      return updatedLogs;
    });

    showToast(`Colaborador "${newEmp.name}" cadastrado com sucesso!`, 'person_add');
    return { success: true, message: `Colaborador ${newEmp.name} cadastrado com sucesso!`, employee: newEmp };
  };

  const updateEmployee = (id: string, updated: Partial<EmployeeUser>): { success: boolean; message: string } => {
    if (updated.pin) {
      const cleanPin = updated.pin.trim();
      if (cleanPin.length < 4) {
        return { success: false, message: 'O PIN numérico deve conter pelo menos 4 dígitos.' };
      }
      if (employees.some(e => e.id !== id && e.pin === cleanPin)) {
        return { success: false, message: `O PIN "${cleanPin}" já está cadastrado para outro funcionário.` };
      }
    }

    setEmployees(prev => {
      const updatedList = prev.map(e => (e.id === id ? { ...e, ...updated } : e));
      saveToStorage('agropet_employees_v2', updatedList);
      return updatedList;
    });

    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...updated }));
    }

    showToast('Cadastro do colaborador atualizado!', 'manage_accounts');
    return { success: true, message: 'Dados atualizados com sucesso.' };
  };

  const deleteEmployee = (id: string): { success: boolean; message: string } => {
    if (currentUser.id === id) {
      return { success: false, message: 'Você não pode excluir o usuário que está atualmente em sessão ativa.' };
    }
    const target = employees.find(e => e.id === id);
    if (!target) return { success: false, message: 'Colaborador não encontrado.' };

    if (target.role === 'dono' && employees.filter(e => e.role === 'dono').length <= 1) {
      return { success: false, message: 'Operação bloqueada: o sistema precisa manter pelo menos 1 Proprietário cadastrado.' };
    }

    setEmployees(prev => {
      const updated = prev.filter(e => e.id !== id);
      saveToStorage('agropet_employees_v2', updated);
      return updated;
    });

    showToast(`Colaborador "${target.name}" removido do sistema!`, 'delete');
    return { success: true, message: 'Funcionário excluído com sucesso.' };
  };

  const toggleEmployeeStatus = (id: string) => {
    if (currentUser.id === id) {
      showToast('Não é possível desativar o usuário ativo da sessão.', 'warning');
      return;
    }
    setEmployees(prev => {
      const updated = prev.map(e => e.id === id ? { ...e, isActive: !e.isActive } : e);
      saveToStorage('agropet_employees_v2', updated);
      return updated;
    });
    showToast('Status do colaborador alterado!', 'sync');
  };

  const openEmployeeManagement = () => {
    setActiveTab('gestao');
    setGestaoViewMode('equipe');
    setIsEmployeeManagementOpen(false);
    setIsEmployeeModalOpen(false);
  };
  const closeEmployeeManagement = () => setIsEmployeeManagementOpen(false);
  const navigateToEquipe = openEmployeeManagement;

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveToStorage('agropet_settings_v2', updated);
      return updated;
    });
    showToast('Ajustes do sistema gravados com sucesso!', 'tune');
  };

  const openAjustesModal = () => setIsAjustesModalOpen(true);
  const closeAjustesModal = () => setIsAjustesModalOpen(false);

  const openEmployeeModal = () => setIsEmployeeModalOpen(true);
  const closeEmployeeModal = () => setIsEmployeeModalOpen(false);

  const openBarcodeModal = () => setIsBarcodeModalOpen(true);
  const closeBarcodeModal = () => setIsBarcodeModalOpen(false);

  const openNewSaleModal = () => setIsNewSaleModalOpen(true);
  const closeNewSaleModal = () => setIsNewSaleModalOpen(false);

  const openReceiptModal = (sale: Sale) => setSelectedSaleForReceipt(sale);
  const closeReceiptModal = () => setSelectedSaleForReceipt(null);

  // SEFAZ DFe / MDe Actions
  const manifestarSefaz = (chaveAcesso: string, status: 'ciencia' | 'confirmada' | 'desconhecida') => {
    setSefazInvoices(prev => {
      const updated = prev.map(inv => {
        if (inv.chaveAcesso === chaveAcesso) {
          return { ...inv, statusManifestacao: status };
        }
        return inv;
      });
      saveToStorage('agropet_sefaz_invoices_v2', updated);
      return updated;
    });

    const msg = status === 'ciencia'
      ? 'Ciência da Emissão transmitida à SEFAZ com sucesso!'
      : status === 'confirmada'
      ? 'Confirmação da Operação registrada no Portal Nacional!'
      : 'Operação desconhecida comunicada à SEFAZ.';
    showToast(msg, 'verified');
  };

  // Entrada de Estoque por NF-e (XML, PDF IA ou SEFAZ)
  const importNFeToInventory = (
    nfe: ImportedNFe,
    options: { createBills?: boolean; updateCosts?: boolean } = { createBills: true, updateCosts: true }
  ) => {
    let importedCount = 0;
    let updatedCount = 0;

    setProducts(prevProducts => {
      const updatedList = [...prevProducts];

      nfe.items.forEach(item => {
        // Find existing match by EAN or code or exact name
        const matchIndex = updatedList.findIndex(p =>
          (item.ean && p.sku === item.ean) ||
          (item.code && p.sku === item.code) ||
          p.name.toLowerCase().trim() === item.name.toLowerCase().trim()
        );

        if (matchIndex >= 0) {
          // Update existing product
          const existing = updatedList[matchIndex];
          const isGranel = existing.isGranel || item.conversionType === 'despejar_granel';
          const addQty = item.convertedQuantity;

          updatedList[matchIndex] = {
            ...existing,
            stock: Number((existing.stock + addQty).toFixed(2)),
            remainingKg: isGranel
              ? Number(((existing.remainingKg || existing.stock || 0) + addQty).toFixed(2))
              : undefined,
            costPrice: options.updateCosts !== false ? item.convertedUnitCost : existing.costPrice,
            price: item.suggestedSalePrice > 0 ? item.suggestedSalePrice : existing.price,
            supplier: nfe.fornecedorNome || existing.supplier
          };
          updatedCount++;
        } else {
          // Create new product
          const isGranel = item.conversionType === 'despejar_granel' || item.category === 'granel';
          const defaultImg = isGranel
            ? 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&auto=format&fit=crop&q=80'
            : item.category === 'farmacia'
            ? 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
            : item.category === 'petcare'
            ? 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=300&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&auto=format&fit=crop&q=80';

          const newProd: Product = {
            id: `imported-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            name: item.name,
            sku: item.ean || item.code || `PROD-${Math.floor(1000 + Math.random() * 9000)}`,
            price: item.suggestedSalePrice > 0 ? item.suggestedSalePrice : Number((item.convertedUnitCost * 1.45).toFixed(2)),
            costPrice: item.convertedUnitCost,
            marginPercent: item.marginPercent || 45,
            unit: item.convertedUnit || (isGranel ? 'kg' : 'UN'),
            stock: item.convertedQuantity,
            minStock: 5,
            location: isGranel ? 'Silo de Granel' : 'Gôndola de Vendas',
            image: defaultImg,
            isGranel,
            remainingKg: isGranel ? item.convertedQuantity : undefined,
            maxKg: isGranel ? Math.max(item.convertedQuantity, 25) : undefined,
            category: item.category,
            supplier: nfe.fornecedorNome
          };

          updatedList.push(newProd);
          importedCount++;
        }
      });

      saveToStorage('agropet_products_v2', updatedList);
      return updatedList;
    });

    // Create Boletos (Contas a Pagar) automatically if requested
    if (options.createBills !== false && nfe.boletos && nfe.boletos.length > 0) {
      setBills(prevBills => {
        const newBills: BillPayable[] = nfe.boletos.map((b, idx) => ({
          id: `bill-${Date.now()}-${idx}`,
          supplier: nfe.fornecedorNome,
          description: b.numero || `Parcela ${idx + 1} - NF ${nfe.numeroNota}`,
          dueDate: b.vencimento,
          dueDateText: b.vencimento,
          status: 'avencer',
          amount: b.valor,
          value: b.valor,
          barcode: nfe.chaveAcesso
        }));

        const combined = [...prevBills, ...newBills];
        saveToStorage('agropet_bills_v2', combined);
        return combined;
      });
    }

    // Record in imported history
    const completedNFe: ImportedNFe = {
      ...nfe,
      status: 'importada'
    };
    setImportedHistory(prev => {
      const updated = [completedNFe, ...prev.filter(h => h.id !== nfe.id && h.chaveAcesso !== nfe.chaveAcesso)];
      saveToStorage('agropet_imported_history_v2', updated);
      return updated;
    });

    // If matches a SEFAZ incoming invoice, mark as imported
    setSefazInvoices(prev => {
      const updated = prev.map(s => {
        if (s.chaveAcesso === nfe.chaveAcesso || s.numero === nfe.numeroNota) {
          return { ...s, statusEntrada: 'importada' as const, statusManifestacao: 'confirmada' as const };
        }
        return s;
      });
      saveToStorage('agropet_sefaz_invoices_v2', updated);
      return updated;
    });

    showToast(`Entrada concluída: ${importedCount} novos produtos, ${updatedCount} atualizados!`, 'check_circle');
    return { importedCount, updatedCount };
  };

  // Bulk Product Import (from CSV Migration)
  const importBulkProducts = (newProducts: Product[]) => {
    let importedCount = 0;
    let updatedCount = 0;

    setProducts(prev => {
      const copy = [...prev];
      newProducts.forEach(newP => {
        const existingIdx = copy.findIndex(p => p.sku && newP.sku && p.sku === newP.sku);
        if (existingIdx >= 0) {
          copy[existingIdx] = {
            ...copy[existingIdx],
            price: newP.price,
            costPrice: newP.costPrice,
            stock: newP.stock,
            minStock: newP.minStock
          };
          updatedCount++;
        } else {
          copy.push(newP);
          importedCount++;
        }
      });

      saveToStorage('agropet_products_v2', copy);
      return copy;
    });

    showToast(`Migração concluída: ${importedCount} novos, ${updatedCount} atualizados!`, 'cloud_download');
    return { importedCount, updatedCount };
  };

  // ==========================================
  // GESTÃO E SEGURANÇA DE ACESSO REMOTO
  // ==========================================
  const setConnectionMode = (mode: ConnectionMode) => {
    setConnectionModeState(mode);
    saveToStorage('agropet_connection_mode_v2', mode);

    const logEntry: SecurityAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      role: currentUser.role,
      action: mode === 'remoto' ? 'login_remoto_autorizado' : 'login_remoto_autorizado',
      deviceInfo: navigator.userAgent.includes('Mobile') ? 'Smartphone / Tablet' : 'Computador Desktop',
      ipAddress: mode === 'remoto' ? '189.102.34.12 (Rede Externa 4G/5G)' : '192.168.15.20 (Wi-Fi Interno da Agropecuária)',
      status: 'sucesso',
      details: `Modo de conexão alterado para: ${mode === 'remoto' ? 'Acesso Remoto (Fora da Loja)' : 'Rede Local da Loja (Wi-Fi Físico)'}.`
    };

    setSecurityAuditLogs(prev => {
      const updated = [logEntry, ...prev];
      saveToStorage('agropet_security_logs_v2', updated);
      return updated;
    });

    showToast(
      mode === 'remoto'
        ? 'Modo Acesso Remoto ativado! Políticas de segurança externa aplicadas.'
        : 'Conectado à Rede Local da Agropecuária (Na Loja).',
      mode === 'remoto' ? 'public' : 'wifi'
    );
  };

  const updateRemoteAccessPolicy = (policy: Partial<RemoteAccessPolicy>) => {
    setRemoteAccessPolicy(prev => {
      const updated = { ...prev, ...policy };
      saveToStorage('agropet_remote_policy_v2', updated);
      return updated;
    });
    showToast('Políticas de segurança de acesso remoto atualizadas!', 'security');
  };

  const grantRemoteAccessPass = (employeeId: string, hoursValid: number = 4, reason: string = 'Atividade operacional autorizada') => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    const expiresDate = new Date();
    expiresDate.setHours(expiresDate.getHours() + hoursValid);
    const expiresText = `Hoje às ${expiresDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const newPass: RemoteAccessPass = {
      id: `pass-${Date.now()}`,
      employeeId,
      employeeName: emp.name,
      authorizedBy: `${currentUser.name} (${currentUser.roleLabel})`,
      authorizedAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      expiresAt: expiresText,
      reason,
      status: 'ativo'
    };

    setRemoteAccessPolicy(prev => {
      const filtered = prev.authorizedPasses.filter(p => p.employeeId !== employeeId || p.status !== 'ativo');
      const updated = {
        ...prev,
        authorizedPasses: [newPass, ...filtered]
      };
      saveToStorage('agropet_remote_policy_v2', updated);
      return updated;
    });

    // Record Security Audit
    const logEntry: SecurityAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      role: currentUser.role,
      action: 'autorizacao_concedida',
      deviceInfo: 'Painel de Gestão Remota',
      ipAddress: '177.136.204.88',
      status: 'sucesso',
      details: `Passe de acesso remoto temporário emitido para ${emp.name} válido por ${hoursValid} horas. Motivo: ${reason}.`
    };

    setSecurityAuditLogs(prev => {
      const updated = [logEntry, ...prev];
      saveToStorage('agropet_security_logs_v2', updated);
      return updated;
    });

    showToast(`Acesso remoto liberado para ${emp.name} até ${expiresText}!`, 'verified_user');
  };

  const revokeRemoteAccessPass = (passId: string) => {
    setRemoteAccessPolicy(prev => {
      const updated = {
        ...prev,
        authorizedPasses: prev.authorizedPasses.map(p => (p.id === passId ? { ...p, status: 'revogado' as const } : p))
      };
      saveToStorage('agropet_remote_policy_v2', updated);
      return updated;
    });
    showToast('Passe de acesso remoto revogado imediatamente.', 'block');
  };

  const toggleEmergencyLockdown = () => {
    setRemoteAccessPolicy(prev => {
      const nextState = !prev.emergencyLockdown;
      const updated = {
        ...prev,
        emergencyLockdown: nextState
      };
      saveToStorage('agropet_remote_policy_v2', updated);

      const logEntry: SecurityAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        role: currentUser.role,
        action: 'bloqueio_emergencia',
        deviceInfo: 'Painel de Gestão Remota',
        ipAddress: 'IP Seguro de Comando',
        status: nextState ? 'alerta' : 'sucesso',
        details: nextState
          ? `TRAVA DE EMERGÊNCIA ATIVADA por ${currentUser.name}. Todo acesso remoto de operadores e funcionários foi cortado imediatamente.`
          : `Trava de emergência desativada por ${currentUser.name}. Acessos restabelecidos sob regras normais.`
      };

      setSecurityAuditLogs(l => {
        const u = [logEntry, ...l];
        saveToStorage('agropet_security_logs_v2', u);
        return u;
      });

      return updated;
    });

    showToast(
      remoteAccessPolicy.emergencyLockdown
        ? 'Trava de emergência suspensa.'
        : 'TRAVA DE EMERGÊNCIA ATIVADA: Operadores remotos bloqueados!',
      'warning'
    );
  };

  // Verificação em tempo real: o usuário atual está bloqueado no acesso remoto?
  const isRemoteAccessBlockedForCurrentUser = (() => {
    // 1. Se estiver na loja (rede local física), NUNCA está bloqueado
    if (connectionMode === 'local') return false;

    // 2. Dono e Admin NUNCA são bloqueados: têm monitoramento e gestão remota irrestrita 24h
    if (currentUser.role === 'dono' || currentUser.role === 'admin') return false;

    // Se o colaborador possui permissão expressa de acesso remoto configurada no seu cadastro
    if (currentUser.allowRemoteAccess) return false;

    // 3. Se a trava de emergência estiver ligada pelo dono:
    if (remoteAccessPolicy.emergencyLockdown) return true;

    // 4. Se tiver um passe ativo válido concedido pelo gerente/dono:
    const activePass = remoteAccessPolicy.authorizedPasses.find(
      p => p.employeeId === currentUser.id && p.status === 'ativo'
    );
    if (activePass) return false;

    // 5. Se for Operador / Vendedor / Tosador:
    if (['operador', 'vendedor', 'tosador'].includes(currentUser.role)) {
      // Verifica se o dono proibiu totalmente acesso remoto de operadores
      if (!remoteAccessPolicy.allowRemoteOperatorAccess) return true;

      // Verifica horário comercial da loja
      const now = new Date();
      const currentDay = now.getDay();
      const isWorkDay = remoteAccessPolicy.businessDays.includes(currentDay);

      const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const isWithinHours = currentHM >= remoteAccessPolicy.businessHoursStart && currentHM <= remoteAccessPolicy.businessHoursEnd;

      // Se for fora do expediente ou fora dos dias de funcionamento e não tem aprovação do dono, bloqueia
      if (!isWorkDay || !isWithinHours) {
        return true;
      }

      // Durante o expediente, se a loja exige autorização expressa do dono mesmo no horário:
      if (remoteAccessPolicy.requireOwnerApproval && !activePass) {
        return true;
      }

      return false;
    }

    // 6. Gerente pode acessar durante horário ou se não houver lockdown
    return false;
  })();

  // Solicitar liberação instantânea com PIN do Dono ou Gerente
  const requestRemoteAccessWithPin = (pin: string): { success: boolean; message: string } => {
    const supervisor = employees.find(e => (e.role === 'dono' || e.role === 'gerente') && e.pin === pin.trim());
    if (!supervisor) {
      return { success: false, message: 'PIN incorreto. Apenas Gerente ou Dono podem liberar o acesso remoto.' };
    }

    grantRemoteAccessPass(currentUser.id, 4, `Liberação presencial com PIN autorizado por ${supervisor.name}`);
    return { success: true, message: `Acesso remoto liberado por 4 horas por ${supervisor.name}!` };
  };

  const openRemoteDashboard = () => setIsRemoteDashboardOpen(true);
  const closeRemoteDashboard = () => setIsRemoteDashboardOpen(false);

  const openEmployeeForm = (emp?: EmployeeUser | null) => {
    setEmployeeToEdit(emp || null);
    setIsEmployeeFormOpen(true);
  };

  const closeEmployeeForm = () => {
    setIsEmployeeFormOpen(false);
    setEmployeeToEdit(null);
  };

  // Funções do Módulo RAG + Atendimento IA (WhatsApp & Pedidos Online)
  const updateBotSettings = (updated: Partial<BotSettings>) => {
    setBotSettings(prev => ({ ...prev, ...updated }));
    showToast('Configurações do Robô RAG atualizadas!', 'smart_toy');
  };

  const createOnlineOrder = (orderData: Omit<OnlineOrder, 'id' | 'orderNumber' | 'createdAt'>): OnlineOrder => {
    const newOrderNumber = `#ON-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OnlineOrder = {
      ...orderData,
      id: `ord-online-${Date.now()}`,
      orderNumber: newOrderNumber,
      createdAt: new Date().toISOString()
    };

    setOnlineOrders(prev => [newOrder, ...prev]);

    if (botSettings.soundAlertOnNewLead) {
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch {}
    }

    showToast(`🚨 Novo Pedido Online ${newOrderNumber} recebido via IA!`, 'shopping_bag');
    return newOrder;
  };

  const updateOnlineOrderStatus = (orderId: string, status: OnlineOrder['status']) => {
    setOnlineOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Status do pedido atualizado para: ${status.replace('_', ' ').toUpperCase()}`, 'local_shipping');
  };

  const importOnlineOrderToPDV = (order: OnlineOrder) => {
    // Adiciona os itens ao carrinho do PDV
    for (const item of order.items) {
      const existingProduct = products.find(p => p.id === item.productId || p.name.toLowerCase() === item.name.toLowerCase());
      if (existingProduct) {
        addToCart(existingProduct, item.quantity, item.isGranel);
      } else {
        setCart(prev => [
          ...prev,
          {
            id: `online-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: item.name,
            price: item.unitPrice,
            quantity: item.quantity,
            unit: item.unit,
            isGranel: item.isGranel
          }
        ]);
      }
    }
    updateOnlineOrderStatus(order.id, 'em_separacao');
    setActiveTab('pdv');
    showToast(`Pedido ${order.orderNumber} importado para o Caixa PDV!`, 'point_of_sale');
  };

  const sendChatMessage = async (text: string): Promise<BotChatMessage> => {
    const userMsg: BotChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/rag-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: [...chatMessages, userMsg].map(m => ({ sender: m.sender, text: m.text })),
          botSettings,
          storeSettings,
          products
        })
      });

      const resData = await res.json();
      const botReplyText = resData?.data?.reply || 'Olá! Recebi sua mensagem, como posso te ajudar?';
      const orderProposal = resData?.data?.orderProposal;
      const ragSources = resData?.data?.ragSources || [];
      const intent = resData?.data?.intent;

      let generatedOrder: OnlineOrder | undefined;

      // Se a IA qualificou e gerou proposta válida para fechar pedido
      if (orderProposal && orderProposal.isReadyToCreate && Array.isArray(orderProposal.items) && orderProposal.items.length > 0) {
        generatedOrder = createOnlineOrder({
          customerName: orderProposal.customerName || 'Cliente WhatsApp',
          customerPhone: orderProposal.customerPhone || '(19) 99888-7766',
          customerAddress: orderProposal.customerAddress || 'Endereço fornecido no chat',
          neighborhood: orderProposal.neighborhood || 'Centro',
          petName: orderProposal.petName || 'Pet',
          items: orderProposal.items,
          subtotal: orderProposal.subtotal || orderProposal.total || 45,
          deliveryFee: orderProposal.deliveryFee || 0,
          total: orderProposal.total || orderProposal.subtotal || 45,
          paymentMethod: orderProposal.paymentMethod || 'pix',
          status: 'pendente',
          source: 'whatsapp_bot',
          notes: orderProposal.notes || 'Pedido fechado automaticamente pelo assistente RAG'
        });
      }

      const botMsg: BotChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          ragSources,
          generatedOrder,
          actionTaken: generatedOrder ? 'ORDER_CREATED' : intent === 'agendamento_petcare' ? 'PETCARE_BOOKED' : 'PRICE_QUOTED'
        }
      };

      setChatMessages(prev => [...prev, botMsg]);
      return botMsg;
    } catch (err) {
      console.error('Erro na chamada RAG Chat:', err);
      const fallbackMsg: BotChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: 'Olá! Au-au! 🐾 Consultei nosso estoque: temos rações a granel fresquinhas, banho & tosa e entregas rápidas. Como posso te atender agora?',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
      return fallbackMsg;
    }
  };

  const clearChatMessages = () => {
    setChatMessages([INITIAL_DEMO_CHAT_MESSAGES[0]]);
    showToast('Simulador WhatsApp reiniciado!', 'refresh');
  };

  const openOnlineOrdersModal = () => setIsOnlineOrdersModalOpen(true);
  const closeOnlineOrdersModal = () => setIsOnlineOrdersModalOpen(false);

  const pendingOnlineOrdersCount = onlineOrders.filter(o => o.status === 'pendente' || o.status === 'em_separacao').length;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        employees,
        switchUser,
        verifySupervisorPin,
        storeSettings,
        updateStoreSettings,
        isAjustesModalOpen,
        openAjustesModal,
        closeAjustesModal,
        isEmployeeModalOpen,
        openEmployeeModal,
        closeEmployeeModal,
        isEmployeeManagementOpen,
        openEmployeeManagement,
        closeEmployeeManagement,
        isEmployeeFormOpen,
        employeeToEdit,
        openEmployeeForm,
        closeEmployeeForm,
        gestaoViewMode,
        setGestaoViewMode,
        navigateToEquipe,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        toggleEmployeeStatus,
        products,
        petCareQueue,
        clients,
        sales,
        bills,
        suppliers,
        supplierOrders,
        cart,
        caixaStatus,
        toast,
        showToast,
        hideToast,
        addToCart,
        removeFromCart,
        clearCart,
        finalizeSale,
        adjustProductWeight,
        openNewBulkSack,
        orderProductSupplier,
        addNewSupplier,
        updateSupplier,
        deleteSupplier,
        addNewSupplierOrder,
        updateSupplierOrderStatus,
        updatePetStatus,
        addPetAppointment,
        importPetServiceToPDV,
        receiveClientPayment,
        addNewClient,
        payBill,
        addNewBill,
        closeCaixaOfDay,
        isBarcodeModalOpen,
        openBarcodeModal,
        closeBarcodeModal,
        isNewSaleModalOpen,
        openNewSaleModal,
        closeNewSaleModal,
        selectedSaleForReceipt,
        openReceiptModal,
        closeReceiptModal,
        resetDemoData,
        sefazInvoices,
        importedHistory,
        manifestarSefaz,
        importNFeToInventory,
        importBulkProducts,
        // Gestão e Monitoramento Remoto
        connectionMode,
        setConnectionMode,
        remoteAccessPolicy,
        updateRemoteAccessPolicy,
        securityAuditLogs,
        isRemoteAccessBlockedForCurrentUser,
        grantRemoteAccessPass,
        revokeRemoteAccessPass,
        toggleEmergencyLockdown,
        requestRemoteAccessWithPin,
        isRemoteDashboardOpen,
        openRemoteDashboard,
        closeRemoteDashboard,
        // Módulo RAG + Atendimento IA
        botSettings,
        updateBotSettings,
        onlineOrders,
        createOnlineOrder,
        updateOnlineOrderStatus,
        importOnlineOrderToPDV,
        chatMessages,
        sendChatMessage,
        clearChatMessages,
        isOnlineOrdersModalOpen,
        openOnlineOrdersModal,
        closeOnlineOrdersModal,
        pendingOnlineOrdersCount,
        // Segurança AppSec & LGPD
        isScreenLocked,
        lockScreen,
        unlockScreen,
        isSensitiveDataMasked,
        toggleSensitiveDataMask,
        anonymizeClient
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
