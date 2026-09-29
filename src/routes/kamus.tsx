import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GLOSSARY, glossaryEntry } from "@/lib/glossary";
import { buildMeta } from "@/lib/seo";
import { MagnifyingGlass, ArrowRight } from "@/lib/kicon";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/kamus")({
  head: () =>
    buildMeta({
      title: "Kamus Istilah Web3 | web3min",
      description:
        "Arti istilah web3 yang sering bikin bingung: seed phrase, gas, slippage, L2, stablecoin, dan puluhan lainnya. Dijelaskan singkat dengan bahasa sehari-hari.",
      path: "/kamus",
    }),
  component: KamusPage,
});

function KamusPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const entries = useMemo(() => {
    const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "id"));
    if (!q) return sorted;
    return sorted.filter(
      (e) =>
        e.term.toLowerCase().includes(q) ||
        (e.aliases ?? []).some((a) => a.toLowerCase().includes(q)) ||
        e.def.toLowerCase().includes(q),
    );
  }, [q]);

  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="rounded-[28px] border-2 border-choco-900 bg-linear-to-b from-blush-50 to-blush-200 p-5 sm:p-6 shadow-[0_6px_0_#3B2218]">
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-choco-900 bg-white px-3 py-1 font-pixel text-[10px] font-bold text-choco-900 shadow-[0_2px_0_#3B2218]">
            <BookOpen className="size-3.5" />
            KAMUS ISTILAH
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-display font-black text-choco-900 tracking-tight">
            Kamus Istilah Web3
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-semibold text-choco-700 leading-relaxed">
            Istilah yang muncul di materi dan kuis, dijelaskan singkat dengan bahasa sehari-hari. Di dalam pelajaran,
            ketuk kata bergaris putus-putus untuk membuka artinya langsung.
          </p>

          {/* Pencarian */}
          <div className="mt-4">
            <label htmlFor="kamus-cari" className="sr-only">
              Cari istilah
            </label>
            <div className="relative">
              <MagnifyingGlass
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-choco-500"
                weight="bold"
              />
              <input
                id="kamus-cari"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari istilah, mis. slippage"
                autoComplete="off"
                className="w-full h-13 pl-11 pr-4 rounded-2xl bg-white border-2 border-choco-900 text-base sm:text-sm font-bold text-choco-900 placeholder:text-choco-500 shadow-[0_2px_0_#3B2218] focus:border-candy-500 focus:shadow-[0_3px_0_#3B2218] outline-none transition-all"
              />
            </div>
            <p className="mt-2 text-[11px] font-semibold text-choco-600" role="status">
              {q
                ? entries.length > 0
                  ? `${entries.length} istilah cocok dengan "${query.trim()}".`
                  : `Tidak ada istilah yang cocok dengan "${query.trim()}".`
                : `${entries.length} istilah, diurutkan A sampai Z.`}
            </p>
          </div>
        </div>

        {/* Daftar */}
        {entries.length === 0 ? (
          <div className="mt-6 rounded-[24px] border-2 border-choco-900 bg-white p-6 text-center shadow-[0_4px_0_#3B2218]">
            <p className="font-pixel text-sm font-bold text-choco-900">Belum ketemu.</p>
            <p className="mt-1 text-xs font-semibold text-choco-600">
              Coba kata kunci lain, atau lihat daftar lengkap dengan menghapus isian pencarian.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl border-2 border-choco-900 bg-white px-5 font-pixel text-xs font-bold text-choco-900 shadow-[0_3px_0_#3B2218] hover:bg-cream active:translate-y-0.5 active:shadow-[0_1px_0_#3B2218] cursor-pointer transition-all"
            >
              Tampilkan semua
            </button>
          </div>
        ) : (
          <ul className="mt-6 flex flex-col gap-3">
            {entries.map((e) => (
              <li
                key={e.id}
                className="rounded-[24px] border-2 border-choco-900 bg-white p-4 sm:p-5 shadow-[0_4px_0_#3B2218]"
              >
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h2 className="font-pixel text-sm sm:text-base font-bold text-choco-900">{e.term}</h2>
                  {e.aliases && e.aliases.length > 0 ? (
                    <span className="text-[11px] font-semibold text-choco-500">
                      disebut juga {e.aliases.join(", ")}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-[13.5px] font-medium leading-[22px] text-choco-700">{e.def}</p>
                {e.related && e.related.length > 0 ? (
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-choco-500">Lihat juga:</span>
                    {e.related.map((id) => {
                      const rel = glossaryEntry(id);
                      if (!rel) return null;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setQuery(rel.term)}
                          className="rounded-full border border-choco-900 bg-cream px-2.5 py-1 text-[11px] font-bold text-choco-900 hover:bg-candy-50 cursor-pointer transition-colors"
                        >
                          {rel.term}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        {/* Ajakan balik ke pelajaran */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-b from-blush-50 to-blush-200 hover:brightness-105 text-choco-900 font-pixel font-bold text-xs sm:text-sm border-2 border-candy-600 shadow-[0_4px_0_#B01F62] active:translate-y-1 active:shadow-[0_1px_0_#B01F62] cursor-pointer flex items-center justify-center gap-2 transition-all text-center"
          >
            <span>Balik ke Peta Belajar</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
