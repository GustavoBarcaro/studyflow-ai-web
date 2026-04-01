import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { InlineError } from "@/shared/components/common/inline-error";
import { MarkdownContent } from "@/shared/components/common/markdown/content";
import type { StudyLevel } from "@/shared/types/domain";

import { StudyToolCard } from "../tool";

interface StudyToolsExplainCardProps {
  focus: string;
  level: StudyLevel;
  explanation?: string;
  isPending: boolean;
  errorMessage?: string;
  onFocusChange: (value: string) => void;
  onLevelChange: (level: StudyLevel) => void;
}

export function StudyToolsExplainCard({
  focus,
  level,
  explanation,
  isPending,
  errorMessage,
  onFocusChange,
  onLevelChange,
}: StudyToolsExplainCardProps) {
  return (
    <StudyToolCard title="Explain again">
      <div className="space-y-2">
        <Label htmlFor="focus">Focus area</Label>
        <Input
          id="focus"
          value={focus}
          onChange={(event) => onFocusChange(event.target.value)}
          placeholder="Focus on one confusing part"
        />
      </div>
      <div className="space-y-2">
        <Label>Study level</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={level === "beginner" ? "default" : "outline"}
            onClick={() => onLevelChange("beginner")}
          >
            Beginner
          </Button>
          <Button
            variant={level === "intermediate" ? "default" : "outline"}
            onClick={() => onLevelChange("intermediate")}
          >
            Intermediate
          </Button>
        </div>
      </div>
      <Separator />
      <div className="rounded-2xl bg-muted/50 p-3 text-sm leading-6 text-muted-foreground">
        {isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-8/12" />
            <Skeleton className="h-4 w-9/12" />
          </div>
        ) : explanation ? (
          <MarkdownContent content={explanation} />
        ) : (
          "Request a fresh explanation tuned to a specific focus area and study level."
        )}
      </div>
      <InlineError message={errorMessage} />
    </StudyToolCard>
  );
}
