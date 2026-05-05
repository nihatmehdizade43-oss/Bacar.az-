// Purpose: Professional registration page with Zod validation and API-backed signup.
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = info, 2 = password
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password strength
  const passwordScore =
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
  const strengthLabel =
    password.length === 0
      ? ""
      : passwordScore <= 1
        ? "Zəif"
        : passwordScore <= 2
          ? "Orta"
          : passwordScore <= 3
            ? "Güclü"
            : "Çox güclü";
  const strengthColor =
    passwordScore <= 1
      ? "bg-red-500"
      : passwordScore <= 2
        ? "bg-yellow-500"
        : "bg-brand-green";

  function goToStep2() {
    setError("");
    if (!name.trim() || name.trim().length < 2) {
      setError("Ad minimum 2 simvol olmalıdır.");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Düzgün email daxil edin.");
      return;
    }
    setStep(2);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (step === 1) {
      goToStep2();
      return;
    }

    // Step 2 validation
    if (password.length < 8) {
      setError("Şifrə minimum 8 simvol olmalıdır.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Şifrələr uyğun gəlmir.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error?.message ?? "Qeydiyyat uğursuz oldu. Yenidən cəhd edin.");
        setLoading(false);
        return;
      }

      // Auto-login after registration
      setSuccess(true);

      const signInResult = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Registration succeeded but auto-login failed — redirect to login
        router.push("/login");
        return;
      }

      // Wait a moment for the success animation
      await new Promise((r) => setTimeout(r, 1000));
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Server xətası baş verdi. Zəhmət olmasa bir az sonra cəhd edin.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-brand-green/20 flex items-center justify-center text-4xl mx-auto mb-6"
          >
            ✅
          </motion.div>
          <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">
            Qeydiyyat uğurlu!
          </h2>
          <p className="text-[var(--text-secondary)]">
            Dashboard-a yönləndirilirsiniz...
          </p>
          <div className="mt-4">
            <div className="animate-spin w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full mx-auto" />
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[var(--border-color)] shadow-2xl md:grid-cols-2">
        {/* Left — Branding Panel */}
        <div className="relative hidden md:flex flex-col justify-between bg-gradient-to-br from-[#00C853] via-[#00A844] to-[#0066FF] p-10 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative z-10">
            <Link href="/" className="inline-block">
              <h2 className="text-4xl font-black text-white tracking-tight">
                BACAR<span className="text-white/60">.</span>AZ
              </h2>
            </Link>
            <p className="mt-4 max-w-sm text-white/85 leading-relaxed text-lg">
              Bacarığını göstər, iş tap, peşəkar şəbəkəni genişləndir.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <span className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">⚡</span>
              <span>2 dəqiqədə qeydiyyatdan keç</span>
            </div>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <span className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">🎯</span>
              <span>AI ilə portfolio yarat</span>
            </div>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <span className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">🔒</span>
              <span>Təhlükəsiz və pulsuz</span>
            </div>
          </div>
        </div>

        {/* Right — Register Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[var(--bg-card)] p-8 sm:p-10"
        >
          <div className="mb-8">
            {/* Mobile Logo */}
            <div className="md:hidden mb-4">
              <Link href="/">
                <span className="text-2xl font-black">
                  <span className="gradient-text-blue">BACAR</span>
                  <span className="text-[var(--text-primary)]">.</span>
                  <span className="gradient-text-green">AZ</span>
                </span>
              </Link>
            </div>
            <h1 className="text-2xl font-black text-[var(--text-primary)]">
              Hesab yaradın
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Pulsuz qeydiyyatdan keçin və başlayın
            </p>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 mt-4">
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? "bg-brand-green" : "bg-[var(--border-color)]"}`} />
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-brand-green" : "bg-[var(--border-color)]"}`} />
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1.5">
              Addım {step}/2 — {step === 1 ? "Məlumatlar" : "Şifrə"}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                      Ad Soyad
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">👤</span>
                      <input
                        className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] pl-11 pr-4 py-3.5 text-sm input-focus transition-all"
                        placeholder="Adınız Soyadınız"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoComplete="name"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">📧</span>
                      <input
                        className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] pl-11 pr-4 py-3.5 text-sm input-focus transition-all"
                        type="email"
                        placeholder="email@nümunə.az"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-5"
                >
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                      Şifrə
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">🔒</span>
                      <input
                        className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] pl-11 pr-12 py-3.5 text-sm input-focus transition-all"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 8 simvol"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm"
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>

                    {/* Password Strength */}
                    {password.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2 space-y-1"
                      >
                        <div className="h-1.5 rounded-full bg-[var(--border-color)] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((passwordScore / 4) * 100, 100)}%` }}
                            className={`h-full transition-colors ${strengthColor}`}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-[var(--text-muted)]">
                            Şifrə gücü: <span className="font-medium">{strengthLabel}</span>
                          </p>
                          <div className="flex gap-1 text-xs text-[var(--text-muted)]">
                            {password.length >= 8 ? "✅" : "❌"} 8+
                            {/[A-Z]/.test(password) ? " ✅" : " ❌"} Böyük
                            {/[0-9]/.test(password) ? " ✅" : " ❌"} Rəqəm
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                      Şifrəni təsdiqlə
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">🔐</span>
                      <input
                        className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] pl-11 pr-4 py-3.5 text-sm input-focus transition-all"
                        type="password"
                        placeholder="Şifrəni yenidən daxil edin"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                      />
                      {confirmPassword.length > 0 && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2">
                          {password === confirmPassword ? "✅" : "❌"}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Errors */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-500 flex items-start gap-2"
              >
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(""); }}
                  className="rounded-xl border border-[var(--border-color)] px-6 py-3.5 font-semibold text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-card-hover)]"
                >
                  ← Geri
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-brand-green to-emerald-600 px-4 py-3.5 font-semibold text-white disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-green-500/25 hover:brightness-110 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Yaradılır...
                  </>
                ) : step === 1 ? (
                  "Davam et →"
                ) : (
                  "Hesab yarat"
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border-color)]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[var(--bg-card)] px-3 text-[var(--text-muted)]">və ya</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3.5 font-semibold text-[var(--text-primary)] transition-all hover:bg-[var(--bg-card-hover)] hover:shadow-md flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google ilə 1 klik qeydiyyat
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Artıq hesabınız var?{" "}
            <Link
              href="/login"
              className="text-brand-blue font-semibold hover:underline"
            >
              Daxil ol
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
