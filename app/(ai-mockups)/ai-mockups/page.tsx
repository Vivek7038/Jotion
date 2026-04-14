import Link from "next/link";

const AiMockupsPage = () => {
  return (
    <div>
      <h1>AI Feature Mockups</h1>
      <ul>
        <li><Link href="/ai-mockups/writing-assistant">Writing Assistant</Link></li>
        <li><Link href="/ai-mockups/summarizer">Document Summarizer</Link></li>
        <li><Link href="/ai-mockups/semantic-search">Semantic Search</Link></li>
        <li><Link href="/ai-mockups/chat">Chat with Notes</Link></li>
        <li><Link href="/ai-mockups/auto-tagging">Auto-Tagging</Link></li>
        <li><Link href="/ai-mockups/action-items">Action Item Extractor</Link></li>
        <li><Link href="/ai-mockups/tone-fixer">Tone & Grammar Fixer</Link></li>
        <li><Link href="/ai-mockups/title-suggester">AI Title Suggester</Link></li>
      </ul>
    </div>
  );
};

export default AiMockupsPage;
