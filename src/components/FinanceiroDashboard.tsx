import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../context/AppContext';

interface WeeklyData {
  periodo: string;
  receita: number;
  despesa: number;
  lucro: number;
  margem: number;
}

export const FinanceiroDashboard: React.FC = () => {
  const { caixaStatus, bills, sales } = useApp();

  const [periodFilter, setPeriodFilter] = useState<'semanal' | 'mensal'>('semanal');
  const [scenario, setScenario] = useState<'realista' | 'otimista' | 'conservador'>('realista');

  // Multiplier based on scenario
  const scenarioFactor = scenario === 'otimista' ? 1.08 : scenario === 'conservador' ? 0.94 : 1.0;

  // Calculate live dynamic metrics incorporating real-time caixa/sales
  const extraRevenue = caixaStatus?.totalToday ? (caixaStatus.totalToday - 3840.50) : 0;
  const paidBillsTotal = useMemo(() => {
    return bills
      .filter(b => b.status === 'pago')
      .reduce((acc, curr) => acc + (curr.amount ?? curr.value ?? 0), 0);
  }, [bills]);

  const pendingBillsTotal = useMemo(() => {
    return bills
      .filter(b => b.status !== 'pago')
      .reduce((acc, curr) => acc + (curr.amount ?? curr.value ?? 0), 0);
  }, [bills]);

  // Dynamic Weekly Timeline Data (PowerBI style)
  const timelineData: WeeklyData[] = useMemo(() => {
    if (periodFilter === 'semanal') {
      return [
        {
          periodo: 'Sem 01 (01-07)',
          receita: 11850 * scenarioFactor,
          despesa: 7920,
          lucro: (11850 * scenarioFactor) - 7920,
          margem: Math.round((((11850 * scenarioFactor) - 7920) / (11850 * scenarioFactor)) * 100)
        },
        {
          periodo: 'Sem 02 (08-14)',
          receita: 13420 * scenarioFactor,
          despesa: 8640,
          lucro: (13420 * scenarioFactor) - 8640,
          margem: Math.round((((13420 * scenarioFactor) - 8640) / (13420 * scenarioFactor)) * 100)
        },
        {
          periodo: 'Sem 03 (15-21)',
          receita: 12900 * scenarioFactor,
          despesa: 7850,
          lucro: (12900 * scenarioFactor) - 7850,
          margem: Math.round((((12900 * scenarioFactor) - 7850) / (12900 * scenarioFactor)) * 100)
        },
        {
          periodo: 'Sem 04 (22-28)',
          receita: (14650 + Math.max(0, extraRevenue)) * scenarioFactor,
          despesa: 8900 + (paidBillsTotal > 0 ? 400 : 0),
          lucro: ((14650 + Math.max(0, extraRevenue)) * scenarioFactor) - (8900 + (paidBillsTotal > 0 ? 400 : 0)),
          margem: Math.round(((((14650 + Math.max(0, extraRevenue)) * scenarioFactor) - 8900) / ((14650 + Math.max(0, extraRevenue)) * scenarioFactor)) * 100)
        },
        {
          periodo: 'Sem 05 Proj. (29-31)',
          receita: 6800 * scenarioFactor,
          despesa: 3800,
          lucro: (6800 * scenarioFactor) - 3800,
          margem: Math.round((((6800 * scenarioFactor) - 3800) / (6800 * scenarioFactor)) * 100)
        }
      ];
    } else {
      // Monthly 6-month historical & projection
      return [
        { periodo: 'Mai/26', receita: 46200, despesa: 32100, lucro: 14100, margem: 31 },
        { periodo: 'Jun/26', receita: 49100, despesa: 33800, lucro: 15300, margem: 31 },
        { periodo: 'Jul/26', receita: 52400, despesa: 35200, lucro: 17200, margem: 33 },
        { periodo: 'Ago/26', receita: 54800, despesa: 36400, lucro: 18400, margem: 34 },
        {
          periodo: 'Set/26 (Atual)',
          receita: (59620 + Math.max(0, extraRevenue)) * scenarioFactor,
          despesa: 37110,
          lucro: ((59620 + Math.max(0, extraRevenue)) * scenarioFactor) - 37110,
          margem: Math.round(((((59620 + Math.max(0, extraRevenue)) * scenarioFactor) - 37110) / ((59620 + Math.max(0, extraRevenue)) * scenarioFactor)) * 100)
        },
        {
          periodo: 'Out/26 (Proj)',
          receita: 63000 * scenarioFactor,
          despesa: 38500,
          lucro: (63000 * scenarioFactor) - 38500,
          margem: Math.round((((63000 * scenarioFactor) - 38500) / (63000 * scenarioFactor)) * 100)
        }
      ];
    }
  }, [periodFilter, scenarioFactor, extraRevenue, paidBillsTotal]);

  // Aggregate Total for Month
  const totalReceita = useMemo(() => timelineData.reduce((a, b) => a + b.receita, 0), [timelineData]);
  const totalDespesa = useMemo(() => timelineData.reduce((a, b) => a + b.despesa, 0), [timelineData]);
  const totalLucro = totalReceita - totalDespesa;
  const margemMedia = totalReceita > 0 ? Math.round((totalLucro / totalReceita) * 100) : 0;
  const metaFaturamento = 60000;
  const atingimentoMeta = Math.min(100, Math.round((totalReceita / metaFaturamento) * 100));

  // Department Distribution (Donut Chart)
  const departmentData = [
    { name: 'Rações Granel & Sacarias', value: 34579, color: '#6366f1' },
    { name: 'Estética Banho & Tosa', value: 13116, color: '#a855f7' },
    { name: 'Farmácia Veterinária', value: 8346, color: '#10b981' },
    { name: 'Acessórios & Brinquedos', value: 3577, color: '#f59e0b' }
  ];

  // Expense Breakdown
  const expenseData = [
    { categoria: 'CMV Fornecedores Ração', valor: 21400, percent: 57, color: '#6366f1' },
    { categoria: 'Folha Pagamento & Pró-labore', valor: 7800, percent: 21, color: '#ec4899' },
    { categoria: 'Aluguel, Água & Energia', valor: 3950, percent: 11, color: '#f59e0b' },
    { categoria: 'Impostos & Taxas Maquininhas', valor: 2650, percent: 7, color: '#8b5cf6' },
    { categoria: 'Insumos Banho & Tosa', valor: 1310, percent: 4, color: '#10b981' }
  ];

  // Custom Formatter for Currency
  const formatBRL = (val: number) => {
    return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  // Custom PowerBI Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b0d19]/95 border border-white/20 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs text-white flex flex-col gap-1 min-w-[170px]">
          <span className="font-bold text-white/90 pb-1 border-b border-white/10">{label}</span>
          {payload.map((entry: any, index: number) => {
            const isPercent = entry.name.toLowerCase().includes('margem');
            return (
              <div key={`item-${index}`} className="flex items-center justify-between gap-3 py-0.5">
                <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  <span className="text-white/70">{entry.name}:</span>
                </span>
                <span className="font-semibold text-white">
                  {isPercent ? `${entry.value}%` : formatBRL(entry.value)}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Power BI Top Bar with Filter Slicers */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <span className="material-symbols-outlined text-[22px]">analytics</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold text-white tracking-tight">Power BI • Resumo Financeiro & DRE</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Ao Vivo
              </span>
            </div>
            <p className="text-[11px] text-white/50">
              Projeção analítica do mês • Setembro 2026 • Agro & Pet Care
            </p>
          </div>
        </div>

        {/* Slicers / Interactive Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Timeline Granularity Slicer */}
          <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/10 text-[11px]">
            <button
              id="btn-period-semanal"
              type="button"
              onClick={() => setPeriodFilter('semanal')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                periodFilter === 'semanal'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Semanal
            </button>
            <button
              id="btn-period-mensal"
              type="button"
              onClick={() => setPeriodFilter('mensal')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                periodFilter === 'mensal'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Semestral
            </button>
          </div>

          {/* Scenario Slicer */}
          <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/10 text-[11px]">
            <button
              id="btn-scenario-conservador"
              type="button"
              onClick={() => setScenario('conservador')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                scenario === 'conservador'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Conservador
            </button>
            <button
              id="btn-scenario-realista"
              type="button"
              onClick={() => setScenario('realista')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                scenario === 'realista'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Realista
            </button>
            <button
              id="btn-scenario-otimista"
              type="button"
              onClick={() => setScenario('otimista')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                scenario === 'otimista'
                  ? 'bg-emerald-600 text-white font-semibold shadow'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Otimista
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Executive Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Receita Projetada */}
        <div id="card-kpi-receita" className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-1">
              <span>Receita Projetada</span>
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">trending_up</span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatBRL(totalReceita)}
            </div>
          </div>
          <div className="pt-3 border-t border-white/5 mt-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">arrow_drop_up</span> +14.8% vs ago
              </span>
              <span className="text-white/50">{atingimentoMeta}% da meta</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${atingimentoMeta}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Despesas & CMV */}
        <div id="card-kpi-despesas" className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-rose-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-1">
              <span>Despesas & CMV Total</span>
              <span className="material-symbols-outlined text-rose-400 text-[18px]">shopping_cart_checkout</span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatBRL(totalDespesa)}
            </div>
          </div>
          <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-[11px]">
            <span className="text-white/60">Boletos pendentes:</span>
            <span className="text-amber-300 font-bold">{formatBRL(pendingBillsTotal)}</span>
          </div>
        </div>

        {/* Lucro Operacional Líquido */}
        <div id="card-kpi-lucro" className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-1">
              <span>Lucro Líquido Projetado</span>
              <span className="material-symbols-outlined text-indigo-400 text-[18px]">account_balance_wallet</span>
            </div>
            <div className="text-2xl font-bold text-indigo-200 tracking-tight">
              {formatBRL(totalLucro)}
            </div>
          </div>
          <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-[11px]">
            <span className="text-white/60">Ponto de Equilíbrio:</span>
            <span className="text-emerald-400 font-bold">Superado (Dia 17)</span>
          </div>
        </div>

        {/* Margem de Lucro % */}
        <div id="card-kpi-margem" className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-1">
              <span>Margem de Lucro Média</span>
              <span className="material-symbols-outlined text-purple-400 text-[18px]">pie_chart</span>
            </div>
            <div className="text-2xl font-bold text-purple-300 tracking-tight flex items-baseline gap-1">
              <span>{margemMedia}%</span>
              <span className="text-[12px] text-white/50 font-normal">s/ faturamento</span>
            </div>
          </div>
          <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-[11px]">
            <span className="text-white/60">Benchmark Agro:</span>
            <span className="text-purple-300 font-semibold">+3.2 p.p. acima</span>
          </div>
        </div>
      </div>

      {/* Main Chart Section: Evolução de Receitas, Despesas e Margem (PowerBI Visual) */}
      <div id="card-chart-evolucao" className="glass-card p-4 md:p-5 rounded-2xl border border-white/10 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-[16px] text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400 text-[20px]">waterfall_chart</span>
              Curva de Receita, Despesa e Margem de Lucro Projetada
            </h3>
            <p className="text-[11px] text-white/50">
              Evolução temporal comparativa com projeção de fechamento do mês
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-white/70">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500/80"></span>
              Receita (R$)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500/80"></span>
              Despesa (R$)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-indigo-400"></span>
              Margem (%)
            </span>
          </div>
        </div>

        {/* Recharts Composed Chart */}
        <div className="w-full h-72 sm:h-80 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={timelineData}
              margin={{ top: 15, right: 15, bottom: 5, left: 10 }}
            >
              <defs>
                <linearGradient id="receitaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="despesaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              
              <XAxis
                dataKey="periodo"
                stroke="rgba(255,255,255,0.4)"
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
              />
              
              {/* Primary Y Axis for Currency */}
              <YAxis
                yAxisId="left"
                stroke="rgba(255,255,255,0.4)"
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
                axisLine={false}
                tickLine={false}
              />

              {/* Secondary Y Axis for Margem % */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 60]}
                stroke="rgba(255,255,255,0.4)"
                tick={{ fill: '#818cf8', fontSize: 10 }}
                tickFormatter={(val) => `${val}%`}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Receitas Area */}
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="receita"
                name="Receita Bruta"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#receitaGrad)"
              />

              {/* Despesas Bar / Area */}
              <Bar
                yAxisId="left"
                dataKey="despesa"
                name="Despesas & CMV"
                fill="#f43f5e"
                opacity={0.8}
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />

              {/* Margem Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="margem"
                name="Margem de Lucro"
                stroke="#818cf8"
                strokeWidth={3}
                dot={{ fill: '#818cf8', r: 4, strokeWidth: 1, stroke: '#ffffff' }}
                activeDot={{ r: 6, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Mix de Departamentos (Donut) & Centro de Custos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full min-w-0 items-stretch">
        {/* Donut Chart: Mix de Faturamento */}
        <div id="card-chart-donut-faturamento" className="glass-card p-4 md:p-5 rounded-2xl border border-white/10 flex flex-col justify-between w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-[15px] text-white">Composição da Receita por Linha</h3>
              <p className="text-[11px] text-white/50">Participação percentual no faturamento mensal</p>
            </div>
            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
              4 Canais
            </span>
          </div>

          {/* Donut graphic container with centered KPI */}
          <div className="w-full h-44 relative flex items-center justify-center my-1 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatBRL(Number(value)), 'Faturamento']}
                  contentStyle={{
                    backgroundColor: '#0b0d19',
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#ffffff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center KPI in Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-white/50 uppercase font-semibold">Total Mês</span>
              <span className="text-[14px] font-bold text-white tracking-tight">R$ 59,6k</span>
            </div>
          </div>

          {/* Department Breakdown Legend - 2x2 Grid with min-w-0 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-3 border-t border-white/5">
            {departmentData.map((dept, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 flex-1 pr-1">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: dept.color }}></span>
                  <span className="text-white/80 font-medium text-[11px] truncate">{dept.name}</span>
                </div>
                <span className="font-bold text-white text-[11px] whitespace-nowrap flex-shrink-0">
                  {formatBRL(dept.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown de Despesas e CMV */}
        <div id="card-centros-de-custo" className="glass-card p-4 md:p-5 rounded-2xl border border-white/10 flex flex-col justify-between w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-[15px] text-white">Centros de Custo & CMV</h3>
              <p className="text-[11px] text-white/50">Distribuição das principais saídas operacionais</p>
            </div>
            <span className="text-[10px] font-bold text-rose-300 bg-rose-500/15 border border-rose-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
              CMV: 57%
            </span>
          </div>

          <div className="flex flex-col justify-between gap-3.5 my-auto pt-1">
            {expenseData.map((exp, idx) => (
              <div key={idx} className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center justify-between text-[11px] font-medium text-white/80 min-w-0">
                  <span className="flex items-center gap-1.5 truncate pr-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: exp.color }}></span>
                    <span className="truncate">{exp.categoria}</span>
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-bold text-white">{formatBRL(exp.valor)}</span>
                    <span className="text-white/50 text-[10px] w-7 text-right font-mono">{exp.percent}%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${exp.percent}%`, backgroundColor: exp.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PowerBI Smart Insights Narrative Card */}
      <div id="card-smart-narrative-bi" className="glass-card p-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 to-purple-950/20 flex flex-col sm:flex-row items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[20px]">insights</span>
        </div>
        <div className="flex flex-col gap-1 text-[12px] text-white/80">
          <h4 className="font-bold text-white text-[13px] flex items-center gap-2">
            Narrativa Executiva da Controladoria
            <span className="text-[10px] font-normal text-indigo-300 bg-indigo-500/20 px-1.5 py-0.2 rounded">
              IA BI Insights
            </span>
          </h4>
          <p className="text-white/70 leading-relaxed">
            • <strong>Ponto de Equilíbrio (Break-Even):</strong> Foi superado no 17º dia do mês, gerando uma margem de segurança operacional projetada de <strong>{margemMedia}%</strong>.
          </p>
          <p className="text-white/70 leading-relaxed">
            • <strong>Ração a Granel & Pet Care:</strong> Representam <strong>80% do faturamento total</strong> e puxam o ticket médio da loja para R$ 145,00 por cliente.
          </p>
          <p className="text-white/70 leading-relaxed">
            • <strong>Saúde Financeira:</strong> Com {bills.filter(b => b.status === 'pago').length} boletos já liquidados e controle rígido do caderninho de fiado, o fluxo de caixa opera no verde com sobra líquida de <strong>{formatBRL(totalLucro)}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
