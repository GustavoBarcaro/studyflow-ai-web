import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { InlineError } from "@/shared/components/common/inline-error";
import { MarkdownContent } from "@/shared/components/common/markdown/content";

import { StudyToolCard } from "../tool";

interface StudyToolsSummaryCardProps {
  summary?: string;
  isPending: boolean;
  errorMessage?: string;
  onCopy: () => Promise<void> | void;
}

export function StudyToolsSummaryCard({
  summary,
  isPending,
  errorMessage,
  onCopy,
}: StudyToolsSummaryCardProps) {
  return (
    <StudyToolCard title="Summary">
      <div className="rounded-2xl bg-muted/50 p-3 text-sm leading-6">
        {isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-9/12" />
          </div>
        ) : summary ? (
          <MarkdownContent content={summary} />
        ) : (
          "Create a short summary when you want a quick review of this session."
        )}
      </div>
      <InlineError message={errorMessage} />
      <Button
        variant="outline"
        className="w-full"
        disabled={!summary}
        onClick={onCopy}
      >
        <Copy className="h-4 w-4" />
        Copy summary
      </Button>
    </StudyToolCard>
  );
}
