import { MarkdownContent } from "@/shared/components/common/markdown-content";
import type { Message } from "@/shared/types/domain";
import { formatMessageTime } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

type MessageBubbleProps = {
  message: Message;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={cn("flex", isAssistant ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[80%] rounded-[1.5rem] px-4 py-3 shadow-sm",
          isAssistant ? "bg-white text-foreground" : "bg-primary text-primary-foreground",
        )}
      >
        {isAssistant ? (
          <MarkdownContent content={message.content} className="text-foreground" />
        ) : (
          <MarkdownContent content={message.content} inverted className="text-primary-foreground" />
        )}
        <p className={cn("mt-2 text-xs", isAssistant ? "text-muted-foreground" : "text-primary-foreground/70")}>
          {formatMessageTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
