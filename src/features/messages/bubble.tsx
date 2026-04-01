import { MarkdownContent } from "@/shared/components/common/markdown/content";
import type { Message } from "@/shared/types/domain";
import { formatMessageTime } from "@/shared/lib/format";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === "assistant";
  const isPending = Boolean(message.isPending);

  return (
    <div className={cn("flex", isAssistant ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[80%] rounded-[1.5rem] px-4 py-3 shadow-sm",
          isAssistant
            ? "bg-white text-foreground"
            : "bg-primary text-primary-foreground",
        )}
      >
        {isAssistant ? (
          isPending ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex gap-1">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary/50 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary/50 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary/50 [animation-delay:300ms]" />
                </span>
                Thinking...
              </div>
            </div>
          ) : (
            <MarkdownContent
              content={message.content}
              className="text-foreground"
            />
          )
        ) : (
          <MarkdownContent
            content={message.content}
            inverted
            className="text-primary-foreground"
          />
        )}
        <p
          className={cn(
            "mt-2 text-xs",
            isAssistant
              ? "text-muted-foreground"
              : "text-primary-foreground/70",
          )}
        >
          {isPending ? "Just now" : formatMessageTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
