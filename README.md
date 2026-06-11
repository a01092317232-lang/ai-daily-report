# 🤖 AI Daily Intelligence

> **매일 오전 8시, 글로벌 AI 동향을 자동 수집해 HTML 리포트로 저장하는 시스템**  
> IT 전략 담당자를 위한 팀/부서 공유용 브리핑 자동화

---

## 📋 개요

AI 업계의 빠른 변화를 매일 추적하기 위해 만든 자동화 리포트 시스템입니다.  
Claude AI가 글로벌 소스 15개 이상을 분석해 4개 섹션으로 정리하고, 날짜별 HTML 파일로 저장합니다.

---

## 🗂️ 리포트 구성

| 섹션 | 내용 |
|------|------|
| 📐 **모델 & 기술** | 신규 AI 모델 출시, 기술 발전, 플랫폼 변화 |
| 🏢 **기업 AI 도입** | 도입 통계, 에이전틱 AI 트렌드, 기업 전략 |
| ⚖️ **규제 & 정책** | EU / 미국 / 중국 규제 동향 |
| 💰 **투자 & 시장** | VC 투자, 대형 라운드, 시장 동향 |

---

## ✨ 주요 기능

- **매일 오전 8시 자동 실행** — Claude Code 스케줄러로 자동 수집 및 생성
- **클릭 가능한 카드** — 모든 이슈 카드에 원문 출처 링크 연결
- **NEW 배지** — 당일 새로 업데이트된 뉴스를 빨간 배지로 강조
- **전략 시사점** — IT 전략 담당자 관점의 즉시 행동 가능한 인사이트 5개 제공
- **날짜별 파일 저장** — `AI_Report_YYYY-MM-DD.html` 형식으로 누적 보관

---

## 📁 파일 구조

```
ai-daily-report/
├── README.md                       ← 이 파일 (GitHub 소개 · 실행법)
├── CLAUDE.md                       ← 에이전트 진입점 (환경 · 규칙 · 스킬)
├── SOUL.md                         ← 사명 · 판단 원칙 (CLAUDE.md에서 참조)
├── prompts/
│   └── daily-report-prompt.md      ← 리포트 생성 프롬프트 (파이프라인 소스)
├── reports/
│   └── AI_Report_YYYY-MM-DD.html   ← 날짜별 산출물 (자동 생성, 누적)
└── .claude/skills/audit-and-issue/ ← 레포 감사 · 이슈 · 문서최적화 스킬
```

> **코드가 없는 이유**: 이 레포는 Python/JS 크롤러 대신 **Claude Code가 직접
> 수집·작성하는 AI-네이티브 파이프라인**입니다. 전통적 코드의 역할은
> [prompts/daily-report-prompt.md](prompts/daily-report-prompt.md)가 대신합니다.

---

## 🖥️ 미리보기

| 요소 | 설명 |
|------|------|
| 배경 | 라이트 테마 (`#f0f2f8`) |
| 상단 통계 카드 | 모델 수 / 도입률 / 규제 / 투자 — 클릭 시 원문 이동 |
| 핵심 요약 | 오늘의 뉴스 6건 한눈에 |
| 뉴스 카드 | hover 시 `↗` 표시, 클릭 시 원문 기사 이동 |
| 전략 시사점 | 당일 가장 중요한 액션 포인트 |

---

## ⚙️ 자동화 구조

```
Claude Code 스케줄러
    └─ 매일 08:00 → prompts/daily-report-prompt.md 실행
         ├─ WebSearch × 5 (모델 / 기업 / 규제 / 도입 / 투자)
         ├─ 원출처 검증 (SOUL.md 판단 원칙)
         ├─ reports/AI_Report_YYYY-MM-DD.html 생성
         └─ git commit & push
```

---

## 🚀 실행 방법

**전제 조건**: [Claude Code](https://claude.ai/code) 설치 + `gh auth login` 완료 (Python/Node 불필요)

```bash
# 1. 클론
git clone https://github.com/a01092317232-lang/ai-daily-report.git
cd ai-daily-report

# 2. Claude Code 실행 후 프롬프트 입력
claude
> prompts/daily-report-prompt.md 를 읽고 오늘 날짜 리포트를 생성해줘
```

**스케줄 실행**: Claude Code 사이드바 → **Scheduled** 탭 → `daily-ai-news-report` → **Run now**

**품질 점검**: `/audit-and-issue` 또는 "레포 점검해줘" — 링크·출처 감사부터 이슈 등록·수정·문서 최적화까지 자동 수행

---

## 📌 대상 독자

- IT 전략 / 기획 담당자
- AI 트렌드를 팀에 공유해야 하는 리더
- 매일 뉴스를 직접 찾는 시간을 줄이고 싶은 분

---

*Built with [Claude Code](https://claude.ai/code) · 자동 생성 및 업데이트*
