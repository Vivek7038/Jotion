import { Button } from "@/components/ui/button";
import { Check, X, ChevronLeft, FileText, Tag, Sparkles } from "lucide-react";
import Link from "next/link";

const documents = [
  {
    title: "Q4 Product Review",
    preview: "The quarterly product review highlighted several areas for improvement in our current workflow…",
    suggestedTags: [
      { label: "#product", accepted: true },
      { label: "#Q4", accepted: true },
      { label: "#review", accepted: null },
      { label: "#engineering", accepted: null },
    ],
    confirmedTags: ["#strategy"],
  },
  {
    title: "Team Meeting — Oct 8",
    preview: "Discussed the new on-call rotation. Alice will lead incident response until end of quarter…",
    suggestedTags: [
      { label: "#meeting", accepted: true },
      { label: "#oncall", accepted: null },
      { label: "#Q4", accepted: true },
    ],
    confirmedTags: ["#engineering"],
  },
  {
    title: "2025 Annual Planning",
    preview: "Revenue targets for next year have been set at a 35% growth rate, driven primarily by APAC expansion…",
    suggestedTags: [
      { label: "#planning", accepted: true },
      { label: "#revenue", accepted: null },
      { label: "#2025", accepted: null },
      { label: "#leadership", accepted: null },
    ],
    confirmedTags: [],
  },
];

const tagGroups = [
  { tag: "#product", count: 4 },
  { tag: "#meeting", count: 7 },
  { tag: "#Q4", count: 5 },
  { tag: "#engineering", count: 3 },
  { tag: "#planning", count: 2 },
  { tag: "#strategy", count: 2 },
];

const AutoTaggingPage = () => {
  return (
    <div className="min-h-full dark:bg-[#1F1F1F] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/ai-mockups" className="hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> AI Features
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Auto-Tagging</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tag sidebar */}
          <div className="lg:col-span-1">
            <div className="border rounded-xl overflow-hidden dark:bg-[#2F2F2F] bg-white">
              <div className="border-b px-4 py-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-pink-500" />
                <span className="font-semibold text-sm">Browse by Tag</span>
              </div>
              <div className="p-3 space-y-1">
                {tagGroups.map((tg, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-secondary/70 transition-colors ${
                      i === 0 ? "bg-secondary" : ""
                    }`}
                  >
                    <span className="text-xs font-medium">{tg.tag}</span>
                    <span className="text-xs text-muted-foreground">{tg.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Document cards */}
          <div className="lg:col-span-3 space-y-4">
            {documents.map((doc, i) => (
              <div
                key={i}
                className="border rounded-xl overflow-hidden dark:bg-[#2F2F2F] bg-white"
              >
                <div className="px-5 py-4">
                  {/* Title row */}
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-semibold text-sm">{doc.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 leading-5 line-clamp-2">
                    {doc.preview}
                  </p>

                  {/* Confirmed tags */}
                  {doc.confirmedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {doc.confirmedTags.map((t, j) => (
                        <span
                          key={j}
                          className="text-xs bg-secondary rounded-full px-2.5 py-0.5 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* AI suggested tags row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                      AI suggests:
                    </div>
                    {doc.suggestedTags.map((tag, j) => (
                      <div
                        key={j}
                        className={`inline-flex items-center gap-1.5 text-xs rounded-full border px-2.5 py-1 font-medium ${
                          tag.accepted === true
                            ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
                            : tag.accepted === false
                            ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-400 line-through opacity-50"
                            : "bg-secondary border-border text-foreground"
                        }`}
                      >
                        {tag.label}
                        {tag.accepted === null && (
                          <>
                            <button className="text-green-600 hover:text-green-700">
                              <Check className="h-3 w-3" />
                            </button>
                            <button className="text-red-400 hover:text-red-500">
                              <X className="h-3 w-3" />
                            </button>
                          </>
                        )}
                        {tag.accepted === true && <Check className="h-3 w-3" />}
                        {tag.accepted === false && <X className="h-3 w-3" />}
                      </div>
                    ))}
                    <Button size="sm" variant="ghost" className="h-6 text-xs ml-auto">
                      Accept all
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Mockup only — the AI suggests tags per document; users can accept ✓ or reject ✗ each suggestion individually.
        </p>
      </div>
    </div>
  );
};

export default AutoTaggingPage;
