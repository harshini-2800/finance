import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import TransactionsView from './components/TransactionsView';
import CategoriesView from './components/CategoriesView';
import AnalyticsView from './components/AnalyticsView';
import AIInsightsView from './components/AIInsightsView';
import BudgetsView from './components/BudgetsView';
import SettingsView from './components/SettingsView';
import ExpenseModal from './components/ExpenseModal';
import IncomeModal from './components/IncomeModal';
import { ErrorBoundary } from './components/ErrorBoundary';

function MainLayout() {
  const { activeTab } = useFinance();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleOpenAddExpense = () => {
    setEditingExpense(null);
    setExpenseModalOpen(true);
  };

  const handleEditExpense = (tx) => {
    setEditingExpense(tx);
    setExpenseModalOpen(true);
  };

  const handleOpenAddIncome = () => {
    setIncomeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#09070D] text-[#F5F0FA] flex flex-col lg:flex-row font-sans">
      {/* Left Navigation Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Sticky Header */}
        <Header 
          onOpenMobileNav={() => setMobileOpen(true)}
          onOpenAddExpense={handleOpenAddExpense}
          onOpenAddIncome={handleOpenAddIncome}
        />

        {/* Dynamic Route View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <ErrorBoundary>
            {activeTab === 'dashboard' && (
              <DashboardView 
                onOpenAddExpense={handleOpenAddExpense} 
                onOpenAddIncome={handleOpenAddIncome} 
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionsView 
                onOpenAddExpense={handleOpenAddExpense} 
                onEditExpense={handleEditExpense} 
              />
            )}

            {activeTab === 'categories' && (
              <CategoriesView 
                onOpenAddExpense={handleOpenAddExpense} 
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView />
            )}

            {activeTab === 'ai-insights' && (
              <AIInsightsView 
                onOpenAddExpense={handleOpenAddExpense} 
                onOpenAddIncome={handleOpenAddIncome} 
              />
            )}

            {activeTab === 'budgets' && (
              <BudgetsView 
                onOpenAddExpense={handleOpenAddExpense} 
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView 
                onOpenAddExpense={handleOpenAddExpense} 
                onOpenAddIncome={handleOpenAddIncome} 
              />
            )}
          </ErrorBoundary>
        </main>

        {/* Global Footer */}
        <footer className="mt-auto border-t border-[#291C35] px-6 py-4 text-center text-xs text-[#82768E] flex flex-col sm:flex-row items-center justify-between gap-2 bg-[#100B16]/60">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F5F0FA]">SmartSpend</span>
            <span>• Obsidian Amethyst Private Wealth Platform</span>
          </div>
          <div className="text-[11px] text-[#82768E]">
            Client-Side Verified • INR (₹) Currency Standard
          </div>
        </footer>
      </div>

      {/* Expense Modal (Create & Edit) */}
      <ExpenseModal 
        isOpen={expenseModalOpen} 
        onClose={() => setExpenseModalOpen(false)} 
        editExpenseData={editingExpense} 
      />

      {/* Income Modal */}
      <IncomeModal 
        isOpen={incomeModalOpen} 
        onClose={() => setIncomeModalOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <MainLayout />
    </FinanceProvider>
  );
}
