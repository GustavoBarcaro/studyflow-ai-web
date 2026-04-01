import { ArrowRight, Clock3, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { withAlpha } from "@/shared/lib/color";
import type { Topic } from "@/shared/types/domain";

interface TopicCardProps {
  topic: Topic;
  sessionsCount: number;
  lastActivity: string;
  onDelete?: (topic: Topic) => void;
  isDeleting?: boolean;
}

export function TopicCard({
  topic,
  sessionsCount,
  lastActivity,
  onDelete,
  isDeleting = false,
}: TopicCardProps) {
  const color = topic.color ?? "#64748B";

  return (
    <Card className="overflow-hidden border-border/70 bg-background/95 shadow-md">
      <div
        className="h-28"
        style={{
          background: `linear-gradient(135deg, ${color}, ${withAlpha(color, 0.72)})`,
        }}
      />
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">{topic.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {sessionsCount} study sessions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{sessionsCount}x</Badge>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(topic)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 className="h-4 w-4" />
          Last activity: {lastActivity}
        </div>

        <Button asChild className="w-full">
          <Link to={`/topics/${topic.id}`}>
            Start studying
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
