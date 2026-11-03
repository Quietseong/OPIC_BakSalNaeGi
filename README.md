# OPIc 말하기 연습

질문을 듣고 영어 답변을 녹음한 뒤, 문항별로 다시 듣고 메모하는 개인용 로컬 웹 앱입니다. 서버, 로그인, 외부 전송이 없습니다. 녹음은 브라우저의 IndexedDB에만 저장됩니다.

## 실행

Node 20.18 이상과 Windows 영어 음성(기본 설치된 Microsoft Zira)이 필요합니다.

```bash
npm install
npm run audio   # 질문 음성 WAV 생성 (public/audio, git 제외). 이미 있으면 건너뜀. 다시 만들려면 -- --force
npm run dev     # http://localhost:5173 을 Chrome 또는 Edge로 연다
```

질문 음성은 생성된 WAV, 브라우저 음성 합성, 질문 텍스트 순서로 시도합니다. 마이크는 localhost에서만 동작합니다.

## 모드

| 모드 | 동작 |
| --- | --- |
| 연습 | 15문항, 질문 텍스트 표시, 다시 듣기 제한 없음, 다시 녹음 가능, 90초·120초 목표 표시(자동 종료 없음) |
| 실전 | 질문 텍스트 숨김, 질문 청취 2회, 전체 40분, 7번 뒤 쉬운·비슷한·어려운 선택(12·15·15문항) |

공식 규칙과 앱 자체 규칙의 구분은 `docs/research-and-rules.md`에 있습니다.

## 테스트

```bash
npm test           # 상태 머신, 세션 흐름, IndexedDB 저장 (Vitest + fake-indexeddb)
npm run test:e2e   # Chromium 가짜 마이크로 전체 흐름 (Playwright). 처음 한 번 npx playwright install chromium
npm run build      # 타입 검사 + 프로덕션 빌드
```

## 구조

- `src/domain`에는 문항 세트, 세션 진행 규칙, 문항별 상태 머신이 있습니다. React에 의존하지 않습니다.
- `src/storage/db.ts`는 IndexedDB 저장소입니다. 답변 메타데이터와 녹음은 한 트랜잭션으로 저장됩니다.
- `src/media`는 마이크 녹음과 질문 재생을 맡습니다.
- `src/ui`는 React 화면입니다.
- `docs/decisions.tsv`는 구현 중 내린 결정과 근거를 기록한 로그입니다.
