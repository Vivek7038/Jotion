import { Button } from "@/components/ui/button";
import { ChevronLeft, Check, X, Palette } from "lucide-react";
import Link from "next/link";

const tones = ["Formal", "Casual", "Persuasive", "Friendly"];

const paragraph1 = {
  before: "The meeting was kinda all over the place and nobody really knew what was going on. We need to fix this ASAP.",
  issues: [
    { text: "kinda all over the place", type: "tone" as const, suggestion: "disorganized and lacked clear direction" },
    { text: "nobody really knew", type: "grammar" as const, suggestion: "participants were unclear" },
    { text: "ASAP", type: "tone" as const, suggestion: "as soon as possible" },
  ],
};

const paragraph2 = {
  before: "I think maybe we could possibly consider updating the process if everyone is okay with that.",
  issues: [
    { text: "I think maybe we could possibly consider", type: "tone" as const, suggestion: "We should" },
  ],
};

// Renders a sentence with underlined issues
function AnnotatedText({
  text,
  issues,
}: {
  text: string;
  issues: { text: string; type: "grammar" | "tone"; suggestion: string }[];
}) {
  const parts: { segment: string; issue?: (typeof issues)[0] }[] = [];
  let remaining = text;

  issues.forEach((issue) => {
    const idx = remaining.indexOf(issue.text);
    if (idx === -1) return;
    if (idx > 0) parts.push({ segment: remaining.slice(0, idx) });
    parts.push({ segment: issue.text, issue });
    remaining = remaining.slice(idx + issue.text.length);
  });
  if (remaining) parts.push({ segment: remaining });

  return (
    <span>
      {parts.map((p, i) =>
        p.issue ? (
          <span
            key={i}
            className={`underline decoration-wavy decoration-2 cursor-pointer ${
              p.issue.type === "grammar"
                ? "decoration-red-500 bg-red-50 dark:bg-red-900/20"
                : "decoration-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
            }`}
            title={`Suggestion: ${p.issue.suggestion}`}
          >
            {p.segment}
          </span>
        ) : (
          <span key={i}>{p.segment}</span>
        )
      )}
    </span>
  );
}

const ToneFixerPage = () => {
  return (
    <div className="min-h-full dark:bg-[#1F1F1F] px-6 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/ai-mockups" className="hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> AI Features
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Tone & Grammar Fixer</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document editor */}
          <div className="lg:col-span-2">
            <div className="border rounded-xl overflow-hidden dark:bg-[#2F2F2F] bg-white">
              {/* Tone selector */}
              <div className="border-b px-5 py-3 flex items-center gap-3">
                <Palette className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Tone:</span>
                <div className="flex items-center gap-1">
                  {tones.map((tone, i) => (
                    <button
                      key={tone}
                      className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                        i === 0
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Paragraph 1 */}
                <p className="text-sm leading-8">
                  <AnnotatedText text={paragraph1.before} issues={paragraph1.issues} />
                </p>

                {/* Paragraph 2 */}
                <p className="text-sm leading-8">
                  <AnnotatedText text={paragraph2.before} issues={paragraph2.issues} />
                </p>

                <p className="text-sm leading-7 text-foreground/80">
                  The revised onboarding documentation will be distributed to all new hires starting in Q1. This initiative is expected to reduce time-to-productivity by approximately 30%.
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-4 border-b-2 border-wavy border-red-500" />
                Grammar issue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-4 border-b-2 border-wavy border-yellow-500" />
                Tone suggestion
              </span>
            </div>
          </div>

          {/* Suggestions panel */}
          <div className="lg:col-span-1">
            <div className="border rounded-xl overflow-hidden dark:bg-[#2F2F2F] bg-white sticky top-28">
              <div className="border-b px-4 py-3">
                <p className="font-semibold text-sm">Suggestions</p>
                <p className="text-xs text-muted-foreground mt-0.5">4 issues found</p>
              </div>
              <div className="divide-y">
                {[...paragraph1.issues, ...paragraph2.issues].map((issue, i) => (
                  <div key={i} className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          issue.type === "grammar"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                        }`}
                      >
                        {issue.type === "grammar" ? "Grammar" : "Tone"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      &quot;{issue.text}&quot;
                    </p>
                    <p className="text-xs font-medium mb-2">→ &quot;{issue.suggestion}&quot;</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-6 text-xs gap-1 flex-1">
                        <Check className="h-3 w-3 text-green-500" /> Accept
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 text-xs gap-1 flex-1">
                        <X className="h-3 w-3 text-muted-foreground" /> Ignore
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t">
                <Button size="sm" className="w-full text-xs">Accept all suggestions</Button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Mockup only — red underlines = grammar issues, yellow = tone mismatches. The tone selector switches the target writing style.
        </p>
      </div>
    </div>
  );
};

export default ToneFixerPage;
