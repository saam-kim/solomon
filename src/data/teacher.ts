import { lawPoints } from "./lawPoints";

export const teacherSceneLinks = [
  { id: "intro", label: "1. 인트로" },
  { id: "first_shift", label: "2. 첫 출근" },
  { id: "labor_contract", label: "3. 근로계약서" },
  { id: "limited_bread", label: "4. 한정판 빵" },
  { id: "parent_card_console", label: "5. 부모 카드와 게임기" },
  { id: "phone_id", label: "6. 신분증 사진" },
  { id: "disposal_food_cctv", label: "7. 폐기 음식과 CCTV" },
  { id: "spilled_milk", label: "8. 쏟아진 우유" },
  { id: "fall_accident", label: "9. 낙상 사고와 보험" },
  { id: "rainy_cat", label: "10. 비 오는 밤의 고양이" },
  { id: "payday", label: "11. 월급날" },
  { id: "ending", label: "12. 엔딩" },
] as const;

export const teacherLawConcepts = [
  { name: "근로계약서", scene: "믿음과 약속 사이", point: lawPoints.labor_contract },
  { name: "미성년자 계약", scene: "부모 카드와 게임기", point: lawPoints.minor_contract },
  { name: "청소년 유해물 판매 책임", scene: "신분증 사진", point: lawPoints.id_check },
  { name: "폐기 음식과 규정", scene: "폐기 음식과 CCTV", point: lawPoints.disposal_rule },
  { name: "안전관리와 손해배상", scene: "쏟아진 우유 · 낙상 사고", point: lawPoints.damages_procedure },
  { name: "임금 전액 지급 원칙", scene: "마지막 선", point: lawPoints.wage_payment },
];

export const teacherDiscussionQuestions = [
  "좋은 마음으로 한 행동도 책임을 낳을 수 있을까?",
  "법을 지키는 말투도 중요할까?",
  "알바생이 점장에게 어디까지 말할 수 있을까?",
  "민법과 노동법은 각각 누구를 보호하려고 할까?",
  "법이 사람을 보호하는 선이 되려면 무엇이 필요할까?",
];

export const teacherChoiceTypeLabels = {
  lawful_explained: "법+설명형",
  lawful_cold: "차가운 원칙형",
  relationship_first: "관계 우선형",
  avoidant: "회피형",
  creative_risk: "창의적 위험형",
} as const;
