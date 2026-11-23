import { ASSETS } from "./assets";
import { Fade, Logo, Photo, useI18n } from "./ui";

export function Hero() {
  const { t } = useI18n();
  return (
    <section id="top" className="relative flex h-[100svh] min-h-[560px] items-center justify-center overflow-hidden bg-[#181715] text-[#F8F6F1]">
      <Photo src={ASSETS.exterior} alt={t.hero.alt} label="EXTERIOR · 외부 사진" eager className="absolute inset-0 h-full w-full object-cover hero-drift" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(24,23,21,0.55)_0%,rgba(24,23,21,0.6)_45%,rgba(24,23,21,0.9)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#181715]/70 to-transparent" />

      <div className="hero-in relative px-6 text-center">
        <Logo src={ASSETS.logoLight || ASSETS.logo} size="lg" className="mx-auto text-[#D8C7AE]" />
        <h1 className="mt-10">
          <span className="block f-serif text-[2.6rem] font-light leading-none tracking-[0.3em] md:text-[4.2rem]">{t.hero.title}</span>
          {!ASSETS.logo && <span className="mt-5 block f-serif text-lg font-light tracking-[0.6em] text-[#F8F6F1]/80 md:text-xl">{t.hero.hanja}</span>}
        </h1>
        <p className="keep mx-auto mt-12 max-w-md whitespace-pre-line f-serif text-[15px] font-light leading-loose tracking-[0.12em] text-[#F8F6F1]/80">
          {t.hero.sub}
        </p>
      </div>

      <a href="#philosophy" className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4 text-[#F8F6F1]/70">
        <span className="f-cg text-[11px] tracking-[0.35em]">{t.hero.scroll}</span>
        <span className="relative block h-16 w-px overflow-hidden bg-[#F8F6F1]/25">
          <span className="scroll-line absolute inset-x-0 top-0 h-6 bg-[#F8F6F1]/80" />
        </span>
      </a>
    </section>
  );
}

export function Philosophy() {
  const { t, lang } = useI18n();
  const p = t.philosophy;
  return (
    <section id="philosophy" className="scroll-mt-20 py-32 md:py-44">
      <div className="mx-auto grid max-w-[1240px] gap-14 px-6 md:px-12 lg:grid-cols-12 lg:gap-12">
        <Fade className="lg:col-span-5">
          <p className="f-cg text-sm tracking-[0.25em] text-[#9E8262]">{p.label}</p>
          <h2 className={`keep mt-8 whitespace-pre-line f-serif font-light leading-[1.6] text-[#1C1B19] ${lang === "ko" ? "text-[1.9rem] tracking-[0.04em] md:text-[2.4rem]" : "f-cg text-[2.4rem] tracking-[0.02em] md:text-[3.1rem] leading-[1.25]"}`}>
            {p.title}
          </h2>
        </Fade>
        <Fade delay={150} className="max-w-[34rem] space-y-7 lg:col-span-6 lg:col-start-7 lg:pt-24">
          {p.body.map((b, i) => (
            <p key={i} className="keep f-serif text-[15.5px] font-light leading-[2.05] tracking-[0.01em] text-[#5C5852]">{b}</p>
          ))}
          <p className="pt-2 f-cg text-[15px] tracking-[0.12em] text-[#9E8262]">— {p.sign}</p>
        </Fade>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-[#2C221E] py-28 text-[#D8C7AE]">
      <div className="mx-auto max-w-[1240px] px-6 text-center md:px-12">
        <Logo src={ASSETS.logoLight || ASSETS.logo} size="lg" className="mx-auto" />
        {!ASSETS.logo && (
          <>
            <p className="mt-6 f-cg text-lg tracking-[0.4em]">JIMIHEON</p>
            <p className="mt-2 f-serif text-sm font-light tracking-[0.5em] text-[#D8C7AE]/70">知味軒</p>
          </>
        )}
        <div className="mx-auto mt-14 max-w-md space-y-2 border-t border-[#D8C7AE]/15 pt-10 text-[13px] font-light leading-relaxed tracking-[0.06em] text-[#D8C7AE]/70">
          <p>{t.footer.address}</p>
          <p>{t.footer.hours}</p>
        </div>
        <p className="mt-14 f-cg text-xs tracking-[0.2em] text-[#D8C7AE]/45">{t.footer.copy}</p>
      </div>
    </footer>
  );
}
