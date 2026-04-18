import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MAX_SELECTION_CHARS } from "@/lib/ai-config";
import { detectContext } from "@/lib/ai/context-detector";

const schema = z.object({ text: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body: 'text' must be a non-empty string." },
        { status: 400 }
      );
    }

    const { text } = parsed.data;
    if (text.length > MAX_SELECTION_CHARS) {
      return NextResponse.json(
        { error: `Selection too long. Maximum allowed is ${MAX_SELECTION_CHARS} characters.` },
        { status: 400 }
      );
    }

    const context = await detectContext(text);
    return NextResponse.json(context);
  } catch {
    return NextResponse.json(
      { error: "Failed to detect context. Please try again." },
      { status: 500 }
    );
  }
}
