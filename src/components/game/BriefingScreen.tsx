import { Button } from "../ui/Button";

interface BriefingScreenProps {
  onContinue: () => void;
}

const caseFacts = [
  ["案件编号", "CW-demo-shm-001"],
  ["死者", "沈鹤鸣"],
  ["地点", "废弃档案馆主室"],
  ["时间", "23:17"],
  ["官方结论", "自诱导记忆碎裂"],
];

const anomalies = [
  "现场存在第 7 次回溯痕迹。",
  "记忆读取器出现超频损坏。",
  "23:17 灯光与主记录仪短暂中断。",
];

const objectives = ["调查现场", "询问证人", "回溯比对", "提交不完全指控"];

export function BriefingScreen({ onContinue }: BriefingScreenProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.14),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0),#020617_86%)]" />

      <section className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-6 border-b border-cyan-400/25 pb-5">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-cyan-300">
            Truth Court Archive
          </p>
          <h1 className="mt-3 text-3xl font-bold text-amber-300 sm:text-4xl">
            废弃档案馆 · 沈鹤鸣死亡案
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            你将以“时序证人”的身份进入封存现场。证词会随回溯发生漂移，但真相核心不会改变。
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-lg border border-cyan-400/30 bg-slate-950/82 p-5 shadow-xl shadow-cyan-950/25">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-100">案件档案</h2>
              <span className="rounded border border-amber-400/35 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-200">
                Playtest Demo
              </span>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              {caseFacts.map(([label, value]) => (
                <div key={label} className="rounded-md border border-slate-700/70 bg-slate-900/70 p-3">
                  <dt className="text-xs text-slate-400">{label}</dt>
                  <dd className="mt-1 text-sm font-medium text-slate-100">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 rounded-md border border-amber-400/25 bg-amber-400/8 p-4">
              <h3 className="text-sm font-semibold text-amber-200">异常点</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
                {anomalies.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <aside className="rounded-lg border border-slate-700/70 bg-slate-950/78 p-5 shadow-xl shadow-slate-950/40">
            <h2 className="text-lg font-semibold text-slate-100">本次任务</h2>
            <div className="mt-4 grid gap-3">
              {objectives.map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-md border border-slate-700/70 bg-slate-900/70 p-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-cyan-400/45 bg-cyan-400/10 text-xs font-mono text-cyan-200">
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-md border border-cyan-400/25 bg-cyan-400/8 p-4 text-sm leading-7 text-slate-200">
              进入档案馆后，优先调查主室中央的记忆读取器和东墙七道划痕。
            </div>

            <Button className="mt-6 w-full" size="lg" onClick={onContinue}>
              进入档案馆
            </Button>
          </aside>
        </div>
      </section>
    </main>
  );
}
