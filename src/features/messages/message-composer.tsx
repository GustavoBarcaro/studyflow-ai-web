import { SendHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";

type MessageComposerProps = {
  onSend: (value: string) => void;
  isSending?: boolean;
};

export function MessageComposer({ onSend, isSending = false }: MessageComposerProps) {
  const [value, setValue] = useState("");

  return (
    <div className="rounded-[1.5rem] border bg-white p-4">
      <Textarea
        className="min-h-[96px] border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask the AI to explain a concept, compare ideas, or help you practice."
      />
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">AI is positioned as a study guide, not just a chat box.</p>
        <Button
          disabled={isSending}
          onClick={() => {
            if (!value.trim()) return;
            onSend(value);
            setValue("");
          }}
        >
          {isSending ? "Sending..." : "Send"}
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
