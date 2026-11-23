import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ASSETS } from "./assets";
import { Fade, Photo, useI18n } from "./ui";

export function Space() {
  const { t } = useI18n();
  const [index, setIndex] = useState<number | null>(null);
  const photos = ASSETS.interior;

  return (
    <section id="space" className="scroll-mt-20 bg-[#181715] py-32 text-[#F8F6F1] md:py-44">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <Fade className="grid gap-10 border-b border-[#F8F6F1]/12 pb-20 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="f-cg text-sm tracking-[0.25em] text-[#9E8262]">{t.space.label}</p>
            <h2 className="keep mt-8 f-serif text-[1.8rem] font-light leading-[1.6] tracking-[0.06em] md:text-[2.3rem]">{t.space.title}</h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 md:self-end">
            <p className="keep f-serif text-[15px] font-light leading-[2.05] text-[#F8F6F1]/65">{t.space.body}</p>
            <p className="mt-6 text-xs font-light tracking-[0.12em] text-[#F8F6F1]/40">{t.space.hint}</p>
          </div>
        </Fade>

        <ul className="mt-20 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {photos.map((src, i) => (
            <Fade as="li" key={i} delay={(i % 3) * 120}>
              <button type="button" onClick={() => setIndex(i)} className="group block w-full" aria-label={`${t.space.photos[i] ?? ""} — 크게 보기`}>
                <div className="aspect-[4/5] overflow-hidden bg-[#23211E]">
                  <Photo src={src} alt={t.space.photos[i] ?? ""} label={`INTERIOR ${i + 1}`} className="h-full w-full object-cover opacity-90 transition-[opacity,transform] duration-[1200ms] ease-out group-hover:scale-[1.03] group-hover:opacity-100" />
                </div>
              </button>
            </Fade>
          ))}
        </ul>
      </div>
      {index !== null && <Lightbox index={index} setIndex={setIndex} />}
    </section>
  );
}

function Lightbox({ index, setIndex }: { index: number; setIndex: (i: number | null) => void }) {
  const { t } = useI18n();
  const photos = ASSETS.interior;
  const closeRef = useRef<HTMLButtonElement>(null);
  const go = useCallback((d: number) => setIndex((index + d + photos.length) % photos.length), [index, photos.length, setIndex]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; prev?.focus(); };
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [go, setIndex]);

  return (
    <div className="lightbox-in fixed inset-0 z-50 flex flex-col bg-[#181715]/97 text-[#F8F6F1]" role="dialog" aria-modal="true" aria-label={t.space.photos[index]}>
      <div className="flex h-20 shrink-0 items-center justify-between px-6 md:px-12">
        <span className="f-cg text-sm tracking-[0.3em] text-[#9E8262]">{String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
        <button ref={closeRef} type="button" onClick={() => setIndex(null)} aria-label={t.space.close} className="-mr-2 p-2 opacity-70 transition-opacity duration-500 hover:opacity-100">
          <X size={22} strokeWidth={1} />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24" onClick={e => e.target === e.currentTarget && setIndex(null)}>
        <Photo key={index} src={photos[index]} alt={t.space.photos[index] ?? ""} label={`INTERIOR ${index + 1}`} className="lightbox-img max-h-full max-w-full object-contain" />
        <button type="button" onClick={() => go(-1)} aria-label={t.space.prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-3 opacity-60 transition-opacity duration-500 hover:opacity-100 md:left-8">
          <ChevronLeft size={28} strokeWidth={0.8} />
        </button>
        <button type="button" onClick={() => go(1)} aria-label={t.space.next} className="absolute right-2 top-1/2 -translate-y-1/2 p-3 opacity-60 transition-opacity duration-500 hover:opacity-100 md:right-8">
          <ChevronRight size={28} strokeWidth={0.8} />
        </button>
      </div>
      <div className="h-20 shrink-0" />
    </div>
  );
}
