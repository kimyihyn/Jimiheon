import { ArrowUpRight, Phone } from "lucide-react";
import { useState } from "react";
import { LINKS } from "./assets";
import { ReservationModal } from "./ReservationModal";
import { Fade, useI18n } from "./ui";

export function Info() {
  const { t } = useI18n();
  const i = t.info;
  const [open, setOpen] = useState(false);

  return (
    <section id="reservation" className="scroll-mt-20 border-t border-stone-300/60 py-32 md:py-44">
      <div className="mx-auto grid max-w-[1240px] gap-24 px-6 md:px-12 lg:grid-cols-12 lg:gap-12">
        <Fade className="lg:col-span-6">
          <p className="f-cg text-sm tracking-[0.25em] text-[#9E8262]">{i.label}</p>
          <h2 className="keep mt-8 f-serif text-[1.8rem] font-light leading-[1.6] tracking-[0.06em] text-[#1C1B19] md:text-[2.3rem]">{i.title}</h2>

          <dl className="mt-16 border-t border-stone-300/60">
            <Row term={i.location}>
              <p className="whitespace-pre-line">{i.locationBody}</p>
            </Row>
            <Row term={i.hours}>
              <table className="w-full max-w-xs border-collapse">
                <tbody>
                  {i.hoursRows.map(([a, b]) => (
                    <tr key={a}>
                      <td className="py-0.5 pr-6 align-top">{a}</td>
                      <td className="py-0.5 text-right tabular-nums">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Row>
            <Row term={i.facilities}>
              <ul className="space-y-1.5">
                {i.facilityList.map(f => <li key={f} className="keep">{f}</li>)}
              </ul>
            </Row>
            <Row term={i.payment}>
              <p className="keep">{i.paymentBody}</p>
            </Row>
          </dl>
        </Fade>

        <Fade delay={150} className="lg:col-span-5 lg:col-start-8 lg:pt-40">
          <div className="border-t border-[#9E8262]/60 pt-12">
            <p className="f-cg text-sm tracking-[0.25em] text-[#9E8262]">{i.reserveLabel}</p>
            <h3 className="keep mt-8 whitespace-pre-line f-serif text-[1.5rem] font-light leading-[1.7] tracking-[0.06em] text-[#1C1B19]">{i.reserveTitle}</h3>
            <p className="keep mt-8 text-[14.5px] font-light leading-[1.95] tracking-[0.01em] text-[#5C5852]">{i.reserveBody}</p>

            <div className="mt-14 space-y-4">
              <a href={LINKS.catchTable} target="_blank" rel="noopener noreferrer"
                className="group flex items-center justify-between bg-[#1C1B19] px-7 py-5 text-[#F8F6F1] transition-colors duration-700 hover:bg-[#2C221E]">
                <span>
                  <span className="block text-[15px] font-light tracking-[0.12em]">{i.catchTable}</span>
                  <span className="mt-1 block f-cg text-[13px] tracking-[0.15em] text-[#D8C7AE]/80">{i.catchTableSub}</span>
                </span>
                <ArrowUpRight size={18} strokeWidth={1} className="opacity-70 transition-opacity duration-700 group-hover:opacity-100" aria-hidden="true" />
              </a>
              <button type="button" onClick={() => setOpen(true)}
                className="group flex w-full items-center justify-between border border-[#1C1B19]/70 px-7 py-5 text-left text-[#1C1B19] transition-colors duration-700 hover:border-[#9E8262] hover:text-[#2C221E]">
                <span>
                  <span className="block text-[15px] font-light tracking-[0.12em]">{i.direct}</span>
                  <span className="mt-1 block f-cg text-[13px] tracking-[0.15em] text-[#9E8262]">{i.directSub}</span>
                </span>
                <span className="h-px w-8 bg-current opacity-50 transition-[width] duration-700 group-hover:w-12" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-10 flex items-center gap-3 text-[13px] font-light tracking-[0.08em] text-[#5C5852]">
              <Phone size={14} strokeWidth={1} aria-hidden="true" />
              <span>{i.phone}</span>
              <span className="h-px w-6 bg-stone-300" aria-hidden="true" />
              {LINKS.phone ? <a href={`tel:${LINKS.phone}`} className="tabular-nums text-[#1C1B19]">{LINKS.phone}</a> : <span>{i.phoneNone}</span>}
            </p>
          </div>
        </Fade>
      </div>
      {open && <ReservationModal onClose={() => setOpen(false)} />}
    </section>
  );
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4 border-b border-stone-300/60 py-9 md:grid-cols-[11rem_1fr]">
      <dt className="f-cg text-[15px] tracking-[0.15em] text-[#9E8262]">{term}</dt>
      <dd className="text-[14.5px] font-light leading-[1.9] tracking-[0.02em] text-[#1C1B19]">{children}</dd>
    </div>
  );
}
