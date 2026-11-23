// 지미헌 소유자 화면: 홈페이지로 들어온 예약 문의(상태 변경) + 설정(예약 문의 받기/멈춤).
import { CalendarDays, Settings as Gear } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { content, ownerSample, reservationStatus, settings } from "../content";
import { sample, type Row } from "../lib/data";
import { dateKo, dateTimeKo } from "../lib/format";
import { DetailDrawer, Field } from "../owner/DetailDrawer";
import { OwnerGate, useOwner } from "../owner/OwnerGate";
import { OwnerShell } from "../owner/OwnerShell";
import { RecordList, type Column } from "../owner/RecordList";
import { SettingsForm } from "../owner/SettingsForm";
import { StatusActions, StatusPill } from "../owner/StatusPill";

type Reservation = Row & {
  id: number; code: string; visit_date: string; meal: string; guests: number; pairing: number;
  name: string; contact: string; occasion: string; diet: string; lang: string; status: string; created_at: string;
};

const mealLabel = (m: string) => (m === "lunch" ? "런치 12:00" : "디너 18:00");

export default function Admin() {
  const demo = useMemo(() => sample(ownerSample, settings, { reservations: reservationStatus }), []);
  return (
    <OwnerGate title={content.owner.title} sample={demo}>
      <Screens />
    </OwnerGate>
  );
}

function Screens() {
  const { data } = useOwner();
  const [tab, setTab] = useState(() => new URLSearchParams(location.search).get("tab") ?? "inbox");
  const [rows, setRows] = useState<Reservation[] | null>(null);
  const [open, setOpen] = useState<Reservation | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [conf, setConf] = useState<{ values: Record<string, unknown>; updated: string | null } | null>(null);

  const load = useCallback(() => data.list<Reservation>("reservations").then(setRows, e => setError(e.message)), [data]);
  useEffect(() => { void load(); data.settings().then(setConf, e => setError(e.message)); }, [data, load]);
  const go = (id: string) => { setTab(id); history.replaceState(null, "", id === "inbox" ? location.pathname : `?tab=${id}`); };

  async function patch(p: Partial<Reservation>) {
    if (!open) return;
    setBusy(true); setError("");
    try {
      const row = await data.update<Reservation>("reservations", open.id, p);
      setRows(rs => rs?.map(r => (r.id === row.id ? row : r)) ?? rs);
      setOpen(row);
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }

  const columns: Column<Reservation>[] = [
    { key: "visit_date", label: "방문일", width: "11.5rem", render: r => dateKo(`${r.visit_date}T12:00:00`), csv: r => r.visit_date },
    { key: "meal", label: "식사", width: "6rem", render: r => mealLabel(r.meal), csv: r => mealLabel(r.meal) },
    { key: "guests", label: "인원", width: "4rem", render: r => `${r.guests}명` },
    { key: "name", label: "예약자", width: "minmax(0,1fr)" },
    { key: "occasion", label: "기념일·식이", width: "minmax(0,1.4fr)", render: r => [r.occasion, r.diet].filter(Boolean).join(" / ") || "—", hideOnPhone: true, csv: r => [r.occasion, r.diet].filter(Boolean).join(" / ") },
    { key: "status", label: "상태", width: "6.5rem", render: r => <StatusPill status={r.status} config={reservationStatus} />, csv: r => reservationStatus[r.status as keyof typeof reservationStatus]?.label ?? r.status },
  ];
  const fresh = rows?.filter(r => r.status === "new").length ?? 0;

  return (
    <OwnerShell title={content.owner.title} active={tab} onTab={go} tabs={[{ id: "inbox", label: "예약 문의", icon: CalendarDays, badge: fresh }, { id: "settings", label: "설정", icon: Gear }]}>
      {error && <p className="mb-3 rounded-control border border-danger/30 bg-danger/10 px-3 py-2 text-step--1 text-danger" role="alert">{error}</p>}
      {tab === "inbox" ? (
        <RecordList
          label="예약 문의 목록" rows={rows ?? []} loading={!rows} columns={columns}
          statuses={reservationStatus} statusKey="status" dateKey="created_at"
          searchText={r => `${r.name} ${r.contact} ${r.occasion} ${r.diet} ${r.code}`}
          sorts={[
            { id: "visit", label: "방문일 빠른 순", compare: (a, b) => a.visit_date.localeCompare(b.visit_date) },
            { id: "new", label: "최근 받은 순", compare: (a, b) => b.created_at.localeCompare(a.created_at) },
          ]}
          onOpen={setOpen} selectedId={open?.id} csvName="지미헌_예약문의.csv"
          empty={{ title: "아직 받은 예약 문의가 없어요", body: "홈페이지의 ‘공식 홈페이지 예약 문의’로 들어온 내용이 여기에 쌓여요." }}
        />
      ) : conf ? (
        <SettingsForm spec={settings} values={conf.values} updated={conf.updated} onSave={async v => { const r = await data.saveSettings(v); setConf(r); return r; }}
          groups={[["예약", ["open"]]]} />
      ) : <p className="text-ink-3" role="status">불러오는 중…</p>}

      <DetailDrawer open={!!open} onClose={() => setOpen(null)} title={open?.name} subtitle={open && <>{dateTimeKo(open.created_at)} 접수 · 번호 <span className="font-mono">{open.code}</span></>}
        footer={open && <StatusActions status={open.status} config={reservationStatus} busy={busy} onMove={to => void patch({ status: to })} />}>
        {open && (
          <dl className="m-0 divide-y divide-line">
            <Field label="상태"><StatusPill status={open.status} config={reservationStatus} /></Field>
            <Field label="방문">{dateKo(`${open.visit_date}T12:00:00`)} · {mealLabel(open.meal)} · {open.guests}명</Field>
            <Field label="와인 페어링">{open.pairing ? "함께 주문" : "선택 안 함"}</Field>
            <Field label="연락처">{open.contact}</Field>
            <Field label="기념일">{open.occasion || "—"}</Field>
            <Field label="알레르기·식이 제한"><p className="m-0 whitespace-pre-wrap">{open.diet || "—"}</p></Field>
            <Field label="응대 언어">{open.lang === "en" ? "영어" : "한국어"}</Field>
          </dl>
        )}
      </DetailDrawer>
    </OwnerShell>
  );
}
