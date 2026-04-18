import { create } from "zustand";

export type AiContextType = "code" | "prose" | "list" | "meeting_notes";

export type ActionId =
  | "explain"
  | "comment"
  | "improve"
  | "summarize"
  | "action-items"
  | "rewrite"
  | "checklist"
  | "prioritize"
  | "details"
  | "summarize-decisions"
  | "extract-actions"
  | "format-agenda";

export type AiContext = {
  type: AiContextType;
  language?: string;
  structure?: string;
};

type AiActionsStore = {
  selectedText: string;
  selectionRect: DOMRect | null;
  context: AiContext | null;
  activeAction: ActionId | null;
  streamedResult: string;
  isStreaming: boolean;
  isPopoverOpen: boolean;
  isPanelOpen: boolean;
  selectedBlockIds: string[];
  error: string | null;

  setSelection: (text: string, rect: DOMRect | null, blockIds: string[]) => void;
  setContext: (context: AiContext) => void;
  setAction: (action: ActionId) => void;
  appendChunk: (chunk: string) => void;
  setError: (error: string) => void;
  setStreaming: (value: boolean) => void;
  reset: () => void;
  openPanel: () => void;
  closePanel: () => void;
};

const initialState = {
  selectedText: "",
  selectionRect: null,
  context: null,
  activeAction: null,
  streamedResult: "",
  isStreaming: false,
  isPopoverOpen: false,
  isPanelOpen: false,
  selectedBlockIds: [],
  error: null,
};

export const useAiActions = create<AiActionsStore>((set) => ({
  ...initialState,

  setSelection: (text, rect, blockIds) => {
    if (text) {
      set({ ...initialState, selectedText: text, selectionRect: rect, selectedBlockIds: blockIds, isPopoverOpen: true });
    } else {
      set(initialState);
    }
  },

  setContext: (context) => set({ context }),

  setAction: (action) => set({ activeAction: action, isPopoverOpen: false }),

  appendChunk: (chunk) =>
    set((state) => ({ streamedResult: state.streamedResult + chunk, isStreaming: true })),

  setError: (error) => set({ error, isStreaming: false }),

  setStreaming: (v) => set({ isStreaming: v }),

  reset: () => set(initialState),

  openPanel: () => set({ isPanelOpen: true, streamedResult: "", isStreaming: false, error: null }),

  closePanel: () => set({ isPanelOpen: false, isStreaming: false }),
}));
