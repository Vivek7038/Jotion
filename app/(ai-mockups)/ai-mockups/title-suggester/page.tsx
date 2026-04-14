import { Button } from "@/components/ui/button";
import { ChevronLeft, Type, Check, RefreshCw, Sparkles, Smile, ImageIcon } from "lucide-react";
import Link from "next/link";

const suggestedTitles = [
  "Q4 Product Review: Key Decisions & Next Steps",
  "Quarterly Engineering Retrospective — November 2024",
  "Product Team Sync: Roadmap Blockers & Resolutions",
  "Engineering Workflow Improvements — Q4 Summary",
  "Onboarding Overhaul: Proposal & Stakeholder Notes",
];

const documentContent = `The quarterly product review highlighted several areas for improvement in our current workflow. Team members raised concerns about the onboarding process, specifically the lack of clear documentation and the steep learning curve for new employees.

In response to these concerns, the engineering team proposed a restructured onboarding pipeline that includes automated environment setup, interactive tutorials, and a dedicated buddy system pairing new hires with senior engineers.

Budget constraints remain a significant challenge. The proposed solutions will require additional tooling costs and approximately 20% of senior engineer time over the next two quarters.`;

const TitleSuggesterPage = () => {
  return (
    <div className="min-h-full dark:bg-[#1F1F1F] px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/ai-mockups" className="hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> AI Features
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">AI Title Suggester</span>
        </div>

        <div className="border rounded-xl overflow-hidden dark:bg-[#2F2F2F] bg-white">
          {/* Toolbar — mimicking Jotion toolbar */}
          <div className="border-b px-5 py-2 flex items-center gap-2 text-muted-foreground">
            <button className="hover:bg-secondary p-1.5 rounded">
              <Smile className="h-4 w-4" />
            </button>
            <button className="hover:bg-secondary p-1.5 rounded">
              <ImageIcon className="h-4 w-4" />
            </button>
            <span className="text-xs ml-2">Add icon · Add cover</span>
          </div>

          <div className="px-8 pt-8 pb-4">
            {/* Untitled heading */}
            <h1 className="text-4xl font-bold text-muted-foreground/50 mb-2 cursor-text">
              Untitled
            </h1>

            {/* AI title suggestion dropdown */}
            <div className="mt-3 border rounded-xl overflow-hidden shadow-md dark:bg-[#383838] bg-gray-50 max-w-xl">
              <div className="border-b px-4 py-2.5 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-semibold">AI Title Suggestions</span>
                <span className="ml-auto text-xs text-muted-foreground">Based on your content</span>
              </div>
              <div className="divide-y">
                {suggestedTitles.map((title, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/50 transition-colors cursor-pointer group"
                  >
                    <Type className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm flex-1">{title}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Check className="h-3 w-3" /> Use this
                    </Button>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t flex items-center">
                <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
                  <RefreshCw className="h-3 w-3" /> Regenerate suggestions
                </button>
              </div>
            </div>

            {/* Document content */}
            <div className="mt-8 space-y-4 pb-8">
              {documentContent.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm leading-7 text-foreground/80">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Mockup only — the title suggestion dropdown appears when the document title is empty ("Untitled"), powered by analysis of the document content.
        </p>
      </div>
    </div>
  );
};

export default TitleSuggesterPage;
