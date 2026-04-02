import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { QuizCard } from "@/features/quizzes/card";
import { InlineError } from "@/shared/components/common/inline-error";
import { PageLoading } from "@/shared/components/common/page/loading";
import { PageHeader } from "@/shared/components/common/page/header";
import { SurfaceCard } from "@/shared/components/common/surface/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    mutationFn: (learningPathStepId: string) =>
      api.completeLearningPathStep(learningPathStepId),
    onSuccess: async () => {
      if (quizResponse) {
        await queryClient.invalidateQueries({
          queryKey: ["learning-path", quizResponse.learningPath.topicId],
        });
      }
    },
  });

  if (isPending) {
    return <PageLoading titleWidth="w-72" lines={1} />;
  }

  if (error || completeStepMutation.error) {
    return (
      <InlineError message={(error ?? completeStepMutation.error)?.message} />
    );
  }

  if (!quizResponse) {
    return <p>Quiz not found.</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        backLink={{
          to: `/topics/${quizResponse.learningPath.topicId}`,
          label: "Back to topic",
        }}
        title={quizResponse.learningPathStep.title}
        titleClassName="text-3xl sm:text-4xl"
        badges={
          <>
            <Badge variant="secondary">Learning path quiz</Badge>
            <Badge className="capitalize">
              {LEARNING_PATH_QUIZ_DIFFICULTY}
            </Badge>
            <Badge variant="outline">
              {LEARNING_PATH_QUIZ_QUESTIONS} questions
            </Badge>
          </>
        }
        description={
          <div className="space-y-2">
            <p className="max-w-3xl">
              {quizResponse.learningPathStep.description}
            </p>
            <p className="text-sm">
              Score at least {PASS_THRESHOLD}% to complete this learning path step.
            </p>
          </div>
        }
      />

      {completeStepMutation.isSuccess ? (
        <SurfaceCard className="border-emerald-200 bg-emerald-50 shadow-sm">
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              You passed. This step is complete.
            </div>
            <Button
              variant="outline"
              onClick={() =>
                navigate(`/topics/${quizResponse.learningPath.topicId}`)
              }
            >
              Back to learning path
            </Button>
          </div>
        </SurfaceCard>
      ) : null}

      <QuizCard
        quiz={quizResponse.quiz}
        difficulty={LEARNING_PATH_QUIZ_DIFFICULTY}
        onSubmitResult={({ percentage }) => {
          if (
            percentage < PASS_THRESHOLD ||
            completeStepMutation.isPending ||
            completeStepMutation.isSuccess
          ) {
            return;
          }

          completeStepMutation.mutate(quizResponse.learningPathStep.id);
        }}
      />
    </div>
  );
}
