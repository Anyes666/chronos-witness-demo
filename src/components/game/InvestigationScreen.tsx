// src/components/game/InvestigationScreen.tsx
// 调查主界面 — 桌面端 3D / 手机端 2D
import { useIsMobile } from "./useIsMobile";
import { DesktopInvestigationScreen } from "./DesktopInvestigationScreen";
import { MobileInvestigationScreen } from "./MobileInvestigationScreen";

interface InvestigationScreenProps {
  onAccuse: () => void;
}

export function InvestigationScreen({ onAccuse }: InvestigationScreenProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileInvestigationScreen onAccuse={onAccuse} />;
  }

  return <DesktopInvestigationScreen onAccuse={onAccuse} />;
}
