import { create } from "zustand";

import {
  clearStoredAuthState,
  persistAuthState,
  readStoredAuthState,
} from "@/shared/lib/auth";
import type { AuthUser } from "@/shared/types/domain";

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  bootstrapped: boolean;
  setSession: (payload: { accessToken: string; user: AuthUser | null }) => void;
  clearSession: () => void;
  finishBootstrap: () => void;
};

const storedState = readStoredAuthState();

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: storedState.accessToken,
  user: storedState.user,
  bootstrapped: false,
  setSession: ({ accessToken, user }) => {
    persistAuthState({
      accessToken,
      user,
    });

    set({
      accessToken,
      user,
    });
  },
  clearSession: () => {
    clearStoredAuthState();

    set({
      accessToken: null,
      user: null,
    });
  },
  finishBootstrap: () =>
    set({
      bootstrapped: true,
    }),
}));
