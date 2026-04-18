"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAiActions, ActionId, AiContext } from "@/hooks/use-ai-actions";
import { getSuggestedActions, ACTION_TEMPLATES, Action } from "@/lib/ai/action-suggester";
import { MAX_SELECTION_CHARS } from "@/lib/ai-config";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type PopoverState = "default" | "detecting" | "contextual" | "warning" | "error";

const DEFAULT_ACTIONS: Action[] = ACTION_TEMPLATES["prose"];

export function AiActionPopover() {
  const { selectedText, selectionRect, isPopoverOpen, context, setContext, setAction, openPanel, reset } =
    useAiActions();

  const [popoverState, setPopoverState] = useState<PopoverState>("default");
  const [actions, setActions] = useState<Action[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  const runDetection = useCallback(async () => {
    if (!selectedText) return;

    setPopoverState("detecting");

    try {
      const res = await fetch("/api/ai/detect-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText }),
      });

      if (!res.ok) throw new Error("Request failed");

      const context: AiContext = await res.json();
      setContext(context);
      setActions(getSuggestedActions(context));
      setPopoverState("contextual");
    } catch {
      setPopoverState("error");
    }
  }, [selectedText, setContext]);

  useEffect(() => {
    if (isPopoverOpen) {
      setPopoverState("default");
      setActions([]);
    }
  }, [isPopoverOpen]);

  useEffect(() => {
    if (!isPopoverOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        reset();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") reset();
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPopoverOpen, reset]);

  const handleAction = (action: Action) => {
    if (!context) setContext({ type: "prose" });
    setAction(action.id as ActionId);
    openPanel();
  };

  if (!isPopoverOpen || !selectionRect) return null;

  if (selectedText.length > MAX_SELECTION_CHARS) {
    const MARGIN = 8;
    const offset = 12;
    const popoverWidth = popoverRef.current?.offsetWidth ?? 224;
    const popoverHeight = popoverRef.current?.offsetHeight ?? 80;
    const rawLeft = selectionRect.right + offset;
    const rawTop = selectionRect.top;
    const left = Math.min(rawLeft, window.innerWidth - popoverWidth - MARGIN);
    const top = Math.min(Math.max(rawTop, MARGIN), window.innerHeight - popoverHeight - MARGIN);

    return (
      <div
        ref={popoverRef}
        style={{ position: "fixed", left, top, zIndex: 50 }}
        className="w-56 rounded-lg border bg-white dark:bg-neutral-900 shadow-lg text-sm"
      >
        <div className="px-3 py-2 text-amber-600 dark:text-amber-400">
          ⚠️ Selection too long. Please select less text to use AI actions.
        </div>
      </div>
    );
  }

  const MARGIN = 8;
  const offset = 12;
  const popoverWidth = popoverRef.current?.offsetWidth ?? 224;
  const popoverHeight = popoverRef.current?.offsetHeight ?? 160;

  const rawLeft = selectionRect.right + offset;
  const rawTop = selectionRect.top;

  const left = Math.min(rawLeft, window.innerWidth - popoverWidth - MARGIN);
  const top = Math.min(Math.max(rawTop, MARGIN), window.innerHeight - popoverHeight - MARGIN);

  return (
    <div
      ref={popoverRef}
      style={{ position: "fixed", left, top, zIndex: 50 }}
      className="w-56 rounded-lg border bg-white dark:bg-neutral-900 shadow-lg text-sm"
    >
      {popoverState === "detecting" && (
        <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground">
          <Spinner size="sm" />
          <span>Detecting context…</span>
        </div>
      )}

      {popoverState === "default" && (
        <div className="py-1">
          <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">✦ AI Actions</div>
          {DEFAULT_ACTIONS.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 px-3 rounded-none h-8"
              onClick={() => handleAction(action)}
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </Button>
          ))}
          <div className="border-t mt-1 pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-end gap-1 px-3 rounded-none h-8 text-muted-foreground"
              onClick={runDetection}
            >
              More Actions →
            </Button>
          </div>
        </div>
      )}

      {popoverState === "contextual" && (
        <div className="py-1">
          <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">✦ AI Actions</div>
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 px-3 rounded-none h-8"
              onClick={() => handleAction(action)}
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      )}

      {popoverState === "error" && (
        <div className="flex flex-col gap-2 px-3 py-2">
          <span className="text-muted-foreground">Could not analyze. Try again.</span>
          <Button size="sm" onClick={runDetection}>Retry</Button>
        </div>
      )}
    </div>
  );
}
