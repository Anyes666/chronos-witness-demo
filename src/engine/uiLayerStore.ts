import { create } from "zustand";

export type OverlayPanel =
  | "none"
  | "scene"
  | "npcs"
  | "evidence"
  | "board"
  | "rewind"
  | "journal";

export type ModalType =
  | "none"
  | "tutorial"
  | "inspect"
  | "confirmRewind"
  | "accusation";

interface UiLayerState {
  overlayPanel: OverlayPanel;
  modalType: ModalType;
  rewindEffectActive: boolean;
  debugOpen: boolean;
  openOverlay: (panel: OverlayPanel) => void;
  closeOverlay: () => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  triggerRewindEffect: () => void;
  clearRewindEffect: () => void;
  toggleDebug: () => void;
  isBlockingInput: () => boolean;
}

function releasePointerLock(): void {
  if (typeof document !== "undefined" && document.pointerLockElement) {
    document.exitPointerLock();
  }
}

export const useUiLayerStore = create<UiLayerState>((set, get) => ({
  overlayPanel: "none",
  modalType: "none",
  rewindEffectActive: false,
  debugOpen: false,

  openOverlay: (panel) => {
    releasePointerLock();
    set({ overlayPanel: panel });
  },
  closeOverlay: () => set({ overlayPanel: "none" }),
  openModal: (modal) => set({ modalType: modal }),
  closeModal: () => set({ modalType: "none" }),
  triggerRewindEffect: () => set({ rewindEffectActive: true }),
  clearRewindEffect: () => set({ rewindEffectActive: false }),
  toggleDebug: () => set((state) => ({ debugOpen: !state.debugOpen })),
  isBlockingInput: () => get().modalType !== "none" || get().rewindEffectActive,
}));
