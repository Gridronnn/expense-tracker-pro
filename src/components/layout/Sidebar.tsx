import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  BarChart3,
  Sparkles,
  Repeat,
  Calendar,
  Settings,
  Plus,
  X,
} from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, setIsQuickActionOpen, setQuickActionType, insights } = useApp();
  const { user } = useAuth();

  const unreadInsights = insights.filter(i => !i.read).length;

  const navSections: {
    title: string;
    items: { id: NavigationTab; label: string; icon: React.FC<any>; badge?: number }[];
  }[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Bento Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'MANAGE',
      items: [
        { id: 'transactions', label: 'Transactions Ledger', icon: ArrowLeftRight },
        { id: 'budgets', label: 'Spending Budgets', icon: PieChart },
        { id: 'subscriptions', label: 'Recurring SaaS', icon: Repeat },
      ],
    },
    {
      title: 'PLAN',
      items: [
        { id: 'goals', label: 'Savings Vaults', icon: Target },
        { id: 'calendar', label: 'Time Map', icon: Calendar },
      ],
    },
    {
      title: 'INSIGHTS',
      items: [
        { id: 'analytics', label: 'Deep Telemetry', icon: BarChart3 },
        { id: 'ai', label: 'Aura AI Heuristics', icon: Sparkles, badge: unreadInsights },
        { id: 'settings', label: 'Preferences', icon: Settings },
      ],
    },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#FCFBF8] border-r border-[#E6E2D8] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 font-sans ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-[#E6E2D8]">
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#111111] text-white flex items-center justify-center font-black text-sm shadow-sm">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-[#111111] tracking-tight">AURA PRO</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EAF56D] text-[#111111] font-bold">
                  v2.5
                </span>
              </div>
              <p className="text-[10px] text-[#666666] font-medium">Wealth Intelligence</p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-xl text-[#666666] hover:text-[#111111]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Button */}
        <div className="p-4 px-5">
          <button
            onClick={() => {
              setQuickActionType('expense');
              setIsQuickActionOpen(true);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-[#262626] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Transaction</span>
          </button>
        </div>

        {/* Grouped Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-4">
          {navSections.map(section => (
            <div key={section.title} className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-[#888888] uppercase tracking-wider block">
                {section.title}
              </span>

              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all relative ${
                      isActive
                        ? 'bg-[#111111] text-white shadow-sm'
                        : 'text-[#555555] hover:text-[#111111] hover:bg-[#F0EDE4]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-[#EAF56D] stroke-[2.5]' : 'text-[#777777]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-[#D9CEFF] text-[#111111]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Card Bottom */}
        <div className="p-4 border-t border-[#E6E2D8]">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#F0EDE4]">
            <div className="w-8 h-8 rounded-lg bg-[#EAF56D] text-[#111111] flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#111111] truncate">{user?.name || 'Account'}</p>
              <p className="text-[10px] text-[#666666] truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
