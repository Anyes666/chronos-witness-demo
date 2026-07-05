import { Button } from "../ui/Button";

interface InvestigationFallbackProps {
  error?: Error;
  onRefresh: () => void;
  onSwitchTo2D: () => void;
  onReturnBriefing?: () => void;
}

export function InvestigationFallback({
  error,
  onRefresh,
  onReturnBriefing,
  onSwitchTo2D,
}: InvestigationFallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <section className="w-full max-w-lg rounded-lg border border-cyan-500/30 bg-slate-950/90 p-6 shadow-2xl shadow-cyan-950/30">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-cyan-300">
          Investigation Runtime
        </p>
        <h1 className="mt-3 text-2xl font-bold text-amber-300">
          调查场景加载失败
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          调查场景正在加载。如果长时间无响应，请刷新页面，或切换到 2D 调查模式继续推进案件。
        </p>

        {import.meta.env.DEV && error && (
          <pre className="mt-4 max-h-40 overflow-auto rounded-md border border-red-500/25 bg-red-950/20 p-3 text-xs text-red-100">
            {error.message}
          </pre>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Button type="button" variant="secondary" onClick={onSwitchTo2D}>
            切换 2D 调查模式
          </Button>
          <Button type="button" variant="ghost" onClick={onReturnBriefing ?? onRefresh}>
            返回简报
          </Button>
          <Button type="button" onClick={onRefresh}>
            刷新页面
          </Button>
        </div>
      </section>
    </div>
  );
}
