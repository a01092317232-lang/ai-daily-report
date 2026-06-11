# briefing-improver

실습 1~3 통합 스킬 — 이슈 발굴(issue-writer) + 수정 실행(issue-runner) + 문서 최적화(doc-optimizer)를 하나의 파이프라인으로 묶는다.
실제 구현은 `.claude/skills/audit-and-issue/SKILL.md`와 동일하며, 이 파일은 Day 1 산출물 기준 명칭의 사본이다.

## 실행 순서

**Part A — 이슈 사이클 (issue-writer + issue-runner)**
1. 파일 읽기 — 저장소 구조 파악, 주요 파일 분석
2. 버그 탐지 — 링크·출처·콘텐츠·코드 오류 식별
3. WebSearch 검증 — 올바른 URL / 사실 확인
4. 이슈 등록 — gh CLI로 문제별 이슈 생성
5. 수정 계획 코멘트 — 각 이슈에 작업 계획 댓글
6. 코드 수정 — 파일 직접 편집
7. 커밋 & 푸시 — git commit + push
8. 이슈 close — 수정 완료 코멘트와 함께 close

**Part B — 문서 최적화 (doc-optimizer)**
9. 문서 역할 점검 — CLAUDE.md / SOUL.md / README.md 중복·낡은 내용 검사
10. 문서 수정 — 중복 제거, 역할 재배치 후 커밋 & 푸시

사용자가 "이슈만" 또는 "문서만" 지정하면 해당 Part만 실행한다.

---

## Part A: 이슈 사이클

### 1단계: 파일 읽기

파일 종류별 검토 관점:
- **HTML**: 링크 URL 정확성, 텍스트 사실성
- **Markdown**: 링크 유효성, 내용 정확성
- **JSON/설정**: 스키마 오류, 잘못된 값
- **소스 코드**: 논리 오류, 누락된 예외처리

### 2단계: 버그/문제점 탐지

- 내용과 무관한 링크 (제목은 A인데 링크는 B)
- 범용 페이지·2차 요약 블로그 연결 (원출처 아님)
- 수치·날짜·인명 불일치
- 오해를 줄 수 있는 표현

### 3단계: WebSearch 검증

- 올바른 URL 확인 시 → 수정 URL을 이슈 본문에 포함
- 불분명한 경우 → "확인 필요" 이슈로 등록
- 코드·구조 오류 → 검색 없이 바로 이슈 등록

### 4단계: 이슈 등록

gh 로그인 확인 (이슈 선언 전 반드시 먼저 실행):

```powershell
$gh = "C:\Program Files\GitHub CLI\gh.exe"
& $gh auth status
```

로그인 확인 후 "이슈 N개 등록합니다" 선언.

```powershell
$body = "## 문제`n내용`n`n## 수정`n- 기존: ..`n- 변경: ..`n`n## 근거`n출처"
& $gh issue create --repo <owner>/<repo> --title "[카테고리]: 설명" --body $body
```

### 5단계: 수정 계획 코멘트

```powershell
$plan = "## 작업 계획`n- [ ] 파일 수정`n- [ ] 커밋 & 푸시`n- [ ] 이슈 close"
& $gh issue comment <번호> --repo <owner>/<repo> --body $plan
```

### 6단계: 코드 수정

이슈별로 파일을 직접 편집한다. Edit 도구 사용.

### 7단계: 커밋 & 푸시

```powershell
cd <레포 경로>
git add <수정된 파일>
git commit -m "fix: 이슈 #N~M 수정"
git push
```

커밋 전 git config 확인 (비어있으면 설정):

```powershell
git config user.email "a01092317232@gmail.com"
git config user.name "a01092317232-lang"
```

### 8단계: 이슈 close

```powershell
$hash = git rev-parse --short HEAD
foreach ($n in @(이슈번호들)) {
    & $gh issue close $n --repo <owner>/<repo> --comment "수정 완료 (commit $hash)"
}
```

---

## Part B: 문서 최적화 (doc-optimizer)

### 9단계: 문서 역할 점검

세 문서의 역할 기준:

| 문서 | 역할 | 담는 것 |
|------|------|--------|
| CLAUDE.md | 에이전트 진입점 (WHAT·HOW) | 환경, 작업규칙, 파일구조, 스킬 |
| SOUL.md | 사명·판단원칙 (WHO·WHY) | 사명, 가치, 판단 기준 — CLAUDE.md가 @import |
| README.md | 사람용 온보딩 (외부 WHAT) | 개요, 기능, 실행법, 대상독자 |

점검 항목:
- **SSOT**: 같은 사실이 두 문서에 있으면 위반 — 한 곳에만 두고 나머지는 링크
- **최소성**: 코드/git에서 알 수 있는 내용은 삭제
- **신선도**: 낡은 경로·계정·상태 정보는 갱신 또는 삭제
- **역할 위반**: 개요가 CLAUDE.md에, 환경설정이 README에 있으면 이동

### 10단계: 문서 수정 & 푸시

- 위반 사항을 표로 보고 후 수정
- 커밋 메시지: `docs: 문서 역할 분리 — 중복 제거`
- push

---

## 완료 보고

**Part A:**

| 이슈 | 제목 | 변경 내용 |
|------|------|----------|
| [#N](URL) | 제목 | 기존 → 변경 |

**Part B:**

| 문서 | 조치 | 내용 |
|------|------|------|
| CLAUDE.md | 삭제/이동 | 무엇을 어디로 |

문제 없으면 "검토 결과 이상 없음"으로 보고한다.
