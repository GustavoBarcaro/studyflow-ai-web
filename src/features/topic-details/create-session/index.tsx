import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InlineError } from "@/shared/components/common/inline-error";
import { SurfaceCard } from "@/shared/components/common/surface/card";

interface CreateSessionCardProps {
  title: string;
  isPending: boolean;
  errorMessage?: string;
  onTitleChange: (value: string) => void;
  onCreate: () => void;
}

export function CreateSessionCard({
  title,
  isPending,
  errorMessage,
  onTitleChange,
  onCreate,
}: CreateSessionCardProps) {
  return (
    <SurfaceCard className="w-full max-w-md shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg">Start a new session</CardTitle>
        <CardDescription>
          Open a study session for this topic and ask questions as you learn.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="What do you want to study?"
        />
        <Button
          size="lg"
          className="w-full"
          disabled={!title.trim() || isPending}
          onClick={onCreate}
        >
          <PlusCircle className="h-4 w-4" />
          {isPending ? "Creating..." : "Create session"}
        </Button>
        <InlineError message={errorMessage} />
      </CardContent>
    </SurfaceCard>
  );
}
