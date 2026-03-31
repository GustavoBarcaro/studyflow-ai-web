import { ArrowUpRight, Clock3, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatRelativeSessionDate } from "@/shared/lib/format";
import type { StudySession } from "@/shared/types/domain";

type SessionListProps = {
  sessions: StudySession[];
  onDelete?: (session: StudySession) => void;
  deletingSessionId?: string | null;
};

export function SessionList({ sessions, onDelete, deletingSessionId }: SessionListProps) {
  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id} className="border-white/60">
          <CardContent className="flex flex-col gap-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold">{session.title}</h3>
                <Badge>{session.topic.name}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Focused study session inside {session.topic.name}.</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="h-4 w-4" />
                Updated {formatRelativeSessionDate(session.updatedAt)}
              </div>
            </div>
            <Button asChild>
              <Link to={`/sessions/${session.id}`}>
                Open session
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            {onDelete && (
              <Button
                variant="outline"
                onClick={() => onDelete(session)}
                disabled={deletingSessionId === session.id}
              >
                <Trash2 className="h-4 w-4" />
                {deletingSessionId === session.id ? "Deleting..." : "Delete"}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
