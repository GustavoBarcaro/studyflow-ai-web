import { MarkdownContent } from "@/shared/components/common/markdown-content";
import { Copy, HelpCircle, ListChecks, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

import { api } from "@/shared/lib/api";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { QuizDifficulty, StudyLevel } from "@/shared/types/domain";

type StudyToolsPanelProps = {
  sessionId: string;
};

export function StudyToolsPanel({ sessionId }: StudyToolsPanelProps) {
  const [focus, setFocus] = useState("");
  const [level, setLevel] = useState<StudyLevel>("beginner");
  const [quizDifficulty, setQuizDifficulty] = useState<QuizDifficulty>("medium");
  const [questions, setQuestions] = useState(3);

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
      <Card className="border-border/70 bg-background/95">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Study tools
            </CardTitle>
            <Badge>Session actions</Badge>
          </div>
          <CardDescription>Keep the learning flow tight: summarize, simplify, and test understanding.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full justify-start"
            variant="secondary"
            disabled={summaryMutation.isPending}
            onClick={() => summaryMutation.mutate()}
          >
            <ListChecks className="h-4 w-4" />
            {summaryMutation.isPending ? "Generating summary..." : "Summarize session"}
          </Button>
          <Button
            className="w-full justify-start"
            variant="secondary"
            disabled={explainMutation.isPending}
            onClick={() => explainMutation.mutate()}
          >
            <HelpCircle className="h-4 w-4" />
            {explainMutation.isPending ? "Reframing explanation..." : "Explain again"}
          </Button>
          <Button className="w-full justify-start" asChild>
            <Link to={`/quizzes/${sessionId}?difficulty=${quizDifficulty}&questions=${questions}`}>
              <Sparkles className="h-4 w-4" />
              Generate quiz
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-background/95">
        <CardHeader className="pb-3">
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-2xl bg-muted/50 p-3 text-sm leading-6">
            {summaryMutation.isPending ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-9/12" />
              </div>
            ) : summaryMutation.data?.summary ? (
              <MarkdownContent content={summaryMutation.data.summary} />
            ) : (
              "Generate a concise summary of the session when you want a quick review artifact."
            )}
          </div>
          {summaryMutation.error && <p className="text-sm text-red-600">{summaryMutation.error.message}</p>}
          <Button
            variant="outline"
            className="w-full"
            disabled={!summaryMutation.data?.summary}
            onClick={async () => {
              if (!summaryMutation.data?.summary) return;
              await navigator.clipboard.writeText(summaryMutation.data.summary);
            }}
          >
            <Copy className="h-4 w-4" />
            Copy summary
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-background/95">
        <CardHeader className="pb-3">
          <CardTitle>Explain again</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="focus">Focus area</Label>
            <Input id="focus" value={focus} onChange={(event) => setFocus(event.target.value)} placeholder="Focus on one confusing part" />
          </div>
          <div className="space-y-2">
            <Label>Study level</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant={level === "beginner" ? "default" : "outline"} onClick={() => setLevel("beginner")}>
                Beginner
              </Button>
              <Button
                variant={level === "intermediate" ? "default" : "outline"}
                onClick={() => setLevel("intermediate")}
              >
                Intermediate
              </Button>
            </div>
          </div>
          <Separator />
          <div className="rounded-2xl bg-muted/50 p-3 text-sm leading-6 text-muted-foreground">
            {explainMutation.isPending ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-10/12" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-8/12" />
                <Skeleton className="h-4 w-9/12" />
              </div>
            ) : explainMutation.data?.explanation ? (
              <MarkdownContent content={explainMutation.data.explanation} />
            ) : (
              "Request a fresh explanation tuned to a specific focus area and study level."
            )}
          </div>
          {explainMutation.error && <p className="text-sm text-red-600">{explainMutation.error.message}</p>}
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-background/95">
        <CardHeader className="pb-3">
          <CardTitle>Quiz settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={quizDifficulty === "easy" ? "default" : "outline"}
                onClick={() => setQuizDifficulty("easy")}
              >
                Easy
              </Button>
              <Button
                variant={quizDifficulty === "medium" ? "default" : "outline"}
                onClick={() => setQuizDifficulty("medium")}
              >
                Medium
              </Button>
              <Button
                variant={quizDifficulty === "hard" ? "default" : "outline"}
                onClick={() => setQuizDifficulty("hard")}
              >
                Hard
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="question-count">Questions</Label>
            <Input
              id="question-count"
              type="number"
              min={1}
              max={10}
              value={questions}
              onChange={(event) => setQuestions(Number(event.target.value) || 1)}
            />
          </div>
          <p className="text-sm text-muted-foreground">The quiz page generates on demand from the current session context.</p>
        </CardContent>
      </Card>
    </div>
  );
}
