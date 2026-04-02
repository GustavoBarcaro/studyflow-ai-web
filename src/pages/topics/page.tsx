import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { TopicColorPicker } from "@/features/topics/color/picker";
import { TopicCard } from "@/features/topics/card";
import { DeleteConfirmDialog } from "@/shared/components/common/delete-confirm/dialog";
import { InlineError } from "@/shared/components/common/inline-error";
import { PageLoading } from "@/shared/components/common/page/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/shared/lib/api";
import {
  isValidHexColor,
  normalizeHexColor,
  withAlpha,
} from "@/shared/lib/color";
import { formatRelativeSessionDate } from "@/shared/lib/format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Topic } from "@/shared/types/domain";

export function TopicsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#0EA5E9");
  const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);
  const topicNameInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const {
    data: topics = [],
    isPending: isTopicsPending,
    error: topicsError,
  } = useQuery({
    queryKey: ["topics"],
    queryFn: api.getTopics,
  });
  const {
    data: sessions = [],
    isPending: isSessionsPending,
    error: sessionsError,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: api.getSessions,
  });
  const createTopicMutation = useMutation({
    mutationFn: api.createTopic,
    onSuccess: async () => {
      setName("");
      setColor("#0EA5E9");
      await queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });
  const deleteTopicMutation = useMutation({
    mutationFn: api.deleteTopic,
    onSuccess: async () => {
      setTopicToDelete(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["topics"] }),
        queryClient.invalidateQueries({ queryKey: ["sessions"] }),
      ]);
    },
  });

  const topicsWithMeta = topics.map((topic) => {
    const relatedSessions = sessions.filter(
      (session) => session.topicId === topic.id,
    );
    const lastActivity = relatedSessions
      .map((session) => session.updatedAt)
      .sort(
        (left, right) => new Date(right).getTime() - new Date(left).getTime(),
      )[0];

    return {
      topic,
      sessionsCount: relatedSessions.length,
      lastActivity: lastActivity
        ? formatRelativeSessionDate(lastActivity)
        : "No study sessions yet",
    };
  });

  useEffect(() => {
    if (searchParams.get("create") !== "1") return;

    topicNameInputRef.current?.focus();
    topicNameInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("create");
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  if (isTopicsPending || isSessionsPending) {
    return <PageLoading titleWidth="w-96" />;
  }

  if (topicsError || sessionsError) {
    return <InlineError message={(topicsError ?? sessionsError)?.message} />;
  }

  const normalizedColor = isValidHexColor(color)
    ? normalizeHexColor(color)
    : color;
  const canCreateTopic =
    Boolean(name.trim()) &&
    isValidHexColor(color) &&
    !createTopicMutation.isPending;

  return (
    <div className="space-y-6">
      <Card
        className="overflow-hidden border-border/70 shadow-md"
        style={{
          background: `linear-gradient(135deg, ${withAlpha(normalizedColor, 0.18)}, rgba(255,255,255,0.92))`,
        }}
      >
        <CardContent className="flex flex-col gap-4 pt-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Topics
            </p>
            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Keep your study topics organized.
            </h1>
            <p className="text-muted-foreground">
              Create topics for each subject and jump back into the sessions you want to review.
            </p>
          </div>
          <div className="w-full max-w-md space-y-4 rounded-[1.5rem] border bg-background/90 p-4 shadow-sm backdrop-blur">
            <div className="space-y-2">
              <Label htmlFor="topic-name">Topic name</Label>
              <Input
                id="topic-name"
                ref={topicNameInputRef}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter a topic name"
              />
            </div>
            <TopicColorPicker color={color} onChange={setColor} />
            <Separator />
            <Button
              size="lg"
              className="w-full"
              disabled={!canCreateTopic}
              onClick={() =>
                createTopicMutation.mutate({
                  name: name.trim(),
                  color: normalizeHexColor(color),
                })
              }
            >
              <PlusCircle className="h-4 w-4" />
              {createTopicMutation.isPending ? "Creating..." : "Create topic"}
            </Button>
            {!isValidHexColor(color) ? (
              <InlineError message="Enter a valid hex color before creating the topic." />
            ) : null}
            <InlineError message={createTopicMutation.error?.message} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-3">
        {topicsWithMeta.length > 0 ? (
          topicsWithMeta.map(({ topic, sessionsCount, lastActivity }) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              sessionsCount={sessionsCount}
              lastActivity={lastActivity}
              onDelete={(selectedTopic) => setTopicToDelete(selectedTopic)}
              isDeleting={
                deleteTopicMutation.isPending && topicToDelete?.id === topic.id
              }
            />
          ))
        ) : (
          <Card className="border-dashed border-white/60 xl:col-span-3">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                No topics yet. Create your first topic to start studying.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <DeleteConfirmDialog
        open={Boolean(topicToDelete)}
        onOpenChange={(open) => {
          if (!open) setTopicToDelete(null);
        }}
        title="Delete topic?"
        description={
          topicToDelete
            ? `This will permanently delete "${topicToDelete.name}" and its study history. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete topic"
        isPending={deleteTopicMutation.isPending}
        onConfirm={() => {
          if (topicToDelete) {
            deleteTopicMutation.mutate(topicToDelete.id);
          }
        }}
      />
    </div>
  );
}
