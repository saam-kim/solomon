import type { LawPoint } from "../types/game";

export const lawPoints: Record<string, LawPoint> = {
  labor_contract: {
    id: "labor_contract",
    title: "믿음을 적어두는 이유",
    summary: "근로계약서는 서로를 의심하기 위한 종이가 아니라, 서로 다르게 기억할 수 있는 약속을 보호하기 위한 장치다.",
    keyConcepts: ["근로계약서", "임금", "근로시간", "근로조건 명시"],
    reflectionQuestion: "친한 사이라면 계약서를 쓰지 않아도 괜찮을까?",
  },
  fair_sale: {
    id: "fair_sale",
    title: "호의가 불공정이 되는 순간",
    summary: "한 사람에게는 따뜻한 배려였던 행동도, 같은 기회를 기대한 다른 사람에게는 불공정으로 느껴질 수 있다. 규칙은 사람을 차갑게 대하기 위한 것이 아니라, 사람마다 달라지지 않는 기준을 만들기 위한 장치다.",
    keyConcepts: ["공정성", "거래 질서", "소비자 신뢰"],
    reflectionQuestion: "단골에게 특별히 잘해주는 것은 언제부터 불공정이 될까?",
  },
  minor_contract: {
    id: "minor_contract",
    title: "보호와 거래 사이의 확인",
    summary: "미성년자의 고가 거래는 법정대리인의 동의가 없으면 나중에 취소될 수 있다. 민법은 미성년자를 보호하면서 거래 상대방에게도 확인할 필요를 남긴다.",
    keyConcepts: ["미성년자 계약", "법정대리인 동의", "계약 취소"],
    reflectionQuestion: "부모의 카드를 가지고 왔다는 사실만으로 동의가 확인됐다고 볼 수 있을까?",
  },
  id_check: {
    id: "id_check",
    title: "편의 한 번이 남기는 책임",
    summary: "청소년 유해물 판매에서는 신분 확인 책임이 중요하다. 휴대폰에 저장한 신분증 사진은 본인 여부와 진위를 확인하기 어렵다.",
    keyConcepts: ["신분 확인", "청소년 보호", "판매자 책임"],
    reflectionQuestion: "상대의 사정이 딱해 보여도 확인 기준을 바꾸면 안 되는 이유는 무엇일까?",
  },
  disposal_rule: {
    id: "disposal_rule",
    title: "버릴 물건에도 남아 있는 기준",
    summary: "폐기 예정 음식이라도 매장 자산과 내부 규정의 문제에서 자유롭지 않다. 작은 예외가 일하는 사람 사이의 신뢰를 흔들 수 있다.",
    keyConcepts: ["매장 자산", "내부 규정", "신뢰"],
    reflectionQuestion: "곧 버릴 물건이라면 개인이 가져가도 괜찮다고 말할 수 있을까?",
  },
  safety_management: {
    id: "safety_management",
    title: "아무 일도 일어나지 않게 하는 일",
    summary: "안전 관리는 사고가 나기 전에 위험을 발견하고 조치하는 일이다. 매출을 잠깐 늦추더라도 사고를 막는 선택이 가게와 사람을 지킬 수 있다.",
    keyConcepts: ["안전 관리", "위험 예방", "주의 표지"],
    reflectionQuestion: "눈앞의 불편과 아직 일어나지 않은 사고 중 무엇을 먼저 고려해야 할까?",
  },
  damages_procedure: {
    id: "damages_procedure",
    title: "책임을 정확히 정하는 절차",
    summary: "손해배상은 손해 발생, 원인, 책임 범위와 과실 여부를 확인해 정해야 한다. 사고 기록과 공식 절차는 책임을 피하는 수단이 아니라 공정하게 나누는 기준이다.",
    keyConcepts: ["손해배상", "과실", "사고 기록", "보험 절차"],
    reflectionQuestion: "사고 직후 바로 현금으로 보상하는 것이 언제나 가장 책임 있는 방법일까?",
  },
  goodwill_responsibility: {
    id: "goodwill_responsibility",
    title: "좋은 마음을 책임 있게 건네기",
    summary: "법이 모든 답을 주지는 않는다. 그래서 선의는 위생, 영업 공간, 주변 사람에게 미칠 영향까지 살피며 더 신중하게 실천해야 한다.",
    keyConcepts: ["선의", "위생 관리", "주변 책임"],
    reflectionQuestion: "좋은 의도로 한 행동도 다른 사람에게 피해가 된다면 어떻게 조정해야 할까?",
  },
  wage_payment: {
    id: "wage_payment",
    title: "임금과 손해 사이의 선",
    summary: "임금은 원칙적으로 전액 지급되어야 한다. 근로자의 손해배상 책임이 문제 되더라도 임금에서 임의로 공제하는 방식과는 구분해야 한다.",
    keyConcepts: ["임금 전액 지급", "임의 공제", "손해배상 분리"],
    reflectionQuestion: "가게에 실제 손해가 생겼다면 임금에서 바로 빼는 것이 왜 문제가 될까?",
  },
};
