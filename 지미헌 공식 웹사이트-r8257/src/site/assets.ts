// ─────────────────────────────────────────────────────────────────────────────
// 지미헌 이미지 한 곳 모음. 내 사진으로 바꿀 때는 이 파일의 주소만 바꾸면 됩니다.
//   · 내 파일은 public/images/ 폴더에 넣고 "/images/파일이름.jpg" 처럼 적어 주세요.
//   · 값을 "" 로 비워 두면 그 자리에 라벨이 적힌 빈 액자(플레이스홀더)가 보입니다.
// ─────────────────────────────────────────────────────────────────────────────


export const ASSETS = {
  /** 로고 1장 (투명 PNG·SVG 권장). 비워 두면 기와 처마 곡선 로고가 그려집니다. */
  logo: "/images/logo.png",
  /** 로고를 어두운 배경(히어로·푸터)에 쓸 흰색 버전. 비워 두면 logo 를 그대로 씁니다. */
  logoLight: "/images/logo-light.png",

  /** 외부 사진 1장 · 히어로 풀스크린 (가로 16:9 이상 권장) */
  exterior: "/images/exterior.png",

  /** 내부 사진 6장 · 순서대로 메인 홀 / 서까래 / 조명 / 프라이빗 다이닝룸 / 테이블 세팅 / 중정 */
  interior: [
    "/images/main.png",
    "/images/in1.png",
    "/images/in2.png",
    "/images/in3.png",
    "/images/in4.png",
    "/images/table.png",
  ],

  /** 메뉴 사진 · 정사각 또는 4:5. 개수를 늘리면 src/site/copy.ts 의 dishes 도 같은 순서로 늘려 주세요. */
  dishes: [
    "/images/menu1.png",
    "/images/menu2.png",
    "/images/menu3.png",
    "/images/menu4.png",
    "/images/menu5.png",
    "/images/menu6.png",
    "/images/menu7.png",
    "/images/menu8.png",
  ],
};

/** 예약·연락 링크. 실제 값으로 바꿔 주세요. */
export const LINKS = {
  catchTable: "https://app.catchtable.co.kr/",
  phone: "", // 예: "02-000-0000" — 비워 두면 전화번호 줄이 '준비 중'으로 보입니다.
  email: "", // 예: "reservation@jimiheon.kr"
};
