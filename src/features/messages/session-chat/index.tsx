import { Card, CardContent } from "@/components/ui/card";
import { InlineError } from "@/shared/components/common/inline-error";
import type { Message } from "@/shared/types/domain";

import { MessageComposer } from "../composer";
import { MessageList } from "../list";

interface SessionChatCardProps {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  errorMessage?: string;
  placeholder: string;
  onSend: (value: string) => void;
}

export function SessionChatCard({
  messages,
  isLoading,
  isSending,
  errorMessage,
  placeholder,
  onSend,
}: SessionChatCardProps) {
  return (
    <Card className="border-white/60">
      <CardContent className="space-y-4 pt-6">
        <MessageList messages={messages} isLoading={isLoading} />
        <MessageComposer
          isSending={isSending}
          onSend={onSend}
          placeholder={placeholder}
        />
        <InlineError message={errorMessage} />
      </CardContent>
    </Card>
  );
}
