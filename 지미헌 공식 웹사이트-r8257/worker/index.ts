// /api 는 여기서, 나머지 화면은 정적 파일(ASSETS)이 처리한다.
import { Hono } from "hono";
import { reservationStatus, settings } from "../src/content";
import { canMove } from "../src/lib/status";
import { type Bindings, bad, clean, describeError, intIn, ownerOnly, rateLimited } from "./lib";
import { mountSettings, readSettings } from "./settings";

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

app.use("*", async (c, next) => {
  await next();
  c.header("cache-control", "no-store");
  c.header("x-robots-tag", "noindex");
});

app.get("/health", c => c.json({ ok: true }));

app.get("/admin/summary", ownerOnly, c => c.json({ ok: true }));

mountSettings(app, settings);

// --- 예약 문의: 홈페이지 모달 → 소유자 목록(/admin) → 상태 변경 ---
const code6 = () => [...crypto.getRandomValues(new Uint8Array(6))].map(b => "ABCDEFGHJKMNPQRSTUVWXYZ23456789"[b % 31]).join("");

app.post("/reservations", async c => {
  const b = await c.req.json().catch(() => ({})) as Record<string, unknown>;
  const conf = await readSettings(c.env.DB, settings);
  if (conf.values.open === false) return bad(c, "지금은 홈페이지 예약 문의를 잠시 받지 않아요. 캐치테이블을 이용해 주세요.", 409);
  const date = clean(b.date, 10), name = clean(b.name, 40), contact = clean(b.contact, 80);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !name || !contact) return bad(c, "날짜, 성함, 연락처를 모두 적어 주세요");
  const day = new Date(`${date}T12:00:00Z`);
  const today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  if (Number.isNaN(day.getTime()) || date <= today) return bad(c, "오늘 이후 날짜를 골라 주세요");
  if (day.getUTCDay() === 1) return bad(c, "월요일은 정기 휴무예요");
  const meal = b.meal === "lunch" ? "lunch" : "dinner";
  const guests = intIn(b.guests, 1, 8, 2);
  const lang = b.lang === "en" ? "en" : "ko";
  if (await rateLimited(c, "reservation", 8, 600)) return bad(c, "잠시 뒤 다시 보내 주세요", 429);
  const code = code6();
  await c.env.DB.prepare("INSERT INTO reservation (code, visit_date, meal, guests, pairing, name, contact, occasion, diet, lang) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(code, date, meal, guests, b.pairing ? 1 : 0, name, contact, clean(b.occasion, 120), clean(b.diet, 400), lang).run();
  return c.json({ code }, 201);
});

app.get("/admin/reservations", ownerOnly, async c => {
  const { results } = await c.env.DB.prepare("SELECT * FROM reservation ORDER BY id DESC LIMIT 1000").all();
  return c.json({ rows: results });
});

app.patch("/admin/reservations/:id", ownerOnly, async c => {
  const id = Number(c.req.param("id"));
  const row = await c.env.DB.prepare("SELECT * FROM reservation WHERE id = ?").bind(id).first<{ status: string }>();
  if (!row) return bad(c, "없는 예약 문의예요", 404);
  const b = await c.req.json().catch(() => ({})) as Record<string, unknown>;
  const status = b.status === undefined ? row.status : String(b.status);
  if (status !== row.status && !canMove(reservationStatus, row.status, status)) return bad(c, "지금 상태에서는 바꿀 수 없어요", 409);
  await c.env.DB.prepare("UPDATE reservation SET status = ? WHERE id = ?").bind(status, id).run();
  return c.json({ row: await c.env.DB.prepare("SELECT * FROM reservation WHERE id = ?").bind(id).first() });
});

app.notFound(c => c.json({ error: "not found" }, 404));
app.onError((err, c) => {
  console.error(`[api] ${c.req.method} ${c.req.path} 500\n${describeError(err)}`);
  return c.json({ error: "잠시 뒤 다시 시도해 주세요" }, 500);
});

export default app;
