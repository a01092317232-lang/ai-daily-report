# audit-and-issue

저장소를 감사해 버그를 찾고, 이슈 등록 → 수정 계획 코멘트 → 코드 수정 → 푸시 → 이슈 close 까지 자동 처리한다.

## 실행 순서

1. 파일 읽기 — 저장소 구조 파악, 주요 파일 분석
2. 버그 탐지 — 링크·출처·콘텐츠·코드 오류 식별
3. WebSearch 검증 — 올바른 URL / 사실 확인
4. 이슈 등록 — gh CLI로 문제별 이슈 생성
5. 수정 계획 코멘트 — 각 이슈에 작업 계획 댓글
6. 코드 수정 — 파일 직접 편집
7. 커밋 & 푸시 — git commit + push
8. 이슈 close — 수정 완료 코멘트와 함께 close

---

## 1단계: 파일 읽기

파일 종류별 검토 관점:
- **HTML**: 링크 URL 정확성, 텍스트 사실성
- **Markdown**: 링크 유효성, 내용 정확성
- **JSON/설정**: 스키마 오류, 잘못된 값
- **소스 코드**: 논리 오류, 누락된 예외처리

---

## 2단계: 버그/문제점 탐지

- 내용과 무관한 링크 (제목은 A인데 링크는 B)
- 범용 페이지 연결 (홈페이지·목록 — 구체적 출처 없음)
- 수치·날짜·인명 불일치
- 오해를 줄 수 있는 표현

---

## 3단계: WebSearch 검증

- 올바른 URL 확인 시 → 수정 URL을 이슈 본문에 포함
- 불분명한 경우 → "확인 필요" 이슈로 등록
- 코드·구조 오류 → 검색 없이 바로 이슈 등록

---

## 4단계: 이슈 등록

### gh 로그인 확인 (이슈 선언 전 반드시 먼저 실행)

```powershell
$gh = "C:\Program Files\GitHub CLI\gh.exe"
& $gh auth status
```

로그인 확인 후 "이슈 N개 등록합니다" 선언.

### 이슈 생성

```powershell
$body = "## 문제`n내용`n`n## 수정`n- 기존: ..`n- 변경: .."
& $gh issue create --repo <owner>/<repo> --title "[카테고리]: 설명" --body $body
```

### 이슈 본문 형식

```
## 문제
어디서, 무엇이 잘못됐는지

## 수정
- 기존: [현재 값]
- 변경: [올바른 값]

## 근거
WebSearch 출처 URL 또는 분석 근거
```

---

## 5단계: 수정 계획 코멘트

이슈 등록 직후 각 이슈에 작업 계획 댓글을 단다.

```powershell
$plan = "## 작업 계획`n- [ ] 파일 수정`n- [ ] 커밋 & 푸시`n- [ ] 이슈 close"
& $gh issue comment <번호> --repo <owner>/<repo> --body $plan
```

---

## 6단계: 코드 수정

이슈별로 파일을 직접 편집한다. Edit 도구 사용.

---

## 7단계: 커밋 & 푸시

```powershell
cd <레포 경로>
git add <수정된 파일>
git commit -m "fix: 이슈 #N~M 링크/버그 수정"
git push
```

커밋 전 `git config user.email` / `user.name` 설정 여부 확인:

```powershell
git config user.email   # 비어있으면 아래 실행
git config user.email "a01092317232@gmail.com"
git config user.name "a01092317232-lang"
```

---

## 8단계: 이슈 close

커밋 해시를 코멘트에 포함해 close한다.

```powershell
$hash = git rev-parse --short HEAD
foreach ($n in @(이슈번호들)) {
    $msg = "수정 완료 (commit $hash)"
    & $gh issue close $n --repo <owner>/<repo> --comment $msg
}
```

---

## 완료 보고

| 이슈 | 제목 | 변경 내용 |
|------|------|----------|
| [#N](URL) | 제목 | 기존 → 변경 |

문제 없으면 "검토 결과 이상 없음"으로 보고한다.
