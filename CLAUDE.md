# CLAUDE.md — fe

해청농원(곶감/두릅) 주문 사이트의 정적 프론트엔드. Vanilla JS + CSS, 빌드 없음(스크립트 하나로 런타임 설정만 생성). Vercel 배포.

자세한 도메인 모델·파일 구조는 `DDD.md` 참조.

---

## 핵심 개념

- **productType (`gotgam` | `durup`)**: `.env`의 `PRODUCT_TYPE` → `scripts/build-env.sh` → `public/env.js` (`window.__HORANG_CONFIG__.productType`) → 모든 HTML head 스크립트가 `<html>`에 `product-gotgam`/`product-durup` 클래스 부착.
- **랜딩 분기**: `public/index.html`이 곶감 기본. durup이면 `landing-durup.html`로 `location.replace()`. `submitOrder.html` / `checkOrder.html` / `bankAccount.html`은 양쪽 공용 (JS/CSS에서 분기).
- **테마**: `public/src/css/design-system.css`의 `:root`가 durup(초록), `html.product-gotgam`이 gotgam(주황)을 오버라이드. alpha 합성은 `rgba(var(--c-brand-rgb), α)` 패턴 — 새 색상 추가 시 이 방식을 유지.

---

## 로컬 실행

```bash
# .env 설정
echo "PRODUCT_TYPE=gotgam" > .env   # 또는 durup
sh scripts/build-env.sh             # public/env.js 생성

# 정적 서버 (fe 루트에서)
python3 -m http.server 8080 --directory . --bind 127.0.0.1
# → http://127.0.0.1:8080/public/index.html
```

로컬 BE 연결이 필요하면 `public/src/js/config/constants.js` 상단의 `API_BASE_URL`을 `http://localhost:5008`로 주석 교체. **커밋 전 반드시 원복** (기본은 `https://horang.dev.ericfromkorea.com:50001`).

---

## 자주 건드리는 파일

| 목적 | 파일 |
|---|---|
| 상품가/배송비/플래그/API URL | `public/src/js/config/constants.js` |
| 브랜드 컬러·타이포·스페이싱 토큰 | `public/src/css/design-system.css` |
| 랜딩 (곶감/두릅) | `public/index.html`, `public/landing-durup.html` |
| 주문 페이지 로직 | `public/src/js/pages/submit-order.js` |
| 주문 폼 마크업 | `public/submitOrder.html` |
| 랜딩 CSS | `public/src/css/pages/landing.css` |
| 주문 폼 CSS | `public/src/css/pages/submit-order.css` |

---

## 주의사항

- `public/env.js`는 gitignored. 빌드 시점에 생성됨 (Vercel: `vercel.json`의 `buildCommand`).
- admin(`public/admin/`, `public/src/css/pages/admin/`, `public/src/js/pages/admin/`)은 별개 서비스 영역. 스토어프론트 리팩토링 시 기본적으로 제외.
- 브라우저에서 onclick 핸들러가 동작하려면 `window.submitOrder = ...` 식 전역 노출이 필요한 레거시 코드 포인트가 있음.
- 랜딩 hero/CTA 등 장식 영역 배경 그라디언트는 반드시 `rgba(var(--c-brand-rgb), α)` 형태로 작성 (하드코딩하면 테마 스위칭 깨짐).
