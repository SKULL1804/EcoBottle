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
            {/* Left Pane - Theme Aligned Background */}
            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-on-primary-container to-primary text-on-primary items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative blurred shapes */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-surface-container-lowest/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10 max-w-md pr-8">
                    {/* Aligned Logo - Desktop */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-surface-container-lowest/15 backdrop-blur-sm flex items-center justify-center shadow-lg border border-on-primary/10">
                            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>recycling</span>
                        </div>
                        <h1 className="text-5xl font-extrabold font-headline tracking-tight">EcoBottle</h1>
                    </div>
                    
                    <p className="text-xl opacity-90 leading-relaxed font-medium mb-12 text-on-primary/90">
                        Bergabunglah dengan komunitas pemerhati lingkungan. Daur ulang botol plastikmu dan dapatkan hadiah nyata.
                    </p>

                    <div className="space-y-6">
                        {[{icon: "qr_code_scanner", title: "Scan Botol AI", desc: "Deteksi botol instan"}, {icon: "monetization_on", title: "Dapat Saldo", desc: "Tarik ke e-wallet"}, {icon: "public", title: "Bantu Bumi", desc: "Kurangi jejak karbon"}].map(f => (
                            <div key={f.title} className="flex items-center gap-4 bg-surface-container-lowest/10 backdrop-blur-sm p-4 rounded-2xl border border-on-primary/10">
                                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"><span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>{f.icon}</span></div>
                                <div><p className="font-bold font-headline">{f.title}</p><p className="text-sm opacity-80">{f.desc}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Pane - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
                <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-8 sm:p-10 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] border border-transparent">
                    
                    {/* Aligned Logo - Mobile */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-on-primary-container to-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>recycling</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-primary font-headline tracking-tighter">EcoBottle</h1>
                    </div>
                    
                    <h2 className="text-2xl font-bold font-headline text-on-surface mb-2 tracking-tight">{step === "register" ? "Buat Akun Baru" : "Verifikasi Email"}</h2>
                    <p className="text-tertiary text-sm font-medium mb-8">{step === "register" ? "Daftar untuk mulai mendaur ulang bersama kami" : `Masukkan kode OTP yang dikirim ke email ${email}`}</p>

                    {error && (
                        <div className="mb-6 p-4 bg-error/10 text-error rounded-xl text-sm font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 bg-primary/10 text-primary rounded-xl text-sm font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            {success}
                        </div>
                    )}

                    {step === "register" ? (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-2">Nama Lengkap</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-tertiary">person</span>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Budi Santoso" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface placeholder:text-outline/40" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-2">Email</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-tertiary">mail</span>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="budi@gmail.com" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface placeholder:text-outline/40" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-2">No. HP <span className="text-tertiary font-normal">(opsional)</span></label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-tertiary">phone</span>
                                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08123456789" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface placeholder:text-outline/40" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-2">Password</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-tertiary">lock</span>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 karakter" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface placeholder:text-outline/40" required minLength={6} />
                                </div>
                            </div>
                            <div className="pt-2">
                                <button type="submit" disabled={isLoading} className="w-full py-4 gradient-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2">
                                    {isLoading ? <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" /> : <span className="material-symbols-outlined text-lg">person_add</span>}
                                    {isLoading ? "Mendaftar..." : "Daftar Akun"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-4 text-center">Kode OTP</label>
                                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" maxLength={6} className="w-full px-4 py-4 rounded-xl bg-surface border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface text-center text-3xl tracking-[0.5em] font-black placeholder:text-outline/30 placeholder:tracking-normal placeholder:font-medium" required />
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full py-4 gradient-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2">
                                {isLoading ? <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" /> : <span className="material-symbols-outlined text-lg">verified</span>}
                                {isLoading ? "Memverifikasi..." : "Verifikasi Sekarang"}
                            </button>
                        </form>
                    )}

                    <p className="text-center mt-8 text-tertiary text-sm font-medium">
                        Sudah punya akun? <Link href="/login" className="text-primary font-bold hover:underline transition-all">Masuk di sini</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
