import { X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { api, demoStore, isDemo } from "../lib/api";
import { EaveMark, useI18n } from "./ui";

type Form = { date: string; meal: "lunch" | "dinner"; guests: number; pairing: boolean; name: string; contact: string; occasion: string; diet: string };

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const tomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 1); return ymd(d); };
const isMonday = (s: string) => new Date(`${s}T12:00:00`).getDay() === 1;

export function ReservationModal({ onClose }: { onClose: () => void }) {
  const { t, lang } = useI18n();
  const m = t.modal;
  const [f, setF] = useState<Form>({ date: "", meal: "dinner", guests: 2, pairing: false, name: "", contact: "", occasion: "", diet: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF(p => ({ ...p, [k]: v }));

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const els = [...panel.current.querySelectorAll<HTMLElement>("button, input, textarea, select, a[href]")].filter(el => !el.hasAttribute("disabled"));
        const first = els[0], last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("keydown", key); document.body.style.overflow = ""; prev?.focus(); };
  }, [onClose]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!f.date || !f.name.trim() || !f.contact.trim()) return setError(m.errFields);
    if (f.date < tomorrow()) return setError(m.errPast);
    if (isMonday(f.date)) return setError(m.errMonday);
    setBusy(true);
    try {
      const r = await api<{ code: string }>("/api/reservations", { method: "POST", body: JSON.stringify({ ...f, lang }) });
      setDone(r.code);
    } catch (err) {
      if (isDemo(err)) {
        const code = Math.random().toString(36).slice(2, 8).toUpperCase();
        demoStore.set("reservations", [...demoStore.get<unknown[]>("reservations", []), { ...f, code }]);
        setDone(code);
      } else setError((err as Error).message || m.errNetwork);
    } finally { setBusy(false); }
  }

  const dateLabel = f.date ? new Date(`${f.date}T12:00:00`).toLocaleDateString(lang === "ko" ? "ko-KR" : "en-GB", { year: "numeric", month: "long", day: "numeric", weekday: "short" }) : "";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#181715]/60 backdrop-blur-[2px] md:items-center md:p-8" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="rsv-title"
        className="modal-in max-h-[92dvh] w-full max-w-2xl overflow-y-auto bg-[#F8F6F1] text-[#1C1B19]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-300/60 bg-[#F8F6F1] px-7 py-5 md:px-12">
          <h2 id="rsv-title" className="f-serif text-lg font-light tracking-[0.15em]">{m.title}</h2>
          <button type="button" onClick={onClose} aria-label={m.close} className="-mr-2 p-2 text-[#5C5852] transition-colors duration-500 hover:text-[#1C1B19]">
            <X size={20} strokeWidth={1} />
          </button>
        </div>

        {done ? (
          <div className="px-7 py-20 text-center md:px-12" role="status">
            <EaveMark className="mx-auto w-20 text-[#9E8262]" />
            <p className="mt-10 f-serif text-xl font-light tracking-[0.1em]">{m.doneTitle}</p>
            <p className="keep mx-auto mt-5 max-w-sm text-[14px] font-light leading-[1.9] text-[#5C5852]">{m.doneBody}</p>
            <dl className="mx-auto mt-12 max-w-sm border-t border-stone-300/60 text-left text-[13.5px] font-light">
              <Line k={m.doneCode} v={<span className="tracking-[0.2em] text-[#9E8262]">{done}</span>} />
              <Line k={m.date} v={dateLabel} />
              <Line k={m.meal} v={f.meal === "lunch" ? m.lunch : m.dinner} />
              <Line k={m.guests} v={`${f.guests}${m.guestUnit}`} />
              <Line k={m.pairing} v={f.pairing ? m.pairingYes : m.pairingNo} />
            </dl>
            <button type="button" onClick={onClose} data-autofocus className="mt-12 border border-[#1C1B19]/70 px-10 py-3.5 text-[14px] font-light tracking-[0.15em] transition-colors duration-700 hover:border-[#9E8262]">{m.doneClose}</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="px-7 pb-10 pt-8 md:px-12">
            <p className="keep text-[13.5px] font-light leading-[1.9] text-[#5C5852]">{m.intro}</p>

            <div className="mt-10 grid gap-x-8 gap-y-9 md:grid-cols-2">
              <Field id="rsv-date" label={m.date} required help={m.dateHelp}>
                <input id="rsv-date" data-autofocus type="date" min={tomorrow()} value={f.date} onChange={e => set("date", e.target.value)} className="field" aria-describedby="rsv-date-help" required />
              </Field>
              <Field id="rsv-guests" label={m.guests} required>
                <select id="rsv-guests" value={f.guests} onChange={e => set("guests", Number(e.target.value))} className="field">
                  {Array.from({ length: 8 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}{m.guestUnit}</option>)}
                </select>
              </Field>
              <Choice legend={m.meal} name="meal" value={f.meal} onChange={v => set("meal", v as Form["meal"])} options={[["lunch", m.lunch], ["dinner", m.dinner]]} />
              <Choice legend={m.pairing} name="pairing" value={f.pairing ? "yes" : "no"} onChange={v => set("pairing", v === "yes")} options={[["no", m.pairingNo], ["yes", m.pairingYes]]} />
              <Field id="rsv-name" label={m.name} required>
                <input id="rsv-name" autoComplete="name" value={f.name} onChange={e => set("name", e.target.value)} placeholder={m.namePh} maxLength={40} className="field" required />
              </Field>
              <Field id="rsv-contact" label={m.contact} required>
                <input id="rsv-contact" autoComplete="tel" value={f.contact} onChange={e => set("contact", e.target.value)} placeholder={m.contactPh} maxLength={80} className="field" required />
              </Field>
              <Field id="rsv-occasion" label={m.occasion} className="md:col-span-2">
                <input id="rsv-occasion" value={f.occasion} onChange={e => set("occasion", e.target.value)} placeholder={m.occasionPh} maxLength={120} className="field" />
              </Field>
              <Field id="rsv-diet" label={m.diet} className="md:col-span-2">
                <textarea id="rsv-diet" rows={2} value={f.diet} onChange={e => set("diet", e.target.value)} placeholder={m.dietPh} maxLength={400} className="field resize-none" />
              </Field>
            </div>

            {error && <p className="mt-8 border-l border-[#9B3B2E] pl-4 text-[13.5px] font-light text-[#9B3B2E]" role="alert">{error}</p>}

            <div className="mt-12 flex flex-col-reverse items-stretch gap-5 border-t border-stone-300/60 pt-8 md:flex-row md:items-center md:justify-between">
              <p className="text-xs font-light tracking-[0.05em] text-[#5C5852]"><span className="text-[#9E8262]">*</span> {m.required}</p>
              <button type="submit" disabled={busy} className="bg-[#1C1B19] px-10 py-4 text-[14px] font-light tracking-[0.15em] text-[#F8F6F1] transition-colors duration-700 hover:bg-[#2C221E] disabled:opacity-60">
                {busy ? m.sending : m.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ id, label, required, help, className = "", children }: { id: string; label: string; required?: boolean; help?: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[12.5px] font-light tracking-[0.12em] text-[#5C5852]">
        {label}{required && <span className="ml-1 text-[#9E8262]">*</span>}
      </label>
      {children}
      {help && <p id={`${id}-help`} className="mt-2 text-[11.5px] font-light text-[#5C5852]/80">{help}</p>}
    </div>
  );
}

function Choice({ legend, name, value, onChange, options }: { legend: string; name: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <fieldset>
      <legend className="block text-[12.5px] font-light tracking-[0.12em] text-[#5C5852]">{legend}</legend>
      <div className="mt-3 grid grid-cols-2 border border-stone-300">
        {options.map(([v, l], i) => (
          <label key={v} className={`cursor-pointer px-3 py-3 text-center text-[13.5px] font-light tracking-[0.06em] transition-colors duration-500 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-[#9E8262] ${i > 0 ? "border-l border-stone-300" : ""} ${value === v ? "bg-[#1C1B19] text-[#F8F6F1]" : "text-[#1C1B19] hover:bg-[#ECE7DD]"}`}>
            <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} className="sr-only" />
            {l}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Line({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex justify-between gap-6 border-b border-stone-300/60 py-3">
      <dt className="text-[#5C5852]">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  );
}
