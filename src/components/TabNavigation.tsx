import React from 'react';
import { BarChart3, Target, Receipt, TrendingUp, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabType = 'overview' | 'budgets' | 'transactions' | 'goals' | 'settings';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
  { id: 'budgets' as const, label: 'Budgets', icon: Target },
  { id: 'transactions' as const, label: 'Transactions', icon: Receipt },
  { id: 'goals' as const, label: 'Goals', icon: TrendingUp },
  { id: 'settings' as const, label: 'Settings', icon: Settings },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/20 z-50 backdrop-blur-xl">
      <div className="flex relative">
        {/* Active indicator */}
        <div 
          className="absolute top-0 h-1 bg-gradient-primary rounded-full transition-all duration-300 ease-out"
          style={{
            width: '20%',
            left: `${tabs.findIndex(tab => tab.id === activeTab) * 20}%`,
          }}
        />
        
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center py-3 px-2 transition-all duration-300",
                "hover:bg-white/10 active:scale-95 relative group",
                isActive 
                  ? "text-primary transform scale-105" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "relative transition-transform duration-300",
                isActive && "animate-bounce-gentle"
              )}>
                <Icon className={cn(
                  "w-6 h-6 mb-1 transition-colors duration-300",
                  isActive && "drop-shadow-sm"
                )} />
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 blur-md animate-pulse-glow" />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium transition-all duration-300",
                isActive ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};