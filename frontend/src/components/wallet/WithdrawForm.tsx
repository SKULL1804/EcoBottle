"use client";

import { useState } from "react";
import Link from "next/link";
import { PAYMENT_METHODS, WITHDRAW_OPTIONS } from "@/constants/wallet";

const QUICK_AMOUNTS = [10000, 15000, 25000, 50000];

export default function WithdrawForm() {
  const connectedWallets = PAYMENT_METHODS.filter((pm) => pm.connected);
  const [selectedWallet, setSelectedWallet] = useState(
    connectedWallets[0]?.name ?? "",
  );
  const [amount, setAmount] = useState("");
  const [selectedSpeed, setSelectedSpeed] = useState("Regular");
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");

  const numericAmount = parseInt(amount.replace(/\D/g, "") || "0", 10);
  const balance = 25000;
  const selectedOption = WITHDRAW_OPTIONS.find(
    (o) => o.label === selectedSpeed,
  );
  const fee =
    selectedSpeed === "Instant" ? 1000 : 0;
  const totalDeducted = numericAmount + fee;
  const isValid =
    numericAmount >= 5000 && numericAmount <= balance && selectedWallet !== "";

  const formatRupiah = (val: number) =>
    `Rp ${val.toLocaleString("id-ID")}`;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setAmount(raw);
  };

  const handleConfirm = () => {
    setStep("success");
  };

  // ─── SUCCESS SCREEN ───
  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/30">
          <span
            className="material-symbols-outlined text-on-primary text-4xl"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            check_circle
          </span>
        </div>
        <h3 className="text-2xl font-black font-headline text-on-surface mb-2">
          Withdraw Berhasil!
        </h3>
        <p className="text-tertiary text-sm mb-1">
          {formatRupiah(numericAmount)} telah dikirim ke{" "}
          <span className="font-bold text-on-surface">{selectedWallet}</span>
        </p>
        <p className="text-tertiary text-xs mb-8">
          Estimasi tiba: {selectedOption?.duration}
        </p>

        <div className="bg-surface-container-lowest rounded-2xl p-6 w-full max-w-sm shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-tertiary">Jumlah</span>
              <span className="font-bold text-on-surface">
                {formatRupiah(numericAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-tertiary">Biaya</span>
              <span className="font-bold text-on-surface">
                {fee === 0 ? "Gratis" : formatRupiah(fee)}
              </span>
            </div>
            <div className="border-t border-outline-variant/15 pt-3 flex justify-between text-sm">
              <span className="text-tertiary">Total</span>
              <span className="font-bold text-primary">
                {formatRupiah(totalDeducted)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-tertiary">Sisa Saldo</span>
              <span className="font-bold text-on-surface">
                {formatRupiah(balance - totalDeducted)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8 w-full max-w-sm">
          <Link
            href="/dashboard/wallet"
            className="flex-1 py-3.5 gradient-primary text-on-primary font-bold rounded-xl text-center shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Kembali ke Wallet
          </Link>
          <Link
            href="/dashboard/history"
            className="px-5 py-3.5 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-colors"
          >
            Riwayat
          </Link>
        </div>
      </div>
    );
  }

  // ─── CONFIRMATION SCREEN ───
  if (step === "confirm") {
    const wallet = connectedWallets.find((w) => w.name === selectedWallet);
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">
                receipt_long
              </span>
            </div>
            <h4 className="font-bold text-on-surface font-headline text-lg">
              Konfirmasi Penarikan
            </h4>
            <p className="text-tertiary text-xs mt-1">
              Periksa detail sebelum melanjutkan
            </p>
          </div>

          <div className="bg-surface rounded-xl p-4 space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-tertiary text-sm">Tujuan</span>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm">
                    {wallet?.icon}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-on-surface text-sm">
                    {wallet?.name}
                  </p>
                  <p className="text-tertiary text-[10px]">{wallet?.phone}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-outline-variant/10" />

            <div className="flex justify-between">
              <span className="text-tertiary text-sm">Jumlah</span>
              <span className="font-bold text-on-surface text-sm">
                {formatRupiah(numericAmount)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-tertiary text-sm">Metode</span>
              <span className="font-bold text-on-surface text-sm">
                {selectedSpeed}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-tertiary text-sm">Biaya</span>
              <span
                className={`font-bold text-sm ${fee === 0 ? "text-primary" : "text-tertiary"}`}
              >
                {fee === 0 ? "Gratis" : formatRupiah(fee)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-tertiary text-sm">Estimasi</span>
              <span className="font-bold text-on-surface text-sm">
                {selectedOption?.duration}
              </span>
            </div>

            <div className="border-t border-outline-variant/10" />

            <div className="flex justify-between">
              <span className="font-bold text-on-surface text-sm">
                Total Dipotong
              </span>
              <span className="font-black text-primary text-lg font-headline">
                {formatRupiah(totalDeducted)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              className="flex-1 py-3.5 gradient-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                send
              </span>
              Konfirmasi Withdraw
            </button>
            <button
              onClick={() => setStep("form")}
              className="px-5 py-3.5 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-colors"
            >
              Ubah
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN FORM ───
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left — Form */}
      <div className="lg:col-span-3 space-y-6">
        {/* Balance Summary Card */}
        <div className="bg-linear-to-br from-on-primary-container to-primary rounded-2xl p-6 text-on-primary shadow-xl relative overflow-hidden">
          <div className="absolute -top-14 -right-14 w-40 h-40 bg-primary-fixed/8 rounded-full blur-3xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-primary-fixed/60 text-xs font-medium mb-1">
                Saldo Tersedia
              </p>
              <h3 className="text-3xl font-black font-headline tracking-tight">
                {formatRupiah(balance)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-surface-container-lowest/15 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span
                className="material-symbols-outlined text-2xl"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                account_balance_wallet
              </span>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">
                payments
              </span>
            </div>
            <div>
              <h4 className="font-bold text-on-surface font-headline">
                Jumlah Penarikan
              </h4>
              <p className="text-tertiary text-xs">Minimum Rp 5.000</p>
            </div>
          </div>

          {/* Amount Field */}
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface font-black text-lg">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={amount ? parseInt(amount).toLocaleString("id-ID") : ""}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full pl-14 pr-4 py-4 bg-surface rounded-xl border border-outline-variant/30 text-on-surface text-2xl font-black font-headline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-outline/40 tracking-tight"
            />
          </div>

          {/* Quick Amounts */}
          <div className="flex gap-2 flex-wrap">
            {QUICK_AMOUNTS.map((val) => (
              <button
                key={val}
                onClick={() => setAmount(String(val))}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  numericAmount === val
                    ? "gradient-primary text-on-primary shadow-md shadow-primary/20"
                    : "bg-surface-container text-tertiary hover:bg-surface-container-high"
                }`}
              >
                {formatRupiah(val)}
              </button>
            ))}
            <button
              onClick={() => setAmount(String(balance))}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                numericAmount === balance
                  ? "gradient-primary text-on-primary shadow-md shadow-primary/20"
                  : "bg-primary/10 text-primary hover:bg-primary/15"
              }`}
            >
              Semua Saldo
            </button>
          </div>

          {/* Validation Messages */}
          {numericAmount > 0 && numericAmount < 5000 && (
            <p className="text-error text-xs mt-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              Minimum penarikan Rp 5.000
            </p>
          )}
          {numericAmount > balance && (
            <p className="text-error text-xs mt-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              Saldo tidak mencukupi
            </p>
          )}
        </div>

        {/* Withdraw Speed */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
          <h4 className="font-bold text-on-surface font-headline mb-4">
            Metode Penarikan
          </h4>
          <div className="space-y-3">
            {WITHDRAW_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setSelectedSpeed(opt.label)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  selectedSpeed === opt.label
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-transparent bg-surface hover:border-outline-variant/15"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      selectedSpeed === opt.label
                        ? "bg-primary text-on-primary"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {opt.icon}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-on-surface text-sm">
                      {opt.label}
                    </p>
                    <p className="text-tertiary text-[11px]">{opt.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold ${
                      opt.fee === "Gratis" ? "text-primary" : "text-tertiary"
                    }`}
                  >
                    {opt.fee}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedSpeed === opt.label
                        ? "border-primary bg-primary"
                        : "border-outline-variant"
                    }`}
                  >
                    {selectedSpeed === opt.label && (
                      <div className="w-2 h-2 bg-surface-container-lowest rounded-full" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={() => isValid && setStep("confirm")}
          disabled={!isValid}
          className={`w-full py-4 font-bold rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${
            isValid
              ? "gradient-primary text-on-primary shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
              : "bg-surface-container-high text-outline cursor-not-allowed shadow-none"
          }`}
        >
          <span className="material-symbols-outlined text-lg">send</span>
          Lanjut ke Konfirmasi
        </button>
      </div>

      {/* Right — Sidebar Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Destination Wallet */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
          <h4 className="font-bold text-on-surface font-headline mb-4">
            Tujuan Penarikan
          </h4>
          <div className="space-y-2">
            {connectedWallets.map((w) => (
              <button
                key={w.name}
                onClick={() => setSelectedWallet(w.name)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  selectedWallet === w.name
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-surface hover:border-outline-variant/15"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                    selectedWallet === w.name
                      ? "bg-primary text-on-primary"
                      : "bg-secondary-container text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {w.icon}
                  </span>
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-on-surface text-sm">{w.name}</p>
                  <p className="text-tertiary text-[11px]">{w.phone}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedWallet === w.name
                      ? "border-primary bg-primary"
                      : "border-outline-variant"
                  }`}
                >
                  {selectedWallet === w.name && (
                    <div className="w-2 h-2 bg-surface-container-lowest rounded-full" />
                  )}
                </div>
              </button>
            ))}
          </div>
          <Link
            href="/dashboard/wallet"
            className="mt-3 flex items-center justify-center gap-1 text-primary text-xs font-bold hover:text-primary/70 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">
              settings
            </span>
            Kelola E-Wallet
          </Link>
        </div>

        {/* Summary Preview */}
        {numericAmount > 0 && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
            <h4 className="font-bold text-on-surface font-headline mb-4">
              Ringkasan
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-tertiary">Jumlah</span>
                <span className="font-bold text-on-surface">
                  {formatRupiah(numericAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-tertiary">Biaya ({selectedSpeed})</span>
                <span
                  className={`font-bold ${fee === 0 ? "text-primary" : "text-on-surface"}`}
                >
                  {fee === 0 ? "Gratis" : formatRupiah(fee)}
                </span>
              </div>
              <div className="border-t border-outline-variant/15 pt-3 flex justify-between">
                <span className="font-bold text-on-surface text-sm">
                  Total Diterima
                </span>
                <span className="font-black text-primary text-lg font-headline">
                  {formatRupiah(numericAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-tertiary">Sisa Saldo</span>
                <span className="font-bold text-on-surface">
                  {formatRupiah(Math.max(0, balance - totalDeducted))}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
          <h4 className="font-bold text-on-surface font-headline mb-4">
            Informasi
          </h4>
          <div className="space-y-4">
            {[
              {
                icon: "info",
                text: "Minimum penarikan Rp 5.000",
              },
              {
                icon: "schedule",
                text: "Penarikan regular diproses 1-2 hari kerja",
              },
              {
                icon: "verified_user",
                text: "Semua transaksi dilindungi enkripsi",
              },
            ].map((info) => (
              <div key={info.text} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-sm">
                    {info.icon}
                  </span>
                </div>
                <p className="text-tertiary text-xs leading-relaxed">
                  {info.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
