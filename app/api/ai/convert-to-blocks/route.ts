import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callLLMForBlocks } from "@/lib/llm/index";
import { buildConvertToBlocksPrompt } from "@/lib/ai/prompt-builder";

type PartialBlock = Record<string, unknown>;

const ALLOWED_BLOCK_TYPES = new Set([
  "heading",
  "paragraph",
  "bulletListItem",
  "numberedListItem",
  "checkListItem",
  "codeBlock",
]);

const schema = z.object({
  text: z.string().min(1),
  action: z.string().min(1),
  context: z.object({
    type: z.enum(["code", "prose", "list", "meeting_notes"]),
    language: z.string().optional(),
    structure: z.string().optional(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const { text, action, context } = parsed.data;
    const prompt = buildConvertToBlocksPrompt(text, action, context);

    let raw: string;
    try {
      raw = await callLLMForBlocks(prompt);
    } catch {
      return NextResponse.json(
        { error: "LLM call failed. Please try again." },
        { status: 500 }
      );
    }

    let parsed_blocks: unknown;
    try {
      parsed_blocks = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Model returned invalid JSON. Could not convert to blocks." },
        { status: 500 }
      );
    }

    if (!Array.isArray(parsed_blocks)) {
      return NextResponse.json(
        { error: "Model returned invalid JSON. Could not convert to blocks." },
        { status: 500 }
      );
    }

    const allValid = parsed_blocks.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).type === "string" &&
        ALLOWED_BLOCK_TYPES.has((item as Record<string, unknown>).type as string)
    );
    if (!allValid) {
      return NextResponse.json(
        { error: "Model returned invalid block types. Could not convert to blocks." },
        { status: 500 }
      );
    }

    return NextResponse.json({ blocks: parsed_blocks as PartialBlock[] });
  } catch {
    return NextResponse.json(
      { error: "Unexpected error. Please try again." },
      { status: 500 }
    );
  }
}
