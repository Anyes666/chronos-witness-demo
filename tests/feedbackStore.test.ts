import { describe, it, expect, vi } from "vitest";
import { feedbackStore } from "../src/engine/feedbackStore";

describe("feedbackStore", () => {
  it("adds and removes toast messages", async () => {
    const messages: { text: string }[] = [];
    const unsub = feedbackStore.subscribe((msgs) => {
      messages.length = 0;
      messages.push(...msgs);
    });

    feedbackStore.success("test success");
    expect(messages.length).toBe(1);
    expect(messages[0].text).toBe("test success");

    feedbackStore.error("test error");
    expect(messages.length).toBe(2);

    // 等待自动过期
    await new Promise((r) => setTimeout(r, 2600));
    expect(messages.length).toBe(0);

    unsub();
  }, 5000);

  it("info and warning work", () => {
    const msgs: string[] = [];
    feedbackStore.subscribe((m) => { msgs.length = 0; msgs.push(...m.map((t) => t.text)); });

    feedbackStore.info("info msg");
    expect(msgs).toContain("info msg");

    feedbackStore.warning("warn msg");
    expect(msgs).toContain("warn msg");
  });
});
