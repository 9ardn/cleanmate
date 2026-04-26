# 📄 SQL 파일 실행 가이드

CleanMate의 4개 SQL 파일을 **정확한 순서**로 실행하기 위한 상세 가이드입니다.

---

## 🚀 실행 환경

- Supabase 대시보드 → **SQL Editor**
- 또는: Supabase CLI `psql` 연결

```bash
# CLI를 사용한다면 (선택사항)
psql postgres://YOUR_USER:YOUR_PASSWORD@YOUR_DB.supabase.co:5432/postgres
```

---

## 📋 실행 순서 (절대 변경 금지)

```
1️⃣ schema.sql      (테이블 & 인덱스)
   ↓
2️⃣ functions.sql   (함수 & 트리거)
   ↓
3️⃣ policies.sql    (RLS 정책)
   ↓
4️⃣ seed.sql        (샘플 데이터 - 선택)
```

---

## 1️⃣ schema.sql

### 📝 파일 위치
```
supabase/schema.sql
```

### ⏰ 실행 시간
약 500ms

### 🎯 역할

데이터베이스의 기본 구조를 만듭니다:

| 테이블 | 용도 | 행 수 |
|--------|------|-------|
| `profiles` | 사용자 프로필 (auth.users 확장) | 가변 |
| `parties` | 집/룸메이트 그룹 | 1+ |
| `party_members` | 파티 멤버 조인 | 가변 |
| `tasks` | 청소 항목 | 가변 |
| `verifications` | 인증 요청 & 사진 | 가변 |
| `scores` | 유저별 점수 (파티별) | 가변 |
| `streaks` | 파티 스트릭 | 1/파티 |
| `activity` | 활동 로그 | 가변 |
| `user_badges` | 배지 획득 기록 | 가변 |
| `notification_settings` | 알림 설정 | 1/유저 |
| `user_totals` | 누적 통계 (캐시용) | 1/유저 |

### ✅ 체크포인트

SQL Editor 실행 후:
```
✓ Execution time: ~500ms
✓ 에러 없음 (Query executed successfully)
```

콘솔에 다음이 출력되어야 합니다:
```sql
-- Created 11 tables
-- Created 8 indexes
-- Created 5 triggers
```

### ⚠️ 주의사항

1. **순서 필수**: functions.sql을 먼저 실행하면 안 됨 (테이블이 없어서 에러)
2. **이미 존재하면**: 기존 테이블은 삭제되지 않음
   - 재실행 필요 시: SQL Editor에서 다음 실행
   ```sql
   DROP TABLE public.profiles, public.parties, ... CASCADE;
   ```
   - 또는 새 프로젝트 생성 (권장)
3. **UUID**: `uuid-ossp` 확장이 자동 활성화됨

### 🔍 테스트 쿼리

실행 직후 확인:
```sql
-- 테이블 목록
\dt public.

-- 특정 테이블 구조
\d public.profiles

-- 인덱스 확인
SELECT * FROM pg_indexes WHERE schemaname = 'public';
```

---

## 2️⃣ functions.sql

### 📝 파일 위치
```
supabase/functions.sql
```

### ⏰ 실행 시간
약 1-2초

### 🎯 역할

비즈니스 로직을 수행하는 함수들과 자동화 트리거:

#### 트리거
| 트리거 | 이벤트 | 역할 |
|--------|--------|------|
| `on_auth_user_created` | 사용자 가입 후 | 프로필, 파티, 설정 자동 생성 |
| `profiles_updated_at` | 프로필 수정 | updated_at 자동 갱신 |
| 등 (5개) | | |

#### RPC 함수 (앱에서 호출)
```typescript
// app에서 이렇게 호출
supabase.rpc('approve_verification', { 
  p_verification_id: '...', 
  p_approver_id: '...' 
})
```

| 함수 | 파라미터 | 반환값 | 역할 |
|------|---------|--------|------|
| `handle_new_user()` | trigger 자동 | void | 신규 가입자 초기화 |
| `calculate_room_score()` | party_id | 0-100 | 청결도 계산 |
| `create_verification()` | task_id, photo | UUID | 인증 요청 생성 |
| `approve_verification()` | verif_id, approver_id | JSON | 인증 승인 & 스코어 증가 |
| `reject_verification()` | verif_id, rejecter_id, reason | JSON | 인증 반려 |
| `join_party()` | invite_code | UUID | 파티 참여 |

### ✅ 체크포인트

SQL Editor 실행 후:
```
✓ Execution time: ~1-2s
✓ "CREATE FUNCTION" 메시지 6개
✓ "CREATE TRIGGER" 메시지 5개
```

### ⚠️ 주의사항

1. **Execution timing**: `security definer` 설정 → 함수는 super-user 권한으로 실행
   - RLS 정책을 우회할 수 있음 (의도적)
   - 신뢰할 수 있는 로직만 포함

2. **RPC 함수 이름**: app에서 호출 시 정확한 이름 사용 필수
   - `approve_verification` (snake_case)
   - `approveVerification`이 아님

3. **Trigger 오류 처리**: 
   ```plpgsql
   BEGIN
     ...
   EXCEPTION WHEN OTHERS THEN
     NULL;  -- 에러 무시 (권장 아님)
   END;
   ```
   - 예: handle_new_user에서 party 생성 실패 시도 처리

4. **성능**: calculate_room_score는 무거운 함수
   - SELECT 쿼리마다 호출하지 말 것
   - 캐시된 scores 테이블 사용 권장

### 🔍 테스트 쿼리

실행 직후 확인:
```sql
-- 함수 목록
SELECT * FROM pg_proc WHERE pronamespace = 'public'::regnamespace;

-- 트리거 목록
SELECT * FROM pg_trigger WHERE tgrelname = 'auth_users';

-- RPC 함수 호출 테스트 (더미)
SELECT public.calculate_room_score('11111111-1111-1111-1111-111111111111');
-- 결과: 0 (파티가 없으면)
```

---

## 3️⃣ policies.sql

### 📝 파일 위치
```
supabase/policies.sql
```

### ⏰ 실행 시간
약 2-3초 (정책이 50+개)

### 🎯 역할

**Row Level Security (RLS)** 정책으로 데이터 접근 제어:

- **주인**: 자기 데이터만
- **같은 파티 멤버**: 파티 데이터만
- **공개 데이터**: profiles 이름, 이모지 등

#### 보호되는 테이블

```
✓ profiles
✓ party_members
✓ tasks
✓ verifications
✓ scores
✓ streaks
✓ activity
✓ user_badges
✓ notification_settings
✓ user_totals
✓ storage.objects (파일)
```

#### 정책 유형 (각 테이블별)

| 작업 | 규칙 |
|------|------|
| SELECT | 같은 파티 멤버만 조회 가능 |
| INSERT | 파티 멤버만 삽입 가능 (다른 유저 데이터는 불가) |
| UPDATE | 자기 데이터만 수정 가능 |
| DELETE | 소유자만 삭제 가능 |

### ✅ 체크포인트

SQL Editor 실행 후:
```
✓ Execution time: ~2-3s
✓ "CREATE POLICY" 메시지 50+개
✓ "CREATE FUNCTION" 1개 (is_party_member 헬퍼)
```

RLS 상태 확인:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- 결과:
-- profiles             | true
-- parties              | true
-- tasks                | true
-- ... (모두 true)
```

### ⚠️ 주의사항

1. **RLS 활성화 필수**:
   - 이 파일은 이미 활성화함
   - 만약 비활성화되면 정책이 무시됨
   ```sql
   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
   ```

2. **정책 수정 후 테스트**:
   - 매번 다른 유저 계정으로 테스트
   - 예: 익명 유저 A, 익명 유저 B

3. **성능**: 복잡한 정책 많음
   - SQL 쿼리 느릴 수 있음 (인덱스 확인)
   - 프로덕션: 쿼리 최적화 필요

4. **Storage RLS**:
   - policies.sql에 storage.objects 정책도 포함
   - verifications 버킷의 파일 접근 제어

### 🔍 테스트 쿼리

실행 직후:
```sql
-- 생성된 정책 확인
SELECT * FROM pg_policies WHERE schemaname = 'public' LIMIT 10;

-- 특정 테이블의 정책
SELECT policyname, qual 
FROM pg_policies 
WHERE tablename = 'tasks';
```

---

## 4️⃣ seed.sql (선택사항)

### 📝 파일 위치
```
supabase/seed.sql
```

### ⏰ 실행 시간
약 500ms

### 🎯 역할

**테스트용 샘플 데이터**:

- 🍽️ **설거지** (1일 주기, 무게 10)
- 🚿 **샤워 청소** (1일 주기, 무게 8)
- 🧹 **바닥 청소** (3일 주기, 무게 15)
- 👕 **세탁** (7일 주기, 무게 10)
- 🪴 **식물 물주기** (2일 주기, 무게 5)
- 🗑️ **쓰레기 버리기** (3일 주기, 무게 12)

### ✅ 체크포인트

SQL Editor 실행 후:
```
✓ Execution time: ~500ms
✓ "INSERT 6 rows into tasks"
✓ 에러 없음
```

확인:
```sql
SELECT COUNT(*) FROM public.tasks;
-- 결과: 6
```

### ⚠️ 주의사항

1. **선택사항**: 프로덕션에서는 실행하지 말 것
2. **재실행 방지**:
   ```sql
   -- 샘플 데이터 삭제
   DELETE FROM public.tasks 
   WHERE name IN ('설거지', '샤워 청소', '바닥 청소', ...);
   ```
3. **user_id 주의**: seed.sql은 anonymous user 가정
   - 실제 가입한 유저가 있으면 참고

---

## 🔄 재실행 & 초기화

### 전체 초기화 (권장하지 않음)

```sql
-- 모든 public 테이블 삭제
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- auth 스키마는 건드리지 않기!
```

### 특정 테이블만 삭제

```sql
-- 예: tasks만 삭제
DROP TABLE public.tasks CASCADE;

-- 그 다음 schema.sql 다시 실행
```

### 데이터만 초기화

```sql
-- 모든 테이블의 데이터 삭제 (구조는 유지)
TRUNCATE public.tasks CASCADE;
TRUNCATE public.verifications CASCADE;
TRUNCATE public.activity CASCADE;
-- ... (각 테이블별)
```

---

## 🚨 에러 해결

| 에러 | 원인 | 해결 |
|------|------|------|
| `relation "public.profiles" does not exist` | schema.sql 미실행 | schema.sql 먼저 실행 |
| `function public.handle_new_user does not exist` | functions.sql 미실행 | functions.sql 실행 |
| `permission denied for schema public` | 권한 부족 | Supabase owner 계정 확인 |
| `duplicate key value violates unique constraint` | 중복 실행 | 테이블 삭제 후 재실행 |
| `extension "uuid-ossp" does not exist` | 확장 미설치 | schema.sql이 `create extension` 포함 |

---

## ✨ 완료 체크리스트

모든 SQL을 실행한 후:

- [ ] schema.sql 실행 완료
- [ ] functions.sql 실행 완료
- [ ] policies.sql 실행 완료
- [ ] seed.sql 실행 완료 (선택)
- [ ] `npm run dev` 실행 → 로그인 페이지 표시
- [ ] 익명 로그인 가능
- [ ] 홈 페이지 진입 가능
- [ ] 청소 항목 표시 (또는 "항목이 없어요")

**모두 완료 시**: 🎉 Supabase 연결 성공!

---

## 📚 참고

- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security
- PostgreSQL Triggers: https://www.postgresql.org/docs/current/triggers.html
- CleanMate Architecture: docs/ARCHITECTURE.md
