import { BrainCircuit, CheckCircle2, ListChecks } from "lucide-react";

interface LearningPathInputSummaryProps {
  topicName: string;
  hasGoal: boolean;
  hasSelectedSession: boolean;
}

const cards = [
  {
    key: "topic",
    icon: BrainCircuit,
    label: "Topic",
    getTitle: (props: LearningPathInputSummaryProps) => props.topicName,
    description: "This anchors the overall subject area for the trail.",
  },
  {
    key: "session",
    icon: ListChecks,
    label: "Session context",
    getTitle: (props: LearningPathInputSummaryProps) =>
      props.hasSelectedSession ? "Selected session" : "Recent topic context",
    description: "Use one session if you want the path to stay tightly scoped.",
  },
  {
    key: "goal",
    icon: CheckCircle2,
    label: "Outcome",
    getTitle: (props: LearningPathInputSummaryProps) =>
      props.hasGoal ? "Goal provided" : "Goal optional",
    description: "A goal makes the steps more practical and less generic.",
  },
];

export function LearningPathInputSummary(props: LearningPathInputSummaryProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-2 text-muted-foreground">
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{card.label}</span>
            </div>
            <p className="font-semibold">{card.getTitle(props)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
