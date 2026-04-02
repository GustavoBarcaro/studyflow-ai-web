import { CheckCircle2, Circle, CircleOff, Sparkles } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SurfaceCard } from "@/shared/components/common/surface/card";
import type { QuizDifficulty, QuizQuestion } from "@/shared/types/domain";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  quiz: QuizQuestion[];
  difficulty: QuizDifficulty;
  onSubmitResult?: (result: {
    correctCount: number;
    total: number;
    percentage: number;
  }) => void;
}

export function QuizCard({ quiz, difficulty, onSubmitResult }: QuizCardProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const answeredCount = Object.keys(answers).length;
  const correctCount = quiz.reduce((total, question, index) => {
    const key = `${question.question}-${index}`;
    return total + (answers[key] === question.correctOptionId ? 1 : 0);
  }, 0);
  const percentage =
    quiz.length === 0 ? 0 : Math.round((correctCount / quiz.length) * 100);

  return (
    <SurfaceCard>
      <CardHeader className="space-y-3">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-extrabold sm:text-2xl">
              Quiz
            </CardTitle>
            <CardDescription>
              Answer the questions, then review the explanations at the end.
            </CardDescription>
          </div>
          <Badge className="capitalize">{difficulty}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          {answeredCount} of {quiz.length} answered
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {submitted && (
          <div
            className={cn(
              "rounded-xl border p-4",
              percentage >= 70
                ? "border-emerald-200 bg-emerald-50"
                : "border-amber-200 bg-amber-50",
            )}
          >
            <p className="text-sm font-semibold">
              Score: {correctCount}/{quiz.length} correct
            </p>
            <p
              className={cn(
                "mt-1 text-sm",
                percentage >= 70 ? "text-emerald-700" : "text-amber-700",
              )}
            >
              {percentage}%{" "}
              {percentage >= 70
                ? "You passed."
                : "You need at least 70% to pass."}
            </p>
          </div>
        )}
        {quiz.map((question, index) =>
          (() => {
            const key = `${question.question}-${index}`;
            const selectedOptionId = answers[key];
            const isAnswered = Boolean(selectedOptionId);
            const selectedOption = question.options.find(
              (option) => option.id === selectedOptionId,
            );
            const correctOption = question.options.find(
              (option) => option.id === question.correctOptionId,
            );
            const answeredCorrectly =
              submitted && selectedOptionId === question.correctOptionId;
            const answeredIncorrectly =
              submitted &&
              isAnswered &&
              selectedOptionId !== question.correctOptionId;

            return (
              <div
                key={key}
                className={cn(
                  "space-y-4 rounded-xl border bg-card p-4 transition-all sm:p-5",
                  isAnswered &&
                    !submitted &&
                    "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-md",
                  submitted && "border-border",
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">
                      Question {index + 1}
                    </p>
                    <h3 className="text-lg font-semibold">
                      {question.question}
                    </h3>
                  </div>
                  <Badge
                    variant={isAnswered ? "default" : "outline"}
                    className="self-start"
                  >
                    {isAnswered ? "Selected" : "Pending"}
                  </Badge>
                </div>
                <Separator />
                <div className="grid gap-3">
                  {question.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    const isCorrect =
                      submitted && question.correctOptionId === option.id;
                    const isIncorrect =
                      submitted &&
                      isSelected &&
                      question.correctOptionId !== option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={cn(
                          "flex flex-col gap-3 rounded-xl border bg-background px-4 py-3 text-left text-sm transition-all sm:flex-row sm:items-start sm:justify-between",
                          "hover:border-primary/40 hover:bg-accent/40",
                          isSelected &&
                            "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-sm",
                          isCorrect &&
                            "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200",
                          isIncorrect &&
                            "border-red-400 bg-red-50 ring-2 ring-red-200",
                        )}
                        onClick={() =>
                          setAnswers((current) => ({
                            ...current,
                            [key]: option.id,
                          }))
                        }
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <div
                            className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-muted text-muted-foreground",
                              isCorrect &&
                                "border-emerald-500 bg-emerald-500 text-white",
                              isIncorrect &&
                                "border-red-400 bg-red-400 text-white",
                            )}
                          >
                            {option.id}
                          </div>
                          <span className="min-w-0 pt-0.5 leading-6">
                            {option.text}
                          </span>
                        </div>
                        <div className="self-end pt-0.5 sm:self-start">
                          {isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : isIncorrect ? (
                            <CircleOff className="h-5 w-5 text-red-500" />
                          ) : isSelected ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {submitted && (
                  <div
                    className={cn(
                      "rounded-xl border p-4",
                      answeredCorrectly && "border-emerald-200 bg-emerald-50",
                      answeredIncorrectly && "border-red-200 bg-red-50",
                      !isAnswered && "border-border bg-muted/40",
                    )}
                  >
                    <p
                      className={cn(
                        "mb-3 text-xs font-semibold uppercase tracking-wide",
                        answeredCorrectly && "text-emerald-700",
                        answeredIncorrectly && "text-red-700",
                        !isAnswered && "text-muted-foreground",
                      )}
                    >
                      {answeredCorrectly
                        ? "Correct answer"
                        : answeredIncorrectly
                          ? "Incorrect answer"
                          : "Not answered"}
                    </p>

                    {selectedOption && (
                      <p
                        className={cn(
                          "text-sm leading-6",
                          answeredIncorrectly
                            ? "text-red-700"
                            : "text-muted-foreground",
                        )}
                      >
                        <span className="font-semibold">Your answer:</span>{" "}
                        {selectedOption.id}. {selectedOption.text}
                      </p>
                    )}

                    {correctOption && (
                      <p className="mt-2 text-sm leading-6 text-emerald-700">
                        <span className="font-semibold">Correct option:</span>{" "}
                        {correctOption.id}. {correctOption.text}
                      </p>
                    )}

                    <p className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Explanation
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })(),
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            You can change your answers before checking the results.
          </p>
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              setSubmitted(true);
              onSubmitResult?.({
                correctCount,
                total: quiz.length,
                percentage,
              });
            }}
            disabled={answeredCount === 0}
          >
            Check answers
          </Button>
        </div>
      </CardContent>
    </SurfaceCard>
  );
}
