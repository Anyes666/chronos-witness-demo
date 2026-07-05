// src/components/ui/Tabs.tsx
import type { ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: ReactNode;
}

export function Tabs({ tabs, activeTab, onTabChange, children }: TabsProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-slate-700/50 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-amber-600/20 text-amber-400">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
