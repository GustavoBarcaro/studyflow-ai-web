import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
  inverted?: boolean;
}

export function MarkdownContent({
  content,
  className,
  inverted = false,
}: MarkdownContentProps) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none prose-headings:mb-2 prose-headings:mt-4 prose-p:my-2 prose-li:my-1 prose-pre:rounded-xl prose-pre:bg-slate-950 prose-pre:p-4 prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none",
        inverted &&
          "prose-invert prose-p:text-primary-foreground prose-strong:text-primary-foreground prose-headings:text-primary-foreground prose-li:text-primary-foreground prose-code:bg-primary-foreground/15",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
