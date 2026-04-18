import type { AiContext } from "@/lib/ai/context-detector";

export type Action = { id: string; label: string; icon: string };

export const ACTION_TEMPLATES: Record<AiContext["type"], Action[]> = {
  code: [
    { id: "explain", label: "Explain this code", icon: "💡" },
    { id: "comment", label: "Add comments", icon: "📝" },
    { id: "improve", label: "Suggest improvements", icon: "✨" },
  ],
  prose: [
    { id: "summarize", label: "Summarize", icon: "📄" },
    { id: "action-items", label: "Extract action items", icon: "✓" },
    { id: "rewrite", label: "Rewrite for clarity", icon: "✏️" },
  ],
  list: [
    { id: "checklist", label: "Convert to checklist", icon: "☑️" },
    { id: "prioritize", label: "Prioritize items", icon: "🔢" },
    { id: "details", label: "Add details", icon: "📋" },
  ],
  meeting_notes: [
    { id: "summarize-decisions", label: "Summarize decisions", icon: "📄" },
    { id: "extract-actions", label: "Extract action items", icon: "✓" },
    { id: "format-agenda", label: "Format as agenda", icon: "📅" },
  ],
};

export function getSuggestedActions(context: AiContext): Action[] {
  return ACTION_TEMPLATES[context.type] ?? ACTION_TEMPLATES["prose"];
}
