import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { StudySession } from "@/shared/types/domain";

interface SessionContextSelectorProps {
  sessions: StudySession[];
  selectedSessionId: string;
  onChange: (sessionId: string) => void;
}

interface SessionContextOptionProps {
  title: string;
  description: string;
  badgeLabel: string;
  isSelected: boolean;
  onClick: () => void;
  badgeVariant?: "default" | "outline";
}

function SessionContextOption({
  title,
  description,
  badgeLabel,
  isSelected,
  onClick,
  badgeVariant = "outline",
}: SessionContextOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border p-4 text-left transition-colors",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border bg-card hover:bg-muted/40",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge variant={isSelected ? "default" : badgeVariant}>
          {badgeLabel}
        </Badge>
      </div>
    </button>
  );
}

export function SessionContextSelector({
  sessions,
  selectedSessionId,
  onChange,
}: SessionContextSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label>Base it on a session</Label>
        <p className="text-sm text-muted-foreground">
          Pick one conversation to keep the path tightly focused, or let the
          backend infer from recent topic context.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <SessionContextOption
          title="Use recent topic context"
          description="Let the API infer context from the topic and your recent study history."
          badgeLabel="Default"
          badgeVariant="outline"
          isSelected={selectedSessionId === ""}
          onClick={() => onChange("")}
        />

        {sessions.map((session) => (
          <SessionContextOption
            key={session.id}
            title={session.title}
            description="Use this session as the main source for the path."
            badgeLabel="Session"
            badgeVariant="outline"
            isSelected={selectedSessionId === session.id}
            onClick={() => onChange(session.id)}
          />
        ))}
      </div>
    </div>
  );
}
