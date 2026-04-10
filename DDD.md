# 호랑곶감 — 해청농원 DDD 설계 분석

## 1. 도메인 개요

해청농원(경남 함양군 서하면)의 프리미엄 곶감·두릅 온라인 주문 시스템.
고객이 웹에서 상품을 선택 → 주문서를 작성 → 계좌이체로 입금 → 관리자가 확인 후 발송하는 **예약 주문 기반** 플로우.

---

## 2. Bounded Contexts

```
┌─────────────────────────────────┐  ┌──────────────────────────────┐
│   Customer Order Context        │  │   Admin Management Context   │
│                                 │  │                              │
│  ▸ 상품 카탈로그 조회           │  │  ▸ 주문 현황 관리            │
│  ▸ 주문서 작성 / 제출           │  │  ▸ 가용 날짜 설정            │
│  ▸ 주문 상태 조회               │  │  ▸ 재고(수량) 설정           │
│  ▸ 계좌 정보 확인               │  │  ▸ 주문 출력                 │
└─────────────────────────────────┘  └──────────────────────────────┘
          │                                      │
          └──────────── API Server ──────────────┘
                  (horang.dev.ericfromkorea.com)
```

---

## 3. 도메인 모델

### 3.1 Entities / Aggregates

#### `Product` (상품)
| 필드 | 타입 | 설명 |
|------|------|------|
| id | `product1`~`product5` / `durup1`~`durup2` | 상품 식별자 |
| type | `'gotgam'` \| `'durup'` | 상품 카테고리 |
| name | string | 상품명 (예: "1호 기본", "산두릅") |
| grade | string | 등급 (기본/고급/명품/명품특) |
| unit | string | 단위 (개입, kg) |
| price | number | 단가 (원) |
| stockQty | number | 주문 가능 수량 (API 로드) |
| imageUrl | string | 상품 이미지 경로 |

#### `Order` (주문) — **Aggregate Root**
| 필드 | 타입 | 설명 |
|------|------|------|
| orderDate | ISO string | 주문 일시 |
| productType | `'gotgam'` \| `'durup'` | 상품 유형 |
| items | `OrderItem[]` | 주문 항목 목록 |
| reserveDate | string | 발송 예정일 |
| sender | `CustomerInfo` | 주문자 정보 |
| receiver | `ReceiverInfo` | 수령인 정보 |
| totalAmount | number | 총 결제금액 (배송비 포함) |
| requestEtc | string | 해청농원 요청사항 |
| requestDelivery | string | 택배사 요청사항 |

#### `OrderItem` (주문 항목)
| 필드 | 타입 |
|------|------|
| productId | string |
| quantity | number |

### 3.2 Value Objects

#### `CustomerInfo`
```
{ name: string, contact: PhoneNumber }
```

#### `ReceiverInfo`
```
{ name: string, contact: PhoneNumber, address: string }
```

#### `PhoneNumber`
- 형식: 숫자만, 11자리 (하이픈 제거 후 저장)
- 유효성: `/^01(?:0|1|[6-9])\d{7,8}$/`

#### `Money`
- 원화(KRW), 양의 정수
- 배송비 정책: 50,000원 미만 → +4,000원

#### `ShippingDate`
- API에서 사용 가능한 날짜 목록 로드
- 형식: `M/D` → `M월 D일(요일)`로 포맷

---

## 4. 도메인 서비스

| 서비스 | 책임 |
|--------|------|
| `PriceCalculator` | 상품 합계 + 배송비 계산 |
| `OrderValidator` | 수량 선택 여부, 전화번호 형식, 필수 항목 검증 |
| `DateFormatter` | 날짜 문자열 → 한국어 날짜 포맷 변환 |

---

## 5. Application Services (Use Cases)

| Use Case | 담당 페이지 | 파일 |
|----------|------------|------|
| 주문 가능 날짜 / 재고 로드 | submitOrder.html | `submit-order.js:loadAvailableDates()` |
| 실시간 가격 계산 | submitOrder.html | `submit-order.js:calculateTotal()` |
| 주문 제출 (곶감) | submitOrder.html | `api.js:submitGotgamOrder()` |
| 주문 제출 (두릅) | submitOrder.html | `api.js:submitDurupOrder()` |
| 주문 조회 | checkOrder.html | `check-order.js:checkOrder()` |
| 날짜 추가/삭제 | admin/controlMenu.html | `control-menu.js:addDate/deleteDate()` |
| 재고/설정 업데이트 | admin/controlMenu.html | `control-menu.js:updateOrder()` |

---

## 6. Infrastructure / Ports & Adapters

```
┌──────────────────── Frontend ────────────────────────────┐
│                                                           │
│  Pages            Controllers         Services           │
│  ─────────────    ─────────────────   ────────────────   │
│  index.html  →    (static links)                         │
│  submitOrder →    SubmitOrderPage  →  APIService         │
│  checkOrder  →    CheckOrderPage   →  APIService         │
│  admin/*     →    ControlMenuPage  →  fetch() direct     │
│                                                           │
│  Utils: dom.js · formatters.js · validators.js           │
│  Config: constants.js (prices, flags, URLs)              │
└───────────────────────────────────────────────────────────┘
                         │ HTTPS / JSON
┌──────────────────── Backend API ─────────────────────────┐
│  horang.dev.ericfromkorea.com:50001                       │
│                                                           │
│  GET  /load-order          → 재고·날짜 설정 조회         │
│  POST /submit-order        → 곶감 주문 등록               │
│  POST /submit-order-durup  → 두릅 주문 등록               │
│  GET  /check-order?name&phoneNumber → 주문 조회           │
│  POST /update-order        → 설정 업데이트 (admin)        │
│  POST /add-date            → 날짜 추가 (admin)            │
│  POST /delete-date         → 날짜 삭제 (admin)            │
└───────────────────────────────────────────────────────────┘
```

---

## 7. 파일 구조 분석

```
horangGotgam/
├── index.html                    # root redirect (vercel entry)
├── vercel.json                   # MIME type / cache 설정
├── DDD.md                        # 이 문서
│
└── public/                       # 웹 루트 (Vercel 배포 기준)
    ├── index.html                # 랜딩 / 홈페이지
    ├── submitOrder.html          # 주문 페이지 (핵심)
    ├── checkOrder.html           # 주문 조회 페이지
    ├── bankAccount.html          # 계좌 정보 간이 페이지
    │
    ├── admin/                    # 관리자 전용 페이지
    │   ├── login.html
    │   ├── hub.html
    │   ├── controlMenu.html      # 날짜·재고 설정
    │   ├── typeOrder.html        # 주문 유형 관리
    │   └── print.html            # 주문서 인쇄
    │
    ├── images/
    │   ├── gotgam/               # 곶감 상품 이미지 (1~5.jpeg)
    │   └── durup/                # 두릅 상품 이미지
    │
    └── src/
        ├── css/
        │   ├── reset.css         # Meyer reset
        │   ├── design-system.css # 디자인 토큰 (CSS 변수)
        │   └── pages/
        │       ├── landing.css   # 랜딩 페이지
        │       ├── submit-order.css
        │       ├── check-order.css
        │       └── admin/        # 어드민 전용 CSS
        │
        └── js/
            ├── config/
            │   └── constants.js  # 가격·API URL·플래그 상수
            ├── services/
            │   └── api.js        # APIService 클래스 (fetch wrapper)
            ├── utils/
            │   ├── dom.js        # DOM 조작·로딩 오버레이
            │   ├── formatters.js # 통화·날짜·전화번호 포맷
            │   └── validators.js # 전화번호·상품 선택 검증
            └── pages/
                ├── submit-order.js   # SubmitOrderPage 클래스
                ├── check-order.js    # CheckOrderPage 클래스
                └── admin/
                    ├── control-menu.js
                    ├── print.js
                    └── type-order.js
```

---

## 8. 주요 설계 패턴 및 특이사항

- **Page Controller Pattern**: 각 페이지마다 하나의 클래스(`SubmitOrderPage`, `CheckOrderPage`)가 해당 페이지의 모든 로직을 담당
- **Singleton Service**: `APIService`는 인스턴스를 하나 생성해 `apiService`로 export
- **Feature Flag**: `constants.js`의 `IS_AVAILABLE`, `PRODUCT_TYPES`로 주문 가능 여부 및 활성 상품 유형을 코드 변경으로 토글
- **Global Function Exposure**: HTML `onclick` 핸들러를 위해 `window.submitOrder = ...` 방식으로 전역 노출
- **계좌이체 결제**: PG 없이 관리자가 수동으로 입금 확인하는 오프라인 결제 방식
