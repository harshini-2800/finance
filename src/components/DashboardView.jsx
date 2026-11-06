import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  PiggyBank, 
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { formatINR, formatMonthName, CATEGORY_COLORS } from '../utils/constants';

export default function DashboardView({ onOpenAddExpense, onOpenAddIncome }) {
  const { 
    selectedMonth, 
    currentMonthData, 
    monthlyTrendsData, 
    setActiveTab
  } = useFinance();

  const {
    totalIncome = 0,
    totalExpenses = 0,
    remainingBalance = 0,
    savingsRate = 0,
    categoryTotals = {},
    monthExpenses = [],
    aiInsights = []
  } = currentMonthData || {};

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value);

  const recentTransactions = monthExpenses.slice(0, 5);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#100B16] border border-[#8955B5]/50 p-3 rounded-xl shadow-[0_0_25px_rgba(137,85,181,0.35)] text-xs space-y-1.5 z-50">
          <p className="font-semibold text-[#F5F0FA] text-[13px] border-b border-[#291C35] pb-1">
            {label || payload[0]?.name}
          </p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color || '#B99AD9' }} className="font-medium flex items-center justify-between gap-4">
              <span>{entry.name}:</span>
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
      {/* Top Banner: Obsidian Plum Card */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-[#17101F] via-[#201629] to-[#100B16] border border-[#352247] hover:border-[#8955B5]/60 hover:shadow-[0_0_30px_rgba(137,85,181,0.25)] transition-all shadow-lg">
        {/* Subtle radial purple lighting */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-[#8955B5]/12 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded bg-[#633B86]/25 text-[#D3C0E8] border border-[#8955B5]/40 shadow-[0_0_12px_rgba(137,85,181,0.2)]">
                Executive Portfolio Position
              </span>
              <span className="text-xs text-[#82768E]">• {formatMonthName(selectedMonth)}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F0FA] tracking-tight">
              Financial Health & Capital Ledger
            </h2>
            <p className="text-xs sm:text-sm text-[#B7AFC1] mt-1 max-w-2xl font-normal">
              {totalIncome > 0 
                ? `You have allocated ${((totalExpenses / totalIncome) * 100).toFixed(0)}% of monthly liquidity. Net retained capital: ${formatINR(remainingBalance)}.` 
                : 'Add your monthly income to initiate automated cash flow ratio tracking.'}
            </p>
          </div>

          {/* Quick AI Tip preview */}
          {aiInsights.length > 0 && (
            <div 
              onClick={() => setActiveTab('ai-insights')}
              className="cursor-pointer group p-3.5 rounded-xl bg-[#100B16]/80 hover:bg-[#17101F] border border-[#352247] hover:border-[#8955B5]/70 hover:shadow-[0_0_20px_rgba(137,85,181,0.4)] transition-all max-w-md shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#633B86]/25 border border-[#8955B5]/40 flex items-center justify-center text-[#B99AD9] flex-shrink-0 group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(137,85,181,0.5)] transition-all">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#B99AD9]">
                    <span>AI Advisory</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 text-[#D3C0E8] transition-transform" />
                  </div>
                  <p className="text-xs text-[#F5F0FA] font-medium truncate mt-0.5">
                    {aiInsights[0].title}
                  </p>
                  <p className="text-[11px] text-[#82768E] truncate mt-0.5">
                    {aiInsights[0].message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4 Financial Summary Cards - Glowing on Hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Monthly Income */}
        <div className="p-5 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/60 hover:shadow-[0_0_25px_rgba(137,85,181,0.35)] transition-all transform hover:-translate-y-1 shadow-sm group">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B99AD9]">
              Total Inflow / Income
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#633B86]/20 border border-[#8955B5]/30 group-hover:border-[#8955B5]/60 group-hover:shadow-[0_0_12px_rgba(137,85,181,0.5)] text-[#D3C0E8] flex items-center justify-center transition-all">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-[#F5F0FA] tracking-tight">
            {formatINR(totalIncome)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#291C35]">
            <button
              onClick={onOpenAddIncome}
              className="text-[#B99AD9] hover:text-[#D3C0E8] hover:underline font-medium text-[11px] flex items-center gap-1"
            >
              + Edit / Add Income
            </button>
            <span className="text-[#82768E] text-[11px]">{formatMonthName(selectedMonth)}</span>
          </div>
        </div>

        {/* Card 2: Total Expenditure */}
        <div className="p-5 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/60 hover:shadow-[0_0_25px_rgba(137,85,181,0.35)] transition-all transform hover:-translate-y-1 shadow-sm group">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B7AFC1]">
              Total Outflow / Spend
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#39204F]/40 border border-[#633B86]/40 group-hover:border-[#8955B5]/60 group-hover:shadow-[0_0_12px_rgba(137,85,181,0.5)] text-[#B99AD9] flex items-center justify-center transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-[#F5F0FA] tracking-tight">
            {formatINR(totalExpenses)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#291C35]">
            <span className="text-[#82768E] text-[11px]">{monthExpenses.length} transactions</span>
            <button 
              onClick={onOpenAddExpense}
              className="text-[#B99AD9] hover:text-[#D3C0E8] hover:underline font-medium text-[11px]"
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* Card 3: Remaining Balance */}
        <div className="p-5 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/60 hover:shadow-[0_0_25px_rgba(137,85,181,0.35)] transition-all transform hover:-translate-y-1 shadow-sm group">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D3C0E8]">
              Net Liquidity / Balance
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#8955B5]/20 border border-[#8955B5]/35 group-hover:border-[#8955B5]/60 group-hover:shadow-[0_0_12px_rgba(137,85,181,0.5)] text-[#D3C0E8] flex items-center justify-center transition-all">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-mono font-bold tracking-tight ${
            remainingBalance >= 0 ? 'text-[#F5F0FA]' : 'text-[#D3C0E8]'
          }`}>
            {formatINR(remainingBalance)}
          </div>
          <div className="mt-3 text-xs pt-2 border-t border-[#291C35] flex items-center gap-1.5">
            {remainingBalance >= 0 ? (
              <span className="text-[#B99AD9] font-medium text-[11px]">
                Surplus Liquidity
              </span>
            ) : (
              <span className="text-[#82768E] font-medium text-[11px]">
                Deficit Position
              </span>
            )}
          </div>
        </div>

        {/* Card 4: Savings Rate */}
        <div className="p-5 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/60 hover:shadow-[0_0_25px_rgba(137,85,181,0.35)] transition-all transform hover:-translate-y-1 shadow-sm group">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B99AD9]">
              Savings Retention Rate
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#633B86]/20 border border-[#8955B5]/30 group-hover:border-[#8955B5]/60 group-hover:shadow-[0_0_12px_rgba(137,85,181,0.5)] text-[#B99AD9] flex items-center justify-center transition-all">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-[#F5F0FA] tracking-tight flex items-baseline gap-2">
            <span>{totalIncome > 0 ? savingsRate.toFixed(1) : 0}%</span>
            {totalIncome > 0 && savingsRate > 20 && (
              <span className="text-xs text-[#D3C0E8] font-semibold uppercase">
                Healthy
              </span>
            )}
          </div>
          {/* Subtle Progress bar */}
          <div className="mt-3.5 w-full bg-[#100B16] rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#633B86] to-[#8955B5] shadow-[0_0_8px_rgba(137,85,181,0.5)]"
              style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts Section: Inflow vs Outflow Bar + Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/50 hover:shadow-[0_0_25px_rgba(137,85,181,0.2)] transition-all">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-semibold text-[#F5F0FA] tracking-tight">
                Cash Flow Trajectory (Income vs Expense)
              </h3>
              <p className="text-xs text-[#82768E]">
                Comparative volume across recent reporting cycles
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#B7AFC1]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8955B5] shadow-[0_0_6px_#8955B5]"></span> Income
              </span>
              <span className="flex items-center gap-1.5 text-[#B7AFC1]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#633B86] shadow-[0_0_6px_#633B86]"></span> Expenses
              </span>
            </div>
          </div>

          <div className="h-68 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendsData || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#291C35" vertical={false} />
                <XAxis dataKey="name" stroke="#82768E" fontSize={11} tickLine={false} />
                <YAxis stroke="#82768E" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" name="Income" fill="#8955B5" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="expense" name="Expenses" fill="#633B86" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Donut Chart */}
        <div className="p-6 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/50 hover:shadow-[0_0_25px_rgba(137,85,181,0.2)] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-[#F5F0FA] tracking-tight">
                Category Split
              </h3>
              <button 
                onClick={() => setActiveTab('categories')}
                className="text-xs text-[#B99AD9] hover:text-[#D3C0E8] hover:underline flex items-center gap-0.5 font-medium"
              >
                All 9 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-[#82768E]">
              Expenditure distribution for {formatMonthName(selectedMonth)}
            </p>
          </div>

          {pieData.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4">
              <p className="text-xs text-[#82768E]">No expenses recorded this month</p>
              <button
                onClick={onOpenAddExpense}
                className="mt-3 text-xs text-[#B99AD9] font-medium underline"
              >
                + Record expense
              </button>
            </div>
          ) : (
            <div className="relative h-56 w-full flex items-center justify-center my-1">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={84}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={CATEGORY_COLORS[entry.name] || '#633B86'} stroke="#17101F" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </RePieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-[10px] uppercase font-semibold text-[#82768E] block">Total</span>
                <span className="text-sm sm:text-base font-mono font-bold text-[#F5F0FA] drop-shadow-[0_0_8px_rgba(185,154,217,0.4)]">{formatINR(totalExpenses)}</span>
              </div>
            </div>
          )}

          {/* Top 3 Legend items */}
          <div className="pt-3 border-t border-[#291C35] space-y-2">
            {pieData.slice(0, 3).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shadow-[0_0_5px_rgba(137,85,181,0.5)]" 
                    style={{ backgroundColor: CATEGORY_COLORS[item.name] || '#633B86' }}
                  />
                  <span className="text-[#B7AFC1]">{item.name}</span>
                </div>
                <div className="font-mono font-medium text-[#F5F0FA]">
                  {formatINR(item.value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent 5 Transactions */}
      <div className="p-6 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/40 hover:shadow-[0_0_20px_rgba(137,85,181,0.18)] transition-all">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-[#F5F0FA] tracking-tight">
              Recent Transactions
            </h3>
            <p className="text-xs text-[#82768E]">
              Latest ledger postings in {formatMonthName(selectedMonth)}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-medium text-[#B99AD9] hover:text-[#D3C0E8] flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Transactions</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-[#291C35] rounded-xl text-[#82768E] text-xs">
            No transactions found for this month.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#291C35] text-[#82768E] uppercase tracking-wider font-semibold">
                  <th className="pb-3 px-3">Title / Merchant</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201629]">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#201629]/60 hover:shadow-[inset_0_0_15px_rgba(137,85,181,0.15)] transition-colors">
                    <td className="py-3 px-3 font-medium text-[#F5F0FA] flex items-center gap-2.5">
                      <span 
                        className="w-2 h-2 rounded-full shadow-[0_0_5px_rgba(137,85,181,0.5)]" 
                        style={{ backgroundColor: CATEGORY_COLORS[tx.category] || '#633B86' }}
                      />
                      <span>{tx.title}</span>
                      {tx.isDemo && (
                        <span className="text-[9px] font-medium bg-[#633B86]/25 text-[#D3C0E8] px-1.5 py-0.2 rounded border border-[#8955B5]/30">
                          DEMO
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[#B7AFC1]">
                      <span className="px-2 py-0.5 rounded bg-[#100B16] border border-[#291C35] text-[11px]">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#82768E] font-mono text-[11px]">{tx.date}</td>
                    <td className="py-3 px-3 text-right font-medium text-[#B99AD9] font-mono text-sm">
                      -{formatINR(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
