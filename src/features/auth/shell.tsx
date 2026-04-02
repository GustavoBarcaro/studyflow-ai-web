import type { PropsWithChildren } from "react";

export function AuthShell({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden bg-[linear-gradient(145deg,rgba(14,116,144,0.92),rgba(234,88,12,0.86))] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
            StudyFlow AI
          </p>
          <h1 className="max-w-md text-5xl font-extrabold leading-tight">
            Study with clear goals, helpful guidance, and less confusion.
          </h1>
          <p className="max-w-lg text-base text-white/80">
            Organize what you are learning, ask questions, and review with AI in one place.
          </p>
        </div>
        <div className="max-w-md rounded-[1.75rem] border border-white/20 bg-white/10 p-6 backdrop-blur">
          <p className="text-sm text-white/80">
            Create topics, open study sessions, generate summaries, and test yourself when you are ready.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center p-6 lg:p-10">
        {children}
      </section>
    </div>
  );
}
