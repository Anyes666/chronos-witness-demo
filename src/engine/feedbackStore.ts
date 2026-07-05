// src/engine/feedbackStore.ts
// 全局 Toast 反馈 — 轻量发布订阅，不依赖 Zustand（避免重渲染链路污染）

type ToastType = "success" | "info" | "warning" | "error";

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

let toastId = 0;
let listener: ((msgs: ToastMessage[]) => void) | null = null;
let messages: ToastMessage[] = [];

function notify() {
  listener?.([...messages]);
}

export const feedbackStore = {
  subscribe(fn: (msgs: ToastMessage[]) => void) {
    listener = fn;
    fn([...messages]);
    return () => { listener = null; };
  },

  add(type: ToastType, text: string) {
    const msg: ToastMessage = { id: ++toastId, type, text };
    messages = [...messages, msg];
    notify();
    // 2.5 秒后自动移除
    setTimeout(() => {
      messages = messages.filter((m) => m.id !== msg.id);
      notify();
    }, 2500);
  },

  success(text: string) { this.add("success", text); },
  info(text: string) { this.add("info", text); },
  warning(text: string) { this.add("warning", text); },
  error(text: string) { this.add("error", text); },
};
