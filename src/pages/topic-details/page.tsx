import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BrainCircuit, CheckCircle2, ListChecks, PlusCircle, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { BackLink } from "@/shared/components/common/back-link";
import { LearningPathPanel } from "@/features/learning-paths/learning-path-panel";
import { SessionList } from "@/features/sessions/session-list";
import { DeleteConfirmDialog } from "@/shared/components/common/delete-confirm-dialog";
import { PageLoading } from "@/shared/components/common/page-loading";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { api } from "@/shared/lib/api";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/utils";
import type { LearningPathStep, StudySession } from "@/shared/types/domain";

export function TopicDetailsPage() {
  const { topicId = "" } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [sessionIdForLearningPath, setSessionIdForLearningPath] = useState("");
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
  const {
    data: learningPath,
    isPending: isLearningPathPending,
    error: learningPathError,
  } = useQuery({
    queryKey: ["learning-path", topicId],
    queryFn: () => api.getLearningPathByTopic(topicId),
    enabled: Boolean(topicId),
  });
  const createLearningPathMutation = useMutation({
    mutationFn: () =>
      api.createLearningPathByTopic(topicId, {
        goal: goal.trim() || undefined,
        sessionId: sessionIdForLearningPath || undefined,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["learning-path", topicId] });
    },
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
  const createStepSessionMutation = useMutation({
    mutationFn: (step: LearningPathStep) =>
      api.createSession({
        title: step.title,
        topicId,
      }),
    onSuccess: async (session) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["sessions"] }),
        queryClient.invalidateQueries({ queryKey: ["sessions", topicId] }),
      ]);
      navigate(`/sessions/${session.id}`);
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

  function normalizeSessionTitle(value: string) {
    return value.trim().toLocaleLowerCase();
  }

  function findExistingSessionByStep(step: LearningPathStep) {
    return sessions.find((session) => normalizeSessionTitle(session.title) === normalizeSessionTitle(step.title)) ?? null;
  }

  if (isTopicPending || isSessionsPending) {
    return <PageLoading titleWidth="w-80" />;
  }

  if (topicError || sessionsError || learningPathError) {
    return <p className="text-sm text-red-600">{(topicError ?? sessionsError ?? learningPathError)?.message}</p>;
  }

  if (!topic) {
    return <p>Topic not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <BackLink to="/topics" label="Back to topics" />
          <h1 className="text-4xl font-extrabold">{topic.name}</h1>
          <p className="max-w-2xl text-muted-foreground">
            Turn sessions into a short study trail with clear next steps, visible progress, and manual completion tracking.
          </p>
          <Button variant="outline" className="mt-3" onClick={() => setIsDeleteTopicOpen(true)}>
            <Trash2 className="h-4 w-4" />
            Delete topic
          </Button>
        </div>
        <Card className="w-full max-w-md border-border/70 bg-background/95 shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-lg">Start a new session</CardTitle>
            <CardDescription>Create a focused conversation inside this topic and use it later as context for the learning path.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
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
          </CardContent>
        </Card>
      </div>

      {learningPath ? (
        <div className="space-y-3">
          <LearningPathPanel
            topic={topic}
            learningPath={learningPath}
            isLoading={isLearningPathPending}
            creatingSessionStepId={createStepSessionMutation.isPending ? createStepSessionMutation.variables?.id ?? null : null}
            getExistingSessionId={(step) => findExistingSessionByStep(step)?.id ?? null}
            getTestQuizHref={(step) => `/learning-path-steps/${step.id}/quiz`}
            onCreateSession={(step) => {
              const existingSession = findExistingSessionByStep(step);

              if (existingSession) {
                navigate(`/sessions/${existingSession.id}`);
                return;
              }

              createStepSessionMutation.mutate(step);
            }}
          />
          {createStepSessionMutation.error && (
            <p className="text-sm text-red-600">{createStepSessionMutation.error.message}</p>
          )}
        </div>
      ) : (
        <Card className="border-border/70 bg-background/95 shadow-md">
          <CardHeader className="space-y-4 rounded-t-xl bg-muted/20 pb-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1 rounded-md px-2 py-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    Manual generation
                  </Badge>
                  <Badge variant="outline" className="rounded-md px-2 py-1">
                    4-6 steps
                  </Badge>
                </div>
                <CardTitle>Create learning path</CardTitle>
              </div>
              <div className="rounded-lg border bg-background px-3 py-2 text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Based on</p>
                <p className="text-sm font-semibold">Topic + session history + goal</p>
              </div>
            </div>
            <CardDescription>
              Generate a short, progressive study trail that feels achievable. The API already constrains this to a focused path instead of a massive syllabus.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                  <BrainCircuit className="h-4 w-4" />
                  <span className="text-sm font-medium">Topic</span>
                </div>
                <p className="font-semibold">{topic.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">This anchors the overall subject area for the trail.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                  <ListChecks className="h-4 w-4" />
                  <span className="text-sm font-medium">Session context</span>
                </div>
                <p className="font-semibold">{sessionIdForLearningPath ? "Selected session" : "Recent topic context"}</p>
                <p className="mt-1 text-sm text-muted-foreground">Use one session if you want the path to stay tightly scoped.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Outcome</span>
                </div>
                <p className="font-semibold">{goal.trim() ? "Goal provided" : "Goal optional"}</p>
                <p className="mt-1 text-sm text-muted-foreground">A goal makes the steps more practical and less generic.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="learning-path-goal">Goal</Label>
              <Textarea
                id="learning-path-goal"
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                placeholder="Example: understand closures well enough to use them confidently in callbacks and hooks"
                className="min-h-28 resize-none rounded-2xl border-border/80 bg-background px-4 py-3 text-sm leading-6 shadow-sm focus-visible:ring-1"
              />
              <p className="text-xs text-muted-foreground">
                Keep it outcome-oriented. The model uses this to shape the sequence and examples.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Base it on a session</Label>
                <p className="text-sm text-muted-foreground">
                  Pick one conversation to keep the path tightly focused, or let the backend infer from recent topic context.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setSessionIdForLearningPath("")}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-colors",
                    sessionIdForLearningPath === ""
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-card hover:bg-muted/40",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">Use recent topic context</p>
                      <p className="mt-1 text-sm text-muted-foreground">Let the API infer context from the topic and your recent study history.</p>
                    </div>
                    <Badge variant={sessionIdForLearningPath === "" ? "default" : "outline"}>Default</Badge>
                  </div>
                </button>

                {sessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => setSessionIdForLearningPath(session.id)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors",
                      sessionIdForLearningPath === session.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{session.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">Use this session as the main source for the path.</p>
                      </div>
                      <Badge variant={sessionIdForLearningPath === session.id ? "default" : "outline"}>Session</Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-3 pt-0">
            <Separator className="mb-1" />
            <Button className="w-full" disabled={createLearningPathMutation.isPending} onClick={() => createLearningPathMutation.mutate()}>
              {createLearningPathMutation.isPending ? "Generating learning path..." : "Generate learning path"}
            </Button>
            {createLearningPathMutation.error && (
              <p className="text-sm text-red-600">{createLearningPathMutation.error.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Manual creation for now. Later this can also be suggested automatically after a strong first session.
            </p>
          </CardFooter>
        </Card>
      )}

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
