import React, { useState } from 'react';
import { 
  Menu, 
  Calendar, 
  Plus, 
  IndianRupee, 
  ChevronDown
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatMonthName } from '../utils/constants';

export default function Header({ onOpenMobileNav, onOpenAddExpense, onOpenAddIncome }) {
  const { 
    selectedMonth, 
    setSelectedMonth, 
    availableMonths, 
    activeTab
  } = useFinance();

  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);

  const pageTitles = {
    'dashboard': { title: 'Executive Overview', desc: 'Real-time financial telemetry & portfolio position' },
    'transactions': { title: 'Transaction Ledger', desc: 'Audited expenditure records and line-item details' },
    'categories': { title: 'Category Breakdown', desc: 'Sectored distribution across core financial vectors' },
    'analytics': { title: 'Financial Analytics', desc: 'Outflow velocity, multi-month trajectories and ratios' },
    'ai-insights': { title: 'AI Advisory Intelligence', desc: 'Data-driven deterministic rules and wealth guidance' },
    'budgets': { title: 'Monthly Budget Targets', desc: 'Allocation thresholds and expenditure ceilings' },
    'settings': { title: 'Settings & Data Center', desc: 'Data management, benchmarks and CSV exports' }
  };

  const currentInfo = pageTitles[activeTab] || { title: 'SmartSpend', desc: 'Private Wealth Management' };

  return (
    <header className="sticky top-0 z-30 bg-[#09070D]/90 backdrop-blur-md border-b border-[#291C35] px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Left title and hamburger */}
      <div className="flex items-center gap-3.5">
        <button 
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl bg-[#17101F] hover:bg-[#201629] text-[#B7AFC1] hover:text-[#F5F0FA] border border-[#291C35] hover:border-[#8955B5]/50 hover:shadow-[0_0_15px_rgba(137,85,181,0.35)] transition-all"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#F5F0FA] flex items-center gap-2">
            <span>{currentInfo.title}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#8955B5] shadow-[0_0_8px_#8955B5]" />
          </h1>
          <p className="text-xs text-[#82768E] hidden sm:block font-normal">
            {currentInfo.desc}
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* Month Selector dropdown */}
        <div className="relative">
          <button
            onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
            className="flex items-center gap-2 bg-[#17101F] hover:bg-[#201629] border border-[#291C35] hover:border-[#8955B5]/60 hover:shadow-[0_0_18px_rgba(137,85,181,0.35)] text-xs sm:text-sm font-medium text-[#F5F0FA] px-3.5 py-2 rounded-xl transition-all shadow-sm"
          >
            <Calendar className="w-4 h-4 text-[#B99AD9]" />
            <span>{formatMonthName(selectedMonth)}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#82768E] transition-transform ${monthDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {monthDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setMonthDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-[#17101F] border border-[#291C35] rounded-xl shadow-[0_8px_32px_rgba(137,85,181,0.25)] py-2 z-40 max-h-64 overflow-y-auto">
                <div className="px-4 py-1.5 text-[10px] font-semibold text-[#82768E] uppercase tracking-wider border-b border-[#291C35]">
                  Select Billing Cycle
                </div>
                {availableMonths.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setSelectedMonth(m);
                      setMonthDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between hover:bg-[#201629] hover:text-[#D3C0E8] transition-colors ${
                      selectedMonth === m ? 'text-[#B99AD9] bg-[#291C35] font-semibold' : 'text-[#B7AFC1]'
                    }`}
                  >
                    <span>{formatMonthName(m)}</span>
                    {selectedMonth === m && <span className="w-1.5 h-1.5 rounded-full bg-[#8955B5] shadow-[0_0_6px_#8955B5]"></span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Action: Add Income button */}
        <button
          onClick={onOpenAddIncome}
          className="hidden sm:flex items-center gap-1.5 bg-[#17101F] hover:bg-[#201629] text-[#B99AD9] hover:text-[#D3C0E8] border border-[#8955B5]/30 hover:border-[#8955B5]/60 hover:shadow-[0_0_18px_rgba(137,85,181,0.35)] px-3.5 py-2 rounded-xl text-xs font-medium transition-all"
          title="Add monthly earnings"
        >
          <IndianRupee className="w-3.5 h-3.5" />
          <span>Add Income</span>
        </button>

        {/* Action: Record Expense button */}
        <button
          onClick={onOpenAddExpense}
          className="flex items-center gap-1.5 bg-gradient-to-r from-[#633B86] to-[#8955B5] hover:from-[#7A4A9E] hover:to-[#9E69CD] text-[#F5F0FA] font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-[#633B86]/30 hover:shadow-[0_0_22px_rgba(137,85,181,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Expense</span>
        </button>
      </div>
    </header>
  );
}
