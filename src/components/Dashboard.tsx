import React, { useState } from "react";
import { TabNavigation, type TabType } from "./TabNavigation";
import { OverviewTab } from "./tabs/OverviewTab";
import { BudgetsTab } from "./tabs/BudgetsTab";
import { TransactionsTab } from "./tabs/TransactionsTab";
import { SettingsTab } from "./tabs/SettingsTab";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'budgets':
        return <BudgetsTab />;
      case 'transactions':
        return <TransactionsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-primary rounded-full opacity-10 blur-3xl animate-float" />
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-gradient-success rounded-full opacity-20 blur-2xl animate-bounce-gentle" />
        
        {/* Header */}
        <header className="sticky top-0 z-40 glass-effect border-b border-white/10">
          <div className="px-6 py-6">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
              {activeTab === 'overview' && '💼 Overview'}
              {activeTab === 'budgets' && '🎯 Budgets'}
              {activeTab === 'transactions' && '📊 Transactions'}
              {activeTab === 'settings' && '⚙️ Settings'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 animate-slide-up">
              {activeTab === 'overview' && 'Your financial dashboard'}
              {activeTab === 'budgets' && 'Manage your spending limits'}
              {activeTab === 'transactions' && 'Track your money flow'}
              {activeTab === 'settings' && 'Customize your experience'}
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="px-6 py-8 relative z-10">
          <div className="animate-fade-in">
            {renderActiveTab()}
          </div>
        </main>

        {/* Bottom Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ThemeProvider>
  );
};