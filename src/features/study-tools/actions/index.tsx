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
      description="Keep the learning flow tight: summarize, simplify, and test understanding."
      headerAction={<Badge>Session actions</Badge>}
    >
      <Button
        className="w-full justify-start"
        variant="secondary"
        disabled={isSummaryPending}
        onClick={onSummarize}
      >
        <ListChecks className="h-4 w-4" />
        {isSummaryPending ? "Generating summary..." : "Summarize session"}
      </Button>
      <Button
        className="w-full justify-start"
        variant="secondary"
        disabled={isExplainPending}
        onClick={onExplainAgain}
      >
        <HelpCircle className="h-4 w-4" />
        {isExplainPending ? "Reframing explanation..." : "Explain again"}
      </Button>
      <Button className="w-full justify-start" asChild>
        <Link
          to={`/quizzes/${sessionId}?difficulty=${quizDifficulty}&questions=${questions}`}
        >
          <Sparkles className="h-4 w-4" />
          Generate quiz
        </Link>
      </Button>
    </StudyToolCard>
  );
}
