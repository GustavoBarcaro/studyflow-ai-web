import { SendHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageComposerProps {
  onSend: (value: string) => void;
  isSending?: boolean;
  placeholder?: string;
}

export function MessageComposer({
  onSend,
  isSending = false,
  placeholder = "Ask the AI to explain a concept, compare ideas, or help you practice.",
}: MessageComposerProps) {
  const [value, setValue] = useState("");

  return (
    <div className="rounded-[1.5rem] border bg-white p-4 shadow-sm">
      <Textarea
        className="min-h-[120px] resize-none rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm leading-6 shadow-sm placeholder:text-muted-foreground/80 focus-visible:ring-1"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
      />
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          AI is positioned as a study guide, not just a chat box.
        </p>
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
