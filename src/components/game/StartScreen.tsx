import { Button } from "../ui/Button";

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-6 text-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.24),transparent_58%)]" />
      <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/8 blur-3xl" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center py-12 text-center">
        <div className="mb-5 rounded-full border border-amber-400/35 bg-amber-400/10 px-4 py-1 text-xs font-medium text-amber-200">
          v0.1.1 Playtest Demo
        </div>

        <div className="rounded-2xl border border-cyan-400/30 bg-slate-950/78 px-6 py-8 shadow-2xl shadow-cyan-950/40 backdrop-blur sm:px-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.36em] text-cyan-200">
            Chronos Witness
          </p>
          <h1 className="text-5xl font-bold tracking-widest text-amber-300 sm:text-7xl">
            时序证人
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-200">
            每一次回溯，都会让真相更近，也更远。
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
            在有限回溯中调查现场、询问证人，并比对证词漂移。不要只相信变化，寻找那些始终稳定的锚点。
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Button size="lg" onClick={onStart}>
              开始调查
            </Button>
            <Button size="lg" variant="secondary" onClick={onStart}>
              继续调查
            </Button>
            <Button size="lg" variant="ghost" onClick={onStart}>
              玩法说明
            </Button>
          </div>

          <div className="mt-8 grid gap-3 text-left text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-700/70 bg-slate-900/70 p-4">
              <p className="text-xs text-cyan-300">桌面端推荐</p>
              <p className="mt-1 font-medium text-slate-100">3D 调查模式</p>
            </div>
            <div className="rounded-lg border border-slate-700/70 bg-slate-900/70 p-4">
              <p className="text-xs text-cyan-300">手机端推荐</p>
              <p className="mt-1 font-medium text-slate-100">2D 调查模式</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
