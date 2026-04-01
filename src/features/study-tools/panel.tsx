import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { api } from "@/shared/lib/api";
import type { QuizDifficulty, StudyLevel } from "@/shared/types/domain";

import { StudyToolsActionsCard } from "./actions";
import { StudyToolsExplainCard } from "./explain";
import { StudyToolsQuizSettingsCard } from "./quiz-settings";
import { StudyToolsSummaryCard } from "./summary";

interface StudyToolsPanelProps {
  sessionId: string;
  quizDifficulty: QuizDifficulty;
  questions: number;
  onQuizDifficultyChange: (difficulty: QuizDifficulty) => void;
  onQuestionsChange: (questions: number) => void;
}

export function StudyToolsPanel({
  sessionId,
  quizDifficulty,
  questions,
  onQuizDifficultyChange,
  onQuestionsChange,
}: StudyToolsPanelProps) {
  const [focus, setFocus] = useState("");
  const [level, setLevel] = useState<StudyLevel>("beginner");

  const summaryMutation = useMutation({
    mutationFn: () => api.summarizeSession(sessionId),
  });
  const explainMutation = useMutation({
    mutationFn: () =>
      api.explainAgain(sessionId, {
        focus: focus || undefined,
        level,
      }),
  });

  return (
    <div id="study-tools-panel" className="space-y-4">
      <StudyToolsActionsCard
        sessionId={sessionId}
        quizDifficulty={quizDifficulty}
        questions={questions}
        isSummaryPending={summaryMutation.isPending}
        isExplainPending={explainMutation.isPending}
        onSummarize={() => summaryMutation.mutate()}
        onExplainAgain={() => explainMutation.mutate()}
      />

      <StudyToolsSummaryCard
        summary={summaryMutation.data?.summary}
        isPending={summaryMutation.isPending}
        errorMessage={summaryMutation.error?.message}
        onCopy={async () => {
          if (!summaryMutation.data?.summary) return;
          await navigator.clipboard.writeText(summaryMutation.data.summary);
        }}
      />

      <StudyToolsExplainCard
        focus={focus}
        level={level}
        explanation={explainMutation.data?.explanation}
        isPending={explainMutation.isPending}
        errorMessage={explainMutation.error?.message}
        onFocusChange={setFocus}
        onLevelChange={setLevel}
      />

      <StudyToolsQuizSettingsCard
        quizDifficulty={quizDifficulty}
        questions={questions}
        onQuizDifficultyChange={onQuizDifficultyChange}
        onQuestionsChange={onQuestionsChange}
      />
    </div>
  );
}
