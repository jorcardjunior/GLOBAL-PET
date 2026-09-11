import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Global Pet ERP:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleClearCacheAndReset = () => {
    try {
      localStorage.removeItem('agropet_employees_v2');
      localStorage.removeItem('agropet_current_user_id_v2');
    } catch (e) {
      console.warn('Erro ao limpar cache:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#0f1017] border border-indigo-500/30 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px]">refresh</span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Recuperação do Sistema Global Pet
              </h2>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Detectamos uma instabilidade temporária na inicialização. Clique abaixo para restabelecer a operação normal da loja.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-500/25 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">replay</span>
                <span>Recarregar Sistema</span>
              </button>

              <button
                type="button"
                onClick={this.handleClearCacheAndReset}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 font-medium text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Restaurar Equipe Inicial & Abrir</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
