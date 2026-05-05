// Purpose: Dedicated admin login page (Yol A — more secure).
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email və ya şifrə yanlışdır.");
        setLoading(false);
        return;
      }

      // Verify admin role via API
      const res = await fetch("/api/auth/session");
      const session = await res.json();

      if (session?.user?.role !== "admin") {
        setError("Bu hesab admin deyil. Yalnız admin girişi mümkündür.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Giriş xətası, yenidən cəhd edin.");
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-3xl mx-auto mb-4">
              🔐
            </div>
            <h1 className="text-2xl font-black text-[var(--text-primary)]">
              Admin Panel
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Yalnız admin hesabları ilə giriş mümkündür
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="float-label-wrap">
              <input
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 input-focus"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <span className="float-label">Admin Email</span>
            </div>

            <div className="float-label-wrap">
              <input
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 input-focus"
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <span className="float-label">Şifrə</span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-500">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 font-semibold text-white disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-red-500/25"
            >
              {loading ? "Yoxlanılır..." : "Admin Girişi"}
            </button>
          </form>

          <p className="text-center text-xs text-[var(--text-muted)] mt-6">
            Bu səhifə yalnız admin istifadəçilər üçündür.
          </p>
        </div>
      </div>
    </section>
  );
}
