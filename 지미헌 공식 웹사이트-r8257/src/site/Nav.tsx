import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ASSETS } from "./assets";
import { Logo, useI18n } from "./ui";

const ITEMS = ["philosophy", "cuisine", "space", "reservation"] as const;

export function Nav() {
  const { t, lang, setLang } = useI18n();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open]);

  const light = !solid && !open;
  const logoSrc = light ? ASSETS.logoLight || ASSETS.logo : ASSETS.logo;

  const LangToggle = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-2 f-cg text-[13px] tracking-[0.2em] ${className}`} role="group" aria-label={t.nav.lang}>
      {(["ko", "en"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span className="opacity-40" aria-hidden="true">/</span>}
          <button type="button" onClick={() => setLang(l)} aria-pressed={lang === l}
            className={`py-2 transition-opacity duration-500 ${lang === l ? "opacity-100" : "opacity-45 hover:opacity-80"}`}>
            {l === "ko" ? "KR" : "EN"}
          </button>
        </span>
      ))}
    </div>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,color,border-color] duration-700 ${
        light ? "border-b border-transparent bg-transparent text-[#F8F6F1]" : "border-b border-stone-300/60 bg-[#F8F6F1]/95 text-[#1C1B19] backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-12">
        <a href="#top" className="shrink-0" onClick={() => setOpen(false)}>
          <Logo src={logoSrc} />
        </a>
        <nav className="hidden items-center gap-10 lg:flex" aria-label="주요 메뉴">
          {ITEMS.map(k => (
            <a key={k} href={`#${k}`} className="f-cg text-[13px] tracking-[0.25em] opacity-80 transition-opacity duration-500 hover:opacity-100">
              {t.nav[k]}
            </a>
          ))}
          <span className="h-4 w-px bg-current opacity-30" aria-hidden="true" />
          <LangToggle />
        </nav>
        <div className="flex items-center gap-4 lg:hidden">
          <LangToggle />
          <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label={open ? t.nav.close : t.nav.menu} className="-mr-2 p-2">
            {open ? <X size={20} strokeWidth={1} /> : <Menu size={20} strokeWidth={1} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="h-[calc(100dvh-5rem)] border-t border-stone-300/60 bg-[#F8F6F1] px-6 pt-16 lg:hidden" aria-label="주요 메뉴">
          <ul className="space-y-10 text-center">
            {ITEMS.map(k => (
              <li key={k}>
                <a href={`#${k}`} onClick={() => setOpen(false)} className="f-cg text-xl tracking-[0.25em]">{t.nav[k]}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
