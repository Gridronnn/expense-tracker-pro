import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { LandingPage } from './components/landing/LandingPage';
import { AuthScreen } from './components/auth/AuthScreen';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { NotificationCenter } from './components/layout/NotificationCenter';
import { QuickActionModal } from './components/layout/QuickActionModal';
import { AIChatDrawer } from './components/ai/AIChatDrawer';
import { CommandPalette } from './components/common/CommandPalette';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { BudgetsView } from './components/budgets/BudgetsView';
import { GoalsView } from './components/goals/GoalsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AIAssistantView } from './components/ai/AIAssistantView';
import { SubscriptionsView } from './components/subscriptions/SubscriptionsView';
import { CalendarView } from './components/calendar/CalendarView';
import { SettingsView } from './components/settings/SettingsView';

export const App: React.FC = () => {
  const { activeTab } = useApp();
  const { isAuthenticated } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  // 1. If user navigated to marketing landing page
  if (activeTab === 'landing') {
    return (
      <main className="min-h-screen bg-[#F7F5F0] text-[#111111] selection:bg-[#111111] selection:text-[#FCFBF8]">
        <LandingPage />
      </main>
    );
  }

  // 2. If user is NOT authenticated, gate entry with the AuthScreen first
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // 3. Authenticated User Experience
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#111111] flex transition-colors duration-200">
      {/* Executive Sidebar Navigation */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 bg-[#F7F5F0]">
        {/* Executive Header Bar */}
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />

        {/* Dynamic View Outlet */}
        <main className="flex-1 overflow-y-auto pb-12 bg-[#F7F5F0]">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'transactions' && <TransactionsView />}
          {activeTab === 'budgets' && <BudgetsView />}
          {activeTab === 'goals' && <GoalsView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'ai' && <AIAssistantView />}
          {activeTab === 'subscriptions' && <SubscriptionsView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Overlays & Modals */}
      <CommandPalette />
      <QuickActionModal />
      <AIChatDrawer />
      <NotificationCenter
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
      />
    </div>
  );
};

export default App;
