import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";

import { QuizCard } from "@/features/quizzes/card";
import { InlineError } from "@/shared/components/common/inline-error";
import { PageLoading } from "@/shared/components/common/page/loading";
import { PageHeader } from "@/shared/components/common/page/header";
import { api } from "@/shared/lib/api";

export function QuizPage() {
  const { sessionId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const difficulty = (searchParams.get("difficulty") ?? "medium") as
    | "easy"
    | "medium"
    | "hard";
  const questions = Number(searchParams.get("questions") ?? "3");
  const {
    data: session,
    isPending: isSessionPending,
    error: sessionError,
  } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => api.getSession(sessionId),
  });
  const {
    data: quiz,
    isPending: isQuizPending,
    error: quizError,
  } = useQuery({
    queryKey: ["quiz-page", sessionId, difficulty, questions],
    queryFn: () =>
      api.generateQuiz(sessionId, {
        difficulty,
        questions,
      }),
  });

  if (isSessionPending || isQuizPending) {
    return <PageLoading titleWidth="w-60" lines={1} />;
  }

  if (sessionError || quizError) {
    return <InlineError message={(sessionError ?? quizError)?.message} />;
  }

  if (!quiz) {
    return <p>Quiz not found.</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        backLink={{ to: `/sessions/${sessionId}`, label: "Back to session" }}
        title="Session quiz"
        titleClassName="text-3xl sm:text-4xl"
        description={
          <p className="max-w-2xl">
            This quiz is based on your current session
            {session ? ` in ${session.topic.name}` : ""}.
          </p>
        }
      />
      <QuizCard quiz={quiz.quiz} difficulty={difficulty} />
    </div>
  );
}
