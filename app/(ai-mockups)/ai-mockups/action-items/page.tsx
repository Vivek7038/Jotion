import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckSquare, Square, Download, User, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

const meetingNotes = [
  {
    id: 1,
    text: "Alice will update the onboarding documentation by end of next week.",
    highlighted: true,
  },
  {
    id: 2,
    text: "The team discussed current deployment bottlenecks and agreed that the staging environment needs to be brought to parity with production.",
    highlighted: false,
  },
  {
    id: 3,
    text: "Bob will schedule a follow-up session with the infrastructure team to review the rollback procedures before Thursday.",
    highlighted: true,
  },
  {
    id: 4,
    text: "Everyone agreed that the current sprint velocity has been good, but capacity planning for Q1 needs to be revisited given the new hiring plan.",
    highlighted: false,
  },
  {
    id: 5,
    text: "Carol is responsible for presenting the updated budget proposal to leadership by December 15th.",
    highlighted: true,
  },
  {
    id: 6,
    text: "The team will adopt the new code review guidelines starting from the next sprint.",
    highlighted: false,
  },
];

const actionItems = [
  {
    task: "Update onboarding documentation",
    assignee: "Alice",
    due: "Nov 15",
    sourceId: 1,
    done: false,
  },
  {
    task: "Schedule infrastructure review for rollback procedures",
    assignee: "Bob",
    due: "Nov 9",
    sourceId: 3,
    done: false,
  },
  {
    task: "Present updated budget proposal to leadership",
    assignee: "Carol",
    due: "Dec 15",
    sourceId: 5,
    done: true,
  },
];

const ActionItemsPage = () => {
  return (
    <div className="min-h-full dark:bg-[#1F1F1F] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/ai-mockups" className="hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> AI Features
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Action Item Extractor</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Meeting notes */}
          <div className="border rounded-xl overflow-hidden dark:bg-[#2F2F2F] bg-white">
            <div className="border-b px-5 py-3 flex items-center gap-2">
              <span className="font-semibold text-sm">Team Meeting — Nov 8</span>
              <span className="ml-auto text-xs text-muted-foreground">Meeting notes</span>
            </div>
            <div className="p-5 space-y-3">
              {meetingNotes.map((note) => (
                <p
                  key={note.id}
                  className={`text-sm leading-6 rounded px-2 py-1 ${
                    note.highlighted
                      ? "bg-teal-100 dark:bg-teal-900/30 border-l-2 border-teal-500"
                      : ""
                  }`}
                >
                  {note.highlighted && (
                    <span className="text-xs text-teal-600 dark:text-teal-400 font-medium mr-1.5">
                      #{actionItems.findIndex((a) => a.sourceId === note.id) + 1}
                    </span>
                  )}
                  {note.text}
                </p>
              ))}
            </div>
          </div>

          {/* Extracted action items */}
          <div className="border rounded-xl overflow-hidden dark:bg-[#2F2F2F] bg-white">
            <div className="border-b px-5 py-3 flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-teal-500" />
              <span className="font-semibold text-sm">Extracted Action Items</span>
              <span className="ml-auto text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full px-2 py-0.5">
                {actionItems.length} found
              </span>
            </div>
            <div className="divide-y">
              {actionItems.map((item, i) => (
                <div key={i} className="px-5 py-4 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-start gap-3">
                    {item.done ? (
                      <CheckSquare className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Square className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium mb-2 ${item.done ? "line-through text-muted-foreground" : ""}`}>
                        {item.task}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-xs bg-secondary rounded-full px-2.5 py-0.5">
                          <User className="h-3 w-3" /> {item.assignee}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs bg-secondary rounded-full px-2.5 py-0.5">
                          <Calendar className="h-3 w-3" /> Due {item.due}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <ChevronRight className="h-3 w-3" /> Source #{item.sourceId}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t">
              <Button size="sm" className="w-full gap-2 text-xs">
                <Download className="h-3.5 w-3.5" /> Export to Tasks
              </Button>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Mockup only — highlighted sentences in the notes correspond to the extracted action items. The "Export to Tasks" button would create Jotion task documents.
        </p>
      </div>
    </div>
  );
};

export default ActionItemsPage;
