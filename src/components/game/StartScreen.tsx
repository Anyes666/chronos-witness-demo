// src/components/game/StartScreen.tsx
import { Button } from "../ui/Button";

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold text-amber-400 tracking-widest mb-3">
        时序证人
      </h1>
      <p className="text-slate-500 text-lg mb-2">Chronos Witness</p>
      <p className="text-slate-600 text-sm max-w-md mb-10 leading-relaxed">
        你不是在寻找真相，而是在有限回溯内，判断哪些变化值得相信。
      </p>
      <Button size="lg" onClick={onStart}>
        进入案件
      </Button>
    </div>
  );
}
