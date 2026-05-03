"use client";

import { useMemo, useState } from "react";
import { BadgeDollarSign, Briefcase, Star } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const areas = ["Hamısı", "IT", "Dizayn", "Biznes", "Dillər"];
const mentors = [
  { id: 1, name: "Elvin Rzayev", area: "IT", years: 7, price: 45, rating: 4.9 },
  { id: 2, name: "Lalə Cəfərova", area: "Dizayn", years: 5, price: 35, rating: 4.8 },
  { id: 3, name: "Kamran İsmayıl", area: "Biznes", years: 9, price: 60, rating: 5.0 },
];

export default function RehberClient() {
  const [activeArea, setActiveArea] = useState("Hamısı");
  const [maxPrice, setMaxPrice] = useState(80);
  const [selectedMentor, setSelectedMentor] = useState<(typeof mentors)[number] | null>(null);
  const [note, setNote] = useState("");

  const filtered = useMemo(
    () =>
      mentors.filter((m) => (activeArea === "Hamısı" ? true : m.area === activeArea)).filter((m) => m.price <= maxPrice),
    [activeArea, maxPrice]
  );

  return (
    <section className="min-h-screen bg-[#0A0A0A] px-4 pb-16 pt-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0066FF] to-[#00C853] p-8">
          <h1 className="text-3xl font-extrabold md:text-5xl">Mentor Tap, Öyrən, Böyü</h1>
          <p className="mt-3 text-sm text-white/90 md:text-base">Sahəyə və büdcəyə görə filter et, uyğun mentordan seans sifariş et.</p>
        </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg">
            <div className="mb-4 flex items-center gap-2 text-xs text-slate-300">
              <span className="rounded-full bg-[#0066FF]/20 px-2 py-1">1. Mentor seç</span>
              <span>→</span>
              <span className="rounded-full bg-[#00C853]/20 px-2 py-1">2. Saat seç</span>
              <span>→</span>
              <span className="rounded-full bg-[#FFD700]/20 px-2 py-1">3. Təsdiq et</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <button
                  key={area}
                  onClick={() => setActiveArea(area)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    activeArea === area ? "border-[#00C853] bg-[#00C853]/20 text-white" : "border-white/10 text-slate-300 hover:text-[#0066FF]"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="mb-2 block text-sm text-slate-300">Maks qiymət: {maxPrice} AZN/saat</label>
              <input type="range" min={20} max={80} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#00C853]" />
            </div>
          </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((mentor, idx) => (
            <article
              key={mentor.id}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur-lg transition duration-200 hover:shadow-xl hover:scale-[1.02] fade-in-up"
              style={{ animationDelay: `${idx * 90}ms` }}
            >
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C853] overflow-hidden">
                    <span className="absolute inset-0 hidden items-center justify-center bg-black/40 text-white group-hover:flex">▶</span>
                  </div>
                  <div>
                    <h2 className="font-semibold">{mentor.name}</h2>
                    <p className="text-xs text-slate-400">{mentor.area}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-200">
                  <p className="flex items-center gap-2"><Briefcase size={15} /> Təcrübə: {mentor.years} il</p>
                  <p className="flex items-center gap-2"><BadgeDollarSign size={15} /> Qiymət: {mentor.price} AZN/saat</p>
                  <p className="flex items-center gap-2"><Star size={15} className="text-[#FFD700]" /> Reytinq: {mentor.rating}</p>
                </div>

                <button onClick={() => setSelectedMentor(mentor)} className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00C853] py-2 text-sm font-semibold">Seans sifariş et</button>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-400">Demo: 3 mentor</p>
      </div>
      <Modal isOpen={!!selectedMentor} onClose={() => setSelectedMentor(null)} title="Seans sifarişi" size="md">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSelectedMentor(null); setNote(""); }}>
          <p className="text-sm text-[var(--text-secondary)]">{selectedMentor?.name} üçün sifariş göndər.</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="Seans barədə qeydiniz..."
            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-3"
          />
          <div className="flex gap-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setSelectedMentor(null)}>Ləğv et</Button>
            <Button type="submit" variant="success" className="flex-1">Təsdiq et</Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
