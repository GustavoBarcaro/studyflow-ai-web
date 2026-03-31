import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { SessionList } from "@/features/sessions/session-list";
import { DeleteConfirmDialog } from "@/shared/components/common/delete-confirm-dialog";
import { PageLoading } from "@/shared/components/common/page-loading";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { api } from "@/shared/lib/api";
import { Input } from "@/shared/components/ui/input";
import type { StudySession } from "@/shared/types/domain";

export function TopicDetailsPage() {
  const { topicId = "" } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [isDeleteTopicOpen, setIsDeleteTopicOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<StudySession | null>(null);
  const queryClient = useQueryClient();
  const {
    data: topic,
    isPending: isTopicPending,
    error: topicError,
  } = useQuery({
    queryKey: ["topic", topicId],
    queryFn: () => api.getTopic(topicId),
  });
  const {
    data: sessions = [],
    isPending: isSessionsPending,
    error: sessionsError,
  } = useQuery({
    queryKey: ["sessions", topicId],
    queryFn: () => api.getSessionsByTopic(topicId),
  });
  const createSessionMutation = useMutation({
    mutationFn: api.createSession,
    onSuccess: async () => {
      setTitle("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["sessions"] }),
        queryClient.invalidateQueries({ queryKey: ["sessions", topicId] }),
      ]);
    },
  });
  const deleteTopicMutation = useMutation({
    mutationFn: api.deleteTopic,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["topics"] }),
        queryClient.invalidateQueries({ queryKey: ["sessions"] }),
      ]);
      navigate("/topics");
    },
  });
  const deleteSessionMutation = useMutation({
    mutationFn: api.deleteSession,
    onSuccess: async () => {
      setSessionToDelete(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["sessions"] }),
        queryClient.invalidateQueries({ queryKey: ["sessions", topicId] }),
        queryClient.invalidateQueries({ queryKey: ["topics"] }),
      ]);
    },
  });

  if (isTopicPending || isSessionsPending) {
    return <PageLoading titleWidth="w-80" />;
  }

  if (topicError || sessionsError) {
    return <p className="text-sm text-red-600">{(topicError ?? sessionsError)?.message}</p>;
  }

  if (!topic) {
    return <p>Topic not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Button asChild variant="ghost" className="px-0">
            <Link to="/topics">
              <ArrowLeft className="h-4 w-4" />
              Back to topics
            </Link>
          </Button>
          <h1 className="text-4xl font-extrabold">{topic.name}</h1>
          <p className="max-w-2xl text-muted-foreground">
            Topic detail should feel like a study workspace, not just a list. Sessions are the progression units inside the topic.
          </p>
          <Button variant="outline" className="mt-3" onClick={() => setIsDeleteTopicOpen(true)}>
            <Trash2 className="h-4 w-4" />
            Delete topic
          </Button>
        </div>
        <div className="w-full max-w-md space-y-3 rounded-[1.5rem] border bg-white p-4">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="New session title" />
          <Button
            size="lg"
            className="w-full"
            disabled={!title.trim() || createSessionMutation.isPending}
            onClick={() => createSessionMutation.mutate({ title: title.trim(), topicId })}
          >
            <PlusCircle className="h-4 w-4" />
            {createSessionMutation.isPending ? "Creating..." : "New session"}
          </Button>
          {createSessionMutation.error && (
            <p className="text-sm text-red-600">{createSessionMutation.error.message}</p>
          )}
        </div>
      </div>

      <Card className="border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(254,243,199,0.7))]">
        <CardHeader>
          <CardTitle>Session library</CardTitle>
          <CardDescription>Each session is scoped to one objective, so the AI has context and the learner sees progress.</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length > 0 ? (
            <SessionList
              sessions={sessions}
              onDelete={(session) => setSessionToDelete(session)}
              deletingSessionId={deleteSessionMutation.isPending ? sessionToDelete?.id ?? null : null}
            />
          ) : (
            <p className="text-sm text-muted-foreground">No sessions in this topic yet. Create one above to start the study flow.</p>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={isDeleteTopicOpen}
        onOpenChange={setIsDeleteTopicOpen}
        title="Delete topic?"
        description={`This will remove "${topic.name}" and its study history. This action cannot be undone.`}
        confirmLabel="Delete topic"
        isPending={deleteTopicMutation.isPending}
        onConfirm={() => deleteTopicMutation.mutate(topicId)}
      />

      <DeleteConfirmDialog
        open={Boolean(sessionToDelete)}
        onOpenChange={(open) => {
          if (!open) setSessionToDelete(null);
        }}
        title="Delete session?"
        description={
          sessionToDelete
            ? `This will remove "${sessionToDelete.title}" and all messages inside it. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete session"
        isPending={deleteSessionMutation.isPending}
        onConfirm={() => {
          if (sessionToDelete) {
            deleteSessionMutation.mutate(sessionToDelete.id);
          }
        }}
      />
    </div>
  );
}
