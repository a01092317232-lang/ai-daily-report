export const meta = {
  name: 'daily-report',
  description: 'AI 일일 리포트 자동 생성 — 뉴스 수집 → HTML 작성 → 품질 검증',
  phases: [
    { title: '수집', detail: '5개 주제 뉴스 동시 검색' },
    { title: '작성', detail: 'HTML 리포트 파일 생성' },
    { title: '검증', detail: 'rubric.md 기준 채점 및 재시도' },
  ],
}

// 수집할 뉴스 주제 5개
const SECTIONS = [
  'LLM 모델 출시·업데이트',
  'AI 규제·정책',
  'AI 비즈니스·투자',
  'AI 개발자 도구·오픈소스',
  'AI 실무 활용 사례',
]

const date = args?.date ?? new Date().toISOString().slice(0, 10)

// ─── 1단계: 5개 주제 동시 수집 ───────────────────────────────────────────────
phase('수집')
log(`${date} 리포트 수집 시작 — ${SECTIONS.length}개 주제 동시 검색`)

const sections = await parallel(
  SECTIONS.map(section => () =>
    agent(
      `오늘(${date}) "${section}" 관련 AI 뉴스 3~5건을 WebSearch로 수집해줘.\n` +
      `각 항목: 제목, 2문장 요약, 원출처 URL(공식 발표·원본 기사만).\n` +
      `결과는 JSON으로 반환.`,
      {
        label: `수집:${section}`,
        phase: '수집',
        schema: {
          type: 'object',
          properties: {
            section: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title:   { type: 'string' },
                  summary: { type: 'string' },
                  url:     { type: 'string' },
                },
                required: ['title', 'summary', 'url'],
              },
            },
          },
          required: ['section', 'items'],
        },
      }
    )
  )
)

const collected = sections.filter(Boolean)
log(`수집 완료 — ${collected.reduce((n, s) => n + s.items.length, 0)}건`)

// ─── 2단계: HTML 리포트 작성 ──────────────────────────────────────────────────
phase('작성')

await agent(
  `다음 뉴스 데이터를 바탕으로 reports/AI_Report_${date}.html 을 생성해줘.\n\n` +
  `뉴스 데이터:\n${JSON.stringify(collected, null, 2)}\n\n` +
  `요구사항:\n` +
  `- rubric.md 기준 준수\n` +
  `- 링크는 원출처만 (블로그·요약 사이트 불가)\n` +
  `- "전략 담당자가 오늘 무엇을 해야 하는가" 관점으로 요약\n` +
  `- 푸터에 "자동 생성 리포트" 명시\n` +
  `- SOUL.md 판단 원칙 준수`,
  { label: 'HTML 작성', phase: '작성' }
)

// ─── 3단계: 품질 검증 (최대 3회 시도) ───────────────────────────────────────
phase('검증')

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    passed:   { type: 'boolean' },
    score:    { type: 'number' },
    failures: { type: 'array', items: { type: 'string' } },
    fixes:    { type: 'string' },
  },
  required: ['passed', 'failures'],
}

let verdict
let attempt = 0

while (attempt < 3) {
  verdict = await agent(
    `reports/AI_Report_${date}.html 을 rubric.md 기준으로 채점해줘.\n` +
    `모든 항목 4점 이상이면 passed: true.\n` +
    `아니면 실패 항목 목록과 수정 지시를 반환해줘.`,
    { label: `검증 ${attempt + 1}회차`, phase: '검증', schema: VERDICT_SCHEMA }
  )

  if (verdict?.passed) break

  if (attempt < 2) {
    log(`불합격 (${attempt + 1}/3회) — 자동 수정 중: ${verdict?.fixes}`)
    await agent(
      `reports/AI_Report_${date}.html 을 다음 지시대로 수정해줘:\n${verdict?.fixes}`,
      { label: `수정 ${attempt + 1}회차`, phase: '검증' }
    )
  }

  attempt++
}

// ─── 최종 결과 반환 ───────────────────────────────────────────────────────────
const result = {
  date,
  passed:  verdict?.passed ?? false,
  score:   verdict?.score,
  file:    `reports/AI_Report_${date}.html`,
  retries: attempt,
}

log(result.passed
  ? `✔ 완료 — ${result.file} (${attempt}회 시도)`
  : `✘ 최종 불합격 — 수동 확인 필요`
)

return result
