// src/components/game/TutorialOverlay.tsx
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { useIsMobile } from "./useIsMobile";

const STORAGE_KEY = "chronos_tutorial_seen";

export function TutorialOverlay() {
  const [visible, setVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-amber-400 text-center">🕐 时序证人 · 调查须知</h2>

        <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-amber-400 font-medium mb-1">① 你不是在寻找单一证词</p>
            <p className="text-slate-500">而是在比较多轮证词中，「什么变了、什么没变」。</p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-amber-400 font-medium mb-1">② 回溯会让证词漂移</p>
            <p className="text-slate-500">每次回溯，证词和环境都会变化。变化不是 bug——变化本身是线索。</p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-amber-400 font-medium mb-1">③ 稳定事实是锚点</p>
            <p className="text-slate-500">多次变化后仍然不变的信息，就是真相锚点。每个证人每轮至少有一个稳定事实。</p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-amber-400 font-medium mb-1">④ 证词对照板是核心工具</p>
            <p className="text-slate-500">它能自动标记「稳定词」「变化词」「新增词」「消失词」。多使用它。</p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-amber-400 font-medium mb-1">⑤ 最终指控不要求完全真相</p>
            <p className="text-slate-500">选择你愿意固定的版本。不完全指控也是合理的结局。</p>
          </div>
        </div>

        {!isMobile && (
          <div className="bg-slate-800/30 rounded-lg p-4 space-y-1 text-xs text-slate-600">
            <p className="text-slate-500 font-medium mb-2">🖱️ 桌面操作</p>
            <p><span className="text-amber-500 font-mono">点击画面</span> 进入调查视角</p>
            <p><span className="text-amber-500 font-mono">WASD</span> 移动 · <span className="text-amber-500 font-mono">鼠标</span> 转向</p>
            <p><span className="text-amber-500 font-mono">E</span> 交互 · <span className="text-amber-500 font-mono">R</span> 回溯</p>
            <p><span className="text-amber-500 font-mono">Tab</span> 证词对照板 · <span className="text-amber-500 font-mono">Esc</span> 关闭面板</p>
          </div>
        )}

        {isMobile && (
          <div className="bg-slate-800/30 rounded-lg p-4 space-y-1 text-xs text-slate-600">
            <p className="text-slate-500 font-medium mb-2">📱 手机操作</p>
            <p>使用底部 Tab 进行调查：现场 · 证人 · 证据 · 对照 · 回溯</p>
          </div>
        )}

        <Button className="w-full" onClick={dismiss}>
          开始调查
        </Button>
      </div>
    </div>
  );
}
