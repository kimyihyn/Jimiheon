// 이 앱의 문구·데이터는 전부 이 파일에 있다. 사용자 정보를 반영할 때는 이 파일만 고친다.
// Worker 도 이 파일을 import 한다(설정 검사·상태 흐름) — 그래서 이미지·컴포넌트를 import 하지 않는다.
import { defineSettings } from "./lib/settings";
import { defineStatuses } from "./lib/status";

export const content = {
  title: "지미헌 知味軒",
  owner: {
    title: "지미헌 예약 관리",
    members: ["예시: 매니저 A", "예시: 매니저 B"],
  },
};

/**
 * 소유자가 /admin 에서 직접 바꾸는 값. 여기 적은 키는 전부 소유자가 고칠 수 있고, public: true 인 키만
 * GET /api/settings 로 방문자 화면에 나간다(계좌번호처럼 주문한 사람에게만 보일 값은 public 을 빼고
 * 그 응답에만 싣는다). 바뀐 값은 D1 settings 표에, 여기 default 는 저장 전의 값.
 */
export const settings = defineSettings({
  open: { type: "toggle", label: "홈페이지 예약 문의", default: true, on: "받는 중", off: "잠시 멈춤", public: true },
});

/** 예약 문의 상태 흐름. */
export const reservationStatus = defineStatuses({
  new: { label: "새 문의", tone: "info", next: [{ to: "contacted", label: "연락함" }, { to: "cancelled", label: "취소", danger: true }] },
  contacted: { label: "연락함", tone: "warn", next: [{ to: "confirmed", label: "예약 확정" }, { to: "cancelled", label: "취소", danger: true }] },
  confirmed: { label: "예약 확정", tone: "ok", next: [{ to: "visited", label: "방문 완료" }, { to: "cancelled", label: "취소", danger: true }] },
  visited: { label: "방문 완료", tone: "neutral", next: [] },
  cancelled: { label: "취소", tone: "danger", next: [{ to: "new", label: "다시 열기" }] },
});

/** 문의 상태 흐름. 상태마다 다음에 누를 수 있는 버튼이 있다. */
export const inquiryStatus = defineStatuses({
  new: { label: "새 문의", tone: "info", next: [{ to: "contacted", label: "연락함" }, { to: "closed", label: "닫기", danger: true }] },
  contacted: { label: "연락함", tone: "warn", next: [{ to: "done", label: "완료" }, { to: "closed", label: "닫기", danger: true }] },
  done: { label: "완료", tone: "ok", next: [{ to: "contacted", label: "다시 열기" }] },
  closed: { label: "닫음", tone: "neutral", next: [{ to: "new", label: "다시 열기" }] },
});

/** 견본 모드에서 보이는 행(이 브라우저에만 저장). 실제 데이터와 같은 모양이어야 한다. 날짜는 오늘 기준으로 만든다. */
const ago = (days: number, hour = 10) => {
  const d = new Date(Date.now() - days * 864e5);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
const ahead = (days: number) => new Date(Date.now() + days * 864e5).toISOString().slice(0, 10);
export const ownerSample = {
  reservations: [
    { id: 3, code: "K7Q2MD", visit_date: ahead(5), meal: "dinner", guests: 2, pairing: 1, name: "예시: 윤서진", contact: "010-0000-0000", occasion: "결혼기념일", diet: "갑각류 알레르기", lang: "ko", status: "new", assignee: "", created_at: ago(0, 9) },
    { id: 2, code: "P4XR8A", visit_date: ahead(9), meal: "lunch", guests: 4, pairing: 0, name: "Example: Emma Clarke", contact: "emma@example.com", occasion: "", diet: "Vegetarian (1)", lang: "en", status: "contacted", assignee: "", created_at: ago(2, 15) },
    { id: 1, code: "B9TN3E", visit_date: ahead(2), meal: "dinner", guests: 6, pairing: 1, name: "예시: 김하린", contact: "010-0000-0000", occasion: "부모님 생신 (PDR 희망)", diet: "", lang: "ko", status: "confirmed", assignee: "", created_at: ago(6, 11) },
  ],
};
