import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

interface BackLinkProps {
  to: string;
  label: string;
  className?: string;
}

export function BackLink({ to, label, className }: BackLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur transition-colors",
        "hover:bg-background hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
