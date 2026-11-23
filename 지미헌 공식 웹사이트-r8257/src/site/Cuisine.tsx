import { ASSETS } from "./assets";
import { PRICES } from "./copy";
import { Fade, Photo, useI18n, won } from "./ui";

export function Cuisine() {
  const { t, lang } = useI18n();
  const c = t.cuisine;
  const dishes = ASSETS.dishes.map((src, i) => ({ src, ...(t.dishes[i] ?? { ko: `메뉴 ${i + 1}`, en: `Dish ${i + 1}`, motif: "" }) }));

  return (
    <section id="cuisine" className="scroll-mt-20 py-32 md:py-44">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <Fade className="mx-auto max-w-2xl text-center">
          <p className="f-cg text-sm tracking-[0.25em] text-[#9E8262]">{c.label}</p>
          <h2 className="keep mt-8 f-serif text-[1.8rem] font-light leading-[1.6] tracking-[0.06em] text-[#1C1B19] md:text-[2.3rem]">{c.title}</h2>
        </Fade>

        <ul className="mt-24 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {dishes.map((d, i) => (
            <Fade as="li" key={i} delay={(i % 4) * 120}>
              <div className="group aspect-square overflow-hidden bg-[#ECE7DD]">
                <Photo src={d.src} alt={lang === "ko" ? d.ko : d.en} label={`DISH ${i + 1}`} tone="light" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              </div>
            </Fade>
          ))}
        </ul>

        <Fade className="mx-auto mt-40 max-w-3xl">
          <h3 className="text-center f-cg text-2xl font-light tracking-[0.2em] text-[#1C1B19]">{c.priceTitle}</h3>
          <div className="mt-16 border-t border-stone-300/60">
            <PriceBlock name={c.lunch} time="12:00 – 15:00" price={PRICES.lunch} pairing={c.pairing4} pairingPrice={PRICES.lunchPairing} />
            <PriceBlock name={c.dinner} time="18:00 – 22:00" price={PRICES.dinner} pairing={c.pairing6} pairingPrice={PRICES.dinnerPairing} />
          </div>
          <p className="mt-6 text-right text-xs font-light tracking-[0.08em] text-[#5C5852]">{c.vat}</p>
          <ul className="mt-16 space-y-3 border-l border-[#9E8262]/50 pl-6">
            {c.notes.map(n => (
              <li key={n} className="keep text-[13.5px] font-light leading-relaxed tracking-[0.02em] text-[#5C5852]">{n}</li>
            ))}
          </ul>
        </Fade>
      </div>
    </section>
  );
}

function PriceBlock({ name, time, price, pairing, pairingPrice }: { name: string; time: string; price: number; pairing: string; pairingPrice: number }) {
  return (
    <div className="border-b border-stone-300/60 py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="f-cg text-xl tracking-[0.18em] text-[#1C1B19] md:text-2xl">
          {name}
          <span className="ml-4 align-middle text-[13px] font-light tracking-[0.1em] text-[#9E8262] [font-family:var(--font-body)]">{time}</span>
        </p>
        <p className="text-lg font-light tracking-[0.08em] text-[#1C1B19] tabular-nums">{won(price)} <span className="text-xs tracking-[0.15em] text-[#5C5852]">KRW</span></p>
      </div>
      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[#5C5852]">
        <p className="f-cg text-[15px] tracking-[0.12em]">{pairing}</p>
        <p className="text-[15px] font-light tracking-[0.08em] tabular-nums">{won(pairingPrice)} <span className="text-xs tracking-[0.15em]">KRW</span></p>
      </div>
    </div>
  );
}
