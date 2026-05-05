// Purpose: Secure login page with Zod validation and NextAuth sign-in.
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { loginSchema } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const authError = params.get("error");
  const passwordScore =
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
  const strengthLabel =
    passwordScore <= 1 ? "Zəif" : passwordScore <= 2 ? "Orta" : "Güclü";

  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const uiAuthError =
    authError === "OAuthAccountNotLinked"
      ? "Bu email başqa giriş üsulu ilə qeydiyyatdan keçib. Zəhmət olmasa əvvəlki üsulla daxil olun."
      : authError
        ? "Giriş xətası, yenidən cəhd edin."
        : "";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Məlumatlar düzgün deyil.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);
    if (result?.error) {
      setError("Email və ya şifrə yanlışdır.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <section className="min-h-[80vh] px-4 py-12">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-[var(--border-color)] md:grid-cols-2">
        <div className="relative hidden md:block bg-gradient-to-br from-[#0066FF] to-[#00C853] p-10">
          <h2 className="text-4xl font-black text-white">BACAR.AZ</h2>
          <p className="mt-4 max-w-sm text-white/90">Bacarığını nümayiş etdir, iş tap və peşəkar şəbəkəni genişləndir.</p>
        </div>
        <form onSubmit={onSubmit} className="bg-[var(--bg-card)] p-6 sm:p-8 space-y-4">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Daxil ol</h1>
          <p className="text-sm text-[var(--text-secondary)]">Hesabınızla platformaya daxil olun.</p>
          <div className="float-label-wrap">
            <input
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 input-focus"
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="float-label">Email</span>
          </div>
          <div className="float-label-wrap">
            <input
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 input-focus"
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="float-label">Şifrə</span>
          </div>
          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-[var(--border-color)] overflow-hidden">
              <div
                className={`h-full transition-all ${
                  passwordScore <= 1 ? "bg-red-500" : passwordScore <= 2 ? "bg-yellow-500" : "bg-brand-green"
                }`}
                style={{ width: `${Math.min((passwordScore / 4) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Şifrə gücü: {strengthLabel}</p>
          </div>
          {uiAuthError ? <p className="text-sm text-red-500">{uiAuthError}</p> : null}
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button disabled={loading} className="w-full rounded-xl bg-brand-blue px-4 py-3 font-semibold text-white disabled:opacity-50">
            {loading ? "Yoxlanılır..." : "Daxil ol"}
          </button>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full rounded-xl border border-[var(--border-color)] px-4 py-3 font-semibold"
          >
            Google ilə daxil ol
          </button>
          <p className="text-sm text-[var(--text-secondary)]">
            Hesabınız yoxdur?{" "}
            <Link href="/register" className="text-brand-blue">
              Qeydiyyat
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
