import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Sparkles, Target, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { DeleteConfirmDialog } from "@/shared/components/common/delete-confirm-dialog";
import { MessageComposer } from "@/features/messages/message-composer";
import { MessageList } from "@/features/messages/message-list";
import { StudyToolsPanel } from "@/features/study-tools/study-tools-panel";
import { PageLoading } from "@/shared/components/common/page-loading";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { api } from "@/shared/lib/api";
import type { QuizDifficulty } from "@/shared/types/domain";

export function SessionPage() {
  const { sessionId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [quizDifficulty, setQuizDifficulty] = useState<QuizDifficulty>("medium");
  const [questions, setQuestions] = useState(3);

  const {
    data: session,
    isPending: isSessionPending,
    error: sessionError,
  } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => api.getSession(sessionId),
  });
  const {
    data: messages = [],
    isPending: isMessagesPending,
    error: messagesError,
  } = useQuery({
    queryKey: ["messages", sessionId],
    queryFn: () => api.getMessages(sessionId),
  });
  const createMessageMutation = useMutation({
    mutationFn: (content: string) => api.createMessage(sessionId, { content }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["messages", sessionId] }),
        queryClient.invalidateQueries({ queryKey: ["session", sessionId] }),
      ]);
    },
  });
  const deleteSessionMutation = useMutation({
    mutationFn: api.deleteSession,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["sessions"] }),
        queryClient.invalidateQueries({ queryKey: ["sessions", session?.topicId] }),
        queryClient.invalidateQueries({ queryKey: ["topics"] }),
      ]);
      navigate(`/topics/${session?.topicId ?? ""}`);
    },
  });

  if (isSessionPending) {
    return <PageLoading titleWidth="w-[30rem]" lines={2} />;
  }

  if (sessionError || messagesError) {
    return <p className="text-sm text-red-600">{(sessionError ?? messagesError)?.message}</p>;
  }

  if (!session) {
    return <p>Session not found.</p>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <Card className="border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(224,242,254,0.8))]">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <Button asChild variant="ghost" className="px-0">
                  <Link to={`/topics/${session.topicId}`}>
                    <ArrowLeft className="h-4 w-4" />
                    Back to topic
                  </Link>
                </Button>
                <CardTitle className="text-4xl font-extrabold">{session.title}</CardTitle>
                <CardDescription className="max-w-2xl text-base">
                  The session page is the product core: chat centered, actions explicit, and the learner always reminded of the study objective.
                </CardDescription>
              </div>
              <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Target className="h-4 w-4 text-accent" />
                  Session objective
                </p>
                <p className="mt-2 max-w-sm text-sm leading-6">
                  Build understanding inside <span className="font-semibold">{session.topic.name}</span> and keep every explanation connected to the stored conversation.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => document.getElementById("study-tools-panel")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Sparkles className="h-4 w-4" />
                Summarize
              </Button>
              <Button
                variant="secondary"
                onClick={() => document.getElementById("study-tools-panel")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Sparkles className="h-4 w-4" />
                Explain again
              </Button>
              <Button asChild>
                <Link to={`/quizzes/${sessionId}?difficulty=${quizDifficulty}&questions=${questions}`}>
                  <Sparkles className="h-4 w-4" />
                  Quiz
                </Link>
              </Button>
              <Button variant="outline" onClick={() => setIsDeleteOpen(true)}>
                <Trash2 className="h-4 w-4" />
                Delete session
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-white/60">
          <CardContent className="space-y-4 pt-6">
            <MessageList messages={messages} isLoading={isMessagesPending} />
            <MessageComposer
              isSending={createMessageMutation.isPending}
              onSend={(value) => createMessageMutation.mutate(value)}
            />
            {createMessageMutation.error && (
              <p className="text-sm text-red-600">{createMessageMutation.error.message}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <StudyToolsPanel
        sessionId={sessionId}
        quizDifficulty={quizDifficulty}
        questions={questions}
        onQuizDifficultyChange={setQuizDifficulty}
        onQuestionsChange={(nextQuestions) => setQuestions(Math.max(1, Math.min(10, nextQuestions)))}
      />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete session?"
        description={`This will remove "${session.title}" and all messages inside it. This action cannot be undone.`}
        confirmLabel="Delete session"
        isPending={deleteSessionMutation.isPending}
        onConfirm={() => deleteSessionMutation.mutate(sessionId)}
      />
    </div>
  );
}
