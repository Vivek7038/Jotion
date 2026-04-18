import { GROQ_MODEL, GROQ_API_BASE_URL } from "@/lib/ai-config";

export async function callGroq(prompt: string): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY environment variable is not set");

  const response = await fetch(`${GROQ_API_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      stream: false,
    }),
  });

  if (!response.ok) throw new Error(response.statusText);

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0].message.content;
}

export async function streamGroq(prompt: string): Promise<ReadableStream> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY environment variable is not set");

  const response = await fetch(`${GROQ_API_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
  });

  if (!response.ok) throw new Error(response.statusText);
  if (!response.body) throw new Error("Response body is null");

  return response.body;
}

export async function callGroqForBlocks(prompt: string): Promise<string> {
  return callGroq(prompt);
}
