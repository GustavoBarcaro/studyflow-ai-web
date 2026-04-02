import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SessionList } from "@/features/sessions/list";
import { SurfaceCard } from "@/shared/components/common/surface/card";
import type { StudySession } from "@/shared/types/domain";

interface SessionLibraryCardProps {
  sessions: StudySession[];
  deletingSessionId?: string | null;
  onDelete: (session: StudySession) => void;
}

export function SessionLibraryCard({
  sessions,
  deletingSessionId,
  onDelete,
}: SessionLibraryCardProps) {
  return (
    <SurfaceCard className="border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(254,243,199,0.7))]">
      <CardHeader>
        <CardTitle>Session library</CardTitle>
        <CardDescription>
          Open any session to continue studying, review past questions, or delete what you no longer need.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <SessionList
            sessions={sessions}
            onDelete={onDelete}
            deletingSessionId={deletingSessionId}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            No sessions in this topic yet. Create one above to get started.
          </p>
        )}
      </CardContent>
    </SurfaceCard>
  );
}
