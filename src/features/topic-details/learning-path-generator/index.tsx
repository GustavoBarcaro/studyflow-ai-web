import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { InlineError } from "@/shared/components/common/inline-error";
import { SurfaceCard } from "@/shared/components/common/surface/card";
import type { StudySession } from "@/shared/types/domain";

import { LearningPathInputSummary } from "../learning-path-input/summary";
import { SessionContextSelector } from "../session-context/selector";

interface LearningPathGeneratorCardProps {
  topicName: string;
  sessions: StudySession[];
  goal: string;
  selectedSessionId: string;
  isPending: boolean;
  errorMessage?: string;
  onGoalChange: (value: string) => void;
  onSessionChange: (sessionId: string) => void;
  onGenerate: () => void;
}

export function LearningPathGeneratorCard({
  topicName,
  sessions,
  goal,
  selectedSessionId,
  isPending,
  errorMessage,
  onGoalChange,
  onSessionChange,
  onGenerate,
}: LearningPathGeneratorCardProps) {
  return (
    <SurfaceCard>
      <CardHeader className="space-y-4 rounded-t-xl bg-muted/20 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1 rounded-md px-2 py-1">
                <Sparkles className="h-3.5 w-3.5" />
                AI generated
              </Badge>
              <Badge variant="outline" className="rounded-md px-2 py-1">
                4-6 steps
              </Badge>
            </div>
            <CardTitle>Create a learning path</CardTitle>
          </div>
          <div className="rounded-lg border bg-background px-3 py-2 text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Uses
            </p>
            <p className="text-sm font-semibold">
              Topic, sessions, and your goal
            </p>
          </div>
        </div>
        <CardDescription>
          Generate a step-by-step plan to help you study this topic with a clear next step.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        <LearningPathInputSummary
          topicName={topicName}
          hasGoal={Boolean(goal.trim())}
          hasSelectedSession={Boolean(selectedSessionId)}
        />

        <div className="space-y-2">
          <Label htmlFor="learning-path-goal">Goal</Label>
          <Textarea
            id="learning-path-goal"
            value={goal}
            onChange={(event) => onGoalChange(event.target.value)}
            placeholder="Example: understand closures well enough to use them confidently in callbacks and hooks"
            className="min-h-28 resize-none rounded-2xl border-border/80 bg-background px-4 py-3 text-sm leading-6 shadow-sm focus-visible:ring-1"
          />
          <p className="text-xs text-muted-foreground">
            Describe what you want to learn or be able to do.
          </p>
        </div>

        <SessionContextSelector
          sessions={sessions}
          selectedSessionId={selectedSessionId}
          onChange={onSessionChange}
        />
      </CardContent>

      <CardFooter className="flex flex-col items-stretch gap-3 pt-0">
        <Separator className="mb-1" />
        <Button className="w-full" disabled={isPending} onClick={onGenerate}>
          {isPending ? "Generating learning path..." : "Generate learning path"}
        </Button>
        <InlineError message={errorMessage} />
        <p className="text-sm text-muted-foreground">
          Pick a session if you want the learning path to use that context too.
        </p>
      </CardFooter>
    </SurfaceCard>
  );
}
