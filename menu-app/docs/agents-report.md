# Agent 진행 리포트

## 1) 프로젝트 매니저
- 범위를 `랜덤 4개 추천 + 룰렛 1개 확정`으로 고정
- 기술 스택을 `Next.js App Router + TypeScript + Tailwind + GraphQL + Supabase`로 정렬
- 실패 시 fallback(내장 메뉴 데이터) 정책 추가

## 2) UI/UX 디자이너
- 따뜻한 푸드 톤 배경/패널 스타일 설계
- 핵심 행동 버튼 2개(`오늘의 메뉴 뽑기`, `룰렛 돌리기`)를 상단 CTA로 배치
- 후보 카드 + 룰렛 결과를 2컬럼(모바일 1컬럼) 반응형으로 구성

## 3) 서버 아키텍처 담당자
- `/api/graphql` 엔드포인트 구성 (`graphql-yoga`)
- `todayMenus(count: Int)` 쿼리 제공
- Supabase `menus` 테이블 조회 후 랜덤 샘플링

## 4) 프론트엔드 개발자
- GraphQL POST 요청으로 메뉴 후보 4개 가져오기
- 룰렛 회전 애니메이션(3초) + 최종 메뉴 표시
- 에러/로딩/비활성 상태 처리

## 5) 비판적 옹호자
- Supabase 환경변수 미설정 시 fallback 보장
- Supabase 조회 실패 시에도 서비스 지속
- 빈 데이터/응답 오류 시 사용자 메시지 노출
