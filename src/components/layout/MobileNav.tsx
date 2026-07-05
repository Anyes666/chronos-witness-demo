// src/components/layout/MobileNav.tsx

interface MobileNavProps {
  tabs: { id: string; label: string; icon: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function MobileNav({ tabs, activeTab, onTabChange }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800 z-40 md:hidden">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2 text-xs transition-colors ${
              activeTab === tab.id
                ? "text-amber-400"
                : "text-slate-600 hover:text-slate-400"
            }`}
          >
            <span className="text-lg mb-0.5">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
