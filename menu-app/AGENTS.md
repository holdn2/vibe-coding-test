# Repository Guidelines

## 프로젝트 구조 및 모듈 구성
- `src/app/`: Next.js App Router 페이지, 레이아웃, 전역 스타일, API 라우트가 위치합니다.
- `src/app/api/graphql/route.ts`: GraphQL Yoga 기반 GraphQL 엔드포인트(`/api/graphql`)입니다.
- `src/components/`: UI 컴포넌트가 위치합니다(예: `menu-roulette.tsx`).
- `src/lib/`: 데이터/연동 로직(Supabase 클라이언트, repository, 시드 fallback 데이터)을 둡니다.
- `public/`: 정적 에셋 디렉터리입니다.
- `docs/`: 프로젝트 노트 및 에이전트 관련 문서를 저장합니다.

비즈니스/데이터 로직은 `src/lib`에 두고, UI 컴포넌트는 렌더링과 상호작용에 집중하세요.

## 빌드, 테스트, 개발 명령어
- `npm install`: 의존성을 설치합니다.
- `npm run dev`: 로컬 개발 서버를 `http://localhost:3000`에서 실행합니다.
- `npm run build`: 프로덕션 빌드를 생성하며 컴파일 단계 이슈를 점검합니다.
- `npm run start`: 생성된 프로덕션 빌드를 로컬에서 실행합니다.
- `npm run lint`: Next.js + TypeScript 규칙으로 ESLint를 실행합니다.

PR 생성 전 `npm run lint && npm run build` 실행을 권장합니다.

## 코딩 스타일 및 네이밍 규칙
- 언어: TypeScript(`.ts`/`.tsx`), `strict` 모드 사용.
- 들여쓰기: 기존 코드 스타일(2칸)과 기본 포매터 동작을 따릅니다.
- 컴포넌트: 적절한 경우 PascalCase, 훅/유틸 함수는 camelCase를 사용합니다.
- 라우트 파일은 Next.js 관례(`page.tsx`, `layout.tsx`, `route.ts`)를 따릅니다.
- `src/*` 참조 시 경로 별칭 `@/*`를 사용합니다(예: `@/lib/menu-repository`).

## 테스트 가이드라인
현재 `package.json`에는 전용 테스트 프레임워크가 설정되어 있지 않습니다.
테스트 체계 도입 전에는 다음을 기준으로 검증하세요.
- `npm run lint`와 `npm run build`를 필수 품질 게이트로 사용
- UI/API 변경 시 핵심 플로우(메뉴 조회, 룰렛 회전, GraphQL 응답) 수동 확인
- 테스트를 추가한다면 소스 인접 위치에 `*.test.ts`/`*.test.tsx`로 배치하고 실행 명령을 `package.json`에 문서화

## 커밋 및 PR 가이드라인
- 기존 이력과 동일하게 Conventional Commits를 사용하세요: `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`.
- 커밋은 작고 단일 목적 중심으로 유지하세요.
- PR에는 다음 내용을 포함하세요.
  - 변경 동작 요약
  - 관련 이슈/작업 링크(있는 경우)
  - UI 변경 시 스크린샷 또는 짧은 영상
  - 환경 변수/설정 변경 사항(예: Supabase 변수)

## 보안 및 설정 팁
- 비밀 정보는 커밋하지 마세요. 자격 증명은 `.env.local`에 보관하세요(예: `SUPABASE_URL`, `SUPABASE_ANON_KEY`).
- Supabase 장애/미연결 시 fallback 동작이 유지되는지 확인하세요.
