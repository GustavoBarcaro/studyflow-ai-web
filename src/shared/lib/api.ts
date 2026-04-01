import {
  clearStoredAuthState,
  decodeAccessToken,
  isAccessTokenExpiredOrNearExpiry,
} from "@/shared/lib/auth";
import type {
  AuthUser,
  CreateMessageResponse,
  ExplainAgainRequest,
  ExplainAgainResponse,
  GeneratedQuizResponse,
  GeneratedLearningPathStepQuizResponse,
  LearningPath,
  LearningPathStep,
  Message,
  SessionDetails,
  StudySession,
  SummarizeResponse,
  Topic,
} from "@/shared/types/domain";
import { useAuthStore } from "@/features/auth/store";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3333";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
  retryOnUnauthorized?: boolean;
};

function ensureArray<T>(value: T[] | null | undefined) {
  return Array.isArray(value) ? value : [];
}

async function parseResponse<T>(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (response.status === 204) {
    return null as T;
  }

  if (!contentType.includes("application/json")) {
    return null as T;
  }

  return (await response.json()) as T;
}

function getHeaders(body: unknown, accessToken: string | null) {
  const headers = new Headers();

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        useAuthStore.getState().clearSession();
        clearStoredAuthState();

        return null;
      }

      const data = (await response.json()) as { accessToken: string };
      const user = decodeAccessToken(data.accessToken);

      useAuthStore.getState().setSession({
        accessToken: data.accessToken,
        user,
      });

      return data.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function getValidAccessToken() {
  const currentAccessToken = useAuthStore.getState().accessToken;

  if (!currentAccessToken) {
    return null;
  }

  if (!isAccessTokenExpiredOrNearExpiry(currentAccessToken)) {
    return currentAccessToken;
  }

  return refreshAccessToken();
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    auth = true,
    retryOnUnauthorized = true,
  } = options;
  const accessToken = auth ? await getValidAccessToken() : null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: getHeaders(body, accessToken),
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401 && auth && retryOnUnauthorized) {
    const refreshedAccessToken = await refreshAccessToken();

    if (refreshedAccessToken) {
      return request<T>(path, {
        ...options,
        retryOnUnauthorized: false,
      });
    }
  }

  if (!response.ok) {
    const errorBody = await parseResponse<{ message?: string }>(response);
    throw new ApiError(errorBody?.message ?? "Request failed", response.status);
  }

  return parseResponse<T>(response);
}

function buildAuthUser(
  user: Partial<AuthUser> | null | undefined,
  emailFallback?: string,
): AuthUser | null {
  if (!user?.email && !emailFallback) return null;

  return {
    id: user?.id ?? "",
    email: user?.email ?? emailFallback ?? "",
    name: user?.name ?? null,
  };
}

export const authApi = {
  async signUp(payload: {
    email: string;
    password: string;
    confirmPassword: string;
    name?: string;
  }) {
    const data = await request<{ user: AuthUser; accessToken: string }>(
      "/signup",
      {
        method: "POST",
        auth: false,
        body: payload,
      },
    );

    useAuthStore.getState().setSession({
      accessToken: data.accessToken,
      user: buildAuthUser(data.user, payload.email),
    });

    return data;
  },
  async login(payload: { email: string; password: string }) {
    const data = await request<{ accessToken: string }>("/login", {
      method: "POST",
      auth: false,
      body: payload,
    });
    const decodedUser = decodeAccessToken(data.accessToken);

    useAuthStore.getState().setSession({
      accessToken: data.accessToken,
      user: buildAuthUser(decodedUser, payload.email),
    });

    return data;
  },
  async refresh() {
    const accessToken = await refreshAccessToken();

    if (!accessToken) {
      throw new ApiError("Unable to refresh session", 401);
    }

    return accessToken;
  },
  async logout() {
    await request<{ message: string }>("/logout", {
      method: "POST",
      body: {},
    });
    useAuthStore.getState().clearSession();
  },
};

export const api = {
  getTopics: async () => ensureArray(await request<Topic[] | null>("/topics")),
  getTopic: (topicId: string) => request<Topic>(`/topics/${topicId}`),
  createTopic: (payload: { name: string; color?: string }) =>
    request<Topic>("/topics", {
      method: "POST",
      body: payload,
    }),
  getLearningPathByTopic: async (topicId: string) => {
    try {
      return await request<LearningPath>(`/topics/${topicId}/learning-path`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }

      throw error;
    }
  },
  createLearningPathByTopic: (
    topicId: string,
    payload?: { goal?: string; sessionId?: string },
  ) =>
    request<LearningPath>(`/topics/${topicId}/learning-path`, {
      method: "POST",
      body: payload ?? {},
    }),
  completeLearningPathStep: (stepId: string) =>
    request<LearningPathStep>(`/learning-path-steps/${stepId}/complete`, {
      method: "PATCH",
    }),
  incompleteLearningPathStep: (stepId: string) =>
    request<LearningPathStep>(`/learning-path-steps/${stepId}/incomplete`, {
      method: "PATCH",
    }),
  deleteTopic: (topicId: string) =>
    request<null>(`/topics/${topicId}`, {
      method: "DELETE",
    }),
  getSessions: async () =>
    ensureArray(await request<StudySession[] | null>("/sessions")),
  getSessionsByTopic: async (topicId: string) => {
    const sessions = await ensureArray(
      await request<StudySession[] | null>("/sessions"),
    );
    return sessions.filter((session) => session.topicId === topicId);
  },
  createSession: (payload: { title: string; topicId: string }) =>
    request<StudySession>("/sessions", {
      method: "POST",
      body: payload,
    }),
  deleteSession: (sessionId: string) =>
    request<null>(`/sessions/${sessionId}`, {
      method: "DELETE",
    }),
  getSession: (sessionId: string) =>
    request<SessionDetails>(`/sessions/${sessionId}`),
  getMessages: async (sessionId: string) =>
    ensureArray(
      await request<Message[] | null>(`/sessions/${sessionId}/messages`),
    ),
  createMessage: (sessionId: string, payload: { content: string }) =>
    request<CreateMessageResponse>(`/sessions/${sessionId}/messages`, {
      method: "POST",
      body: payload,
    }),
  summarizeSession: (sessionId: string) =>
    request<SummarizeResponse>(`/sessions/${sessionId}/summarize`, {
      method: "POST",
    }),
  explainAgain: (sessionId: string, payload: ExplainAgainRequest) =>
    request<ExplainAgainResponse>(`/sessions/${sessionId}/explain-again`, {
      method: "POST",
      body: payload,
    }),
  generateQuiz: (
    sessionId: string,
    payload: { difficulty: "easy" | "medium" | "hard"; questions: number },
  ) =>
    request<GeneratedQuizResponse>(`/sessions/${sessionId}/quiz`, {
      method: "POST",
      body: payload,
    }),
  generateLearningPathStepQuiz: (
    stepId: string,
    payload: { difficulty: "easy" | "medium" | "hard"; questions: number },
  ) =>
    request<GeneratedLearningPathStepQuizResponse>(
      `/learning-path-steps/${stepId}/quiz`,
      {
        method: "POST",
        body: payload,
      },
    ),
};
