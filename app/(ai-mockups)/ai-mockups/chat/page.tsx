import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, FileText, Send, Bot, User } from "lucide-react";
import Link from "next/link";

const documents = [
  { title: "Q4 Product Review", date: "Dec 1" },
  { title: "2025 Annual Planning", date: "Nov 28" },
  { title: "Team Meeting — Oct 8", date: "Oct 8" },
  { title: "Post-mortem: Outage Nov 4", date: "Nov 5" },
  { title: "Deployment Checklist v2", date: "Sep 3" },
  { title: "OKRs Q1 2025", date: "Jan 3" },
];

const messages = [
  {
    role: "user" as const,
    text: "What were the main outcomes from the 2025 annual planning session?",
  },
  {
    role: "assistant" as const,
    text: "Based on your notes, the 2025 annual planning session produced three major outcomes:\n\n1. A 35% revenue growth target driven by APAC expansion\n2. A product roadmap with AI search in Q1, collaborative editing in Q2, and mobile redesign in Q3\n3. A decision to either hire 8 engineers in H1 or pursue selective outsourcing\n\nEnterprise retention was highlighted at 94%, but mid-market churn at 18% was flagged as a concern.",
    sources: ["2025 Annual Planning"],
  },
  {
    role: "user" as const,
    text: "What's the plan to fix mid-market churn?",
  },
  {
    role: "assistant" as const,
    text: "According to the planning notes, customer success proposed a dedicated mid-market program that includes:\n\n• A new health-score dashboard to proactively identify at-risk accounts\n• Quarterly business reviews for all accounts over $5,000 ARR\n\nThis was presented in response to the 18% churn rate observed in Q3.",
    sources: ["2025 Annual Planning", "Team Meeting — Oct 8"],
  },
];

const ChatPage = () => {
  return (
    <div className="min-h-full dark:bg-[#1F1F1F] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/ai-mockups" className="hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> AI Features
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Chat with Your Notes</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
          {/* Documents Sidebar */}
          <div className="lg:col-span-1 border rounded-xl overflow-hidden dark:bg-[#2F2F2F] bg-white flex flex-col">
            <div className="border-b px-4 py-3">
              <p className="font-semibold text-sm">Documents</p>
              <p className="text-xs text-muted-foreground mt-0.5">6 in context</p>
            </div>
            <div className="flex-1 overflow-y-auto divide-y">
              {documents.map((doc, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-2.5 text-sm cursor-pointer hover:bg-secondary/50 transition-colors ${
                    i === 1 ? "bg-secondary/70" : ""
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="truncate flex-1 text-xs">{doc.title}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{doc.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-3 border rounded-xl overflow-hidden dark:bg-[#2F2F2F] bg-white flex flex-col">
            {/* Chat header */}
            <div className="border-b px-4 py-3 flex items-center gap-2">
              <Bot className="h-4 w-4 text-orange-500" />
              <span className="font-semibold text-sm">Jotion AI</span>
              <span className="text-xs text-muted-foreground ml-1">· using 6 documents</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <Avatar className="h-7 w-7 flex-shrink-0 mt-0.5">
                      <AvatarFallback className="bg-orange-100 dark:bg-orange-900/40 text-orange-600 text-xs">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[75%] ${msg.role === "user" ? "order-first" : ""}`}>
                    <div
                      className={`rounded-xl px-4 py-3 text-sm leading-6 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-secondary"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                    {/* Source chips */}
                    {msg.role === "assistant" && msg.sources && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {msg.sources.map((src, j) => (
                          <span
                            key={j}
                            className="inline-flex items-center gap-1 text-xs bg-secondary border rounded-full px-2.5 py-1 cursor-pointer hover:border-primary/50 transition-colors"
                          >
                            <FileText className="h-3 w-3 text-muted-foreground" />
                            {src}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <Avatar className="h-7 w-7 flex-shrink-0 mt-0.5">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t px-4 py-3 flex items-center gap-2">
              <input
                readOnly
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                placeholder="Ask anything about your notes…"
              />
              <Button size="sm" className="gap-1.5">
                <Send className="h-3.5 w-3.5" /> Send
              </Button>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Mockup only — the chat panel shows the planned AI Chat UI with source document citations as clickable chips.
        </p>
      </div>
    </div>
  );
};

export default ChatPage;
