import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { LearningPathPanel } from "@/features/learning-paths/panel";
import { CreateSessionCard } from "@/features/topic-details/create-session";
import { LearningPathGeneratorCard } from "@/features/topic-details/learning-path-generator";
import { SessionLibraryCard } from "@/features/topic-details/session-library";
import { TopicDetailsHeader } from "@/features/topic-details/header";
import { DeleteConfirmDialog } from "@/shared/components/common/delete-confirm/dialog";
import { InlineError } from "@/shared/components/common/inline-error";
import { PageLoading } from "@/shared/components/common/page/loading";
import { api } from "@/shared/lib/api";
import type { LearningPathStep, StudySession } from "@/shared/types/domain";

export function TopicDetailsPage() {
  const { topicId = "" } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [sessionIdForLearningPath, setSessionIdForLearningPath] = useState("");
  const [isDeleteTopicOpen, setIsDeleteTopicOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<StudySession | null>(
    null,
  );
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
      await queryClient.invalidateQueries({
        queryKey: ["learning-path", topicId],
      });
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
    return (
      sessions.find(
        (session) =>
          normalizeSessionTitle(session.title) ===
          normalizeSessionTitle(step.title),
      ) ?? null
    );
  }

  if (isTopicPending || isSessionsPending) {
    return <PageLoading titleWidth="w-80" />;
  }

  if (topicError || sessionsError || learningPathError) {
    return (
      <InlineError
        message={(topicError ?? sessionsError ?? learningPathError)?.message}
      />
    );
  }

  if (!topic) {
    return <p>Topic not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <TopicDetailsHeader
          topicName={topic.name}
          onDelete={() => setIsDeleteTopicOpen(true)}
        />
        <CreateSessionCard
          title={title}
          isPending={createSessionMutation.isPending}
          errorMessage={createSessionMutation.error?.message}
          onTitleChange={setTitle}
          onCreate={() =>
            createSessionMutation.mutate({ title: title.trim(), topicId })
          }
        />
      </div>

      {learningPath ? (
        <div className="space-y-3">
          <LearningPathPanel
            topic={topic}
            learningPath={learningPath}
            isLoading={isLearningPathPending}
            creatingSessionStepId={
              createStepSessionMutation.isPending
                ? (createStepSessionMutation.variables?.id ?? null)
                : null
            }
            getExistingSessionId={(step) =>
              findExistingSessionByStep(step)?.id ?? null
            }
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
          <InlineError message={createStepSessionMutation.error?.message} />
        </div>
      ) : (
        <LearningPathGeneratorCard
          topicName={topic.name}
          sessions={sessions}
          goal={goal}
          selectedSessionId={sessionIdForLearningPath}
          isPending={createLearningPathMutation.isPending}
          errorMessage={createLearningPathMutation.error?.message}
          onGoalChange={setGoal}
          onSessionChange={setSessionIdForLearningPath}
          onGenerate={() => createLearningPathMutation.mutate()}
        />
      )}

      <SessionLibraryCard
        sessions={sessions}
        onDelete={(session) => setSessionToDelete(session)}
        deletingSessionId={
          deleteSessionMutation.isPending ? (sessionToDelete?.id ?? null) : null
        }
      />

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
