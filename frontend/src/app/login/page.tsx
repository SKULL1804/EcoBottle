"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: Record<string, unknown>) => void;
                    renderButton: (el: HTMLElement, config: Record<string, unknown>) => void;
                };
            };
        };
    }
}

export default function LoginPage() {
    const { login, googleLogin, user, loading } = useAuth();
    const router = useRouter();
    const googleBtnRef = useRef<HTMLDivElement>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!loading && user) router.replace("/dashboard");
    }, [user, loading, router]);

    useEffect(() => {
        const initGoogle = () => {
            if (window.google && googleBtnRef.current) {
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    callback: handleGoogleCallback,
                });
                window.google.accounts.id.renderButton(googleBtnRef.current, {
                    theme: "outline", size: "large", width: "360", text: "signin_with", shape: "rectangular",
                });
            }
        };
        const timer = setInterval(() => {
            if (window.google) { initGoogle(); clearInterval(timer); }
        }, 200);
        return () => clearInterval(timer);
    }, []);

    const handleGoogleCallback = async (response: { credential: string }) => {
        setIsLoading(true); setError("");
        const ok = await googleLogin(response.credential);
        if (ok) router.replace("/dashboard");
        else setError("Login Google gagal. Coba lagi.");
        setIsLoading(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); setError(""); setIsLoading(true);
        const ok = await login(email, password);
        if (ok) router.replace("/dashboard");
        else setError("Email atau password salah.");
        setIsLoading(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen flex bg-surface">
            <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12">
                <div className="text-on-primary max-w-md">
                    <h1 className="text-5xl font-extrabold font-headline mb-6">🌿 EcoBottle</h1>
                    <p className="text-xl opacity-90 leading-relaxed">Ubah sampah botol jadi uang. Scan botol dengan AI, dapatkan saldo instan.</p>
                    <div className="mt-10 flex gap-8">
                        <div><p className="text-3xl font-bold">10K+</p><p className="text-sm opacity-70">Botol Didaur Ulang</p></div>
                        <div><p className="text-3xl font-bold">500+</p><p className="text-sm opacity-70">Pengguna Aktif</p></div>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-primary font-headline">🌿 EcoBottle</h1>
                    </div>
                    <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">Selamat Datang</h2>
                    <p className="text-tertiary mb-8">Masuk ke akun EcoBottle Anda</p>

                    {error && <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">{error}</div>}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-on-surface mb-2">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="budi@gmail.com" className="w-full px-4 py-3.5 rounded-xl bg-surface-container border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-on-surface mb-2">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3.5 rounded-xl bg-surface-container border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface" required />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full py-4 gradient-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-wait">
                            {isLoading ? "Memproses..." : "🔑 Masuk"}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant" /></div>
                        <div className="relative flex justify-center text-sm"><span className="px-4 bg-surface text-tertiary">atau</span></div>
                    </div>

                    <div className="flex justify-center"><div ref={googleBtnRef} /></div>

                    <p className="text-center mt-8 text-tertiary text-sm">
                        Belum punya akun? <Link href="/register" className="text-primary font-bold hover:underline">Daftar</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
