import { CheckCircle2, Circle, CircleOff, Sparkles } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import type { QuizDifficulty, QuizQuestion } from "@/shared/types/domain";
import { cn } from "@/shared/lib/utils";

type QuizCardProps = {
  quiz: QuizQuestion[];
  difficulty: QuizDifficulty;
};

export function QuizCard({ quiz, difficulty }: QuizCardProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const answeredCount = Object.keys(answers).length;

  return (
    <Card className="border-border/70 bg-background/95 shadow-md">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold">Session quiz</CardTitle>
            <CardDescription>Answer first, then review the explanation for each question.</CardDescription>
          </div>
          <Badge className="capitalize">{difficulty}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          {answeredCount} of {quiz.length} answered
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {quiz.map((question, index) => (
          (() => {
            const key = `${question.question}-${index}`;
            const selectedOptionId = answers[key];
            const isAnswered = Boolean(selectedOptionId);

            return (
              <div
                key={key}
                className={cn(
                  "space-y-4 rounded-xl border bg-card p-5 transition-all",
                  isAnswered && !submitted && "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-md",
                  submitted && "border-border",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Question {index + 1}</p>
                    <h3 className="text-lg font-semibold">{question.question}</h3>
                  </div>
                  <Badge variant={isAnswered ? "default" : "outline"}>{isAnswered ? "Selected" : "Pending"}</Badge>
                </div>
                <Separator />
                <div className="grid gap-3">
                  {question.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    const isCorrect = submitted && question.correctOptionId === option.id;
                    const isIncorrect = submitted && isSelected && question.correctOptionId !== option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={cn(
                          "flex items-start justify-between gap-4 rounded-xl border bg-background px-4 py-3 text-left text-sm transition-all",
                          "hover:border-primary/40 hover:bg-accent/40",
                          isSelected && "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-sm",
                          isCorrect && "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200",
                          isIncorrect && "border-red-400 bg-red-50 ring-2 ring-red-200",
                        )}
                        onClick={() => setAnswers((current) => ({ ...current, [key]: option.id }))}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold",
                              isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground",
                              isCorrect && "border-emerald-500 bg-emerald-500 text-white",
                              isIncorrect && "border-red-400 bg-red-400 text-white",
                            )}
                          >
                            {option.id}
                          </div>
                          <span className="pt-0.5 leading-6">{option.text}</span>
                        </div>
                        <div className="pt-0.5">
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
                  <div className="rounded-xl border bg-muted/40 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Explanation</p>
                    <p className="text-sm leading-6 text-muted-foreground">{question.explanation}</p>
                  </div>
                )}
              </div>
            );
          })()
        ))}
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Selected answers stay visibly highlighted before you submit.</p>
          <Button onClick={() => setSubmitted(true)} disabled={answeredCount === 0}>
            Check answers
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
