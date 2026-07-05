// src/components/layout/AppShell.tsx
import type { ReactNode } from "react";
import { HeaderStatus } from "./HeaderStatus";
import { MobileNav } from "./MobileNav";

interface AppShellProps {
  children: ReactNode;
  /** 是否显示底部导航（仅调查阶段显示） */
  showNav?: boolean;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

const INVESTIGATION_TABS = [
  { id: "scene", label: "现场", icon: "🏛️" },
  { id: "npcs", label: "证人", icon: "👤" },
  { id: "evidence", label: "证据", icon: "🔍" },
  { id: "board", label: "对照", icon: "📋" },
  { id: "rewind", label: "回溯", icon: "⏳" },
];

export function AppShell({
  children,
  showNav = false,
  activeTab = "scene",
  onTabChange = () => {},
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex flex-col">
      <HeaderStatus />
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
      {showNav && (
        <MobileNav
          tabs={INVESTIGATION_TABS}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      )}
    </div>
  );
}

export { INVESTIGATION_TABS };
