import { ArrowUpRight, Clock3, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatRelativeSessionDate } from "@/shared/lib/format";
import type { StudySession } from "@/shared/types/domain";

interface SessionListProps {
  sessions: StudySession[];
  onDelete?: (session: StudySession) => void;
  deletingSessionId?: string | null;
}

export function SessionList({
  sessions,
  onDelete,
  deletingSessionId,
}: SessionListProps) {
  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id} className="border-white/60">
          <CardContent className="flex flex-col gap-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-bold">{session.title}</h3>
              <p className="text-sm text-muted-foreground">
                Focused study session inside {session.topic.name}.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="h-4 w-4" />
                Updated {formatRelativeSessionDate(session.updatedAt)}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:justify-end">
              <Button asChild className="sm:flex-1 lg:flex-none">
                <Link to={`/sessions/${session.id}`}>
                  Open session
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              {onDelete && (
                <Button
                  variant="outline"
                  className="sm:flex-1 lg:flex-none"
                  onClick={() => onDelete(session)}
                  disabled={deletingSessionId === session.id}
                >
                  <Trash2 className="h-4 w-4" />
                  {deletingSessionId === session.id ? "Deleting..." : "Delete"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
