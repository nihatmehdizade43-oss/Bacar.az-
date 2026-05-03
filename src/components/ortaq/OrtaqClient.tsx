"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Users } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const tags = ["React", "UI/UX", "Node.js", "Python", "Dizayn", "Video"];
const users = [
  { id: 1, name: "Aylin Həsən", city: "Bakı", status: "Komanda axtarıram", skills: ["React", "UI/UX"] },
  { id: 2, name: "Murad Əliyev", city: "Gəncə", status: "Tək işləyirəm", skills: ["Node.js", "Python"] },
  { id: 3, name: "Nərmin Səfər", city: "Sumqayıt", status: "Komanda axtarıram", skills: ["Dizayn", "Video"] },
  { id: 4, name: "Rəşad Məmməd", city: "Şəki", status: "Komanda axtarıram", skills: ["React", "Node.js"] },
  { id: 5, name: "Sevda Quliyeva", city: "Lənkəran", status: "Tək işləyirəm", skills: ["Python", "UI/UX"] },
];

export default function OrtaqClient() {
  const [activeTag, setActiveTag] = useState<string>("Hamısı");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<(typeof users)[number] | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(
    () => (activeTag === "Hamısı" ? users : users.filter((u) => u.skills.includes(activeTag))),
    [activeTag]
  );

  return (
    <section className="min-h-screen bg-[#0A0A0A] px-4 pb-16 pt-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0066FF] to-[#00C853] p-8">
          <h1 className="text-3xl font-extrabold md:text-5xl">Komanda Yoldaşı Tap</h1>
          <p className="mt-3 text-sm text-white/90 md:text-base">Bacarıqlara görə filter et, uyğun tərəfdaşla layihəyə başla.</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {["Hamısı", ...tags].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                activeTag === tag ? "border-[#00C853] bg-[#00C853]/20 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:text-[#0066FF]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading &&
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-56 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="skeleton-shimmer h-full w-full rounded-xl" />
              </div>
            ))}

          {!loading &&
            filtered.map((user, idx) => (
              <article
                key={user.id}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur-lg transition duration-200 hover:shadow-xl hover:scale-[1.02] fade-in-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 font-bold">{user.name.split(" ").map((n) => n[0]).join("")}</div>
                  <div>
                    <h2 className="font-semibold">{user.name}</h2>
                    <p className="flex items-center gap-1 text-xs text-slate-400"><MapPin size={14} />{user.city}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-white/10 px-2 py-1 text-xs text-slate-200">{skill}</span>
                  ))}
                </div>

                <div className="mt-4 rounded-xl bg-black/30 p-2 text-sm text-[#FFD700] flex items-center justify-between">
                  <span>{user.status}</span>
                  <span className="text-brand-green">✓</span>
                </div>
                <button onClick={() => setSelectedUser(user)} className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00C853] py-2 text-sm font-semibold">Təklif göndər</button>
              </article>
            ))}
        </div>
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-400"><Users size={16} />Demo: 5 istifadəçi</div>
      </div>
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Təklif göndər" size="md">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSelectedUser(null); setMessage(""); }}>
          <p className="text-sm text-[var(--text-secondary)]">
            {selectedUser?.name} üçün təklif mesajınızı yazın.
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            placeholder="Təklif mesajınızı yazın..."
            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-3"
          />
          <div className="flex gap-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setSelectedUser(null)}>Ləğv et</Button>
            <Button type="submit" variant="success" className="flex-1">Göndər</Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
