import React, { useState, useEffect } from 'react';
import { X, AlertCircle, PlusCircle, Trash2, IndianRupee } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { INCOME_SOURCES, formatINR, formatMonthName } from '../utils/constants';

export default function IncomeModal({ isOpen, onClose }) {
  const { 
    selectedMonth, 
    incomesByMonth = {}, 
    addIncome, 
    deleteIncome,
    currentMonthData 
  } = useFinance();

  const [source, setSource] = useState('Salary');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSource('Salary');
      setAmount('');
      setDescription('');
      setDate(`${selectedMonth}-01`);
      setError('');
    }
  }, [isOpen, selectedMonth]);

  const existingIncomes = incomesByMonth[selectedMonth] || [];

  const handleAdd = (e) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than ₹0');
      return;
    }
    if (!date) {
      setError('Date is required');
      return;
    }

    addIncome({
      month: selectedMonth,
      source,
      amount: parsedAmount,
      date,
      description: description.trim()
    });

    setAmount('');
    setDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-xl bg-[#17101F] border border-[#291C35] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#291C35] flex items-center justify-between bg-[#100B16]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#633B86]/30 border border-[#8955B5]/40 flex items-center justify-center text-[#D3C0E8]">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#F5F0FA]">
                Monthly Revenue & Inflows
              </h3>
              <p className="text-xs text-[#82768E]">
                Manage revenue streams for {formatMonthName(selectedMonth)}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-[#82768E] hover:text-[#F5F0FA] hover:bg-[#201629] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-[#100B16] border border-[#291C35] flex items-center justify-between">
            <div>
              <div className="text-xs text-[#82768E]">Total Revenue Logged</div>
              <div className="text-2xl font-mono font-bold text-[#B99AD9] mt-0.5">
                {formatINR(currentMonthData?.totalIncome || 0)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#82768E]">Active Billing Period</div>
              <div className="text-sm font-semibold text-[#D3C0E8] mt-0.5">
                {formatMonthName(selectedMonth)}
              </div>
            </div>
          </div>

          {/* Existing Incomes List */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#82768E] mb-2">
              Recorded Inflows ({existingIncomes.length})
            </h4>
            {existingIncomes.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-[#291C35] text-center text-xs text-[#82768E]">
                No income logged for this month yet. Enter your salary or earnings below.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {existingIncomes.map((inc) => (
                  <div 
                    key={inc.id} 
                    className="p-3 rounded-xl bg-[#100B16] border border-[#291C35] flex items-center justify-between gap-3 hover:border-[#8955B5]/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#F5F0FA]">{inc.source}</span>
                        {inc.isDemo && (
                          <span className="text-[9px] font-medium bg-[#633B86]/25 text-[#D3C0E8] px-1.5 py-0.2 rounded border border-[#8955B5]/30">
                            DEMO
                          </span>
                        )}
                        <span className="text-[11px] text-[#82768E] font-mono">{inc.date}</span>
                      </div>
                      {inc.description && (
                        <p className="text-[11px] text-[#82768E] truncate max-w-xs mt-0.5">{inc.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-medium text-[#B99AD9]">
                        +{formatINR(inc.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteIncome(selectedMonth, inc.id)}
                        className="p-1 rounded text-[#82768E] hover:text-[#D3C0E8] hover:bg-[#633B86]/20 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Income Stream Form */}
          <form onSubmit={handleAdd} className="pt-4 border-t border-[#291C35] space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#B99AD9] flex items-center gap-1.5">
              <PlusCircle className="w-3.5 h-3.5" /> Add Revenue Stream
            </h4>

            {error && (
              <div className="p-3 rounded-xl bg-[#633B86]/30 border border-[#8955B5]/40 flex items-center gap-2 text-[#D3C0E8] text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#B7AFC1] mb-1">
                  Source Type
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-[#100B16] border border-[#291C35] focus:border-[#8955B5] rounded-xl px-3 py-2 text-xs text-[#F5F0FA] focus:outline-none"
                >
                  {INCOME_SOURCES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#B7AFC1] mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 45000"
                  className="w-full bg-[#100B16] border border-[#291C35] focus:border-[#8955B5] rounded-xl px-3 py-2 text-xs text-[#F5F0FA] placeholder-[#82768E] focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#B7AFC1] mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#100B16] border border-[#291C35] focus:border-[#8955B5] rounded-xl px-3 py-2 text-xs text-[#F5F0FA] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#B7AFC1] mb-1">
                Description / Memo (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Monthly Base Salary, Consulting Retainer"
                className="w-full bg-[#100B16] border border-[#291C35] focus:border-[#8955B5] rounded-xl px-3 py-2 text-xs text-[#F5F0FA] placeholder-[#82768E] focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#F5F0FA] bg-gradient-to-r from-[#633B86] to-[#8955B5] hover:from-[#7A4A9E] hover:to-[#9E69CD] shadow-sm transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Save Income
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
