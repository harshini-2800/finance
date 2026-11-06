import React from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  BrainCircuit, 
  Lightbulb, 
  Compass,
  Award
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatINR, formatMonthName } from '../utils/constants';

export default function AIInsightsView({ onOpenAddExpense, onOpenAddIncome }) {
  const { selectedMonth, currentMonthData } = useFinance();
  const {
    totalIncome = 0,
    totalExpenses = 0,
    remainingBalance = 0,
    savingsRate = 0,
    aiInsights = [],
    highestCategory = null,
    highestAmount = 0
  } = currentMonthData || {};

  const getInsightBadge = (type) => {
    switch (type) {
      case 'critical':
        return {
          icon: ShieldAlert,
          bg: 'bg-[#633B86]/30 border-[#8955B5]/40 text-[#D3C0E8]',
          badgeText: 'Action Required'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bg: 'bg-[#39204F]/40 border-[#633B86]/40 text-[#B99AD9]',
          badgeText: 'Optimization'
        };
      case 'positive':
        return {
          icon: CheckCircle2,
          bg: 'bg-[#8955B5]/25 border-[#8955B5]/40 text-[#D3C0E8]',
          badgeText: 'Positive Habit'
        };
      default:
        return {
          icon: Info,
          bg: 'bg-[#291C35] border-[#352247] text-[#B7AFC1]',
          badgeText: 'Observation'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#17101F] border border-[#291C35] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D3C0E8] bg-[#633B86]/25 px-2.5 py-0.5 rounded border border-[#8955B5]/35">
              <BrainCircuit className="w-3.5 h-3.5 text-[#B99AD9]" /> Deterministic Rule Modeling
            </span>
            <span className="text-xs text-[#82768E]">• {formatMonthName(selectedMonth)}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F0FA] tracking-tight">
            AI-Assisted Financial Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-[#B7AFC1] mt-1 max-w-2xl font-normal leading-relaxed">
            Transparent, data-driven financial rule modeling. Every recommendation is computed strictly from your actual income, expenses, and budget limits — zero external API tracking.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#100B16] border border-[#291C35] text-right min-w-[200px]">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#82768E] block">Portfolio Solvency</span>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#B99AD9] mt-0.5">
            {totalIncome > 0 ? `${savingsRate.toFixed(1)}% Saved` : 'Awaiting Inflow'}
          </div>
          <span className="text-[11px] text-[#B7AFC1] block mt-1">
            Net Surplus: <strong className="text-[#F5F0FA]">{formatINR(remainingBalance)}</strong>
          </span>
        </div>
      </div>

      {/* Monthly Financial Summary Cards */}
      <div className="p-6 rounded-2xl bg-[#17101F] border border-[#291C35]">
        <h3 className="text-sm font-semibold text-[#F5F0FA] mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-[#B99AD9]" /> Monthly Financial Behavior Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#100B16] border border-[#291C35]">
            <span className="text-[#82768E] font-medium block">Outflow Velocity</span>
            <span className="text-base sm:text-lg font-mono font-bold text-[#F5F0FA] mt-1 block">
              {totalIncome > 0 ? `${((totalExpenses / totalIncome) * 100).toFixed(1)}% Burned` : 'N/A'}
            </span>
            <span className="text-[11px] text-[#82768E] mt-1 block">
              {totalExpenses > totalIncome ? 'Deficit spending detected' : 'Operating within safe cash boundary'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#100B16] border border-[#291C35]">
            <span className="text-[#82768E] font-medium block">Top Spend Vector</span>
            <span className="text-base sm:text-lg font-mono font-bold text-[#B99AD9] mt-1 block truncate">
              {highestCategory ? `${highestCategory} (${formatINR(highestAmount)})` : 'None'}
            </span>
            <span className="text-[11px] text-[#82768E] mt-1 block">
              {totalExpenses > 0 && highestAmount > 0 
                ? `${((highestAmount / totalExpenses) * 100).toFixed(0)}% of monthly spend` 
                : 'No categorized expenses'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#100B16] border border-[#291C35]">
            <span className="text-[#82768E] font-medium block">Discretionary Ratio</span>
            <span className="text-base sm:text-lg font-mono font-bold text-[#D3C0E8] mt-1 block">
              {currentMonthData.categoryTotals['Shopping'] || currentMonthData.categoryTotals['Entertainment'] 
                ? formatINR((currentMonthData.categoryTotals['Shopping'] || 0) + (currentMonthData.categoryTotals['Entertainment'] || 0))
                : '₹0'}
            </span>
            <span className="text-[11px] text-[#82768E] mt-1 block">
              Combined Shopping & Entertainment
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Rule Insights Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#F5F0FA] flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#B99AD9]" /> Active Insights & Rules ({aiInsights.length})
          </h3>
          <span className="text-xs text-[#82768E]">Data-driven automated observations</span>
        </div>

        {aiInsights.map((insight, idx) => {
          const badge = getInsightBadge(insight.type);
          const Icon = badge.icon;

          return (
            <div 
              key={insight.id || idx}
              className="p-5 sm:p-6 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/40 transition-colors shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${badge.bg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${badge.bg}`}>
                        {badge.badgeText}
                      </span>
                      <span className="text-xs text-[#82768E]">• Sector: {insight.category}</span>
                    </div>
                    <h4 className="text-base font-semibold text-[#F5F0FA]">
                      {insight.title}
                    </h4>
                  </div>
                </div>

                <span className="text-[11px] font-medium text-[#82768E] self-start sm:self-auto px-2.5 py-1 rounded bg-[#100B16] border border-[#291C35]">
                  Impact: {insight.impact}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#B7AFC1] ml-0 sm:ml-12 mt-2 leading-relaxed">
                {insight.message}
              </p>

              {insight.recommendation && (
                <div className="mt-3.5 ml-0 sm:ml-12 p-3.5 rounded-xl bg-[#100B16] border border-[#8955B5]/25 flex items-start gap-2.5 text-xs text-[#B7AFC1]">
                  <Lightbulb className="w-4 h-4 text-[#B99AD9] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#B99AD9]">Recommendation: </span>
                    <span>{insight.recommendation}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
