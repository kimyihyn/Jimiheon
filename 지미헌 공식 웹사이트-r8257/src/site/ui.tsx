import { createContext, use, useEffect, useRef, useState, type ReactNode } from "react";
import { COPY, type Copy, type Lang } from "./copy";

// ── 언어 ─────────────────────────────────────────────────────────────────────
type I18n = { lang: Lang; t: Copy; setLang: (l: Lang) => void };
const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try { return (localStorage.getItem("jimiheon.lang") as Lang) === "en" ? "en" : "ko"; } catch { return "ko"; }
  });
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("jimiheon.lang", l); } catch { /* 저장 불가 */ }
  };
  return <I18nContext value={{ lang, t: COPY[lang], setLang }}>{children}</I18nContext>;
}

export function useI18n() {
  const v = use(I18nContext);
  if (!v) throw new Error("I18nProvider 가 없어요");
  return v;
}

// ── 고요한 페이드인: 투명도만 1.1초에 걸쳐 ─────────────────────────────────────
export function Fade({ children, className = "", delay = 0, as: Tag = "div" }: { children: ReactNode; className?: string; delay?: number; as?: "div" | "section" | "li" | "figure" }) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { rootMargin: "0px 0px -12% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as never}
      className={`quiet-fade ${shown ? "is-shown" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

// ── 이미지 자리: 주소가 없거나 깨지면 라벨이 적힌 액자 ───────────────────────────
export function Photo({ src, alt, label, className = "", imgClassName = "", tone = "dark", eager = false }: { src: string; alt: string; label: string; className?: string; imgClassName?: string; tone?: "dark" | "light"; eager?: boolean }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div className={`flex items-center justify-center ${tone === "dark" ? "bg-[#23211E] text-[#9E8262]" : "bg-[#ECE7DD] text-[#9E8262]"} ${className}`} role="img" aria-label={alt}>
        <div className="m-4 flex h-[calc(100%-2rem)] w-[calc(100%-2rem)] flex-col items-center justify-center gap-3 border border-current/30 text-center">
          <EaveMark className="w-10 opacity-70" />
          <span className="f-cg text-sm tracking-[0.2em]">{label}</span>
        </div>
      </div>
    );
  }
  return <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setBroken(true)} className={`${className} ${imgClassName}`} />;
}

// ── 기와 처마 로고 ──────────────────────────────────────────────────────────
export function EaveMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 28" fill="none" className={className} aria-hidden="true">
      <path d="M2 22 C 22 22, 34 12, 60 10 C 86 12, 98 22, 118 22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M2 22 C 4 19, 6 17, 9 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M118 22 C 116 19, 114 17, 111 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M30 17.5 C 42 13, 50 12.4, 60 12.2 C 70 12.4, 78 13, 90 17.5" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" opacity="0.6" />
      <path d="M60 4 L60 10" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ src, size = "sm", className = "" }: { src: string; size?: "sm" | "lg"; className?: string }) {
  if (src) return <img id={size === "sm" ? "brand-logo" : undefined} src={src} alt="지미헌 知味軒 JIMIHEON" className={`${size === "sm" ? "h-11 md:h-12" : "h-36 md:h-48"} w-auto object-contain ${className}`} />;
  return (
    <span id={size === "sm" ? "brand-logo" : undefined} className={`inline-flex flex-col items-center ${className}`} aria-label="지미헌 知味軒 JIMIHEON" role="img">
      <EaveMark className={size === "sm" ? "w-16" : "w-36 md:w-44"} />
      {size === "sm" ? (
        <span className="mt-1 f-cg text-[13px] leading-none tracking-[0.32em]">JIMIHEON <span className="f-serif text-[11px] tracking-[0.2em]">知味軒</span></span>
      ) : null}
    </span>
  );
}

export const won = (n: number) => n.toLocaleString("en-US");
