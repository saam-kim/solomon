import { endings } from "../data/endings";
import type {
  ChoiceHistoryItem,
  ChoiceTypeCounts,
  Ending,
  EndingAnalysis,
  EndingId,
  GameFlags,
  GameState,
} from "../types/game";

export const countChoiceTypes = (history: ChoiceHistoryItem[]): ChoiceTypeCounts => ({
  lawfulExplainedCount: history.filter((choice) => choice.choiceType === "lawful_explained").length,
  lawfulColdCount: history.filter((choice) => choice.choiceType === "lawful_cold").length,
  relationshipFirstCount: history.filter((choice) => choice.choiceType === "relationship_first").length,
  avoidantCount: history.filter((choice) => choice.choiceType === "avoidant").length,
  creativeRiskCount: history.filter((choice) => choice.choiceType === "creative_risk").length,
});

const riskFlagKeys: (keyof GameFlags)[] = [
  "minor_contract_risk",
  "id_check_failed",
  "disposal_rule_broken",
  "fall_accident",
];

export const selectEndingId = (state: GameState): EndingId => {
  const counts = countChoiceTypes(state.choiceHistory);
  const riskCount = riskFlagKeys.filter((key) => state.flags[key] === true).length
    + (state.flags.fair_sale === false ? 1 : 0)
    + (state.flags.insurance_procedure === false ? 1 : 0);

  if (riskCount >= 3 && (state.storeTrust <= -2 || state.affinity.customerTrust <= -2)) {
    return "ending_closing";
  }

  if (
    state.legalStability >= 8
    && counts.lawfulColdCount >= 3
    && (state.explanationSkill <= 2 || state.relationship <= -2 || state.affinity.customerTrust <= -2)
  ) {
    return "ending_empty_counter";
  }

  if (
    state.flags.contract_written === true
    && state.flags.minor_contract_risk === false
    && state.flags.id_check_failed === false
    && state.flags.wage_deduction_accepted === false
    && (state.flags.spill_cleaned === true || state.flags.insurance_procedure === true)
    && state.explanationSkill >= 7
    && state.affinity.ownerTrust > -2
    && state.affinity.customerTrust > -2
  ) {
    return "ending_happy";
  }

  if (
    state.flags.contract_written === false
    || state.flags.wage_deduction_accepted === true
    || state.affinity.jihuSelfRespect <= -3
    || counts.avoidantCount + counts.relationshipFirstCount >= 7
  ) {
    return "ending_unpaid_notice";
  }

  return "ending_normal";
};

export const selectEnding = (state: GameState): Ending => endings[selectEndingId(state)];

const summarizeLegalStability = (state: GameState) => {
  if (state.legalStability >= 10) return "법적 기준을 매우 꾸준히 지켰습니다.";
  if (state.legalStability >= 4) return "중요한 순간에는 법적 기준을 지키려 했습니다.";
  if (state.legalStability >= 0) return "상황에 따라 기준이 흔들렸지만 위험을 돌아볼 여지는 남겼습니다.";
  return "편의와 압박 때문에 여러 법적 위험을 떠안았습니다.";
};

const summarizeRelationships = (state: GameState, counts: ChoiceTypeCounts) => {
  if (state.explanationSkill >= 7 && counts.lawfulExplainedCount >= counts.lawfulColdCount) {
    return "기준의 이유를 설명하며 관계를 지키는 법을 익혔습니다.";
  }
  if (counts.lawfulColdCount >= 3) return "기준은 분명했지만 말이 사람에게 닿는 과정이 부족했습니다.";
  if (counts.relationshipFirstCount + counts.avoidantCount >= 6) return "갈등을 줄이려 했지만 중요한 책임과 설명을 뒤로 미뤘습니다.";
  return "법과 관계 사이에서 여러 방식을 시험하며 현실적인 균형을 배웠습니다.";
};

export const buildEndingAnalysis = (state: GameState): EndingAnalysis => {
  const counts = countChoiceTypes(state.choiceHistory);
  const preferredSceneIds = ["labor_contract", "spilled_milk", "fall_accident", "payday"];
  const preferred = preferredSceneIds
    .map((sceneId) => state.choiceHistory.find((choice) => choice.sceneId === sceneId))
    .filter((choice): choice is ChoiceHistoryItem => Boolean(choice));
  const keyChoices = (preferred.length >= 3 ? preferred : state.choiceHistory).slice(-3);

  const keptLines = [
    state.flags.contract_written === true ? "근로조건을 기록으로 남겼습니다." : null,
    state.flags.fair_sale === true ? "단골과 일반 손님에게 같은 판매 기준을 적용했습니다." : null,
    state.flags.id_check_failed === false ? "신분 확인 기준을 지켰습니다." : null,
    state.flags.spill_cleaned === true ? "눈앞의 대기보다 안전을 먼저 살폈습니다." : null,
    state.flags.insurance_procedure === true ? "사고 책임을 기록과 공식 절차로 다뤘습니다." : null,
    state.flags.wage_deduction_accepted === false ? "임금과 손해배상 문제를 구분했습니다." : null,
  ].filter((item): item is string => Boolean(item));

  const blurredLines = [
    state.flags.contract_written === false ? "근로조건을 말로만 남겼습니다." : null,
    state.flags.fair_sale === false ? "한 사람을 위한 호의로 판매 기준을 바꿨습니다." : null,
    state.flags.minor_contract_risk === true ? "부모 동의가 확인되지 않은 거래를 진행했습니다." : null,
    state.flags.id_check_failed === true ? "확인할 수 없는 신분증 사진을 받아들였습니다." : null,
    state.flags.disposal_rule_broken === true ? "폐기 물품의 처리 기준을 흐렸습니다." : null,
    state.flags.insurance_procedure === false ? "사고 책임을 공식 절차 밖에서 해결하려 했습니다." : null,
    state.flags.wage_deduction_accepted === true ? "임금에서 임의로 공제된 금액을 받아들였습니다." : null,
  ].filter((item): item is string => Boolean(item));

  return {
    keyChoices,
    legalSummary: summarizeLegalStability(state),
    relationshipSummary: summarizeRelationships(state, counts),
    keptLines: keptLines.length ? keptLines : ["완전히 지킨 선은 적었지만, 선택의 결과를 끝까지 확인했습니다."],
    blurredLines: blurredLines.length ? blurredLines : ["크게 흐린 선은 없었습니다."],
  };
};
