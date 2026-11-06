import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  TrendingUp, 
  Sparkles, 
  Target, 
  Settings,
  ShieldCheck,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'categories', label: 'Expense Categories', icon: PieChart },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'ai-insights', label: 'AI Insights', icon: Sparkles, badge: 'AI' },
  { id: 'budgets', label: 'Monthly Budget', icon: Target },
  { id: 'settings', label: 'Settings & Data', icon: Settings },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { activeTab, setActiveTab, hasDemoData } = useFinance();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#100B16] border-r border-[#291C35] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#291C35]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#633B86] to-[#39204F] border border-[#8955B5]/40 flex items-center justify-center text-[#D3C0E8] shadow-md shadow-[#633B86]/20 transition-all hover:shadow-[0_0_20px_rgba(137,85,181,0.5)] cursor-pointer">
              <Building2 className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#F5F0FA] font-sans">
                  Smart<span className="text-[#B99AD9]">Spend</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#633B86]/25 text-[#D3C0E8] border border-[#8955B5]/40">
                  WEALTH
                </span>
              </div>
              <p className="text-[11px] text-[#82768E] tracking-wide font-normal">
                Private Wealth Architecture
              </p>
            </div>
          </div>
        </div>

        {/* Demo status alert badge */}
        {hasDemoData && (
          <div className="mx-4 mt-4 px-3.5 py-2.5 rounded-xl bg-[#17101F] border border-[#8955B5]/25 hover:border-[#8955B5]/60 hover:shadow-[0_0_15px_rgba(137,85,181,0.3)] transition-all flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#B99AD9]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8955B5] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8955B5]"></span>
              </span>
              <span className="font-medium text-[11px]">Benchmark Demo Mode</span>
            </div>
            <button 
              onClick={() => { setActiveTab('settings'); setMobileOpen(false); }}
              className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#633B86]/30 text-[#D3C0E8] hover:bg-[#8955B5] hover:text-[#09070D] hover:shadow-[0_0_12px_rgba(137,85,181,0.5)] transition-all"
            >
              Manage
            </button>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[#82768E]">
            Portfolio Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (setMobileOpen) setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#291C35] to-[#201629] text-[#F5F0FA] border border-[#8955B5]/60 shadow-[0_0_18px_rgba(137,85,181,0.35)]' 
                    : 'text-[#B7AFC1] hover:bg-[#17101F] hover:text-[#F5F0FA] hover:border-[#8955B5]/40 hover:shadow-[0_0_15px_rgba(137,85,181,0.25)] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-all duration-200 ${
                    isActive ? 'text-[#D3C0E8] drop-shadow-[0_0_6px_rgba(185,154,217,0.6)]' : 'text-[#82768E] group-hover:text-[#B99AD9] group-hover:drop-shadow-[0_0_5px_rgba(185,154,217,0.5)]'
                  }`} />
                  <span className={isActive ? 'font-semibold text-[#F5F0FA]' : 'font-normal'}>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                    isActive 
                      ? 'bg-[#8955B5] text-[#F5F0FA] shadow-[0_0_10px_rgba(137,85,181,0.5)]' 
                      : 'bg-[#201629] text-[#B99AD9] border border-[#8955B5]/30 group-hover:border-[#8955B5]/60'
                  }`}>
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-3.5 h-3.5 text-[#B99AD9]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info card */}
        <div className="p-4 mx-3 mb-4 rounded-xl bg-[#17101F] border border-[#291C35] hover:border-[#8955B5]/40 hover:shadow-[0_0_15px_rgba(137,85,181,0.25)] transition-all">
          <div className="flex items-center gap-2 text-xs font-medium text-[#B99AD9]">
            <ShieldCheck className="w-4 h-4 text-[#89988B]" />
            <span>Encrypted Local Vault</span>
          </div>
          <p className="text-[10px] text-[#82768E] mt-1 leading-snug">
            Zero telemetry. 100% private in-browser persistent client database.
          </p>
        </div>
      </aside>
    </>
  );
}
