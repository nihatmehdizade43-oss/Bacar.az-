"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, SlidersHorizontal, X } from "lucide-react";

type Job = {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  author: { name: string | null };
};

export default function JobsInteractive({ jobs }: { jobs: Job[] }) {
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openFilters, setOpenFilters] = useState(false);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(jobs.map((j) => j.category)))],
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q);
      const matchCategory =
        selectedCategory === "all" || job.category === selectedCategory;
      return matchQuery && matchCategory;
    });
  }, [jobs, query, selectedCategory]);

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(queryInput);
  };

  return (
    <section className="min-h-[80vh] px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-6">İş elanları</h1>

        <form onSubmit={onSearch} className="mb-5 flex gap-3">
          <input
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="İş axtar..."
            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3 input-focus"
          />
          <button type="submit" className="rounded-xl border border-[var(--border-color)] px-4 py-3 hover:border-brand-blue transition-colors">
            Axtar
          </button>
          <button
            type="button"
            onClick={() => setOpenFilters((p) => !p)}
            className="rounded-xl border border-[var(--border-color)] px-4 py-3 hover:border-brand-blue transition-colors"
          >
            <SlidersHorizontal size={18} />
          </button>
        </form>

        {openFilters && (
          <div className="mb-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 fade-in-up">
            <label className="text-sm text-[var(--text-secondary)]">Kateqoriya</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <article
              key={job.id}
              className="relative rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 hover:scale-[1.02] transition-transform fade-in-up"
            >
              <button
                onClick={() =>
                  setLiked((prev) => ({ ...prev, [job.id]: !prev[job.id] }))
                }
                className="absolute right-3 top-3 rounded-full p-2 hover:bg-white/5"
                aria-label="Like job"
              >
                <Heart
                  size={18}
                  className={`${liked[job.id] ? "fill-red-500 text-red-500" : "text-[var(--text-muted)]"}`}
                />
              </button>
              <Link href={`/is/${job.id}`}>
                <p className="text-sm text-brand-blue">{job.category}</p>
                <span className="inline-flex mt-2 mb-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-500">DEMO</span>
                <h2 className="font-bold text-lg mt-1">{job.title}</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2">
                  {job.description}
                </p>
                <div className="mt-4 flex justify-between text-sm">
                  <span>{job.budget} AZN</span>
                  <span>{job.author?.name ?? "Anonim"}</span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {!filteredJobs.length && (
          <div className="rounded-2xl border border-dashed border-[var(--border-color)] p-8 text-center text-[var(--text-secondary)] mt-6">
            Nəticə tapılmadı.{" "}
            <button className="text-brand-blue inline-flex items-center gap-1" onClick={() => { setQuery(""); setQueryInput(""); setSelectedCategory("all"); }}>
              Filterləri sıfırla <X size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
