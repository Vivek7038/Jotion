"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useAiActions, ActionId, AiContext } from "@/hooks/use-ai-actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const MARGIN = 8;

const ACTION_LABELS: Record<ActionId, string> = {
  explain: "Explain",
  comment: "Add Comments",
  improve: "Improve",
  summarize: "Summarize",
  "action-items": "Extract Action Items",
  rewrite: "Rewrite",
  checklist: "Make Checklist",
  prioritize: "Prioritize",
  details: "Add Details",
  "summarize-decisions": "Summarize Decisions",
  "extract-actions": "Extract Actions",
  "format-agenda": "Format Agenda",
};

interface AiResultPanelProps {
  editorRef: React.RefObject<BlockNoteEditor | null>;
}

export function AiResultPanel({ editorRef }: AiResultPanelProps) {
  const {
    isPanelOpen,
    selectedText,
    activeAction,
    context,
    streamedResult,
    isStreaming,
    error,
    selectionRect,
    selectedBlockIds,
    appendChunk,
    setError,
    setStreaming,
    openPanel,
    reset,
  } = useAiActions();

  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Streaming effect
  useEffect(() => {
    if (!isPanelOpen || !selectedText || !activeAction || !context) return;

    const controller = new AbortController();
    abortRef.current = controller;

    const stream = async () => {
      try {
        setStreaming(true);
        const res = await fetch("/api/ai/execute-action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: selectedText, action: activeAction, context }),
          signal: controller.signal,
        });

        if (!res.ok) {
          setError("Something went wrong. Please try again.");
          setStreaming(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setError("Something went wrong. Please try again.");
          setStreaming(false);
          return;
        }

        const decoder = new TextDecoder();
        let lineBuffer = "";

        const processLine = (line: string) => {
          if (!line.startsWith("data: ")) return;
          const data = line.slice(6).trim();
          if (data === "[DONE]") return;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (typeof content === "string" && content.length > 0) {
              appendChunk(content);
            }
          } catch {
            // ignore malformed JSON lines
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          lineBuffer += decoder.decode(value, { stream: true });
          const lines = lineBuffer.split("\n");
          lineBuffer = lines.pop() ?? "";

          for (const line of lines) {
            processLine(line);
          }
        }

        if (lineBuffer) processLine(lineBuffer);

        setStreaming(false);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Something went wrong. Please try again.");
        setStreaming(false);
      }
    };

    stream();

    return () => {
      controller.abort();
    };
  }, [isPanelOpen, selectedText, activeAction, context, retryCount]);

  const handleRetry = useCallback(() => {
    abortRef.current?.abort();
    openPanel();
    setRetryCount((c) => c + 1);
  }, [openPanel]);

  const handleInsertBelow = useCallback(async () => {
    if (!editorRef.current) return;

    try {
      const res = await fetch("/api/ai/convert-to-blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: streamedResult, action: activeAction, context }),
      });

      if (!res.ok) {
        setError("Could not insert blocks. Please try again.");
        return;
      }

      const { blocks } = (await res.json()) as { blocks: PartialBlock[] };
      const editor = editorRef.current;

      if (selectedBlockIds.length > 0) {
        const lastId = selectedBlockIds[selectedBlockIds.length - 1];
        const lastBlock = editor.getBlock(lastId);
        if (lastBlock) {
          editor.insertBlocks(blocks, lastBlock, "after");
          reset();
          return;
        }
      }

      const topLevel = editor.topLevelBlocks;
      const refBlock = topLevel[topLevel.length - 1];
      if (!refBlock) {
        setError("Could not find a reference block to insert after.");
        return;
      }
      editor.insertBlocks(blocks, refBlock, "after");
      reset();
    } catch {
      setError("Could not insert blocks. Please try again.");
    }
  }, [editorRef, streamedResult, activeAction, context, selectedBlockIds, setError, reset]);

  const handleReplace = useCallback(async () => {
    if (!editorRef.current) return;

    if (selectedBlockIds.length === 0) {
      setError("No blocks selected for replacement.");
      return;
    }

    try {
      const res = await fetch("/api/ai/convert-to-blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: streamedResult, action: activeAction, context }),
      });

      if (!res.ok) {
        setError("Could not insert blocks. Please try again.");
        return;
      }

      const { blocks } = (await res.json()) as { blocks: PartialBlock[] };
      editorRef.current.replaceBlocks(selectedBlockIds, blocks);
      reset();
    } catch {
      setError("Could not insert blocks. Please try again.");
    }
  }, [editorRef, streamedResult, activeAction, context, selectedBlockIds, setError, reset]);

  if (!isPanelOpen || !selectionRect) return null;

  // Panel positioning
  const PANEL_WIDTH_PX = Math.min(720, window.innerWidth - 48);
  const rawLeft = selectionRect.left - 80;
  const left = Math.min(Math.max(rawLeft, MARGIN), window.innerWidth - PANEL_WIDTH_PX - MARGIN);
  const top = selectionRect.bottom + 12;

  const actionLabel = activeAction ? (ACTION_LABELS[activeAction] ?? activeAction) : "";
  const truncatedText =
    selectedText.length > 120 ? selectedText.slice(0, 120) + "…" : selectedText;

  return (
    <div
      ref={panelRef}
      style={{ position: "fixed", left, top, zIndex: 51, width: PANEL_WIDTH_PX }}
      className="rounded-lg border bg-white dark:bg-neutral-900 shadow-xl"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 border-b">
        <span className="text-sm font-semibold">✦ {actionLabel}</span>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={reset}>
          ✕
        </Button>
      </div>

      {/* Original text */}
      <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/40 border-b">
        {truncatedText}
      </div>

      {/* Stream area */}
      <div className="px-3 py-3 text-sm leading-relaxed min-h-[120px] max-h-[320px] overflow-y-auto whitespace-pre-wrap">
        {streamedResult}
      </div>

      {/* Generating indicator */}
      {isStreaming && (
        <div className="px-3 pb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Spinner size="sm" />
          <span>Generating…</span>
        </div>
      )}

      {/* Error state */}
      {error && !isStreaming && (
        <div className="px-3 pb-2 flex flex-col gap-2">
          <span className="text-xs text-destructive">{error}</span>
          <Button size="sm" onClick={handleRetry}>Retry</Button>
        </div>
      )}

      {/* Footer actions */}
      {!isStreaming && !error && streamedResult && (
        <div className="px-3 py-2 border-t flex gap-2">
          <Button variant="default" size="sm" onClick={handleInsertBelow}>Insert Below</Button>
          <Button variant="outline" size="sm" onClick={handleReplace}>Replace</Button>
        </div>
      )}
    </div>
  );
}
