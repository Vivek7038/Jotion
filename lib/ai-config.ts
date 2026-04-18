export type LLMProvider = "groq" | "openai" | "anthropic";

export const DEFAULT_LLM_PROVIDER: LLMProvider = "groq";
export const GROQ_MODEL = "llama-3.1-8b-instant";
export const GROQ_API_BASE_URL = "https://api.groq.com/openai/v1";
export const MAX_SELECTION_CHARS = 500;
