import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_DEMO_DATA } from '../utils/sampleData';
import { getCurrentMonthYear, autoCategorizeExpense, generateId } from '../utils/constants';
import { generateAIInsights } from '../utils/aiEngine';

const FinanceContext = createContext(null);

const STORAGE_KEYS = {
  INCOMES: 'smartspend_incomes_v1',
  EXPENSES: 'smartspend_expenses_v1',
  BUDGETS: 'smartspend_budgets_v1',
  SELECTED_MONTH: 'smartspend_selected_month_v1',
  IS_DEMO_LOADED: 'smartspend_is_demo_loaded_v1'
};

export function FinanceProvider({ children }) {
  // Current active month (format: YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_MONTH) || '2026-11';
  });

  // Monthly Incomes: { '2026-11': [ { id, source, amount, date, description, isDemo } ] }
  const [incomesByMonth, setIncomesByMonth] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INCOMES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse incomes', e);
    }
    return INITIAL_DEMO_DATA.incomes;
  });

  // Expenses: Array of { id, title, amount, category, date, description, isDemo }
  const [expenses, setExpenses] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse expenses', e);
    }
    return INITIAL_DEMO_DATA.expenses;
  });

  // Budgets: Array of { id, month, category, limit, isDemo }
  const [budgets, setBudgets] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse budgets', e);
    }
    return INITIAL_DEMO_DATA.budgets;
  });

  // Active navigation view state
  const [activeTab, setActiveTab] = useState('dashboard');

  // Persist state updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(incomesByMonth));
    } catch (e) {
      console.error('Storage error for incomes', e);
    }
  }, [incomesByMonth]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.error('Storage error for expenses', e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (e) {
      console.error('Storage error for budgets', e);
    }
  }, [budgets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_MONTH, selectedMonth);
    } catch (e) {
      console.error('Storage error for selectedMonth', e);
    }
  }, [selectedMonth]);

  // Derived calculations for selected month
  const currentMonthData = useMemo(() => {
    // 1. Incomes for this month
    const monthIncomes = incomesByMonth[selectedMonth] || [];
    const totalIncome = monthIncomes.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    // 2. Expenses for this month
    const monthExpenses = expenses.filter(exp => (exp.date || '').startsWith(selectedMonth));
    const totalExpenses = monthExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    // 3. Remaining balance & savings rate
    const remainingBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (remainingBalance / totalIncome) * 100 : 0;

    // 4. Category totals
    const categoryTotals = {};
    monthExpenses.forEach(exp => {
      const cat = exp.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (Number(exp.amount) || 0);
    });

    // 5. Budgets for this month with progress
    const monthBudgets = budgets.filter(b => b.month === selectedMonth);
    const budgetsWithSpending = monthBudgets.map(b => {
      const spent = categoryTotals[b.category] || 0;
      const remaining = b.limit - spent;
      const percentUsed = b.limit > 0 ? (spent / b.limit) * 100 : 0;
      const isExceeded = spent > b.limit;
      const isWarning = !isExceeded && percentUsed >= 80;

      return {
        ...b,
        spent,
        remaining,
        percentUsed,
        isExceeded,
        isWarning
      };
    });

    // 6. Previous month comparison
    const [year, month] = selectedMonth.split('-').map(Number);
    let prevYear = year;
    let prevMonthNum = month - 1;
    if (prevMonthNum === 0) {
      prevMonthNum = 12;
      prevYear = year - 1;
    }
    const prevMonthStr = `${prevYear}-${String(prevMonthNum).padStart(2, '0')}`;
    const prevIncomes = incomesByMonth[prevMonthStr] || [];
    const prevMonthIncome = prevIncomes.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const prevExpensesList = expenses.filter(exp => (exp.date || '').startsWith(prevMonthStr));
    const prevMonthExpenses = prevExpensesList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const prevMonthCategoryTotals = {};
    prevExpensesList.forEach(exp => {
      const cat = exp.category || 'Other';
      prevMonthCategoryTotals[cat] = (prevMonthCategoryTotals[cat] || 0) + (Number(exp.amount) || 0);
    });

    // 7. Highest spending category
    let highestCategory = null;
    let highestAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > highestAmount) {
        highestAmount = amt;
        highestCategory = cat;
      }
    });

    // 8. AI Insights
    const aiInsights = generateAIInsights({
      currentMonth: selectedMonth,
      totalIncome,
      totalExpenses,
      remainingBalance,
      savingsRate,
      categoryTotals,
      prevMonthExpenses,
      prevMonthIncome,
      prevMonthCategoryTotals,
      budgetsWithSpending
    });

    return {
      monthIncomes,
      totalIncome,
      monthExpenses,
      totalExpenses,
      remainingBalance,
      savingsRate,
      categoryTotals,
      highestCategory,
      highestAmount,
      budgetsWithSpending,
      prevMonthStr,
      prevMonthExpenses,
      prevMonthIncome,
      prevMonthCategoryTotals,
      aiInsights
    };
  }, [selectedMonth, incomesByMonth, expenses, budgets]);

  // Available unique months list
  const availableMonths = useMemo(() => {
    const set = new Set();
    set.add('2026-11');
    set.add('2026-10');
    set.add('2026-09');
    set.add(getCurrentMonthYear());
    Object.keys(incomesByMonth).forEach(m => set.add(m));
    expenses.forEach(e => {
      if (e.date && e.date.length >= 7) {
        set.add(e.date.slice(0, 7));
      }
    });
    budgets.forEach(b => {
      if (b.month) set.add(b.month);
    });
    return Array.from(set).sort().reverse();
  }, [incomesByMonth, expenses, budgets]);

  // Overall Historical Monthly Stats (for 6-month trends)
  const monthlyTrendsData = useMemo(() => {
    const months = [...availableMonths].sort();
    return months.map(m => {
      const mIncomes = incomesByMonth[m] || [];
      const income = mIncomes.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
      const mExpenses = expenses.filter(e => (e.date || '').startsWith(m));
      const expense = mExpenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
      const balance = income - expense;
      const [year, monthNum] = m.split('-');
      const label = new Date(parseInt(year, 10), parseInt(monthNum, 10) - 1, 1).toLocaleString('en-US', { month: 'short' });
      return {
        monthKey: m,
        name: label,
        fullName: `${label} '${year.slice(2)}`,
        income,
        expense,
        balance
      };
    });
  }, [availableMonths, incomesByMonth, expenses]);

  // Check if current dataset has demo data
  const hasDemoData = useMemo(() => {
    const hasDemoIncome = Object.values(incomesByMonth).some(list => list.some(i => i.isDemo));
    const hasDemoExpense = expenses.some(e => e.isDemo);
    const hasDemoBudget = budgets.some(b => b.isDemo);
    return hasDemoIncome || hasDemoExpense || hasDemoBudget;
  }, [incomesByMonth, expenses, budgets]);

  const hasPersonalData = useMemo(() => {
    const hasUserIncome = Object.values(incomesByMonth).some(list => list.some(i => !i.isDemo));
    const hasUserExpense = expenses.some(e => !e.isDemo);
    const hasUserBudget = budgets.some(b => !b.isDemo);
    return hasUserIncome || hasUserExpense || hasUserBudget;
  }, [incomesByMonth, expenses, budgets]);

  // Actions: Incomes
  const addIncome = (newIncome) => {
    const month = newIncome.month || selectedMonth;
    const item = {
      id: generateId(),
      source: newIncome.source || 'Salary',
      amount: parseFloat(newIncome.amount) || 0,
      date: newIncome.date || `${month}-01`,
      description: newIncome.description || '',
      isDemo: false
    };

    setIncomesByMonth(prev => {
      const currentList = prev[month] || [];
      return {
        ...prev,
        [month]: [...currentList, item]
      };
    });
  };

  const updateIncome = (month, id, updatedData) => {
    setIncomesByMonth(prev => {
      const currentList = prev[month] || [];
      const updatedList = currentList.map(item => {
        if (item.id === id) {
          return {
            ...item,
            ...updatedData,
            amount: parseFloat(updatedData.amount) || 0
          };
        }
        return item;
      });
      return {
        ...prev,
        [month]: updatedList
      };
    });
  };

  const deleteIncome = (month, id) => {
    setIncomesByMonth(prev => {
      const currentList = prev[month] || [];
      return {
        ...prev,
        [month]: currentList.filter(i => i.id !== id)
      };
    });
  };

  // Actions: Expenses
  const addExpense = (newExpense) => {
    const item = {
      id: generateId(),
      title: newExpense.title.trim(),
      amount: parseFloat(newExpense.amount) || 0,
      category: newExpense.category || autoCategorizeExpense(newExpense.title),
      date: newExpense.date || `${selectedMonth}-01`,
      description: newExpense.description || '',
      isDemo: false
    };

    setExpenses(prev => [item, ...prev]);
  };

  const updateExpense = (id, updatedData) => {
    setExpenses(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...updatedData,
          amount: parseFloat(updatedData.amount) || 0
        };
      }
      return item;
    }));
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(item => item.id !== id));
  };

  // Actions: Budgets
  const addBudget = (newBudget) => {
    const item = {
      id: generateId(),
      month: newBudget.month || selectedMonth,
      category: newBudget.category,
      limit: parseFloat(newBudget.limit) || 0,
      isDemo: false
    };

    setBudgets(prev => {
      // Remove any existing budget for this category & month
      const filtered = prev.filter(b => !(b.month === item.month && b.category === item.category));
      return [...filtered, item];
    });
  };

  const updateBudget = (id, updatedLimit) => {
    setBudgets(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, limit: parseFloat(updatedLimit) || 0 };
      }
      return b;
    }));
  };

  const deleteBudget = (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  // Settings: Data Management
  // 1. Clear Demo Data only (preserves user data)
  const clearDemoData = () => {
    // Filter incomes
    const cleanIncomes = {};
    Object.entries(incomesByMonth).forEach(([month, list]) => {
      const userList = list.filter(i => !i.isDemo);
      if (userList.length > 0) {
        cleanIncomes[month] = userList;
      }
    });

    setIncomesByMonth(cleanIncomes);
    setExpenses(prev => prev.filter(e => !e.isDemo));
    setBudgets(prev => prev.filter(b => !b.isDemo));
  };

  // 2. Restore Demo Data
  const restoreDemoData = () => {
    setIncomesByMonth(INITIAL_DEMO_DATA.incomes);
    setExpenses(INITIAL_DEMO_DATA.expenses);
    setBudgets(INITIAL_DEMO_DATA.budgets);
    setSelectedMonth('2026-11');
  };

  // 3. Delete All Personal Data (preserves demo data)
  const deletePersonalData = () => {
    const cleanIncomes = {};
    Object.entries(incomesByMonth).forEach(([month, list]) => {
      const demoList = list.filter(i => i.isDemo);
      if (demoList.length > 0) {
        cleanIncomes[month] = demoList;
      }
    });

    setIncomesByMonth(cleanIncomes);
    setExpenses(prev => prev.filter(e => e.isDemo));
    setBudgets(prev => prev.filter(b => b.isDemo));
  };

  // 4. Batch import transactions from CSV
  const importCSVTransactions = (parsedList) => {
    // Add all parsed items
    setExpenses(prev => [...parsedList, ...prev]);
  };

  const value = {
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    activeTab,
    setActiveTab,
    // Data & Calculations
    currentMonthData,
    incomesByMonth,
    expenses,
    budgets,
    monthlyTrendsData,
    hasDemoData,
    hasPersonalData,
    // Actions
    addIncome,
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense,
    addBudget,
    updateBudget,
    deleteBudget,
    // Data Management
    clearDemoData,
    restoreDemoData,
    deletePersonalData,
    importCSVTransactions
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}

