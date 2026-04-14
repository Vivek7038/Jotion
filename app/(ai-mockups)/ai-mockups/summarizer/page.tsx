import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, RefreshCw, ChevronLeft, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";

const longDocument = [
  "The annual strategic planning session brought together department heads, team leads, and key stakeholders from across the organization. The primary objective was to align on company goals for the upcoming fiscal year and establish a shared roadmap that reflects both short-term priorities and long-term vision.",
  "Revenue targets for next year have been set at a 35% growth rate, driven primarily by expansion into the APAC market and deeper penetration of existing enterprise accounts. The sales team presented a detailed go-to-market strategy that includes hiring 12 additional account executives and launching a partner channel program in Q2.",
  "The product team unveiled the 2025 roadmap, which includes three major feature releases: an AI-powered search experience in Q1, a collaborative editing overhaul in Q2, and a mobile-first redesign in Q3. These initiatives directly address the top feedback themes from the NPS survey conducted in October.",
  "Engineering capacity planning revealed a gap between the roadmap ambitions and current headcount. The CTO proposed two options: aggressive hiring (8 engineers in H1) or a selective outsourcing arrangement for non-core infrastructure work. The leadership team will evaluate both options based on budget finalization in December.",
  "Customer success reported a 94% retention rate for enterprise accounts but flagged concerns about mid-market churn, which reached 18% in Q3. A dedicated mid-market success program was proposed, including a new health-score dashboard and quarterly business reviews for all accounts over $5,000 ARR.",
  "Marketing presented the brand refresh initiative, which includes a redesigned website, updated visual identity, and a thought leadership content program. The campaign is planned to launch in early Q2 to coincide with the major product release.",
];

const summaryPoints = [
  "2025 revenue target is 35% growth, led by APAC expansion and enterprise account penetration.",
  "Product roadmap includes AI search (Q1), collaborative editing overhaul (Q2), and mobile redesign (Q3).",
  "Engineering headcount gap requires either 8 new hires in H1 or selective outsourcing — decision pending Dec budget.",
  "Enterprise retention is strong at 94%; mid-market churn at 18% flagged as priority concern.",
  "Brand refresh + redesigned website to launch Q2 alongside the major product release.",
];

const SummarizerPage = () => {
  return (
    <div className="min-h-full dark:bg-[#1F1F1F] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/ai-mockups" className="hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> AI Features
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Document Summarizer</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Long Document */}
          <div className="lg:col-span-2">
            <div className="border rounded-xl overflow-hidden dark:bg-[#2F2F2F] bg-white">
              <div className="border-b px-4 py-2 flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">2025 Annual Planning Session — Notes</span>
                <span className="ml-auto text-xs text-muted-foreground">~1,200 words</span>
              </div>
              <div className="p-6 space-y-4 max-h-[520px] overflow-y-auto">
                {longDocument.map((para, i) => (
                  <p key={i} className="text-sm leading-7 text-foreground/80">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* AI Summary Panel */}
          <div className="lg:col-span-1">
            <div className="border rounded-xl overflow-hidden dark:bg-[#2F2F2F] bg-white sticky top-28">
              {/* Panel header */}
              <div className="border-b px-4 py-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-sm">AI Summary</span>
                <button className="ml-auto">
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground">Key takeaways:</p>
                <ul className="space-y-2">
                  {summaryPoints.map((point, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-6">
                      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Loading skeleton (simulates regeneration) */}
                <div className="pt-2 space-y-2 opacity-40">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>

                <div className="pt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="w-full text-xs gap-1">
                    <RefreshCw className="h-3 w-3" /> Regenerate
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Summarized to 5 bullet points · ~90% shorter
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Mockup only — the AI Summary panel shows the planned summarizer UI with bullet-point takeaways and a Regenerate button.
        </p>
      </div>
    </div>
  );
};

export default SummarizerPage;
