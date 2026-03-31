import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { QuizCard } from "@/features/quizzes/quiz-card";
import { PageLoading } from "@/shared/components/common/page-loading";
import { Button } from "@/shared/components/ui/button";
import { api } from "@/shared/lib/api";

export function QuizPage() {
  const { sessionId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const difficulty = (searchParams.get("difficulty") ?? "medium") as "easy" | "medium" | "hard";
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
    return <p className="text-sm text-red-600">{(sessionError ?? quizError)?.message}</p>;
  }

  if (!quiz) {
    return <p>Quiz not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Button asChild variant="ghost" className="px-0">
          <Link to={`/sessions/${sessionId}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to session
          </Link>
        </Button>
        <h1 className="text-4xl font-extrabold">Quiz flow</h1>
        <p className="max-w-2xl text-muted-foreground">
          The quiz is generated live from the session context{session ? ` in ${session.topic.name}` : ""}, not bolted on as a separate tool.
        </p>
      </div>
      <QuizCard quiz={quiz.quiz} difficulty={difficulty} />
    </div>
  );
}
