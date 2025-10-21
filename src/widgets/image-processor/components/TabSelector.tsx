import React from 'react';
import { cn } from '@/shared/lib';
import type { TabMode } from '@/shared/types';

interface TabSelectorProps {
  activeTab: TabMode;
  onTabChange: (tab: TabMode) => void;
}

const tabs: { value: TabMode; label: string }[] = [
  { value: 'transform', label: '변형' },
  { value: 'split', label: '분할' },
];

export const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={cn('flex items-center gap-2 border-b border-slate-200 px-6 py-4')}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-95 active:bg-slate-200'
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
