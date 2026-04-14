import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, FileText, Zap } from "lucide-react";
import Link from "next/link";

const results = [
  {
    title: "Q3 Retrospective — Engineering",
    excerpt:
      "…the team identified three root causes for the deployment delays: insufficient staging environment parity, missing automated rollback procedures, and unclear ownership of…",
    score: 97,
    date: "Oct 12, 2024",
  },
  {
    title: "Post-mortem: Outage Nov 4",
    excerpt:
      "…the database connection pool was exhausted due to a misconfigured timeout. Root cause analysis pointed to the recently merged migration script that…",
    score: 89,
    date: "Nov 5, 2024",
  },
  {
    title: "Deployment Checklist v2",
    excerpt:
      "…always run smoke tests against staging before promoting to production. Verify rollback procedures have been tested within the last 30 days…",
    score: 84,
    date: "Sep 3, 2024",
  },
  {
    title: "Team Meeting — Oct 8",
    excerpt:
      "…discussed the new on-call rotation. Alice will lead incident response until end of quarter. Action item: update runbooks with the new escalation path…",
    score: 71,
    date: "Oct 8, 2024",
  },
];

const SemanticSearchPage = () => {
  return (
    <div className="min-h-full dark:bg-[#1F1F1F] px-6 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/ai-mockups" className="hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> AI Features
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Semantic Search</span>
        </div>

        {/* Search card */}
        <div className="border rounded-xl overflow-hidden dark:bg-[#2F2F2F] bg-white">
          {/* Search bar */}
          <div className="p-4 border-b flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-foreground/70 flex-1">
              What caused our deployment delays in Q3?
            </span>
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
              <button className="px-3 py-1 text-xs rounded-md bg-background shadow-sm font-medium">
                Semantic
              </button>
              <button className="px-3 py-1 text-xs rounded-md text-muted-foreground hover:text-foreground font-medium">
                Keyword
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="divide-y">
            {results.map((result, i) => (
              <div key={i} className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{result.title}</span>
                      <span className="ml-auto text-xs text-muted-foreground flex-shrink-0">
                        {result.date}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-5 line-clamp-2">
                      {result.excerpt}
                    </p>
                  </div>
                  {/* Relevance score badge */}
                  <div
                    className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      result.score >= 90
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : result.score >= 75
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Zap className="h-3 w-3" />
                    {result.score}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span>4 results across 24 documents</span>
            <Button size="sm" variant="ghost" className="text-xs h-7">
              Load more
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Mockup only — results are ranked by semantic relevance score. The Keyword / Semantic toggle switches between traditional and AI-powered search modes.
        </p>
      </div>
    </div>
  );
};

export default SemanticSearchPage;
