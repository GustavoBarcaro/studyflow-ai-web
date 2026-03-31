import type { PropsWithChildren } from "react";

export function AuthShell({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden bg-[linear-gradient(145deg,rgba(14,116,144,0.92),rgba(234,88,12,0.86))] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">StudyFlow AI</p>
          <h1 className="max-w-md text-5xl font-extrabold leading-tight">
            Study sessions that feel guided, focused, and useful.
          </h1>
          <p className="max-w-lg text-base text-white/80">
            A product surface built around progress, not generic conversation.
          </p>
        </div>
        <div className="max-w-md rounded-[1.75rem] border border-white/20 bg-white/10 p-6 backdrop-blur">
          <p className="text-sm text-white/80">
            Quick actions, visible session goals, and a study-specific workflow keep the product grounded in learning outcomes.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center p-6 lg:p-10">{children}</section>
    </div>
  );
}
