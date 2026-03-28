import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { API_BASE_URL } from "@/lib/api-config";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: "admin" | "staff";
    is_active: boolean;
    governance_member_id?: number | null;
    created_at: string;
    last_login?: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

// ─── Token storage helpers ───────────────────────────────────────────────────

const TOKEN_KEY = "amen_portal_token";
const USER_KEY = "amen_portal_user";

export function getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function saveAuth(token: string, user: AuthUser) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

// ─── Core hook ──────────────────────────────────────────────────────────────

export function useAuth() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Hydrate from localStorage on mount
    useEffect(() => {
        const storedToken = getStoredToken();
        const storedUser = getStoredUser();
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (credentials: LoginCredentials): Promise<AuthUser> => {
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "Login failed");
        }

        const data = await res.json();
        const authUser: AuthUser = data.user;
        const accessToken: string = data.access_token;

        saveAuth(accessToken, authUser);
        setToken(accessToken);
        setUser(authUser);
        return authUser;
    }, []);

    const logout = useCallback(() => {
        clearAuth();
        setToken(null);
        setUser(null);
    }, []);

    /** Fetch the latest user profile from the backend and refresh local state */
    const refreshUser = useCallback(async () => {
        const currentToken = getStoredToken();
        if (!currentToken) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
                headers: { Authorization: `Bearer ${currentToken}` },
            });
            if (!res.ok) {
                logout();
                return;
            }
            const freshUser: AuthUser = await res.json();
            saveAuth(currentToken, freshUser);
            setUser(freshUser);
        } catch {
            // network error — keep existing state
        }
    }, [logout]);

    return {
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === "admin",
        login,
        logout,
        refreshUser,
    };
}

// ─── Auth fetcher helper (pre-fills Bearer token) ───────────────────────────

export function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = getStoredToken();
    return fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.body && !(options.body instanceof FormData)
                ? { "Content-Type": "application/json" }
                : {}),
        },
    });
}
