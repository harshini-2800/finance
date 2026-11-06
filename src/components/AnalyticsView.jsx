import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  PieChart as PieIcon, 
  Activity, 
  Layers
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { formatINR, formatMonthName, CATEGORY_COLORS } from '../utils/constants';

export default function AnalyticsView() {
  const { 
    selectedMonth, 
    currentMonthData, 
    monthlyTrendsData = []
  } = useFinance();

  const {
    totalIncome = 0,
    totalExpenses = 0,
    remainingBalance = 0,
    savingsRate = 0,
    highestCategory = null,
    highestAmount = 0,
    categoryTotals = {}
  } = currentMonthData || {};

  const safeMonthlyTrends = Array.isArray(monthlyTrendsData) ? monthlyTrendsData : [];
  const allMonthsCount = safeMonthlyTrends.filter(m => (m?.expense || 0) > 0).length || 1;
  const totalHistoricalExpenditure = safeMonthlyTrends.reduce((acc, m) => acc + (Number(m?.expense) || 0), 0);
  const averageMonthlyExpenditure = totalHistoricalExpenditure / allMonthsCount;

  const categoryAnalyticsData = Object.entries(categoryTotals || {}).map(([cat, amt]) => ({
    name: String(cat),
    amount: Number(amt) || 0,
    fill: CATEGORY_COLORS[cat] || '#8955B5'
  })).sort((a, b) => b.amount - a.amount);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#100B16] border border-[#8955B5]/50 p-3 rounded-xl shadow-[0_0_25px_rgba(137,85,181,0.35)] text-xs space-y-1.5 z-50">
          <p className="font-semibold text-[#F5F0FA] text-[13px] border-b border-[#291C35] pb-1">
            {label || payload[0]?.payload?.name || payload[0]?.name || ''}
          </p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color || '#B99AD9' }} className="font-medium flex items-center justify-between gap-4">
              <span>{entry.name || 'Value'}:</span>
              <span className="font-mono text-sm text-[#F5F0FA]">{formatINR(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/50 hover:shadow-[0_0_25px_rgba(137,85,181,0.25)] transition-all shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-[#F5F0FA] tracking-tight">
          Financial Spending Analytics & Velocity
        </h2>
        <p className="text-xs sm:text-sm text-[#82768E] mt-1 font-normal">
          Portfolio telemetry, capital burn rate and multi-month allocation for {formatMonthName(selectedMonth)}
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Monthly Spend */}
        <div className="p-5 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/60 hover:shadow-[0_0_25px_rgba(137,85,181,0.35)] transition-all transform hover:-translate-y-1 shadow-sm group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B7AFC1]">
              Total Monthly Spend
            </span>
            <div className="p-2 rounded-lg bg-[#39204F]/40 border border-[#633B86]/40 group-hover:border-[#8955B5]/60 group-hover:shadow-[0_0_12px_rgba(137,85,181,0.5)] text-[#B99AD9] transition-all">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-[#F5F0FA]">
            {formatINR(totalExpenses)}
          </div>
          <div className="text-[11px] text-[#82768E] mt-2">
            Billing Cycle: {formatMonthName(selectedMonth)}
          </div>
        </div>

        {/* Metric 2: Average Monthly Spend */}
        <div className="p-5 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/60 hover:shadow-[0_0_25px_rgba(137,85,181,0.35)] transition-all transform hover:-translate-y-1 shadow-sm group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B99AD9]">
              Average Monthly Spend
            </span>
            <div className="p-2 rounded-lg bg-[#633B86]/20 border border-[#8955B5]/30 group-hover:border-[#8955B5]/60 group-hover:shadow-[0_0_12px_rgba(137,85,181,0.5)] text-[#D3C0E8] transition-all">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-[#B99AD9]">
            {formatINR(averageMonthlyExpenditure)}
          </div>
          <div className="text-[11px] text-[#82768E] mt-2">
            Averaged across recorded periods
          </div>
        </div>

        {/* Metric 3: Highest Category */}
        <div className="p-5 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/60 hover:shadow-[0_0_25px_rgba(137,85,181,0.35)] transition-all transform hover:-translate-y-1 shadow-sm group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D3C0E8]">
              Primary Outflow Sector
            </span>
            <div className="p-2 rounded-lg bg-[#8955B5]/20 border border-[#8955B5]/35 group-hover:border-[#8955B5]/60 group-hover:shadow-[0_0_12px_rgba(137,85,181,0.5)] text-[#D3C0E8] transition-all">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-[#F5F0FA] truncate">
            {highestCategory || 'None'}
          </div>
          <div className="text-[11px] text-[#82768E] mt-2 flex items-center justify-between">
            <span>Peak allocation:</span>
            <span className="font-mono font-medium text-[#F5F0FA]">{formatINR(highestAmount)}</span>
          </div>
        </div>

        {/* Metric 4: Savings Ratio */}
        <div className="p-5 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/60 hover:shadow-[0_0_25px_rgba(137,85,181,0.35)] transition-all transform hover:-translate-y-1 shadow-sm group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B99AD9]">
              Net Savings Ratio
            </span>
            <div className="p-2 rounded-lg bg-[#633B86]/20 border border-[#8955B5]/30 group-hover:border-[#8955B5]/60 group-hover:shadow-[0_0_12px_rgba(137,85,181,0.5)] text-[#B99AD9] transition-all">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-[#B99AD9]">
            {totalIncome > 0 ? savingsRate.toFixed(1) : 0}%
          </div>
          <div className="text-[11px] text-[#82768E] mt-2">
            Retained: {formatINR(remainingBalance)}
          </div>
        </div>
      </div>

      {/* Chart 1: Income vs Expenses */}
      <div className="p-6 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/50 hover:shadow-[0_0_25px_rgba(137,85,181,0.2)] transition-all">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-semibold text-[#F5F0FA] tracking-tight">
              Monthly Inflow vs Outflow Comparison
            </h3>
            <p className="text-xs text-[#82768E]">
              Comparative balance of revenues versus capital expenditures
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8955B5]/15 border border-[#8955B5]/30 text-[#D3C0E8]">
              <span className="w-2 h-2 rounded-full bg-[#8955B5] shadow-[0_0_6px_#8955B5]"></span> Income
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#633B86]/25 border border-[#633B86]/40 text-[#B99AD9]">
              <span className="w-2 h-2 rounded-full bg-[#633B86] shadow-[0_0_6px_#633B86]"></span> Expenses
            </span>
          </div>
        </div>

        <div className="h-72 w-full min-h-[280px]">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={safeMonthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#291C35" vertical={false} />
              <XAxis dataKey="fullName" stroke="#82768E" fontSize={11} tickLine={false} />
              <YAxis stroke="#82768E" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Income" fill="#8955B5" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="expense" name="Expenses" fill="#633B86" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2 & 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/50 hover:shadow-[0_0_25px_rgba(137,85,181,0.2)] transition-all">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-[#F5F0FA] tracking-tight">
              Monthly Expenditure Curve
            </h3>
            <p className="text-xs text-[#82768E]">
              Historical outflow trend trajectory
            </p>
          </div>

          <div className="h-64 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={safeMonthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradAmethyst" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8955B5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8955B5" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#291C35" vertical={false} />
                <XAxis dataKey="name" stroke="#82768E" fontSize={11} tickLine={false} />
                <YAxis stroke="#82768E" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="expense" name="Expenditure" stroke="#8955B5" strokeWidth={2.5} fillOpacity={1} fill="url(#spendGradAmethyst)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/50 hover:shadow-[0_0_25px_rgba(137,85,181,0.2)] transition-all">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-[#F5F0FA] tracking-tight">
              Category-Wise Spending Breakdown
            </h3>
            <p className="text-xs text-[#82768E]">
              Current cycle distribution sorted by spend weight
            </p>
          </div>

          {categoryAnalyticsData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-4">
              <PieIcon className="w-8 h-8 text-[#82768E] mb-2 stroke-1" />
              <p className="text-xs text-[#82768E]">No category transactions this month</p>
            </div>
          ) : (
            <div className="h-64 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryAnalyticsData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#291C35" horizontal={false} />
                  <XAxis type="number" stroke="#82768E" fontSize={10} tickFormatter={(val) => `₹${val/1000}k`} />
                  <YAxis dataKey="name" type="category" stroke="#82768E" fontSize={10} width={90} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" name="Expense" fill="#8955B5" radius={[0, 4, 4, 0]}>
                    {categoryAnalyticsData.map((entry) => (
                      <Cell key={`cell-analytics-${entry.name}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
