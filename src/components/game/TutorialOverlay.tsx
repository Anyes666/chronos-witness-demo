import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { useIsMobile } from "./useIsMobile";

export const TUTORIAL_STORAGE_KEY = "chronos_tutorial_seen";

export interface TutorialStep {
  title: string;
  bullets: string[];
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "调查沈鹤鸣死亡案",
    bullets: [
      "官方结论是“自诱导记忆碎裂”。",
      "但现场留下了异常。",
      "你的任务不是立刻找唯一答案，而是验证哪些信息经得起回溯。",
    ],
  },
  {
    title: "变化不是 bug",
    bullets: [
      "每次回溯后，证人的证词可能变化。",
      "变化本身就是线索。",
      "不要只相信某一次证词。",
    ],
  },
  {
    title: "寻找没有变的信息",
    bullets: [
      "多轮都没变的信息更可靠。",
      "稳定事实可以和物证互相验证。",
      "同一时间点被多个来源反复指向，就值得关注。",
    ],
  },
  {
    title: "用对照板完成推理",
    bullets: [
      "询问证人后，打开证词对照板。",
      "回溯后再次询问，再回来比较变化。",
      "绿色是稳定锚点，黄色是变化，蓝色是新增，红色是消失。",
      "比对后再提交不完全指控。",
    ],
  },
];

interface TutorialOverlayProps {
  reopenSignal?: number;
}

export function TutorialOverlay({ reopenSignal = 0 }: TutorialOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const seen = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (!seen) {
      setVisible(true);
      setPage(0);
    }
  }, []);

  useEffect(() => {
    if (reopenSignal > 0) {
      setVisible(true);
      setPage(0);
    }
  }, [reopenSignal]);

  const dismiss = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  const step = TUTORIAL_STEPS[page];
  const isLastPage = page === TUTORIAL_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-lg rounded-xl border border-cyan-700/50 bg-slate-950/95 p-5 shadow-2xl shadow-cyan-950/40">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-cyan-400">
              时序证人快速培训
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-100">{step.title}</h2>
          </div>
          <span className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-400">
            {page + 1}/{TUTORIAL_STEPS.length}
          </span>
        </div>

        <div className="space-y-3">
          {step.bullets.map((bullet) => (
            <div key={bullet} className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-sm leading-relaxed text-slate-300">
              {bullet}
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-xs leading-relaxed text-slate-400">
          {!isMobile ? (
            <div className="grid grid-cols-2 gap-2">
              <span><span className="font-mono text-amber-400">WASD</span> 移动</span>
              <span><span className="font-mono text-amber-400">E</span> 调查/询问</span>
              <span><span className="font-mono text-amber-400">R</span> 回溯</span>
              <span><span className="font-mono text-amber-400">Tab</span> 打开对照板</span>
              <span><span className="font-mono text-amber-400">Esc</span> 关闭面板</span>
            </div>
          ) : (
            <p>使用底部 5 个 Tab：现场 / 证人 / 证据 / 对照 / 回溯。</p>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button
            type="button"
            variant="ghost"
            className="min-h-11"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={page === 0}
          >
            上一步
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="min-h-11"
            onClick={dismiss}
          >
            跳过
          </Button>
          {!isLastPage ? (
            <Button
              type="button"
              className="min-h-11 sm:col-span-2"
              onClick={() => setPage((current) => Math.min(TUTORIAL_STEPS.length - 1, current + 1))}
            >
              下一步
            </Button>
          ) : (
            <Button type="button" className="min-h-11 sm:col-span-2" onClick={dismiss}>
              开始调查
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
