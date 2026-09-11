/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { BarcodeModal } from './components/BarcodeModal';
import { NovaVendaModal } from './components/NovaVendaModal';
import { CupomModal } from './components/CupomModal';
import { EmployeeModal } from './components/EmployeeModal';
import { AjustesModal } from './components/AjustesModal';
import { EmployeeManagementModal } from './components/EmployeeManagementModal';
import { EmployeeFormModal } from './components/EmployeeFormModal';
import { PDVScreen } from './components/PDVScreen';
import { GranelScreen } from './components/GranelScreen';
import { PetCareScreen } from './components/PetCareScreen';
import { ClientesScreen } from './components/ClientesScreen';
import { FornecedoresScreen } from './components/FornecedoresScreen';
import { EntradasScreen } from './components/EntradasScreen';
import { GestaoScreen } from './components/GestaoScreen';
import { AtendimentoIAScreen } from './components/AtendimentoIAScreen';
import { OnlineOrdersModal } from './components/OnlineOrdersModal';
import { RemoteLockScreen } from './components/RemoteLockScreen';
import { OwnerRemoteDashboardModal } from './components/OwnerRemoteDashboardModal';
import { ErrorBoundary } from './components/ErrorBoundary';

const MainContent: React.FC = () => {
  const { activeTab, isRemoteAccessBlockedForCurrentUser } = useApp();

  if (isRemoteAccessBlockedForCurrentUser) {
    return <RemoteLockScreen />;
  }

  return (
    <main className="min-h-screen relative z-10 text-on-surface pt-16 pb-20 md:pb-8 md:pl-[68px] transition-all">
      {activeTab === 'pdv' && <PDVScreen />}
      {activeTab === 'granel' && <GranelScreen />}
      {activeTab === 'petcare' && <PetCareScreen />}
      {activeTab === 'clientes' && <ClientesScreen />}
      {activeTab === 'fornecedores' && <FornecedoresScreen />}
      {activeTab === 'entradas' && <EntradasScreen />}
      {activeTab === 'gestao' && <GestaoScreen />}
      {activeTab === 'bot' && <AtendimentoIAScreen />}
    </main>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="min-h-screen bg-[#050508] text-[#e0e0e6] font-sans selection:bg-indigo-500/30 selection:text-white relative overflow-x-hidden">
          {/* Ambient Frosted Glass Mesh Glows */}
          <div className="mesh-1" />
          <div className="mesh-2" />
          <div className="mesh-3" />

          <Header />
          <Sidebar />
          <MainContent />
          <BarcodeModal />
          <NovaVendaModal />
          <CupomModal />
          <EmployeeModal />
          <AjustesModal />
          <EmployeeManagementModal />
          <EmployeeFormModal />
          <OwnerRemoteDashboardModal />
          <OnlineOrdersModal />
          <Toast />
        </div>
      </AppProvider>
    </ErrorBoundary>
  );
}

