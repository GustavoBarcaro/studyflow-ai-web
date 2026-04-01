import { useQuery } from "@tanstack/react-query";
import { BookOpen, LogOut, PlusCircle } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store";
import { authApi, api } from "@/shared/lib/api";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { withAlpha } from "@/shared/lib/color";
import { formatRelativeSessionDate } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

export function AppShell() {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const { data: topics = [] } = useQuery({
    queryKey: ["topics"],
    queryFn: api.getTopics,
  });
  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions"],
    queryFn: api.getSessions,
  });

  const topicsWithMeta = topics.map((topic) => {
    const relatedSessions = sessions.filter((session) => session.topicId === topic.id);
    const lastActivity = relatedSessions
      .map((session) => session.updatedAt)
      .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0];

    return {
      ...topic,
      sessionsCount: relatedSessions.length,
      lastActivity: lastActivity ? formatRelativeSessionDate(lastActivity) : "No sessions yet",
    };
  });

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1600px] gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] border bg-white/85 p-5 shadow-soft backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">StudyFlow</p>
              <h2 className="mt-2 text-xl font-extrabold">Your topics</h2>
            </div>
            <Button variant="secondary" size="icon" asChild>
              <Link to="/topics?create=1#topic-name" aria-label="Create topic">
                <PlusCircle className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <nav className="mt-8 space-y-2">
            <NavLink
              to="/topics"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted",
                )
              }
            >
              <BookOpen className="h-4 w-4" />
              Browse topics
            </NavLink>
          </nav>

          <div className="mt-8 space-y-3">
            {topicsWithMeta.map((topic) => (
              <Link
                key={topic.id}
                to={`/topics/${topic.id}`}
                className="block rounded-[1.5rem] border border-transparent bg-muted/60 p-4 transition hover:border-border hover:bg-white"
              >
                <div
                  className="h-2 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${topic.color ?? "#64748B"}, ${withAlpha(topic.color ?? "#64748B", 0.58)})`,
                  }}
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{topic.name}</p>
                    <p className="text-sm text-muted-foreground">{topic.sessionsCount} sessions</p>
                  </div>
                  <Badge>{topic.sessionsCount}</Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{topic.lastActivity}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-[1.5rem] bg-foreground p-4 text-white">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="mt-1 text-sm text-white/70">{user?.email}</p>
            <Button
              className="mt-4 w-full"
              variant="secondary"
              onClick={async () => {
                try {
                  await authApi.logout();
                } catch {
                  clearSession();
                }
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </aside>

        <main className="min-h-[calc(100vh-3rem)] rounded-[2rem] border bg-white/70 p-4 shadow-soft backdrop-blur md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
