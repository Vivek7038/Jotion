import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wand2,
  Sparkles,
  ChevronLeft,
  ChevronsUpDown,
  Minimize2,
  Maximize2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

const fakeDocument = [
  {
    id: 1,
    text: "The quarterly product review highlighted several areas for improvement in our current workflow. Team members raised concerns about the onboarding process, specifically the lack of clear documentation and the steep learning curve for new employees.",
  },
  {
    id: 2,
    text: "In response to these concerns, the engineering team proposed a restructured onboarding pipeline that includes automated environment setup, interactive tutorials, and a dedicated buddy system pairing new hires with senior engineers.",
    highlight: true,
  },
  {
    id: 3,
    text: "Budget constraints remain a significant challenge. The proposed solutions will require additional tooling costs and approximately 20% of senior engineer time over the next two quarters.",
  },
];

const WritingAssistantPage = () => {
  return (
    <div className="min-h-full dark:bg-[#1F1F1F] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/ai-mockups" className="hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> AI Features
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">AI Writing Assistant</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Column */}
          <div className="lg:col-span-2">
            <div className="border rounded-xl overflow-hidden dark:bg-[#2F2F2F] bg-white">
              {/* Editor toolbar */}
              <div className="border-b px-4 py-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Q4 Product Review</span>
                <span className="ml-auto">Saved · 2 min ago</span>
              </div>

              <div className="p-6 space-y-4 relative">
                {/* Floating AI toolbar — shown above the highlighted paragraph */}
                <div className="absolute top-[92px] left-1/2 -translate-x-1/2 z-10 bg-background border rounded-lg shadow-lg p-1 flex items-center gap-1">
                  <span className="text-xs text-muted-foreground px-2">AI:</span>
                  <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                    <Wand2 className="h-3.5 w-3.5 text-purple-500" /> Continue writing
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                    <Minimize2 className="h-3.5 w-3.5 text-blue-500" /> Make shorter
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                    <Maximize2 className="h-3.5 w-3.5 text-green-500" /> Make longer
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                    <RefreshCw className="h-3.5 w-3.5 text-orange-500" /> Change tone
                  </Button>
                </div>

                {fakeDocument.map((para) => (
                  <p
                    key={para.id}
                    className={`text-sm leading-7 ${
                      para.highlight
                        ? "bg-purple-100 dark:bg-purple-900/30 rounded px-2 py-1 ring-2 ring-purple-400/50"
                        : ""
                    }`}
                  >
                    {para.text}
                  </p>
                ))}

                {/* Cursor blink indicator */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span className="inline-block w-0.5 h-4 bg-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Output Panel */}
          <div className="lg:col-span-1">
            <div className="border rounded-xl overflow-hidden dark:bg-[#2F2F2F] bg-white h-full">
              <div className="border-b px-4 py-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="font-medium text-sm">AI Suggestion</span>
                <span className="ml-auto text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full px-2 py-0.5">
                  Streaming…
                </span>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground mb-3">
                  Continuing from your selected paragraph:
                </p>
                {/* Simulated streaming output */}
                <p className="text-sm leading-7">
                  To address the budget constraints, the team recommended a phased
                  rollout approach — beginning with the automated setup tools in Q1,
                  followed by the interactive tutorial platform in Q2.
                </p>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />

                <div className="pt-4 flex gap-2">
                  <Button size="sm" className="flex-1 text-xs">
                    Insert
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs gap-1">
                    <RefreshCw className="h-3 w-3" /> Retry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature caption */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          Mockup only — the highlighted paragraph simulates selected text; the floating toolbar and streaming panel show the planned AI Writing Assistant UX.
        </p>
      </div>
    </div>
  );
};

export default WritingAssistantPage;
