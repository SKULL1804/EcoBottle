"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";
import Link from "next/link";

export default function RegisterPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState<"register" | "otp">("register");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!loading && user) router.replace("/dashboard");
    }, [user, loading, router]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault(); setError(""); setIsLoading(true);
        const { status, data } = await authApi.register(name, email, password, phone || undefined);
        if (status === 201) { setStep("otp"); setSuccess("Kode OTP telah dikirim ke email Anda."); }
        else setError((data as { detail?: string }).detail || "Registrasi gagal");
        setIsLoading(false);
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault(); setError(""); setIsLoading(true);
        const { status, data } = await authApi.verifyOtp(email, otp);
        if (status === 200) { setSuccess("Akun berhasil diverifikasi! Silakan login."); setTimeout(() => router.push("/login"), 1500); }
        else setError((data as { detail?: string }).detail || "Verifikasi gagal");
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
                    <p className="text-xl opacity-90 leading-relaxed">Bergabunglah dengan komunitas pemerhati lingkungan. Daur ulang botol, dapatkan uang!</p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="lg:hidden text-center mb-8"><h1 className="text-3xl font-extrabold text-primary font-headline">🌿 EcoBottle</h1></div>
                    <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">{step === "register" ? "Buat Akun Baru" : "Verifikasi Email"}</h2>
                    <p className="text-tertiary mb-8">{step === "register" ? "Daftar untuk mulai mendaur ulang" : `Masukkan kode OTP yang dikirim ke ${email}`}</p>

                    {error && <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">{error}</div>}
                    {success && <div className="mb-6 p-4 bg-secondary-container text-on-secondary-container rounded-xl text-sm font-medium">{success}</div>}

                    {step === "register" ? (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-2">Nama Lengkap</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Budi Santoso" className="w-full px-4 py-3.5 rounded-xl bg-surface-container border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-2">Email</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="budi@gmail.com" className="w-full px-4 py-3.5 rounded-xl bg-surface-container border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-2">No. HP <span className="text-tertiary font-normal">(opsional)</span></label>
                                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08123456789" className="w-full px-4 py-3.5 rounded-xl bg-surface-container border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-2">Password</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 karakter" className="w-full px-4 py-3.5 rounded-xl bg-surface-container border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface" required minLength={6} />
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full py-4 gradient-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50">
                                {isLoading ? "Mendaftar..." : "📝 Daftar"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-2">Kode OTP</label>
                                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" maxLength={6} className="w-full px-4 py-3.5 rounded-xl bg-surface-container border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface text-center text-2xl tracking-[0.5em] font-bold" required />
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full py-4 gradient-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50">
                                {isLoading ? "Memverifikasi..." : "✅ Verifikasi"}
                            </button>
                        </form>
                    )}

                    <p className="text-center mt-8 text-tertiary text-sm">
                        Sudah punya akun? <Link href="/login" className="text-primary font-bold hover:underline">Masuk</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
