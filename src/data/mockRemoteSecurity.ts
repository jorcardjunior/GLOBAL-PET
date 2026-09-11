import { RemoteAccessPolicy, SecurityAuditLog } from '../types';

export const INITIAL_REMOTE_POLICY: RemoteAccessPolicy = {
  allowRemoteOperatorAccess: true,
  requireOwnerApproval: true,
  businessHoursStart: '08:00',
  businessHoursEnd: '18:30',
  businessDays: [1, 2, 3, 4, 5, 6], // Segunda a Sábado
  emergencyLockdown: false,
  authorizedPasses: [
    {
      id: 'pass-101',
      employeeId: 'emp-2',
      employeeName: 'Mariana Souza (Vendedora)',
      authorizedBy: 'Sr. Arnaldo (Dono)',
      authorizedAt: 'Hoje às 08:30',
      expiresAt: 'Hoje às 21:00',
      reason: 'Conferência de inventário e contagem noturna autorizada',
      status: 'ativo'
    }
  ]
};

export const INITIAL_SECURITY_LOGS: SecurityAuditLog[] = [
  {
    id: 'log-1',
    timestamp: 'Hoje às 07:12',
    employeeId: 'emp-1',
    employeeName: 'Sr. Arnaldo (Proprietário)',
    role: 'dono',
    action: 'login_remoto_autorizado',
    deviceInfo: 'iPhone 15 Pro Max (iOS 18) • Safari Mobile',
    ipAddress: '177.136.204.88 (Vivo Fibra Residencial)',
    status: 'sucesso',
    details: 'Acesso do Proprietário irrestrito 24h via gestão remota. Verificação de abertura de caixa e DRE.'
  },
  {
    id: 'log-2',
    timestamp: 'Hoje às 07:45',
    employeeId: 'emp-4',
    employeeName: 'Carlos Eduardo (Gerente)',
    role: 'gerente',
    action: 'login_remoto_autorizado',
    deviceInfo: 'iPad Air 5th Gen • Chrome iPadOS',
    ipAddress: '189.102.34.12 (Rede Externa 5G)',
    status: 'sucesso',
    details: 'Acesso gerencial liberado para conferência de pedidos de ração e boletos do dia.'
  },
  {
    id: 'log-3',
    timestamp: 'Ontem às 22:48',
    employeeId: 'emp-3',
    employeeName: 'Lucas Ferreira (Estoquista)',
    role: 'operador',
    action: 'login_remoto_bloqueado',
    deviceInfo: 'Samsung Galaxy A54 • Android 14',
    ipAddress: '179.184.99.215 (IP Desconhecido 4G)',
    status: 'bloqueado',
    details: 'Tentativa de acesso de operador às 22:48 fora do horário comercial (08:00 às 18:30) sem autorização do dono. Acesso bloqueado por segurança.'
  },
  {
    id: 'log-4',
    timestamp: 'Ontem às 18:45',
    employeeId: 'emp-1',
    employeeName: 'Sr. Arnaldo (Proprietário)',
    role: 'dono',
    action: 'autorizacao_concedida',
    deviceInfo: 'MacBook Air M2 • Google Chrome',
    ipAddress: '177.136.204.88',
    status: 'sucesso',
    details: 'Passe de acesso remoto temporário emitido para Mariana Souza (Vendedora) para auxílio no fechamento mensal.'
  }
];
