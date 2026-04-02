import { HelpCircle, ListChecks, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { QuizDifficulty } from "@/shared/types/domain";

import { StudyToolCard } from "../tool";

interface StudyToolsActionsCardProps {
  sessionId: string;
  quizDifficulty: QuizDifficulty;
  questions: number;
  isSummaryPending: boolean;
  isExplainPending: boolean;
  onSummarize: () => void;
  onExplainAgain: () => void;
}

export function StudyToolsActionsCard({
  sessionId,
  quizDifficulty,
  questions,
  isSummaryPending,
  isExplainPending,
  onSummarize,
  onExplainAgain,
}: StudyToolsActionsCardProps) {
  return (
    <StudyToolCard
      title="Study tools"
      description="Use these tools to review the session, simplify difficult ideas, or test yourself."
      headerAction={<Badge>Tools</Badge>}
    >
      <Button
        className="w-full justify-start"
        variant="secondary"
        disabled={isSummaryPending}
        onClick={onSummarize}
      >
        <ListChecks className="h-4 w-4" />
        {isSummaryPending ? "Creating summary..." : "Summarize session"}
      </Button>
      <Button
        className="w-full justify-start"
        variant="secondary"
        disabled={isExplainPending}
        onClick={onExplainAgain}
      >
        <HelpCircle className="h-4 w-4" />
        {isExplainPending ? "Explaining again..." : "Explain again"}
      </Button>
      <Button className="w-full justify-start" asChild>
        <Link
          to={`/quizzes/${sessionId}?difficulty=${quizDifficulty}&questions=${questions}`}
        >
          <Sparkles className="h-4 w-4" />
          Open quiz
        </Link>
      </Button>
    </StudyToolCard>
  );
}
