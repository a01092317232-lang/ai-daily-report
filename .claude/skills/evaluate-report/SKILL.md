# evaluate-report

리포트를 rubric.md로 채점하고, 미달이면 수정 → 재채점 루프를 돌린다. 트리거: "리포트 채점해줘" / "품질 평가해줘"

## 절차 (자동 개선 루프)

```
1. quality-reviewer 에이전트로 rubric.md 5항목 채점
2. 전 항목 4점 이상?
   ├─ YES → PASS 보고 후 종료 (exit)
   └─ NO  → 감점 사유별로 파일 수정 (report-writer 역할)
            → 1로 돌아가 재채점
3. 3회 반복에도 FAIL이면 중단하고 사람에게 보고
```

## 규칙

- 채점과 수정의 주체를 분리한다: 채점은 quality-reviewer, 수정은 report-writer
- 매 라운드 점수표를 기록해 개선 추이를 보여준다
- PASS 시 최종 점수표와 함께 "합격 (라운드 N)" 보고
