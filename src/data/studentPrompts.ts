export const studentPrompts: Record<string, string> = {
  intro: "지후가 가장 먼저 걱정해야 할 것을 한 문장으로 적어보세요.",
  first_shift: "내가 점장이라면 어떤 알바생에게 더 안심할지 이유를 적어보세요.",
  contract: "점장을 공격하지 않으면서 계약서를 요구하는 문장을 직접 써보세요.",
  limited_bread: "호의를 거절하더라도 관계를 덜 상하게 하는 말을 적어보세요.",
  minor_contract: "매출을 포기하면서도 판매를 미룰 수 있는 이유를 적어보세요.",
  id_photo: "리뷰 협박을 받았을 때 흔들리지 않고 거절하는 문장을 써보세요.",
  disposal_food: "관행과 규정이 다를 때 어느 쪽을 따라야 하는지 이유를 적어보세요.",
  spilled_milk: "내 선택 때문에 손님이 불평한다면 어떻게 설명할지 적어보세요.",
  fall_accident: "손님에게 책임 회피로 들리지 않게 공식 절차를 안내하는 말을 써보세요.",
  rainy_cat: "고양이를 그냥 쫓아내지 않으면서도 매장 책임을 지키는 방법을 적어보세요.",
  payday: "'이의 있습니다'를 공격적으로 들리지 않게 바꿔 말해보세요.",
  ending: "내가 바꿔보고 싶은 선택 하나와 이유를 적어보세요.",
};

export function studentPromptForScene(sceneId: string) {
  return studentPrompts[sceneId] ?? "이 선택을 하려는 이유를 짧게 적어보세요.";
}
