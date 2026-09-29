import { useState } from "react";
import { Dialog } from "@/components/dialog";
import { glossaryEntry, splitGlossary, type GlossaryEntry } from "@/lib/glossary";
import { BookOpen } from "lucide-react";

/**
 * U9: teks materi dengan istilah yang bisa diketuk untuk melihat artinya.
 *
 * Sumber teks TIDAK diubah — pencocokan terjadi saat render (`splitGlossary`).
 * Definisi tampil di `Dialog` yang sudah ada (sudah lolos guard a11y & portal).
 * Satu istilah hanya ditautkan sekali per blok teks supaya tidak penuh garis.
 */
export function GlossaryText({ text, className }: { text: string; className?: string }) {
  const [active, setActive] = useState<GlossaryEntry | null>(null);
  const segments = splitGlossary(text);

  return (
    <>
      <span className={className}>
        {segments.map((seg, i) =>
          seg.entry ? (
            <button
              key={`${seg.entry.id}-${i}`}
              type="button"
              onClick={() => setActive(seg.entry)}
              aria-haspopup="dialog"
              aria-label={`Lihat arti ${seg.entry.term}`}
              className="inline font-semibold text-candy-700 underline decoration-dotted decoration-candy-600/60 underline-offset-2 hover:text-candy-600 focus-visible:text-candy-600 cursor-pointer transition-colors"
            >
              {seg.text}
            </button>
          ) : (
            <span key={i}>{seg.text}</span>
          ),
        )}
      </span>

      <Dialog
        open={active !== null}
        title={active ? active.term : ""}
        onClose={() => setActive(null)}
      >
        {active ? (
          <div className="mt-1">
            <p className="text-sm font-medium leading-relaxed text-choco-700">{active.def}</p>
            {active.related && active.related.length > 0 ? (
              <div className="mt-3.5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-choco-500">Lihat juga</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {active.related.map((id) => {
                    const rel = glossaryEntry(id);
                    if (!rel) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActive(rel)}
                        className="rounded-full border-2 border-choco-900 bg-white px-3 py-1.5 font-pixel text-[11px] font-bold text-choco-900 shadow-[0_2px_0_#3B2218] hover:bg-cream active:translate-y-0.5 active:shadow-[0_1px_0_#3B2218] cursor-pointer transition-all"
                      >
                        {rel.term}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-choco-500">
              <BookOpen className="size-3.5 shrink-0" />
              <span>Daftar lengkap ada di halaman Kamus Istilah.</span>
            </div>
          </div>
        ) : null}
      </Dialog>
    </>
  );
}
