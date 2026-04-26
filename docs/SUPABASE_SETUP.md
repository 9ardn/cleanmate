# 🔧 Supabase 연결 가이드

CleanMate를 Supabase와 연결하기 위한 완벽한 단계별 가이드입니다.

---

## 📋 사전 준비

### 1. 프로젝트 생성
1. [supabase.com](https://supabase.com)에 접속 (로그인 또는 회원가입)
2. **New Project** 클릭
3. 설정:
   - **Organization**: 기본값
   - **Project name**: `cleanmate` (또는 원하는 이름)
   - **Database password**: 강력한 비밀번호 설정 (저장해두기!)
   - **Region**: 한국 가까운 지역 선택 (예: `ap-northeast-1` - Tokyo)
4. **Create new project** 클릭 (생성 완료까지 2-3분 소요)

---

## 🔑 Step 1: 환경 변수 설정

프로젝트가 생성되면 대시보드가 표시됩니다.

### 필요한 값 복사
1. 좌측 사이드바 → **Settings** → **API**
2. 다음 3개 값을 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGc...` (긴 문자열)
   - **service_role** (아래로 스크롤): `eyJhbGc...` (더 긴 문자열)

### .env.local 파일 작성
프로젝트 루트의 `.env.local` 파일을 열고:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **주의**: 이 파일은 `.gitignore`에 보호되어 있으므로 커밋되지 않습니다.

---

## 💾 Step 2: 데이터베이스 스키마 실행

Supabase 대시보드에서 **SQL Editor** 선택.

### 2-1. schema.sql 실행 (필수 먼저)

`supabase/schema.sql` 파일 전체 내용을 복사 → SQL Editor에 붙여넣기 → **RUN**

**역할**:
- 11개 테이블 생성 (profiles, parties, party_members, tasks, verifications, scores, streaks, activity, user_badges, notification_settings, user_totals)
- 인덱스 생성
- uuid-ossp 확장 활성화
- updated_at 자동 갱신 트리거

**체크포인트**:
```
Execution time: 500ms
Rows affected: 0 (DDL 명령이므로)
```

---

### 2-2. functions.sql 실행 (스키마 이후)

`supabase/functions.sql` 파일 전체 내용 복사 → SQL Editor → **RUN**

**역할**:
- `handle_new_user()` 트리거: 사용자 가입 시 자동으로:
  - profiles 레코드 생성
  - notification_settings 생성
  - 기본 party 생성
  - scores, streaks, activity 초기화
- RPC 함수들:
  - `approve_verification()`: 인증 승인
  - `reject_verification()`: 인증 반려
  - `create_verification()`: 인증 요청 생성
  - `join_party()`: 파티 참여
  - `calculate_room_score()`: 청결도 계산 (0-100)

**주의**:
- RPC 함수는 `security definer` 권한으로 실행됨 (보안)
- app에서 `.rpc()` 메서드로 호출

---

### 2-3. policies.sql 실행 (함수 이후)

`supabase/policies.sql` 파일 전체 내용 복사 → SQL Editor → **RUN**

**역할**:
- Row Level Security (RLS) 정책 설정
- `is_party_member()` 헬퍼 함수
- 각 테이블에 대한 SELECT, INSERT, UPDATE, DELETE 정책

**정책 목록** (자동으로 생성):
```
profiles:
  - SELECT: 누구나
  - UPDATE: 자신의 프로필만
  
party_members:
  - SELECT: 같은 파티 멤버만
  - INSERT: 사용자만 (파티 참여)
  
tasks, verifications, scores 등:
  - SELECT/INSERT/UPDATE: 같은 파티 멤버만
  
activity, streaks:
  - SELECT: 같은 파티 멤버만
```

**체크포인트**:
```
✓ Policies created successfully
```

---

### 2-4. seed.sql 실행 (선택 - 샘플 데이터)

`supabase/seed.sql` 파일 전체 내용 복사 → SQL Editor → **RUN**

**역할**:
- 테스트용 청소 항목 6개 자동 생성
  - 🍽️ 설거지 (1일 주기)
  - 🧹 바닥 청소 (3일 주기)
  - 👕 세탁 (7일 주기)
  - 등등...

**용도**:
- 로컬 테스트 시 빠른 개발
- 프로덕션에서는 실행하지 않기

---

## 🔐 Step 3: Authentication 설정

Supabase 대시보드 → **Authentication** 섹션

### 3-1. Email 활성화 (매직링크 로그인)

1. **Providers** → **Email**
2. **Enabled** 토글 ON
3. **SMTP Configuration** (선택사항, 프로덕션용)
   - 기본값으로 Supabase의 SMTP 서버 사용
   - 이메일 리다이렉트: `NEXT_PUBLIC_SITE_URL`로 설정됨

### 3-2. 익명 로그인 활성화 (데모용)

1. **Providers** → 아래로 스크롤
2. **Anonymous Sign-ins** 찾기
3. **Enabled** 토글 ON
4. **Save** 클릭

⚠️ **중요**: 익명 로그인이 OFF면 로그인 페이지에서 "익명 로그인" 버튼이 비활성화됨

### 3-3 URL Configuration

1. **Authentication** → **URL Configuration** (좌측)
2. **Site URL**: `http://localhost:3000`
3. **Redirect URLs**: 다음 URL 모두 추가
   ```
   http://localhost:3000/**
   ```

---

## 📁 Step 4: Storage 버킷 생성

Supabase 대시보드 → **Storage** → **Buckets**

### 4-1. verifications 버킷 생성

1. **New bucket** 클릭
2. **Name**: `verifications`
3. **Public bucket**: ❌ 체크 해제 (RLS로 보호)
4. **Create bucket**

### 4-2. RLS 정책 (자동 적용됨)

policies.sql에서 storage.objects에 대해 다음이 설정됨:
- SELECT: 같은 파티 멤버만 조회 가능
- INSERT: 자신의 인증 사진만 업로드 가능
- DELETE: 자신의 파일만 삭제 가능

---

## ✅ Step 5: RLS 확인

데이터베이스 보안을 위해 RLS가 활성화되어 있는지 확인합니다.

### Supabase 대시보드에서 확인

1. **SQL Editor** → 다음 쿼리 실행:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
   ```
2. 모든 테이블에서 `rowsecurity = true`인지 확인

### 확인 결과 예시
```
profiles           | t (true) ✓
parties            | t ✓
tasks              | t ✓
verifications      | t ✓
... (모두 true여야 함)
```

---

## 🧪 테스트 확인

모든 설정이 완료되면 다음을 테스트합니다:

```bash
npm run dev
```

### 테스트 시나리오

1. **로그인 페이지** (`http://localhost:3000`)
   - ✓ "이메일로 로그인" 버튼 표시
   - ✓ "익명 로그인" 버튼 표시

2. **익명 로그인**
   - ✓ 로그인 성공 → `/onboarding` 리다이렉트
   - ✓ 프로필 생성 완료 후 `/home` 진입
   - ✓ 초기 거실 상태 표시 (점수 0, 상태: "Critical ⛈️")

3. **온보딩**
   - ✓ 3단계 튜토리얼 정상 표시
   - ✓ 프로필 저장 후 홈으로 이동

4. **홈 페이지**
   - ✓ 청소 항목 표시 (seed.sql 실행했으면 6개)
   - ✓ 파티 스트릭, 레벨 표시
   - ✓ 하단 네비게이션 정상

---

## 🐛 트러블슈팅

### 문제 1: "Invalid API Key"
**원인**: `.env.local`에 잘못된 키 입력
**해결**:
1. Supabase 대시보드 → Settings → API 재확인
2. 값을 정확히 복사 (공백 주의)
3. 개발 서버 재시작: `npm run dev`

### 문제 2: "User not found" 에러
**원인**: 사용자가 존재하지 않는데 query 실행
**해결**: 새 세션에서 익명 로그인 후 재시도

### 문제 3: RLS 위반 (403 Forbidden)
**원인**: 정책이 제대로 적용되지 않음
**해결**:
1. policies.sql이 완전히 실행됐는지 확인
2. **SQL Editor** → 위의 RLS 확인 쿼리 실행
3. 문제 있으면 policies.sql 다시 전체 실행

### 문제 4: "Extension uuid-ossp not found"
**원인**: schema.sql의 extension 생성 부분이 실행 안 됨
**해결**: schema.sql 맨 처음부터 다시 실행

---

## 📊 다음 단계

### 타입 재생성 (필수)
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
```

이를 통해 실제 Supabase 스키마와 동기화되는 타입 정의를 얻을 수 있습니다.

### 프로덕션 배포
- Vercel + Supabase Pro 조합 권장
- docs/DEPLOYMENT.md 참고

---

## 📞 지원

- Supabase 공식 가이드: https://supabase.com/docs
- CleanMate 아키텍처: docs/ARCHITECTURE.md
