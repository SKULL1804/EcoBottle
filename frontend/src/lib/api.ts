/**
 * EcoBottle — API Client
 * Centralized API wrapper with auth header injection.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("eco_token");
}

export async function api<T = unknown>(
    method: string,
    path: string,
    body?: unknown,
    options?: { formData?: boolean }
): Promise<{ status: number; data: T }> {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (!options?.formData) headers["Content-Type"] = "application/json";

    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: options?.formData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data: data as T };
}

export async function uploadFile<T = unknown>(path: string, file: Blob, filename = "file.jpg"): Promise<{ status: number; data: T }> {
    const formData = new FormData();
    formData.append("file", file, filename);
    return api<T>("POST", path, formData, { formData: true });
}

export const authApi = {
    login: (email: string, password: string) =>
        api<{ access_token: string; refresh_token: string }>("POST", "/auth/login", { email, password }),
    register: (name: string, email: string, password: string, phone?: string) =>
        api("POST", "/auth/register", { name, email, password, phone }),
    verifyOtp: (email: string, code: string) =>
        api("POST", "/auth/verify-otp", { email, code }),
    googleLogin: (idToken: string) =>
        api<{ access_token: string; refresh_token: string }>("POST", "/auth/google", { id_token: idToken }),
    getMe: () => api("GET", "/auth/me"),
    updateProfile: (name?: string, phone?: string) => api("PUT", "/auth/profile", { name, phone }),
};

export const scanApi = {
    preview: (file: Blob) => uploadFile("/scan/preview", file, "preview.jpg"),
    analyze: (file: Blob) => uploadFile("/scan/analyze", file, "capture.jpg"),
    confirm: (scanId: string) => api("POST", `/scan/${scanId}/confirm`),
    history: (skip = 0, limit = 20) => api("GET", `/scan/history?skip=${skip}&limit=${limit}`),
};

export const statsApi = {
    me: () => api("GET", "/stats/me"),
    achievements: () => api("GET", "/stats/achievements"),
    leaderboard: (limit = 10) => api("GET", `/stats/leaderboard?limit=${limit}`),
};

export const txApi = {
    list: (skip = 0, limit = 20) => api("GET", `/transactions?skip=${skip}&limit=${limit}`),
    withdraw: (amount: number, channelCode: string, accountNumber: string, accountHolderName: string) =>
        api("POST", "/transactions/withdraw", {
            amount, channel_code: channelCode,
            account_number: accountNumber, account_holder_name: accountHolderName,
        }),
    channels: () => api("GET", "/transactions/channels"),
};

export const userApi = {
    balance: () => api("GET", "/users/balance"),
    updateProfile: (name?: string, phone?: string) => api("PUT", "/users/profile", { name, phone }),
};
