import type { ReactNode } from "react";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SurfaceCard } from "@/shared/components/common/surface/card";

interface StudyToolCardProps {
  title: string;
  description?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
}

export function StudyToolCard({
  title,
  description,
  headerAction,
  children,
}: StudyToolCardProps) {
  return (
    <SurfaceCard className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{title}</CardTitle>
          {headerAction}
        </div>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </SurfaceCard>
  );
}
