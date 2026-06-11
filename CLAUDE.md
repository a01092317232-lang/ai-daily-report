# CLAUDE.md

판단 원칙·사명은 @SOUL.md — 프로젝트 소개는 README.md 참고.

파일 구조는 README.md의 "파일 구조" 섹션 참고.

## 환경

- OS: Windows 11 / PowerShell 5.1 (`?.` 옵셔널 체이닝 미지원)
- gh CLI: `C:\Program Files\GitHub CLI\gh.exe` (PATH 미등록)
- git: `a01092317232@gmail.com` / `a01092317232-lang`
- Node.js · Python 미설치 (로컬 서버 실행 불가)

## 작업 규칙

- 링크는 반드시 원출처(공식 발표·원본 기사). 범용 페이지·블로그 요약 불가
- 이슈 등록 전 반드시 `& $gh auth status` 확인 후 선언
- PowerShell 이슈 본문은 변수로 분리 (따옴표 중첩 방지)

## 커스텀 스킬

`audit-and-issue` — 풀 파이프라인: 감사 → 이슈 등록 → 수정 → 푸시 → close + 문서 최적화(doc-optimizer)  
트리거: "레포 점검해줘" / "버그 검증해줘" / "문서 점검해줘"
