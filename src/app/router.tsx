import { useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import { authApi } from "@/shared/lib/api";
import { useAuthStore } from "@/features/auth/store";
import { AppShell } from "@/shared/components/layout/app-shell";
import { LoginPage } from "@/pages/login/page";
import { SignupPage } from "@/pages/signup/page";
import { TopicsPage } from "@/pages/topics/page";
import { TopicDetailsPage } from "@/pages/topic-details/page";
import { SessionPage } from "@/pages/session/page";
import { QuizPage } from "@/pages/quiz/page";
import { LearningPathQuizPage } from "@/pages/learning-path-quiz/page";

function ProtectedRoute() {
  const token = useAuthStore((state) => state.accessToken);
  const bootstrapped = useAuthStore((state) => state.bootstrapped);
  const clearSession = useAuthStore((state) => state.clearSession);
  const finishBootstrap = useAuthStore((state) => state.finishBootstrap);

  useEffect(() => {
    let active = true;

    async function bootstrapSession() {
      if (token) {
        finishBootstrap();
        return;
      }

      try {
        await authApi.refresh();
      } catch {
        clearSession();
      } finally {
        if (active) {
          finishBootstrap();
        }
      }
    }

    if (!bootstrapped) {
      void bootstrapSession();
    }

    return () => {
      active = false;
    };
  }, [bootstrapped, clearSession, finishBootstrap, token]);

  if (!bootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading workspace...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell />;
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Navigate to="/topics" replace />,
      },
      {
        path: "topics",
        element: <TopicsPage />,
      },
      {
        path: "topics/:topicId",
        element: <TopicDetailsPage />,
      },
      {
        path: "sessions/:sessionId",
        element: <SessionPage />,
      },
      {
        path: "quizzes/:sessionId",
        element: <QuizPage />,
      },
      {
        path: "learning-path-steps/:stepId/quiz",
        element: <LearningPathQuizPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
