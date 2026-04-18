import { DEFAULT_LLM_PROVIDER } from "@/lib/ai-config";
import { callGroq, streamGroq, callGroqForBlocks } from "@/lib/llm/groq";

export async function callLLM(prompt: string): Promise<string> {
  switch (DEFAULT_LLM_PROVIDER) {
    case "groq":
      return callGroq(prompt);
    default:
      throw new Error("Unsupported LLM provider");
  }
}

export async function streamLLM(prompt: string): Promise<ReadableStream> {
  switch (DEFAULT_LLM_PROVIDER) {
    case "groq":
      return streamGroq(prompt);
    default:
      throw new Error("Unsupported LLM provider");
  }
}

export async function callLLMForBlocks(prompt: string): Promise<string> {
  switch (DEFAULT_LLM_PROVIDER) {
    case "groq":
      return callGroqForBlocks(prompt);
    default:
      throw new Error("Unsupported LLM provider");
  }
}
