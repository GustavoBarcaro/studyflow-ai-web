import { useEffect, useRef } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageBubble } from "@/features/messages/bubble";
import type { Message } from "@/shared/types/domain";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading = false }: MessageListProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLoading) return;

    const viewport = viewportRef.current;

    if (!viewport) return;

    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  return (
    <ScrollArea
      viewportRef={viewportRef}
      className="h-[50vh] min-h-[320px] rounded-[1.5rem] border bg-muted/40 p-4 md:h-[420px]"
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-[78%] rounded-[1.5rem]" />
          <div className="flex justify-end">
            <Skeleton className="h-20 w-[65%] rounded-[1.5rem]" />
          </div>
          <Skeleton className="h-28 w-[80%] rounded-[1.5rem]" />
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      )}
    </ScrollArea>
  );
}
