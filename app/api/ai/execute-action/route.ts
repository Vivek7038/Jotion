import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { streamLLM } from "@/lib/llm/index";
import { buildActionPrompt } from "@/lib/ai/prompt-builder";

const schema = z.object({
  text: z.string().min(1),
  action: z.string().min(1),
  context: z.object({
    type: z.enum(["code", "prose", "list", "meeting_notes"]),
    language: z.string().optional(),
    structure: z.string().optional(),
  }).optional(),
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

    const { text, action } = parsed.data;
    const context = parsed.data.context ?? { type: "prose" as const };
    const prompt = buildActionPrompt(action, text, context);

    let stream: ReadableStream;
    try {
      stream = await streamLLM(prompt);
    } catch {
      return NextResponse.json(
        { error: "LLM stream failed. Please try again." },
        { status: 500 }
      );
    }

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected error. Please try again." },
      { status: 500 }
    );
  }
}
