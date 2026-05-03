// Purpose: Registration page with Zod validation and API-backed signup.
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerSchema } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const parsed = registerSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Məlumatlar düzgün deyil.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data?.error?.message ?? "Qeydiyyat uğursuz oldu.");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <section className="min-h-[80vh] px-4 py-12">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-[var(--border-color)] md:grid-cols-2">
        <div className="relative hidden md:block bg-gradient-to-br from-[#0066FF] to-[#00C853] p-10">
          <h2 className="text-4xl font-black text-white">BACAR.AZ</h2>
          <p className="mt-4 max-w-sm text-white/90">Qeydiyyatdan keç və dashboard üzərindən iş elanları ilə işləməyə başla.</p>
        </div>
        <form onSubmit={onSubmit} className="bg-[var(--bg-card)] p-6 sm:p-8 space-y-4">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Qeydiyyat</h1>
          <input className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3" placeholder="Ad Soyad" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3" type="email" placeholder="email@bacar.az" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3" type="password" placeholder="Minimum 8 simvol" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button disabled={loading} className="w-full rounded-xl bg-brand-green px-4 py-3 font-semibold text-white disabled:opacity-50">
            {loading ? "Yaradılır..." : "Hesab yarat"}
          </button>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full rounded-xl border border-[var(--border-color)] px-4 py-3 font-semibold"
          >
            Google ilə 1 klik qeydiyyat
          </button>
          <p className="text-sm text-[var(--text-secondary)]">
            Hesabınız var?{" "}
            <Link href="/login" className="text-brand-blue">
              Daxil ol
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
