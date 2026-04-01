import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { QuizCard } from "@/features/quizzes/quiz-card";
import { BackLink } from "@/shared/components/common/back-link";
import { PageLoading } from "@/shared/components/common/page-loading";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { api } from "@/shared/lib/api";

const LEARNING_PATH_QUIZ_DIFFICULTY = "hard" as const;
const LEARNING_PATH_QUIZ_QUESTIONS = 10;
const PASS_THRESHOLD = 70;

export function LearningPathQuizPage() {
  const { stepId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: quizResponse,
    isPending,
    error,
  } = useQuery({
    queryKey: ["learning-path-step-quiz", stepId],
    queryFn: () =>
      api.generateLearningPathStepQuiz(stepId, {
        difficulty: LEARNING_PATH_QUIZ_DIFFICULTY,
        questions: LEARNING_PATH_QUIZ_QUESTIONS,
      }),
    enabled: Boolean(stepId),
  });

  const completeStepMutation = useMutation({
    mutationFn: (learningPathStepId: string) => api.completeLearningPathStep(learningPathStepId),
    onSuccess: async () => {
      if (quizResponse) {
        await queryClient.invalidateQueries({ queryKey: ["learning-path", quizResponse.learningPath.topicId] });
      }
    },
  });

  if (isPending) {
    return <PageLoading titleWidth="w-72" lines={1} />;
  }

  if (error || completeStepMutation.error) {
    return <p className="text-sm text-red-600">{(error ?? completeStepMutation.error)?.message}</p>;
  }

  if (!quizResponse) {
    return <p>Quiz not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <BackLink to={`/topics/${quizResponse.learningPath.topicId}`} label="Back to topic" />

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Learning path quiz</Badge>
            <Badge className="capitalize">{LEARNING_PATH_QUIZ_DIFFICULTY}</Badge>
            <Badge variant="outline">{LEARNING_PATH_QUIZ_QUESTIONS} questions</Badge>
          </div>
          <h1 className="text-4xl font-extrabold">{quizResponse.learningPathStep.title}</h1>
          <p className="max-w-3xl text-muted-foreground">{quizResponse.learningPathStep.description}</p>
          <p className="text-sm text-muted-foreground">
            Pass with at least {PASS_THRESHOLD}% to complete this step in your learning path.
          </p>
        </div>

        {completeStepMutation.isSuccess && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              You passed. This step is now completed.
            </div>
            <Button variant="outline" onClick={() => navigate(`/topics/${quizResponse.learningPath.topicId}`)}>
              Return to learning path
            </Button>
          </div>
        )}
      </div>

      <QuizCard
        quiz={quizResponse.quiz}
        difficulty={LEARNING_PATH_QUIZ_DIFFICULTY}
        onSubmitResult={({ percentage }) => {
          if (percentage < PASS_THRESHOLD || completeStepMutation.isPending || completeStepMutation.isSuccess) {
            return;
          }

          completeStepMutation.mutate(quizResponse.learningPathStep.id);
        }}
      />
    </div>
  );
}
