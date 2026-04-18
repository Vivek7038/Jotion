"use client";
import { useEffect } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { useTheme } from "next-themes";
import { useAiActions } from "@/hooks/use-ai-actions";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
  onEditorReady?: (editor: BlockNoteEditor) => void;
}

export const Editor = ({
  onChange,
  editable,
  initialContent,
  onEditorReady,
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { setSelection } = useAiActions();

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent ? (JSON.parse(initialContent) as PartialBlock[]) : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
  });

  useEffect(() => {
    if (onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (editable !== true) return;

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        setSelection("", null, []);
        return;
      }
      const range = selection.getRangeAt(0);
      if (!editor.domElement?.contains(range.commonAncestorContainer)) {
        setSelection("", null, []);
        return;
      }
      const text = selection.toString().trim();
      if (!text) {
        setSelection("", null, []);
        return;
      }
      const rect = range.getBoundingClientRect();
      const blockIds = editor.getSelection()?.blocks.map(b => b.id) ?? [];
      setSelection(text, rect, blockIds);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [editor, editable, setSelection]);

  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === "light" ? "light" : "dark"}
    />
  );
};
