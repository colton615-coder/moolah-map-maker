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
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-foreground">
              {activeTab === 'overview' && 'Overview'}
              {activeTab === 'budgets' && 'Budgets'}
              {activeTab === 'transactions' && 'Transactions'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
          </div>
        </header>

        {/* Content */}
        <main className="px-6 py-6">
          {renderActiveTab()}
        </main>

        {/* Bottom Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ThemeProvider>
  );
};