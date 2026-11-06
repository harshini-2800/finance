import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Trash2, 
  Edit2
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, formatINR, formatMonthName } from '../utils/constants';

export default function BudgetsView({ onOpenAddExpense }) {
  const { 
    selectedMonth, 
    currentMonthData, 
    addBudget, 
    updateBudget, 
    deleteBudget
  } = useFinance();

  const { budgetsWithSpending = [] } = currentMonthData || {};

  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [budgetLimit, setBudgetLimit] = useState('');
  const [formError, setFormError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editLimit, setEditLimit] = useState('');

  const handleCreateBudget = (e) => {
    e.preventDefault();
    setFormError('');

    const parsedLimit = parseFloat(budgetLimit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      setFormError('Budget limit must be greater than ₹0');
      return;
    }

    addBudget({
      month: selectedMonth,
      category: selectedCategory,
      limit: parsedLimit
    });

    setBudgetLimit('');
    setIsAdding(false);
  };

  const handleStartEdit = (b) => {
    setEditingId(b.id);
    setEditLimit(String(b.limit));
  };

  const handleSaveEdit = (id) => {
    const parsed = parseFloat(editLimit);
    if (!isNaN(parsed) && parsed > 0) {
      updateBudget(id, parsed);
    }
    setEditingId(null);
  };

  const handleDelete = (id, category) => {
    if (window.confirm(`Delete budget target for ${category}?`)) {
      deleteBudget(id);
    }
  };

  const totalBudgetCap = budgetsWithSpending.reduce((acc, b) => acc + b.limit, 0);
  const totalBudgetSpent = budgetsWithSpending.reduce((acc, b) => acc + b.spent, 0);
  const totalBudgetRemaining = totalBudgetCap - totalBudgetSpent;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#17101F] border border-[#291C35] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F5F0FA] tracking-tight">
            Monthly Spending Budgets & Limits
          </h2>
          <p className="text-xs sm:text-sm text-[#82768E] mt-0.5">
            Configure expenditure ceilings and allocation guardrails for {formatMonthName(selectedMonth)}
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#633B86] to-[#8955B5] hover:from-[#7A4A9E] hover:to-[#9E69CD] text-[#F5F0FA] font-semibold text-xs shadow-md shadow-[#633B86]/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{isAdding ? 'Close Form' : 'Set Category Budget'}</span>
        </button>
      </div>

      {/* Aggregate Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#17101F] border border-[#291C35] shadow-sm">
          <span className="text-[11px] text-[#82768E] uppercase font-semibold tracking-wider">Total Budgeted Cap</span>
          <div className="text-2xl font-mono font-bold text-[#F5F0FA] mt-1">
            {formatINR(totalBudgetCap)}
          </div>
          <span className="text-[11px] text-[#82768E] mt-1 block">
            Across {budgetsWithSpending.length} active limits
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#17101F] border border-[#291C35] shadow-sm">
          <span className="text-[11px] text-[#B7AFC1] uppercase font-semibold tracking-wider">Allocated Outflow</span>
          <div className="text-2xl font-mono font-bold text-[#D3C0E8] mt-1">
            {formatINR(totalBudgetSpent)}
          </div>
          <span className="text-[11px] text-[#82768E] mt-1 block">
            {totalBudgetCap > 0 ? `${((totalBudgetSpent / totalBudgetCap) * 100).toFixed(0)}% of total cap used` : 'No limits defined'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#17101F] border border-[#291C35] shadow-sm">
          <span className="text-[11px] text-[#B99AD9] uppercase font-semibold tracking-wider">Remaining Headroom</span>
          <div className={`text-2xl font-mono font-bold mt-1 ${totalBudgetRemaining >= 0 ? 'text-[#B99AD9]' : 'text-[#D3C0E8]'}`}>
            {formatINR(totalBudgetRemaining)}
          </div>
          <span className="text-[11px] text-[#82768E] mt-1 block">
            {totalBudgetRemaining >= 0 ? 'Under aggregate ceiling' : 'Aggregate ceiling breached'}
          </span>
        </div>
      </div>

      {/* Create New Budget Form */}
      {isAdding && (
        <div className="p-6 rounded-2xl bg-[#201629] border border-[#8955B5]/40 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#291C35] pb-3">
            <h3 className="text-sm font-semibold text-[#F5F0FA] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#B99AD9]" /> Set Category Spending Ceiling
            </h3>
            <span className="text-xs text-[#82768E]">Target Month: {selectedMonth}</span>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-[#633B86]/30 border border-[#8955B5]/40 text-[#D3C0E8] text-xs font-semibold">
              {formError}
            </div>
          )}

          <form onSubmit={handleCreateBudget} className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-[#B7AFC1] mb-1.5">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#100B16] border border-[#291C35] focus:border-[#8955B5] rounded-xl px-3.5 py-2 text-xs text-[#F5F0FA] focus:outline-none"
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#B7AFC1] mb-1.5">
                Monthly Spending Limit (₹)
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                placeholder="e.g. 10000"
                className="w-full bg-[#100B16] border border-[#291C35] focus:border-[#8955B5] rounded-xl px-3.5 py-2 text-xs text-[#F5F0FA] placeholder-[#82768E] focus:outline-none"
                required
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-[#F5F0FA] bg-gradient-to-r from-[#633B86] to-[#8955B5] hover:from-[#7A4A9E] hover:to-[#9E69CD] shadow-sm transition-all"
              >
                Save Budget
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="py-2 px-3.5 rounded-xl text-xs text-[#82768E] hover:text-[#F5F0FA] bg-[#100B16] border border-[#291C35]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budgets Grid with 80% & 100% warnings */}
      <div className="space-y-4">
        {budgetsWithSpending.length === 0 ? (
          <div className="p-14 text-center rounded-2xl bg-[#17101F] border border-[#291C35] text-[#82768E] text-xs space-y-3">
            <Target className="w-10 h-10 mx-auto text-[#82768E] stroke-1" />
            <h4 className="text-base font-semibold text-[#F5F0FA]">No Budgets Configured for {formatMonthName(selectedMonth)}</h4>
            <p className="max-w-sm mx-auto text-[#82768E]">
              Establish monthly spending limits to activate 80% threshold warnings and proactive AI advisories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetsWithSpending.map((b) => {
              const isOver = b.isExceeded;
              const isWarn = b.isWarning;
              const catColor = CATEGORY_COLORS[b.category] || '#8955B5';

              return (
                <div 
                  key={b.id} 
                  className={`p-5 rounded-2xl bg-[#17101F] border transition-colors shadow-sm ${
                    isOver 
                      ? 'border-[#8955B5]/60 bg-[#30203E]/50' 
                      : isWarn 
                      ? 'border-[#633B86]/50 bg-[#201629]/50' 
                      : 'border-[#291C35] hover:border-[#8955B5]/40'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: catColor }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-semibold text-[#F5F0FA]">{b.category}</h4>
                          {b.isDemo && (
                            <span className="text-[9px] font-medium bg-[#633B86]/25 text-[#D3C0E8] px-1.5 py-0.2 rounded border border-[#8955B5]/30">
                              DEMO
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#82768E]">
                          Month: {b.month}
                        </span>
                      </div>
                    </div>

                    <div>
                      {isOver ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#D3C0E8] bg-[#633B86]/30 border border-[#8955B5]/40 px-2 py-0.5 rounded">
                          <ShieldAlert className="w-3.5 h-3.5" /> Budget Exceeded
                        </span>
                      ) : isWarn ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#B99AD9] bg-[#39204F]/40 border border-[#633B86]/40 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3.5 h-3.5" /> 80%+ Utilized
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-[#B7AFC1] bg-[#291C35] border border-[#352247] px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5" /> On Track
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Limit & Spent */}
                  <div className="flex items-baseline justify-between mb-2">
                    <div>
                      <span className="text-[11px] text-[#82768E] block">Spent Outflow</span>
                      <span className="text-xl font-mono font-bold text-[#F5F0FA]">
                        {formatINR(b.spent)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-[#82768E] block">Target Limit</span>
                      {editingId === b.id ? (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <input
                            type="number"
                            value={editLimit}
                            onChange={(e) => setEditLimit(e.target.value)}
                            className="w-24 bg-[#100B16] border border-[#8955B5] px-2 py-0.5 rounded text-xs text-[#F5F0FA] text-right"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(b.id)}
                            className="px-2 py-0.5 bg-[#8955B5] text-[#F5F0FA] rounded text-xs font-semibold"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <span className="text-base font-mono font-medium text-[#B7AFC1]">
                          {formatINR(b.limit)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#100B16] rounded-full h-1.5 overflow-hidden my-3">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver ? 'bg-gradient-to-r from-[#8955B5] to-[#B99AD9]' : isWarn ? 'bg-[#633B86]' : 'bg-[#7A4A9E]'
                      }`}
                      style={{ width: `${Math.min(100, b.percentUsed)}%` }}
                    />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-[#82768E] pt-2 border-t border-[#291C35]">
                    <div>
                      {b.remaining >= 0 ? (
                        <span>Remaining: <strong className="text-[#B99AD9] font-mono">{formatINR(b.remaining)}</strong> ({b.percentUsed.toFixed(0)}% used)</span>
                      ) : (
                        <span>Deficit: <strong className="text-[#D3C0E8] font-mono">{formatINR(Math.abs(b.remaining))}</strong> ({b.percentUsed.toFixed(0)}% used)</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(b)}
                        className="p-1 text-[#82768E] hover:text-[#F5F0FA] rounded hover:bg-[#100B16] transition-colors"
                        title="Edit limit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id, b.category)}
                        className="p-1 text-[#82768E] hover:text-[#D3C0E8] rounded hover:bg-[#633B86]/20 transition-colors"
                        title="Delete budget"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
