import type { AiContext } from "@/lib/ai/context-detector";

export function buildActionPrompt(action: string, text: string, context: AiContext): string {
  switch (action) {
    case "summarize":
      return `Summarize the following text. Format: title on the first line, a blank line, then a summary paragraph. No extra commentary.\n\n${text}`;

    case "action-items":
      return `Extract all concrete action items from the following text as a numbered list. Each item should be specific and actionable.\n\n${text}`;

    case "rewrite":
      return `Rewrite the following text for clarity and conciseness. Preserve the original meaning. Return only the rewritten text.\n\n${text}`;

    case "explain":
      return `Explain what the following code does, how it works, and any key implementation details worth noting. Be clear and thorough.\n\n${text}`;

    case "comment":
      return `Return the following code with helpful inline comments added. Preserve the original code exactly — only add comments. Return only the commented code.\n\n${text}`;

    case "improve":
      return `Suggest specific improvements for the following ${context.type === "code" ? "code" : "text"} as a numbered list. Each suggestion should be concrete and actionable.\n\n${text}`;

    case "checklist":
      return `Convert the following list into a markdown checklist (using - [ ] syntax). Return only the checklist.\n\n${text}`;

    case "prioritize":
      return `Re-order the following list items by priority (highest priority first). After the reordered list, briefly explain the ranking rationale.\n\n${text}`;

    case "details":
      return `Expand each item in the following list by adding one supporting detail sentence. Return the expanded list.\n\n${text}`;

    case "summarize-decisions":
      return `Extract and list all decisions made in the following meeting notes. Format as a numbered list. Each entry should clearly state the decision.\n\n${text}`;

    case "extract-actions":
      return `Extract all action items from the following meeting notes. For each item, include the owner and deadline if mentioned. Format as a numbered list.\n\n${text}`;

    case "format-agenda":
      return `Reformat the following meeting notes as a structured meeting agenda with clear sections (e.g. Attendees, Objectives, Topics, Action Items, Decisions). Return only the formatted agenda.\n\n${text}`;

    default:
      return `Process the following text helpfully and return the result.\n\n${text}`;
  }
}

export function buildConvertToBlocksPrompt(text: string, action: string, context: AiContext): string {
  return `Convert the following text into a BlockNote-compatible PartialBlock[] JSON array.

Valid block types and their props:
- "paragraph": no extra props
- "heading": requires prop "level" with value 1, 2, or 3
- "bulletListItem": no extra props
- "numberedListItem": no extra props
- "checkListItem": no extra props
- "codeBlock": no extra props

Each block must follow this exact JSON shape:
{
  "type": "<blockType>",
  "props": { /* optional, only include if required by the block type */ },
  "content": [{ "type": "text", "text": "<content string>", "styles": {} }]
}

Return ONLY the raw JSON array. No markdown code fences, no explanation, no trailing text.

Text to convert (action context: ${action}, content type: ${context.type}):
${text}`;
}
