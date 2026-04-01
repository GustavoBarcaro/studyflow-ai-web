import { ArrowRight, CheckCircle2, Circle, Loader2 } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { LearningPath, LearningPathStep, Topic } from "@/shared/types/domain";
import { cn } from "@/shared/lib/utils";

type LearningPathPanelProps = {
  topic: Topic;
  learningPath?: LearningPath | null;
  isLoading?: boolean;
  isUpdatingStep?: boolean;
  creatingSessionStepId?: string | null;
  onToggleStep: (step: LearningPathStep) => void;
  onCreateSession: (step: LearningPathStep) => void;
};

export function LearningPathPanel({
  topic,
  learningPath,
  isLoading = false,
  isUpdatingStep = false,
  creatingSessionStepId = null,
  onToggleStep,
  onCreateSession,
}: LearningPathPanelProps) {
  if (isLoading) {
    return (
      <Card className="border-border/70 bg-background/95 shadow-md">
        <CardHeader className="space-y-4">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-3 w-full" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!learningPath) {
    return (
      <Card className="border-border/70 bg-background/95 shadow-md">
        <CardHeader>
          <CardTitle>Learning path</CardTitle>
          <CardDescription>The app could not load a learning path for this topic yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const completedSteps = learningPath.steps.filter((step) => step.completed).length;
  const totalSteps = learningPath.steps.length;
  const progress = totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

  return (
    <Card className="border-border/70 bg-background/95 shadow-md">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-3xl font-extrabold">{topic.name}</CardTitle>
            <CardDescription>{learningPath.description}</CardDescription>
          </div>
          <Badge variant={progress === 100 ? "default" : "secondary"}>{progress}%</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Trail progress</span>
            <span>
              {completedSteps}/{totalSteps} steps completed
            </span>
          </div>
          <Progress value={progress} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {learningPath.steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "rounded-xl border p-4 transition-colors",
              step.completed ? "border-emerald-200 bg-emerald-50" : "border-border bg-card",
            )}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  {step.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Step {index + 1}</p>
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                {!step.completed && (
                  <Button
                    variant="outline"
                    disabled={creatingSessionStepId !== null}
                    onClick={() => onCreateSession(step)}
                  >
                    {creatingSessionStepId === step.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating session...
                      </>
                    ) : (
                      <>
                        Start session
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
                <Button variant={step.completed ? "outline" : "default"} disabled={isUpdatingStep} onClick={() => onToggleStep(step)}>
                  {isUpdatingStep ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : step.completed ? (
                    "Mark as undone"
                  ) : (
                    "Mark as done"
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
        <Separator />
        <p className="text-sm text-muted-foreground">
          Manual progress for now. Later this can be inferred from sessions, quizzes, or repeated mastery.
        </p>
      </CardContent>
    </Card>
  );
}
