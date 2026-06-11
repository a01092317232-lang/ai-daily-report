# CLAUDE.md — ai-daily-report

프로젝트 판단 원칙과 가치는 @SOUL.md 를 먼저 읽어라.

## 프로젝트 개요

매일 글로벌 AI 동향을 수집해 HTML 리포트로 자동 생성하는 시스템.
IT 전략 담당자를 위한 브리핑 자동화.

## 파일 구조

```
ai-daily-report/
├── AI_Report_YYYY-MM-DD.html   # 날짜별 리포트 (자동 생성)
├── README.md                   # GitHub 소개 페이지
├── CLAUDE.md                   # 이 파일 (에이전트 진입점)
├── SOUL.md                     # 판단 원칙 및 사명 (CLAUDE.md가 가리킴)
└── .claude/
    └── skills/
        └── audit-and-issue/    # 레포 감사 → 이슈 등록 스킬
```

## 환경

- OS: Windows 11, PowerShell 5.1
- gh CLI: `C:\Program Files\GitHub CLI\gh.exe` (PATH 미등록 — 전체 경로 사용)
- PowerShell 5.1은 `?.` 옵셔널 체이닝 미지원
- Node.js / Python 미설치

## GitHub

- 레포: `a01092317232-lang/ai-daily-report`
- gh 계정: `a01092317232-lang` (로그인됨)
- git 사용자: `a01092317232@gmail.com`

## 작업 규칙

- HTML 파일의 링크는 반드시 원출처(공식 발표, 원본 기사)로 연결
- 범용 페이지(홈, 목록)를 출처로 쓰지 않는다
- 이슈 등록 전 반드시 `gh auth status` 확인 후 선언
- PowerShell에서 이슈 본문은 변수로 분리해 따옴표 중첩 방지

## 커스텀 스킬

- `audit-and-issue` — 파일 감사 → 링크 검증 → GitHub 이슈 자동 등록
  - 트리거: "레포 점검해줘", "버그 검증해줘", "이슈 등록해줘"
