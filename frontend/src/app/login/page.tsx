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
          renderButton: (
            el: HTMLElement,
            config: Record<string, unknown>,
          ) => void;
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

  const handleGoogleCallback = async (response: { credential: string }) => {
    setIsLoading(true);
    setError("");
    const ok = await googleLogin(response.credential);
    if (ok) router.replace("/dashboard");
    else setError("Login Google gagal. Coba lagi.");
    setIsLoading(false);
  };

  useEffect(() => {
    const initGoogle = () => {
      if (window.google && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: "360",
          text: "signin_with",
          shape: "rectangular",
        });
      }
    };
    const timer = setInterval(() => {
      if (window.google) {
        initGoogle();
        clearInterval(timer);
      }
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const ok = await login(email, password);
    if (ok) router.replace("/dashboard");
    else setError("Email atau password salah.");
    setIsLoading(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Left Pane - Theme Aligned Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-on-primary-container to-primary text-on-primary items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative blurred shapes matching WalletBalance/Stats theme */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-surface-container-lowest/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-md pr-8">
          {/* Aligned Logo - Desktop */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-lowest/15 backdrop-blur-sm flex items-center justify-center shadow-lg border border-on-primary/10">
              <span
                className="material-symbols-outlined text-4xl"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                recycling
              </span>
            </div>
            <h1 className="text-5xl font-extrabold font-headline tracking-tight">
              EcoBottle
            </h1>
          </div>

          <p className="text-xl opacity-90 leading-relaxed font-medium mb-12 text-on-primary/90">
            Ubah sampah botol jadi uang. Scan botol dengan AI, dapatkan saldo
            instan, dan pantau progres daur ulangmu.
          </p>

          <div className="flex gap-8">
            <div className="bg-surface-container-lowest/10 backdrop-blur-sm p-5 rounded-2xl border border-on-primary/10">
              <p className="text-4xl font-headline font-black mb-1">10K+</p>
              <p className="text-sm font-medium opacity-80">
                Botol Diselamatkan
              </p>
            </div>
            <div className="bg-surface-container-lowest/10 backdrop-blur-sm p-5 rounded-2xl border border-on-primary/10">
              <p className="text-4xl font-headline font-black mb-1">500+</p>
              <p className="text-sm font-medium opacity-80">Pengguna Aktif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Responsive styling matching cards theme shadow */}
        <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-8 sm:p-10 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] border border-transparent">
          {/* Aligned Logo - Mobile */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-on-primary-container to-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span
                className="material-symbols-outlined text-2xl"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                recycling
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-primary font-headline tracking-tighter">
              EcoBottle
            </h1>
          </div>

          <h2 className="text-2xl font-bold font-headline text-on-surface mb-2 tracking-tight">
            Selamat Datang
          </h2>
          <p className="text-tertiary text-sm font-medium mb-8">
            Masuk ke akun EcoBottle Anda untuk melanjutkan
          </p>

          {error && (
            <div className="mb-6 p-4 bg-error/10 text-error rounded-xl text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-tertiary">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@gmail.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface placeholder:text-outline/40"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-tertiary">
                  lock
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface placeholder:text-outline/40"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 gradient-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-lg">
                    login
                  </span>
                )}
                {isLoading ? "Memproses..." : "Masuk"}
              </button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30" />
            </div>
            <div className="relative flex justify-center text-xs font-semibold uppercase tracking-wider">
              <span className="px-4 bg-surface-container-lowest text-tertiary">
                atau
              </span>
            </div>
          </div>

          <div className="flex justify-center w-full">
            <div
              ref={googleBtnRef}
              className="w-full flex justify-center overflow-hidden rounded-xl"
            />
          </div>

          <p className="text-center mt-8 text-tertiary text-sm font-medium">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-primary font-bold hover:underline transiton-all"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
