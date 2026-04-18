"use client";

import { useEffect, useLayoutEffect, useRef, useCallback, useState } from "react";
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
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({ opacity: 0 });

  // Position panel above or below selection based on available viewport space
  useLayoutEffect(() => {
    if (!isPanelOpen || !selectionRect) return;

    const panelWidth = Math.min(720, window.innerWidth - 48);
    const panelHeight = panelRef.current?.offsetHeight ?? 200;
    const gap = 12;

    const spaceBelow = window.innerHeight - selectionRect.bottom - gap;
    const spaceAbove = selectionRect.top - gap;

    const placeBelow = spaceBelow >= panelHeight || spaceBelow >= spaceAbove;
    const availableSpace = placeBelow ? spaceBelow : spaceAbove;
    const maxHeight = Math.max(180, Math.min(availableSpace - MARGIN, window.innerHeight * 0.85));

    let top: number;
    if (placeBelow) {
      top = selectionRect.bottom + gap;
    } else {
      top = selectionRect.top - Math.min(panelHeight, maxHeight) - gap;
    }

    top = Math.min(Math.max(top, MARGIN), window.innerHeight - Math.min(panelHeight, maxHeight) - MARGIN);

    const rawLeft = selectionRect.left - 80;
    const left = Math.min(Math.max(rawLeft, MARGIN), window.innerWidth - panelWidth - MARGIN);

    setPanelStyle({ position: "fixed", left, top, zIndex: 51, width: panelWidth, maxHeight, opacity: 1 });
  }, [isPanelOpen, selectionRect, streamedResult, isStreaming, error]);

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

  const actionLabel = activeAction ? (ACTION_LABELS[activeAction] ?? activeAction) : "";
  const truncatedText =
    selectedText.length > 120 ? selectedText.slice(0, 120) + "…" : selectedText;

  return (
    <div
      ref={panelRef}
      style={panelStyle}
      className="flex flex-col rounded-lg border bg-white dark:bg-neutral-900 shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex-none flex justify-between items-center px-3 py-2 border-b">
        <span className="text-sm font-semibold">✦ {actionLabel}</span>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={reset}>
          ✕
        </Button>
      </div>

      {/* Original text */}
      <div className="flex-none px-3 py-2 text-xs text-muted-foreground bg-muted/40 border-b">
        {truncatedText}
      </div>

      {/* Stream area — grows to fill available height, scrolls when full */}
      <div className="flex-1 min-h-[80px] overflow-y-auto px-3 py-3 text-sm leading-relaxed whitespace-pre-wrap">
        {streamedResult}
      </div>

      {/* Generating indicator */}
      {isStreaming && (
        <div className="flex-none px-3 pb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Spinner size="sm" />
          <span>Generating…</span>
        </div>
      )}

      {/* Error state */}
      {error && !isStreaming && (
        <div className="flex-none px-3 pb-2 flex flex-col gap-2">
          <span className="text-xs text-destructive">{error}</span>
          <Button size="sm" onClick={handleRetry}>Retry</Button>
        </div>
      )}

      {/* Footer actions */}
      {!isStreaming && !error && streamedResult && (
        <div className="flex-none px-3 py-2 border-t flex gap-2">
          <Button variant="default" size="sm" onClick={handleInsertBelow}>Insert Below</Button>
          <Button variant="outline" size="sm" onClick={handleReplace}>Replace</Button>
        </div>
      )}
    </div>
  );
}
