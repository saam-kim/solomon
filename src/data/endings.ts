import type { Ending, GameState } from "../types";

export const endings: Record<string, Ending> = {
  happy: {
    id: "happy",
    title: "서로 기대어 설 수 있는 선",
    subtitle: "해피 엔딩",
    mainIllustration: "72_CG_HappyEnding_GroupShot.png",
    supportingAssets: ["02_Jihu_Happy.png", "07_Owner_Happy.png", "11_Sujin_Happy.png", "21_OfficeWorker_Happy.png"],
    body: "본사 평가는 가까스로 통과된다. 지후는 법이 사람을 밀어내는 벽이 아니라 서로 기대어 설 수 있도록 그어 놓은 선임을 깨닫는다.",
    diagnosis: [
      "기본 계약과 임금의 선을 지켰다.",
      "매출보다 안전과 신분 확인을 우선했다.",
      "절차를 설명하며 관계를 완전히 끊지 않았다.",
    ],
  },
  soft_bad: {
    id: "soft_bad",
    title: "착한 사람의 미납 고지서",
    subtitle: "배드 엔딩 A",
    mainIllustration: "61_BG_StoreExterior_ClosingCrisis.png",
    supportingAssets: ["52_Prop_PayStatement.png", "53_Prop_BankingApp_Deduction.png", "57_UI_WrongAnswerNote.png"],
    body: "지후는 많은 순간을 좋게 넘기려 했다. 그러나 법을 모른 친절은 자신을 지키지 못했고, 가게의 문제도 조용히 남았다.",
    diagnosis: [
      "갈등을 피하려다 계약과 임금의 기준이 흐려졌다.",
      "좋은 마음이 기록과 절차를 대신하지 못했다.",
      "불편한 말을 미룰수록 다음 선택은 더 어려워졌다.",
    ],
  },
  rigid_bad: {
    id: "rigid_bad",
    title: "법전만 남은 계산대",
    subtitle: "배드 엔딩 B",
    mainIllustration: "68_CG_Payday_CounterConfrontation.png",
    supportingAssets: ["58_UI_LegalExplanationFrame.png", "60_UI_EndingResultCard.png", "12_Sujin_Sad.png"],
    body: "법적 기준은 대체로 지켰지만 사람들의 감정은 계산대 너머에 남겨졌다. 법이 사람들 사이에서 작동하려면 말투와 설득도 필요했다.",
    diagnosis: [
      "원칙은 지켰지만 관계 회복을 위한 설명이 부족했다.",
      "학생들이 토론하기 좋은 지점: 맞는 말은 어떻게 해야 들릴까?",
      "기준과 배려가 함께 갈 때 법은 생활 속에서 작동한다.",
    ],
  },
  normal: {
    id: "normal",
    title: "무사히 닫힌 자동문",
    subtitle: "노멀 엔딩",
    mainIllustration: "33_BG_ConvenienceStore_ExteriorNight.png",
    supportingAssets: ["60_UI_EndingResultCard.png", "01_Jihu_Neutral.png", "06_Owner_Neutral.png"],
    body: "완벽하지는 않았지만, 지후는 조금 더 현실적인 어른이 되었다. 어떤 선은 늦게 그었고, 어떤 선은 어렵게 지켰다.",
    diagnosis: [
      "법적 판단과 인간관계 사이의 균형이 아직 흔들렸다.",
      "다음 플레이에서는 어느 장면에서 다른 선택을 할지 토론해볼 수 있다.",
      "중요한 것은 정답보다 선택의 이유를 말해보는 일이다.",
    ],
  },
};

export function selectEnding(state: GameState): Ending {
  const f = state.flags;
  const safetyRecovered = f.spill_cleaned === true || f.insurance_procedure === true;

  if (
    f.contract_written === true &&
    f.minor_contract_risk === false &&
    f.id_check_failed === false &&
    f.wage_deduction_accepted === false &&
    safetyRecovered &&
    state.storeTrust >= 4
  ) {
    return endings.happy;
  }

  const avoidanceCount = [
    f.contract_written === false,
    f.wage_deduction_accepted === true,
    f.minor_contract_risk === true,
    f.id_check_failed === true,
    f.disposal_rule_broken === true,
  ].filter(Boolean).length;

  if (avoidanceCount >= 2 || f.wage_deduction_accepted === true) {
    return endings.soft_bad;
  }

  if (state.legalStability >= 13 && state.relationship <= -3) {
    return endings.rigid_bad;
  }

  return endings.normal;
}
