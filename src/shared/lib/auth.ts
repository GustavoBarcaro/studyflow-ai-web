import type { AuthUser } from "@/shared/types/domain";

const AUTH_STORAGE_KEY = "studyflow.auth";

type StoredAuthState = {
  accessToken: string | null;
  user: AuthUser | null;
};

type JwtPayload = {
  sub?: string;
  email?: string;
  exp?: number;
};

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  return atob(padded);
}

export function decodeAccessToken(accessToken: string): AuthUser | null {
  try {
    const [, payload] = accessToken.split(".");

    if (!payload) return null;

    const decoded = JSON.parse(decodeBase64Url(payload)) as JwtPayload;

    if (!decoded.email) return null;

    const fallbackName = decoded.email.split("@")[0].replace(/[._-]/g, " ");

    return {
      id: decoded.sub ?? "",
      email: decoded.email,
      name: fallbackName
        ? fallbackName.replace(/\b\w/g, (char) => char.toUpperCase())
        : null,
    };
  } catch {
    return null;
  }
}

export function getAccessTokenExpiry(accessToken: string): number | null {
  try {
    const [, payload] = accessToken.split(".");

    if (!payload) return null;

    const decoded = JSON.parse(decodeBase64Url(payload)) as JwtPayload;

    return typeof decoded.exp === "number" ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isAccessTokenExpiredOrNearExpiry(
  accessToken: string,
  thresholdMs = 30_000,
) {
  const expiry = getAccessTokenExpiry(accessToken);

  if (!expiry) {
    return false;
  }

  return expiry - Date.now() <= thresholdMs;
}

export function readStoredAuthState(): StoredAuthState {
  if (typeof window === "undefined") {
    return {
      accessToken: null,
      user: null,
    };
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return {
      accessToken: null,
      user: null,
    };
  }

  try {
    return JSON.parse(raw) as StoredAuthState;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);

    return {
      accessToken: null,
      user: null,
    };
  }
}

export function persistAuthState(state: StoredAuthState) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
}

export function clearStoredAuthState() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
