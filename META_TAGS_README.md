# 메타 태그 관리 가이드

## 개요
소셜 미디어 썸네일(Open Graph)은 각 HTML 파일의 `<head>` 섹션에 직접 작성되어야 합니다.
JavaScript를 통한 동적 삽입은 소셜 미디어 크롤러가 JavaScript를 실행하지 않기 때문에 작동하지 않습니다.

## 중앙 관리
메타 태그 정보는 `/public/src/js/config/constants.js`의 `META_TAGS` 객체에서 중앙 관리됩니다:

```javascript
export const META_TAGS = {
    gotgam: {
        title: "해청농원 곶감 주문페이지",
        description: "해청농원 곶감 주문하기",
        image: "/images/gotgam/1.jpeg"
    },
    durup: {
        title: "해청농원 두릅 주문페이지",
        description: "해청농원 산두릅(참두릅) 주문하기",
        image: "/images/durup/1_1.jpg"
    }
};
```

## 메타 태그 수정 방법

### 1단계: constants.js 수정
먼저 `/public/src/js/config/constants.js`의 `META_TAGS` 객체를 수정합니다.

### 2단계: HTML 파일들 수정
다음 HTML 파일들의 메타 태그를 **수동으로** 업데이트해야 합니다:
- `/public/index.html`
- `/public/submitOrder.html`
- `/public/checkOrder.html`

### HTML 메타 태그 템플릿

#### 곶감용 (gotgam)
```html
<!-- Open Graph / Social Media Meta Tags -->
<!-- 주의: constants.js의 META_TAGS.gotgam 값과 동기화 필요 -->
<meta property="og:title" content="해청농원 곶감 주문페이지">
<meta property="og:description" content="해청농원 곶감 주문하기">
<meta property="og:image" content="https://horang-gotgam.vercel.app/images/gotgam/1.jpeg">
<meta property="og:url" content="https://horang-gotgam.vercel.app/[페이지경로].html">
<meta property="og:type" content="website">

<!-- Twitter Card Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="해청농원 곶감 주문페이지">
<meta name="twitter:description" content="해청농원 곶감 주문하기">
<meta name="twitter:image" content="https://horang-gotgam.vercel.app/images/gotgam/1.jpeg">
```

#### 두릅용 (durup)
```html
<!-- Open Graph / Social Media Meta Tags -->
<!-- 주의: constants.js의 META_TAGS.durup 값과 동기화 필요 -->
<meta property="og:title" content="해청농원 두릅 주문페이지">
<meta property="og:description" content="해청농원 산두릅(참두릅) 주문하기">
<meta property="og:image" content="https://horang-gotgam.vercel.app/images/durup/1_1.jpg">
<meta property="og:url" content="https://horang-gotgam.vercel.app/[페이지경로].html">
<meta property="og:type" content="website">

<!-- Twitter Card Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="해청농원 두릅 주문페이지">
<meta name="twitter:description" content="해청농원 산두릅(참두릅) 주문하기">
<meta name="twitter:image" content="https://horang-gotgam.vercel.app/images/durup/1_1.jpg">
```

## 주의사항

1. **og:url**: 각 페이지의 실제 URL로 변경해야 합니다
   - index.html: `https://horang-gotgam.vercel.app/`
   - submitOrder.html: `https://horang-gotgam.vercel.app/submitOrder.html`
   - checkOrder.html: `https://horang-gotgam.vercel.app/checkOrder.html`

2. **이미지 경로**: 반드시 전체 URL을 사용해야 합니다
   - 올바름: `https://horang-gotgam.vercel.app/images/gotgam/1.jpeg`
   - 틀림: `/images/gotgam/1.jpeg`

3. **배포 후 캐시**: 배포 후에도 기존 썸네일이 보인다면 소셜 미디어 디버거로 캐시를 초기화하세요:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [Kakao 디버거](https://developers.kakao.com/tool/debugger/sharing)

## 제품 타입 변경 시

`PRODUCT_TYPES`를 "gotgam"에서 "durup"으로 변경할 때:

1. `constants.js`의 `PRODUCT_TYPES` 수정
2. `constants.js`의 `META_TAGS`에서 durup 정보 확인/수정
3. 모든 HTML 파일의 메타 태그를 durup용으로 수동 변경
4. 배포 후 소셜 미디어 디버거로 캐시 초기화

## 현재 상태 (2026-01-07)

- 제품 타입: `gotgam` (곶감)
- 메타 태그가 설정된 페이지:
  - ✅ index.html (곶감)
  - ✅ submitOrder.html (곶감)
  - ✅ checkOrder.html (곶감)
