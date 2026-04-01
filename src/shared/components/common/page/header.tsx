import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { BackLink } from "@/shared/components/common/back-link";

interface PageHeaderProps {
  backLink?: {
    to: string;
    label: string;
  };
  badges?: ReactNode;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function PageHeader({
  backLink,
  badges,
  title,
  description,
  actions,
  aside,
  className,
  titleClassName,
  descriptionClassName,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {backLink ? <BackLink to={backLink.to} label={backLink.label} /> : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl space-y-2">
          {badges ? (
            <div className="flex flex-wrap items-center gap-2">{badges}</div>
          ) : null}
          <h1
            className={cn(
              "text-4xl font-extrabold tracking-tight",
              titleClassName,
            )}
          >
            {title}
          </h1>
          {description ? (
            <div className={cn("text-muted-foreground", descriptionClassName)}>
              {description}
            </div>
          ) : null}
        </div>

        {aside}
      </div>

      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
