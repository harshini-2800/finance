import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  Tag, 
  Layers
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, formatINR, exportTransactionsToCSV } from '../utils/constants';

export default function TransactionsView({ onOpenAddExpense, onEditExpense }) {
  const { 
    expenses = [], 
    deleteExpense, 
    availableMonths = []
  } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [filterMonth, setFilterMonth] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredTransactions = useMemo(() => {
    return (expenses || [])
      .filter((tx) => {
        if (filterMonth !== 'ALL') {
          if (!tx.date?.startsWith(filterMonth)) return false;
        }
        if (selectedCategory !== 'ALL' && tx.category !== selectedCategory) {
          return false;
        }
        if (searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase();
          const matchTitle = (tx.title || '').toLowerCase().includes(term);
          const matchDesc = (tx.description || '').toLowerCase().includes(term);
          const matchCat = (tx.category || '').toLowerCase().includes(term);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [expenses, filterMonth, selectedCategory, searchTerm, sortBy]);

  const totalFilteredAmount = useMemo(() => {
    return filteredTransactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [filteredTransactions]);

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteExpense(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/50 hover:shadow-[0_0_25px_rgba(137,85,181,0.25)] transition-all">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F5F0FA] tracking-tight">
            Expense Records & Ledger
          </h2>
          <p className="text-xs sm:text-sm text-[#82768E] mt-0.5">
            Audit logs, merchant line-items, and dynamic filtering
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportTransactionsToCSV(filteredTransactions)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#100B16] hover:bg-[#201629] border border-[#291C35] hover:border-[#8955B5]/60 hover:shadow-[0_0_15px_rgba(137,85,181,0.35)] text-[#B7AFC1] hover:text-[#F5F0FA] text-xs font-medium transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#B99AD9]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenAddExpense}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#633B86] to-[#8955B5] hover:from-[#7A4A9E] hover:to-[#9E69CD] text-[#F5F0FA] font-semibold text-xs shadow-md shadow-[#633B86]/25 hover:shadow-[0_0_22px_rgba(137,85,181,0.55)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Filter and search controls bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/40 hover:shadow-[0_0_20px_rgba(137,85,181,0.2)] transition-all space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#82768E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search merchant, title..."
              className="w-full bg-[#100B16] border border-[#291C35] focus:border-[#8955B5] focus:shadow-[0_0_15px_rgba(137,85,181,0.4)] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F5F0FA] placeholder-[#82768E] focus:outline-none transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#100B16] border border-[#291C35] focus:border-[#8955B5] focus:shadow-[0_0_15px_rgba(137,85,181,0.4)] rounded-xl px-3 py-2 text-xs text-[#F5F0FA] focus:outline-none transition-all"
            >
              <option value="ALL">All Categories ({EXPENSE_CATEGORIES.length})</option>
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="relative">
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full bg-[#100B16] border border-[#291C35] focus:border-[#8955B5] focus:shadow-[0_0_15px_rgba(137,85,181,0.4)] rounded-xl px-3 py-2 text-xs text-[#F5F0FA] focus:outline-none transition-all"
            >
              <option value="ALL">All Recorded Months</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Sorting Order */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#100B16] border border-[#291C35] focus:border-[#8955B5] focus:shadow-[0_0_15px_rgba(137,85,181,0.4)] rounded-xl px-3 py-2 text-xs text-[#F5F0FA] focus:outline-none transition-all"
            >
              <option value="date-desc">Sort: Date (Newest first)</option>
              <option value="date-asc">Sort: Date (Oldest first)</option>
              <option value="amount-desc">Sort: Amount (Highest first)</option>
              <option value="amount-asc">Sort: Amount (Lowest first)</option>
            </select>
          </div>
        </div>

        {/* Filter status strip */}
        <div className="pt-3 border-t border-[#291C35] flex flex-wrap items-center justify-between text-xs text-[#82768E] gap-2">
          <div className="flex items-center gap-3">
            <span>Showing <strong className="text-[#F5F0FA]">{filteredTransactions.length}</strong> transactions</span>
            {filteredTransactions.length > 0 && (
              <span>• Total: <strong className="text-[#D3C0E8] font-mono text-sm drop-shadow-[0_0_8px_rgba(185,154,217,0.4)]">{formatINR(totalFilteredAmount)}</strong></span>
            )}
          </div>
          {(searchTerm || selectedCategory !== 'ALL' || filterMonth !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setFilterMonth('ALL');
              }}
              className="text-[#B99AD9] hover:underline text-[11px] font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/40 transition-all overflow-hidden shadow-sm">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-[#82768E] text-xs space-y-3">
            <Layers className="w-10 h-10 mx-auto text-[#82768E] stroke-1" />
            <p className="text-base font-medium text-[#F5F0FA]">No matching expense records</p>
            <p className="text-[#82768E]">Adjust filters or enter a new transaction.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#100B16] border-b border-[#291C35] text-[#82768E] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Expense / Merchant</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201629]">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#201629]/70 hover:shadow-[inset_0_0_20px_rgba(137,85,181,0.15)] transition-all group">
                    <td className="py-3.5 px-4 font-medium text-[#F5F0FA]">
                      <div className="flex items-center gap-2.5">
                        <span 
                          className="w-2 h-2 rounded-full flex-shrink-0 shadow-[0_0_6px_rgba(137,85,181,0.6)]" 
                          style={{ backgroundColor: CATEGORY_COLORS[tx.category] || '#633B86' }}
                        />
                        <span className="truncate max-w-xs">{tx.title}</span>
                        {tx.isDemo && (
                          <span className="text-[9px] font-medium bg-[#633B86]/25 text-[#D3C0E8] px-1.5 py-0.2 rounded border border-[#8955B5]/30">
                            DEMO
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#B7AFC1]">
                      <span className="px-2.5 py-1 rounded bg-[#100B16] border border-[#291C35] group-hover:border-[#8955B5]/40 text-[11px] inline-flex items-center gap-1.5 transition-colors">
                        <Tag className="w-2.5 h-2.5 text-[#B99AD9]" />
                        {tx.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#82768E] font-mono text-[11px]">
                      {tx.date}
                    </td>

                    <td className="py-3.5 px-4 text-[#82768E] max-w-xs truncate font-normal">
                      {tx.description || <span className="text-[#82768E]/60 italic">—</span>}
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-[#D3C0E8] font-mono text-sm">
                      -{formatINR(tx.amount)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onEditExpense(tx)}
                          className="p-1.5 rounded text-[#82768E] hover:text-[#F5F0FA] hover:bg-[#201629] hover:shadow-[0_0_10px_rgba(137,85,181,0.4)] transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id, tx.title)}
                          className="p-1.5 rounded text-[#82768E] hover:text-[#D3C0E8] hover:bg-[#633B86]/30 hover:shadow-[0_0_10px_rgba(137,85,181,0.4)] transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
