import React, { useState, useRef } from 'react';
import { 
  Database, 
  Trash2, 
  RotateCcw, 
  Download, 
  Upload, 
  ShieldAlert, 
  CheckCircle, 
  AlertCircle,
  FileSpreadsheet,
  HardDrive
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { exportTransactionsToCSV, parseCSV } from '../utils/constants';

export default function SettingsView({ onOpenAddExpense, onOpenAddIncome }) {
  const { 
    hasDemoData, 
    hasPersonalData, 
    clearDemoData, 
    restoreDemoData, 
    deletePersonalData,
    expenses = [],
    importCSVTransactions 
  } = useFinance();

  const fileInputRef = useRef(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleClearDemoData = () => {
    if (window.confirm('Clear all pre-loaded Demonstration records? Your personal entries will remain completely intact.')) {
      clearDemoData();
      showNotification('Demo transactions and budgets cleared successfully.');
    }
  };

  const handleRestoreDemoData = () => {
    if (window.confirm('Restore initial demonstration records? This will re-populate sample Indian fintech data.')) {
      restoreDemoData();
      showNotification('Demo financial dataset restored.');
    }
  };

  const handleDeletePersonalData = () => {
    if (window.confirm('CAUTION: Delete ALL user-entered personal records? Demo records will remain. This action cannot be reversed.')) {
      deletePersonalData();
      showNotification('Personal records removed.', 'warning');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsed = parseCSV(text);
        importCSVTransactions(parsed);
        showNotification(`Successfully imported ${parsed.length} transactions from ${file.name}`);
      } catch (err) {
        showNotification(err.message || 'Failed to parse CSV file', 'error');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const demoCount = expenses.filter(e => e.isDemo).length;
  const userCount = expenses.filter(e => !e.isDemo).length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#17101F] border border-[#291C35]">
        <h2 className="text-xl sm:text-2xl font-bold text-[#F5F0FA] tracking-tight">
          Settings & Financial Data Center
        </h2>
        <p className="text-xs sm:text-sm text-[#82768E] mt-0.5">
          Benchmark dataset isolation, ledger purging, and CSV transaction audits
        </p>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-xs font-medium border ${
          notification.type === 'error' 
            ? 'bg-[#39204F]/50 border-[#8955B5]/40 text-[#D3C0E8]' 
            : notification.type === 'warning'
            ? 'bg-[#633B86]/25 border-[#8955B5]/30 text-[#B99AD9]'
            : 'bg-[#8955B5]/20 border-[#8955B5]/40 text-[#F5F0FA]'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Storage & Environment telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#17101F] border border-[#291C35] shadow-sm">
          <span className="text-[11px] text-[#82768E] uppercase font-semibold tracking-wider">Demo Records</span>
          <div className="text-2xl font-mono font-bold text-[#B99AD9] mt-1">
            {demoCount} Transactions
          </div>
          <span className="text-[11px] text-[#82768E] mt-1 block">
            {hasDemoData ? 'Active benchmark mode' : 'Cleared / inactive'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#17101F] border border-[#291C35] shadow-sm">
          <span className="text-[11px] text-[#82768E] uppercase font-semibold tracking-wider">Personal Records</span>
          <div className="text-2xl font-mono font-bold text-[#D3C0E8] mt-1">
            {userCount} Transactions
          </div>
          <span className="text-[11px] text-[#82768E] mt-1 block">
            Custom user-entered financial events
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#17101F] border border-[#291C35] shadow-sm">
          <span className="text-[11px] text-[#82768E] uppercase font-semibold tracking-wider">Storage Engine</span>
          <div className="text-2xl font-semibold text-[#F5F0FA] mt-1 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-[#8955B5]" /> LocalStorage
          </div>
          <span className="text-[11px] text-[#82768E] mt-1 block">
            Client-side persistent database
          </span>
        </div>
      </div>

      {/* Demo vs Personal Data Section */}
      <div className="p-6 rounded-2xl bg-[#17101F] border border-[#291C35] space-y-4">
        <h3 className="text-base font-semibold text-[#F5F0FA] flex items-center gap-2">
          <Database className="w-4 h-4 text-[#B99AD9]" /> Data Mode Controls (Demo vs Personal)
        </h3>
        <p className="text-xs sm:text-sm text-[#B7AFC1]">
          SmartSpend safely isolates pre-loaded demonstration records from your authentic personal financial records. You can clear demo records anytime without losing user transactions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Action 1: Clear Demo Data */}
          <div className="p-5 rounded-xl bg-[#100B16] border border-[#291C35] flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold text-[#F5F0FA]">1. Clear Demo Data</h4>
              <p className="text-[11px] text-[#82768E] mt-1 leading-relaxed">
                Removes sample ₹40k salary, rent, and demo transactions. Retains all personal entries.
              </p>
            </div>
            <button
              onClick={handleClearDemoData}
              disabled={!hasDemoData}
              className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                hasDemoData 
                  ? 'bg-[#39204F]/40 hover:bg-[#633B86]/40 text-[#B99AD9] border border-[#633B86]/40' 
                  : 'bg-[#17101F] text-[#82768E]/40 border border-[#291C35] cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Demo Records</span>
            </button>
          </div>

          {/* Action 2: Restore Demo Data */}
          <div className="p-5 rounded-xl bg-[#100B16] border border-[#291C35] flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold text-[#F5F0FA]">2. Restore Demo Data</h4>
              <p className="text-[11px] text-[#82768E] mt-1 leading-relaxed">
                Re-loads realistic Indian financial benchmarks, multi-month trends, and demo budgets.
              </p>
            </div>
            <button
              onClick={handleRestoreDemoData}
              className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-medium bg-[#633B86]/25 hover:bg-[#633B86]/40 text-[#D3C0E8] border border-[#8955B5]/40 flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Demo Data</span>
            </button>
          </div>

          {/* Action 3: Delete All Personal Data */}
          <div className="p-5 rounded-xl bg-[#100B16] border border-[#291C35] flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold text-[#D3C0E8]">3. Delete Personal Records</h4>
              <p className="text-[11px] text-[#82768E] mt-1 leading-relaxed">
                Removes all user-created income, expenses, and personal budgets. Demo data is kept intact.
              </p>
            </div>
            <button
              onClick={handleDeletePersonalData}
              disabled={!hasPersonalData}
              className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                hasPersonalData 
                  ? 'bg-[#30203E] hover:bg-[#39204F] text-[#D3C0E8] border border-[#8955B5]/40' 
                  : 'bg-[#17101F] text-[#82768E]/40 border border-[#291C35] cursor-not-allowed'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Purge Personal Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* CSV Import & Export Hub */}
      <div className="p-6 rounded-2xl bg-[#17101F] border border-[#291C35] space-y-4">
        <h3 className="text-base font-semibold text-[#F5F0FA] flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-[#8955B5]" /> Transaction CSV Import & Export Hub
        </h3>
        <p className="text-xs sm:text-sm text-[#B7AFC1]">
          Export your complete ledger to standard CSV spreadsheets or bulk-import historical statements.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-5 rounded-xl bg-[#100B16] border border-[#291C35] flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold text-[#F5F0FA] flex items-center gap-1.5">
                <Download className="w-4 h-4 text-[#B99AD9]" /> Export Ledger (.CSV)
              </h4>
              <p className="text-[11px] text-[#82768E] mt-1">
                Download all recorded transactions ({expenses.length} records) formatted with categories and dates.
              </p>
            </div>
            <button
              onClick={() => exportTransactionsToCSV(expenses)}
              className="mt-4 py-2 px-4 rounded-xl text-xs font-medium bg-[#17101F] hover:bg-[#201629] text-[#F5F0FA] border border-[#291C35] flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#B99AD9]" />
              <span>Download CSV File</span>
            </button>
          </div>

          <div className="p-5 rounded-xl bg-[#100B16] border border-[#291C35] flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold text-[#F5F0FA] flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#8955B5]" /> Import Ledger (.CSV)
              </h4>
              <p className="text-[11px] text-[#82768E] mt-1">
                Upload CSV containing <code>Title</code>, <code>Amount</code>, and <code>Date</code> columns. Auto-categorizes missing tags!
              </p>
            </div>

            <div className="mt-4">
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-file-input"
              />
              <label
                htmlFor="csv-file-input"
                className="cursor-pointer py-2 px-4 rounded-xl text-xs font-medium bg-[#633B86]/25 hover:bg-[#633B86]/40 text-[#D3C0E8] border border-[#8955B5]/40 flex items-center justify-center gap-2 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select CSV to Import</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
