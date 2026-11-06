import React from 'react';
import { 
  PieChart as PieIcon, 
  ShoppingBag,
  Home,
  Utensils,
  Car,
  GraduationCap,
  Gamepad2,
  HeartPulse,
  Zap,
  HelpCircle,
  Plus
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
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, formatINR, formatMonthName } from '../utils/constants';

const CATEGORY_ICON_MAP = {
  'Food': Utensils,
  'Shopping': ShoppingBag,
  'Transportation': Car,
  'Education': GraduationCap,
  'Entertainment': Gamepad2,
  'Healthcare': HeartPulse,
  'Housing': Home,
  'Bills and Utilities': Zap,
  'Other': HelpCircle
};

export default function CategoriesView({ onOpenAddExpense }) {
  const { selectedMonth, currentMonthData } = useFinance();
  const { 
    totalIncome = 0, 
    totalExpenses = 0, 
    categoryTotals = {}, 
    monthExpenses = [] 
  } = currentMonthData || {};

  const categoryStats = EXPENSE_CATEGORIES.map(cat => {
    const amount = categoryTotals[cat] || 0;
    const percentageOfExpenses = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
    const percentageOfIncome = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
    const txCount = (monthExpenses || []).filter(e => e.category === cat).length;
    return {
      category: cat,
      amount,
      percentageOfExpenses,
      percentageOfIncome,
      txCount,
      color: CATEGORY_COLORS[cat] || '#8955B5'
    };
  }).sort((a, b) => b.amount - a.amount);

  const activeCategories = categoryStats.filter(c => c.amount > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#100B16] border border-[#8955B5]/30 p-3 rounded-xl shadow-xl text-xs space-y-1 z-50">
          <p className="font-semibold text-[#F5F0FA] text-[13px]">{data.category || data.name}</p>
          <p className="text-[#B99AD9] font-mono text-sm">{formatINR(data.amount || data.value)}</p>
          <p className="text-[#82768E]">
            {data.percentageOfExpenses ? `${data.percentageOfExpenses.toFixed(1)}% of total spend` : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="p-6 rounded-2xl bg-[#17101F] border border-[#291C35] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F5F0FA] tracking-tight">
            Expense Categories & Allocation Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-[#82768E] mt-0.5">
            Sectored spending across all 9 classifications for {formatMonthName(selectedMonth)}
          </p>
        </div>
        <button
          onClick={onOpenAddExpense}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#633B86] to-[#8955B5] hover:from-[#7A4A9E] hover:to-[#9E69CD] text-[#F5F0FA] font-semibold text-xs shadow-md shadow-[#633B86]/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Top Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut chart */}
        <div className="p-6 rounded-2xl bg-[#17101F] border border-[#291C35] flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-[#F5F0FA]">Visual Distribution</h3>
            <span className="text-xs text-[#B99AD9]">{activeCategories.length} Active Categories</span>
          </div>

          {activeCategories.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-4">
              <PieIcon className="w-8 h-8 text-[#82768E] mb-2 stroke-1" />
              <p className="text-xs text-[#82768E]">No category transactions this month</p>
            </div>
          ) : (
            <div className="relative h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={activeCategories}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={96}
                    paddingAngle={3}
                  >
                    {activeCategories.map((entry) => (
                      <Cell key={`cell-${entry.category}`} fill={entry.color} stroke="#17101F" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </RePieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-[10px] uppercase font-semibold text-[#82768E] block">Disbursed</span>
                <span className="text-base sm:text-lg font-mono font-bold text-[#F5F0FA]">{formatINR(totalExpenses)}</span>
              </div>
            </div>
          )}

          <div className="w-full flex flex-wrap gap-2 pt-3 border-t border-[#291C35] justify-center text-[11px]">
            {activeCategories.slice(0, 5).map(c => (
              <span key={c.category} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#100B16] border border-[#291C35]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-[#B7AFC1]">{c.category} ({c.percentageOfExpenses.toFixed(0)}%)</span>
              </span>
            ))}
          </div>
        </div>

        {/* Volume Bar Breakdown */}
        <div className="p-6 rounded-2xl bg-[#17101F] border border-[#291C35] flex flex-col justify-between">
          <div className="w-full flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#F5F0FA]">Category Volume Ranking</h3>
            <span className="text-xs text-[#B99AD9]">Highest to lowest</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activeCategories.length > 0 ? activeCategories : [{ category: 'None', amount: 0 }]}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#291C35" horizontal={false} />
                <XAxis type="number" stroke="#82768E" fontSize={10} tickFormatter={(val) => `₹${val/1000}k`} />
                <YAxis dataKey="category" type="category" stroke="#82768E" fontSize={11} width={80} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                  {activeCategories.map((entry) => (
                    <Cell key={`bar-${entry.category}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-[#82768E] pt-3 border-t border-[#291C35] flex items-center justify-between">
            <span>Peak Sector: <strong className="text-[#F5F0FA]">{activeCategories[0]?.category || 'None'}</strong></span>
            <span>Total Categories: 9</span>
          </div>
        </div>
      </div>

      {/* Grid of All 9 Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryStats.map((item) => {
          const Icon = CATEGORY_ICON_MAP[item.category] || HelpCircle;
          return (
            <div 
              key={item.category}
              className="p-5 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/40 transition-colors shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}40`, color: item.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F5F0FA]">
                      {item.category}
                    </h4>
                    <span className="text-[11px] text-[#82768E]">
                      {item.txCount} transaction{item.txCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-mono font-bold text-[#F5F0FA]">
                    {formatINR(item.amount)}
                  </div>
                  <div className="text-[11px] text-[#82768E]">
                    {item.percentageOfExpenses.toFixed(1)}% of spend
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#100B16] rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, item.percentageOfExpenses)}%`,
                    backgroundColor: item.color 
                  }}
                />
              </div>

              {/* Bottom stats */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#82768E]">
                <span>Share of Income:</span>
                <span className="font-medium text-[#B7AFC1]">
                  {totalIncome > 0 ? `${item.percentageOfIncome.toFixed(1)}%` : 'N/A'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
