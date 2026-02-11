# 오늘의 메뉴 추천 + 룰렛

풀스택 `Next.js + TypeScript + Tailwind CSS + GraphQL + Supabase` 기반 웹앱입니다.

기능:
- `오늘의 메뉴 뽑기` 클릭 시 랜덤 메뉴 4개 추천
- `룰렛 돌리기` 클릭 시 후보 중 1개 최종 선택
- Supabase 미연결 시 내장 샘플 메뉴로 자동 fallback

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## 환경 변수

`.env.local` 파일 생성:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

둘 다 없으면 샘플 메뉴를 사용합니다.

## Supabase 테이블 예시

`menus` 테이블 생성 SQL:

```sql
create table if not exists public.menus (
  id bigint generated always as identity primary key,
  name text not null,
  category text not null default '기타'
);
```

샘플 데이터:

```sql
insert into public.menus (name, category) values
('김치찌개', '한식'),
('돈카츠', '일식'),
('파스타', '양식'),
('마라탕', '중식'),
('샐러드볼', '샐러드');
```

## GraphQL API

엔드포인트: `/api/graphql`

쿼리 예시:

```graphql
query GetTodayMenus($count: Int!) {
  todayMenus(count: $count) {
    id
    name
    category
  }
}
```
