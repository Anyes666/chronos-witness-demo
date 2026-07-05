# 时序证人 · Chronos Witness Demo

> **你不是在寻找真相，而是在有限回溯内，判断哪些变化值得相信。**

以"证词漂移"为核心机制的网页叙事推理游戏 Demo。玩家调查沈鹤鸣死亡案，通过 3 次回溯、询问 3 名 NPC、调查废弃档案馆环境证据，在证词对照板中比对多轮证词，找出稳定事实，完成一次不完全指控。

---

## 技术栈

| 层 | 选型 |
|---|---|
| 构建 | Vite |
| 框架 | React 19 + TypeScript |
| 样式 | Tailwind CSS v4 |
| 状态 | Zustand |
| 表格 | TanStack Table |
| 测试 | Vitest + jsdom |
| 部署 | GitHub Pages + GitHub Actions |

**第一版不接 LLM、不接后端，纯静态网页。**

---

## 本地运行

```bash
npm install
npm run dev        # 启动开发服务器
npm run build      # 生产构建
npm run test       # 运行测试
npm run preview    # 预览生产构建
```

---

## 部署

Push 到 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages。

> ⚠️ **重要**：`vite.config.ts` 中 `base` 配置为 `"/chronos-witness-demo/"`。
> 如果 GitHub 仓库名不是 `chronos-witness-demo`，必须同步修改 `vite.config.ts` 的 `base` 值。

```ts
// vite.config.ts
export default defineConfig({
  base: "/chronos-witness-demo/",  // ← 改成你的仓库名
  // ...
})
```

---

## Demo 范围

| 项目 | 内容 |
|------|------|
| 回溯次数 | 3 次 |
| 场景 | 废弃档案馆主室 + 侧室 |
| NPC | 林叙、老何、陆医生 |
| 死者 | 沈鹤鸣 |
| 核心玩法 | 比对证词漂移 |
| 核心 UI | 证词对照板 |
| 结尾 | 不完全指控（2 个结局） |

---

## 项目结构

```
src/
  app/          — 页面入口
  components/
    layout/     — AppShell, MobileNav, HeaderStatus
    game/       — SceneMap, NpcPanel, TestimonyBoard, RewindPanel ...
    ui/         — Button, Card, Modal, Tabs, Badge
  data/cases/
    demo_shm_001/  — 案件数据（Truth Kernel, 证词 Shell, 证据, 结局）
  engine/       — 规则引擎（GameStore, Rewind, Drift, Testimony, Evidence ...）
tests/          — 单元测试
```

---

## 设计文档

项目根目录（`..`）下 7 份设计文档：

- 《落地计划总纲》
- 《系统设计文档 SDD》
- 《技术原型方案 TDD》
- 《叙事设计文档》
- 《Demo 案件设计 · 证词漂移矩阵》
- 《Playtest 验证方案》
- 《创新游戏概念 GDD》
