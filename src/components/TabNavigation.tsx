import React, { useRef, useCallback } from 'react';
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
  const navRef = useRef<HTMLDivElement>(null);

  const createRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }, []);

  return (
    <nav 
      ref={navRef}
      className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="glass-nav mx-2 mb-2 rounded-2xl relative overflow-hidden">
        {/* Dynamic Active Indicator */}
        <div 
          className="absolute top-1 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full transition-all duration-500 ease-out shadow-lg"
          style={{
            width: '16%',
            left: `${6 + tabs.findIndex(tab => tab.id === activeTab) * 17.6}%`,
            boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)',
          }}
        />
        
        <div className="flex relative px-2 py-3">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={(e) => {
                  createRipple(e);
                  onTabChange(tab.id);
                }}
                className={cn(
                  "flex-1 flex flex-col items-center relative group tab-button ripple-container",
                  "px-3 py-2 rounded-xl transition-all duration-300 ease-out",
                  "hover:bg-white/5 active:scale-95",
                  isActive && "tab-button-active"
                )}
              >
                <div className="tab-glow"></div>
                
                {/* Icon Container */}
                <div className={cn(
                  "relative mb-1 p-1.5 rounded-lg transition-all duration-300",
                  isActive 
                    ? "text-blue-400 transform scale-110" 
                    : "text-slate-400 group-hover:text-slate-200 group-hover:scale-105"
                )}>
                  <Icon className="w-5 h-5 relative z-10" strokeWidth={2.5} />
                  
                  {/* Active Icon Background */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg blur-sm animate-pulse" />
                  )}
                </div>
                
                {/* Label */}
                <span className={cn(
                  "text-[10px] font-medium tracking-wide transition-all duration-300",
                  "leading-tight text-center",
                  isActive 
                    ? "text-blue-300 font-semibold" 
                    : "text-slate-500 group-hover:text-slate-300"
                )}>
                  {tab.label}
                </span>
                
                {/* Active State Indicator */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/10" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Bottom Glow Effect */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent blur-sm" />
      </div>
    </nav>
  );
};