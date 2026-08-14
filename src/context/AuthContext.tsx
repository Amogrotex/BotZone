import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi } from "../lib/api";

export type User = {
  id?: string;
  name: string;
  email: string;
  picture?: string;
  avatar?: string;
  role?: "user" | "admin";
  isVerified?: boolean;
};

type AuthSession = { token: string; user: User };

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: AuthSession) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "botzone_user";
const TOKEN_KEY = "botzone_token";

function readCachedUser(): User | null {
  if (!localStorage.getItem(TOKEN_KEY)) return null;
  try {
    const value = localStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function normalizeUser(user: User): User {
  return { ...user, picture: user.picture || user.avatar };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hasToken = Boolean(localStorage.getItem(TOKEN_KEY));
  const [user, setUserState] = useState<User | null>(readCachedUser);
  const [isAuthLoading, setIsAuthLoading] = useState(hasToken);

  const setUser = useCallback((nextUser: User | null) => {
    const normalized = nextUser ? normalizeUser(nextUser) : null;
    setUserState(normalized);
    if (normalized) localStorage.setItem(USER_KEY, JSON.stringify(normalized));
    else localStorage.removeItem(USER_KEY);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setIsAuthLoading(false);
  }, [setUser]);

  const setSession = useCallback(({ token, user: sessionUser }: AuthSession) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(sessionUser);
    setIsAuthLoading(false);
  }, [setUser]);

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      logout();
      return;
    }
    const { user: currentUser } = await authApi.me();
    setUser(currentUser);
  }, [logout, setUser]);

  useEffect(() => {
    let active = true;
    const handleUnauthorized = () => active && logout();
    window.addEventListener("botzone:unauthorized", handleUnauthorized);

    if (localStorage.getItem(TOKEN_KEY)) {
      authApi.me()
        .then(({ user: currentUser }) => {
          if (active) setUser(currentUser);
        })
        .catch(() => {
          if (active) logout();
        })
        .finally(() => {
          if (active) setIsAuthLoading(false);
        });
    } else {
      setIsAuthLoading(false);
    }

    return () => {
      active = false;
      window.removeEventListener("botzone:unauthorized", handleUnauthorized);
    };
  }, [logout, setUser]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: Boolean(user && localStorage.getItem(TOKEN_KEY)),
      isAuthLoading,
      setUser,
      setSession,
      refreshUser,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
