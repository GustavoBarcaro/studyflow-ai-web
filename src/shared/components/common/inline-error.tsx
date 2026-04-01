import { cn } from "@/lib/utils";

interface InlineErrorProps {
  message?: string | null;
  className?: string;
}

export function InlineError({ message, className }: InlineErrorProps) {
  if (!message) {
    return null;
  }

  return <p className={cn("text-sm text-destructive", className)}>{message}</p>;
}
