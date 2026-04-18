import { callLLM } from "@/lib/llm/index";

export type AiContext = {
  type: "code" | "prose" | "list" | "meeting_notes";
  language?: string;
  structure?: string;
};

export async function detectContext(text: string): Promise<AiContext> {
  const prompt = `Classify the following text into exactly one of these types: "code", "prose", "list", or "meeting_notes".

Rules:
- "code": programming code in any language
- "list": a list of items (bulleted, numbered, or otherwise)
- "meeting_notes": notes from a meeting (agenda, action items, attendees, decisions)
- "prose": any other natural language text

If the type is "code", also include a "language" field with the programming language name (e.g. "typescript", "python").
If the type is "prose" or "list", optionally include a "structure" field describing the structure.

Return ONLY a valid JSON object matching this shape:
{ "type": "...", "language": "...", "structure": "..." }

Include only the fields that apply. No explanation, no markdown fences, no extra text.

Text to classify:
${text}`;

  const result = await callLLM(prompt);

  try {
    return JSON.parse(result) as AiContext;
  } catch {
    return { type: "prose" };
  }
}
