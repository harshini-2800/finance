import React, { useState, useEffect } from 'react';
import { X, AlertCircle, IndianRupee } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { EXPENSE_CATEGORIES, autoCategorizeExpense } from '../utils/constants';

export default function ExpenseModal({ isOpen, onClose, editExpenseData = null }) {
  const { addExpense, updateExpense, selectedMonth } = useFinance();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [suggestedBadge, setSuggestedBadge] = useState(false);

  useEffect(() => {
    if (editExpenseData) {
      setTitle(editExpenseData.title || '');
      setAmount(editExpenseData.amount ? String(editExpenseData.amount) : '');
      setCategory(editExpenseData.category || 'Food');
      setDate(editExpenseData.date || new Date().toISOString().slice(0, 10));
      setDescription(editExpenseData.description || '');
      setSuggestedBadge(false);
    } else {
      const today = new Date().toISOString().slice(0, 10);
      const defaultDate = today.startsWith(selectedMonth) ? today : `${selectedMonth}-01`;
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(defaultDate);
      setDescription('');
      setSuggestedBadge(false);
    }
    setError('');
  }, [editExpenseData, isOpen, selectedMonth]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    
    if (!editExpenseData) {
      const autoCat = autoCategorizeExpense(val);
      if (autoCat !== 'Other') {
        setCategory(autoCat);
        setSuggestedBadge(true);
      } else {
        setSuggestedBadge(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than ₹0');
      return;
    }
    if (!date) {
      setError('Date is required');
      return;
    }
    if (!category) {
      setError('Category is required');
      return;
    }

    if (editExpenseData) {
      updateExpense(editExpenseData.id, {
        title: title.trim(),
        amount: parsedAmount,
        category,
        date,
        description: description.trim()
      });
    } else {
      addExpense({
        title: title.trim(),
        amount: parsedAmount,
        category,
        date,
        description: description.trim()
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-[#17101F] border border-[#291C35] rounded-2xl shadow-2xl overflow-hidden"
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
                {editExpenseData ? 'Edit Expense Record' : 'Record New Expense'}
              </h3>
              <p className="text-xs text-[#82768E]">Categorize your expenditure accurately</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-[#82768E] hover:text-[#F5F0FA] hover:bg-[#201629] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-[#633B86]/30 border border-[#8955B5]/40 flex items-center gap-2 text-[#D3C0E8] text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#B7AFC1]">
                Expense Title / Merchant <span className="text-[#8955B5]">*</span>
              </label>
              {suggestedBadge && (
                <span className="text-[10px] font-medium text-[#D3C0E8] bg-[#633B86]/25 px-2 py-0.5 rounded border border-[#8955B5]/35">
                  Auto: {category}
                </span>
              )}
            </div>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Blinkit Groceries, Uber ride, BESCOM Bill..."
              className="w-full bg-[#100B16] border border-[#291C35] focus:border-[#8955B5] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F0FA] placeholder-[#82768E] focus:outline-none transition-colors"
              required
              autoFocus
            />
          </div>

          {/* Amount & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#B7AFC1] mb-1.5">
                Amount (₹ INR) <span className="text-[#8955B5]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B99AD9] font-semibold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#100B16] border border-[#291C35] focus:border-[#8955B5] rounded-xl pl-8 pr-3.5 py-2.5 text-xs sm:text-sm text-[#F5F0FA] placeholder-[#82768E] focus:outline-none transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#B7AFC1] mb-1.5">
                Category <span className="text-[#8955B5]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSuggestedBadge(false);
                }}
                className="w-full bg-[#100B16] border border-[#291C35] focus:border-[#8955B5] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F0FA] focus:outline-none transition-colors"
                required
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-[#B7AFC1] mb-1.5">
              Transaction Date <span className="text-[#8955B5]">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#100B16] border border-[#291C35] focus:border-[#8955B5] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F0FA] focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[#B7AFC1] mb-1.5">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Shared restaurant bill, quarterly utility payment..."
              className="w-full bg-[#100B16] border border-[#291C35] focus:border-[#8955B5] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#F5F0FA] placeholder-[#82768E] focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#291C35]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#B7AFC1] hover:text-[#F5F0FA] hover:bg-[#100B16] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-[#F5F0FA] bg-gradient-to-r from-[#633B86] to-[#8955B5] hover:from-[#7A4A9E] hover:to-[#9E69CD] shadow-sm transition-all"
            >
              {editExpenseData ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
