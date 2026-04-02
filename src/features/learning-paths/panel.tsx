import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SurfaceCard } from "@/shared/components/common/surface/card";
import type {
  LearningPath,
  LearningPathStep,
  Topic,
} from "@/shared/types/domain";
import { cn } from "@/lib/utils";

interface LearningPathPanelProps {
  topic: Topic;
  learningPath?: LearningPath | null;
  isLoading?: boolean;
  creatingSessionStepId?: string | null;
  getExistingSessionId?: (step: LearningPathStep) => string | null;
  getTestQuizHref?: (step: LearningPathStep) => string;
  onCreateSession: (step: LearningPathStep) => void;
}

export function LearningPathPanel({
  topic,
  learningPath,
  isLoading = false,
  creatingSessionStepId = null,
  getExistingSessionId,
  getTestQuizHref,
  onCreateSession,
}: LearningPathPanelProps) {
  if (isLoading) {
    return (
      <SurfaceCard>
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
      </SurfaceCard>
    );
  }

  if (!learningPath) {
    return (
      <SurfaceCard>
        <CardHeader>
          <CardTitle>Learning path</CardTitle>
          <CardDescription>
            No learning path is available for this topic yet.
          </CardDescription>
        </CardHeader>
      </SurfaceCard>
    );
  }

  const completedSteps = learningPath.steps.filter(
    (step) => step.completed,
  ).length;
  const totalSteps = learningPath.steps.length;
  const progress =
    totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

  return (
    <SurfaceCard>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-3xl font-extrabold">
              {topic.name}
            </CardTitle>
            <CardDescription>{learningPath.description}</CardDescription>
          </div>
          <Badge variant={progress === 100 ? "default" : "secondary"}>
            {progress}%
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Your progress</span>
            <span>
              {completedSteps}/{totalSteps} steps completed
            </span>
          </div>
          <Progress value={progress} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {learningPath.steps.map((step, index) => {
          const existingSessionId = getExistingSessionId?.(step) ?? null;

          return (
            <div
              key={step.id}
              className={cn(
                "rounded-xl border p-4 transition-colors",
                step.completed
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-border bg-card",
              )}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={cn(
                      "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm",
                      step.completed
                        ? "border-emerald-200 text-emerald-700"
                        : "border-border/80 text-muted-foreground",
                    )}
                  >
                    {step.completed ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                    ) : (
                      <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/55" />
                    )}
                  </div>
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Step {index + 1}
                      </p>
                      {step.completed && (
                        <Badge
                          variant="secondary"
                          className="rounded-md border border-emerald-200 bg-emerald-100 px-2.5 py-0.5 text-emerald-700 hover:bg-emerald-100"
                        >
                          Passed quiz
                        </Badge>
                      )}
                    </div>
                    <p className="text-base font-semibold leading-6">
                      {step.title}
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:min-w-[190px] lg:flex-col lg:items-end">
                  {step.completed ? (
                    <div className="flex w-full items-center gap-3 rounded-xl border border-emerald-200 bg-background px-3 py-2 shadow-sm sm:w-auto">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                      </div>
                      <div className="text-left lg:text-right">
                        <p className="text-sm font-semibold text-emerald-800">
                          Completed
                        </p>
                        <p className="text-xs text-emerald-700/80">
                          Passed 10-question test
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:flex-col">
                      <Button
                        variant="outline"
                        disabled={creatingSessionStepId !== null}
                        onClick={() => onCreateSession(step)}
                        className="justify-between sm:flex-1 lg:w-full"
                      >
                        {creatingSessionStepId === step.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating session...
                          </>
                        ) : (
                          <>
                            {existingSessionId
                              ? "Open session"
                              : "Start session"}
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                      <Link
                        to={getTestQuizHref?.(step) ?? "#"}
                        className={cn(
                          buttonVariants({ variant: "default" }),
                          "justify-between sm:flex-1 lg:w-full",
                        )}
                      >
                        Test yourself
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <Separator />
        <p className="text-sm text-muted-foreground">
          Complete each step by passing the 10-question quiz with at least 70%.
        </p>
      </CardContent>
    </SurfaceCard>
  );
}
