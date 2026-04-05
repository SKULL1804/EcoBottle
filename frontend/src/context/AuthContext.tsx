"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { authApi } from "@/lib/api";

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    auth_provider: string;
    avatar_url?: string;
    is_verified: boolean;
    points: number;
    balance: number;
    total_scans: number;
    level: number;
    level_title: string;
    created_at?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    accessToken: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    googleLogin: (idToken: string) => Promise<boolean>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const saveToken = (token: string) => {
        localStorage.setItem("eco_token", token);
        setAccessToken(token);
    };

    const refreshUser = useCallback(async () => {
        try {
            const { status, data } = await authApi.getMe();
            if (status === 200) setUser(data as User);
            else { setUser(null); localStorage.removeItem("eco_token"); setAccessToken(null); }
        } catch {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("eco_token");
        if (token) {
            setAccessToken(token);
            refreshUser().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [refreshUser]);

    const login = async (email: string, password: string): Promise<boolean> => {
        const { status, data } = await authApi.login(email, password);
        if (status === 200 && (data as { access_token?: string }).access_token) {
            saveToken((data as { access_token: string }).access_token);
            await refreshUser();
            return true;
        }
        return false;
    };

    const googleLogin = async (idToken: string): Promise<boolean> => {
        const { status, data } = await authApi.googleLogin(idToken);
        if (status === 200 && (data as { access_token?: string }).access_token) {
            saveToken((data as { access_token: string }).access_token);
            await refreshUser();
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem("eco_token");
        setAccessToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, accessToken, login, googleLogin, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
