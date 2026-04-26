# ✅ Supabase 연결 체크리스트

## 🚀 Quick Start (5분)

### Phase 1: 프로젝트 & 환경 (3분)
- [ ] Supabase 프로젝트 생성 (supabase.com)
- [ ] Settings → API에서 3개 키 복사
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `.env.local` 파일에 값 입력 (이미 템플릿이 있음)

### Phase 2: Database 스키마 (2분)
Supabase SQL Editor에서 **순서대로** 실행:
- [ ] `supabase/schema.sql` (11개 테이블 생성)
- [ ] `supabase/functions.sql` (RPC 함수 & 트리거)
- [ ] `supabase/policies.sql` (RLS 정책)
- [ ] `supabase/seed.sql` (선택: 샘플 데이터 6개)

---

## 🔑 Authentication 설정

### Email
- [ ] Supabase → **Authentication** → **Providers** → **Email**
- [ ] **Enabled** 토글 ON

### Anonymous Sign-in
- [ ] **Authentication** → **Providers** (아래로 스크롤)
- [ ] **Anonymous Sign-ins** → **Enabled** ON

### Redirect URLs
- [ ] **Authentication** → **URL Configuration**
- [ ] **Site URL**: `http://localhost:3000`
- [ ] **Redirect URLs**: `http://localhost:3000/**` 추가

---

## 📁 Storage 설정

### verifications 버킷
- [ ] **Storage** → **New bucket**
- [ ] **Name**: `verifications`
- [ ] **Public bucket**: ❌ (OFF) — RLS로 보호됨
- [ ] **Create bucket**

---

## 🔒 Security Verification

### RLS 확인 (SQL Editor에서 실행)
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```
- [ ] 모든 public 테이블에서 `rowsecurity = t` 확인

### 정책 확인
- [ ] SQL Editor → `\dp public.*` 명령어로 정책 목록 조회
  - [ ] 최소 50+ 개의 정책이 생성되어야 함

---

## 🧪 테스트

개발 서버 시작:
```bash
npm run dev
```

### 체크포인트
- [ ] http://localhost:3000 접속 → `/login` 리다이렉트 ✓
- [ ] "이메일로 로그인" 버튼 표시 ✓
- [ ] "익명 로그인" 버튼 표시 ✓
- [ ] 익명 로그인 → `/onboarding` 리다이렉트 ✓
- [ ] 프로필 작성 → `/home` 진입 ✓
- [ ] 홈 페이지 거실 상태 표시 ✓
- [ ] 청소 항목 표시 (또는 "청소 항목이 없어요") ✓

---

## 💾 데이터 동기화

### TypeScript 타입 재생성 (필수)
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
```
- [ ] `YOUR_PROJECT_ID` 값 확인 (Supabase URL에서 추출)
- [ ] 명령어 실행 후 types/database.ts 업데이트 확인
- [ ] `npm run type-check` 다시 실행 (에러 0개 확인)

---

## 🚨 트러블슈팅

| 증상 | 원인 | 해결 |
|------|------|------|
| Invalid API Key | 키 오타 또는 잘못된 값 | Supabase Settings → API에서 정확히 복사 |
| RLS 정책 에러 (403) | policies.sql 미실행 | policies.sql 전체 다시 실행 |
| "User not found" | 로그인 세션 없음 | 익명 로그인 후 재시도 |
| Extension uuid-ossp not found | schema.sql 미실행 | schema.sql 다시 실행 |
| .env.local 값 안 먹힘 | 개발 서버 캐시 | npm run dev 재시작 |

---

## 📋 완료 상태

모든 항목을 체크하면:

```
✅ Supabase 연결 완료!
✅ 인증 시스템 준비됨
✅ 데이터베이스 RLS 활성화됨
✅ 스토리지 버킷 생성됨
✅ 테스트 가능
```

---

## 📚 다음 단계

1. **타입 재생성** (위의 "데이터 동기화" 섹션)
2. **카메라/사진 업로드** 연결 (lib/db/verifications.ts)
3. **Realtime** 구독 설정 (hooks/useAppData.ts)
4. **프로덕션 배포** (docs/DEPLOYMENT.md)

---

**진행 상황**: Phase 1 ▓▓▓▓▓░░░░ Phase 2 ▓▓▓▓▓░░░░ (예시)
