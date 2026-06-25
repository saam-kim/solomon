import type { Ending, EndingId } from "../types/game";

export const endings: Record<EndingId, Ending> = {
  ending_happy: {
    id: "ending_happy",
    title: "편의점 솔로몬",
    description: "지후는 법과 관계 어느 한쪽도 밀어내지 않고, 함께 설 수 있는 기준을 설명하는 사람이 되었다.",
    message: "법을 지킨다는 것은 사람을 밀어내는 일이 아니라, 서로 기대어 설 수 있는 선을 함께 긋는 일이다.",
    background: "81_CG_Ending_WarmStore.png",
    cg: "72_CG_HappyEnding_GroupShot.png",
    discussionQuestions: [
      "법을 지키면서도 상대의 사정을 존중했던 선택은 무엇이었나요?",
      "지후의 설명 방식이 점장과 손님의 태도를 어떻게 바꾸었나요?",
    ],
  },
  ending_unpaid_notice: {
    id: "ending_unpaid_notice",
    title: "착한 사람의 미납 고지서",
    description: "지후는 여러 사람의 사정을 이해했지만, 정작 자신의 권리를 말해야 할 순간에는 계속 뒤로 물러났다.",
    message: "법을 모른 친절은 자신을 지키지 못한다.",
    background: "33_BG_ConvenienceStore_ExteriorNight.png",
    cg: "77_BG_JihuRoom_Night.png",
    discussionQuestions: [
      "상대를 배려하는 것과 자신의 권리를 포기하는 것의 경계는 어디일까요?",
      "지후가 더 일찍 기록하거나 말했어야 할 약속은 무엇이었나요?",
    ],
  },
  ending_empty_counter: {
    id: "ending_empty_counter",
    title: "법전만 남은 계산대",
    description: "지후의 판단은 법적으로 단단했지만, 짧고 차가운 말들이 사람을 계산대에서 멀어지게 했다.",
    message: "맞는 말도 사람에게 닿는 방식이 필요하다.",
    background: "33_BG_ConvenienceStore_ExteriorNight.png",
    cg: "68_CG_Payday_CounterConfrontation.png",
    discussionQuestions: [
      "법적으로 맞는 말을 차갑게 전달했을 때 무엇을 잃을 수 있나요?",
      "같은 기준을 더 잘 설명할 수 있었던 장면은 어디였나요?",
    ],
  },
  ending_closing: {
    id: "ending_closing",
    title: "폐점 위기 탈출 실패",
    description: "작은 예외와 미뤄둔 책임이 민원과 사고로 돌아왔고, 가게가 버틸 신뢰는 조금씩 사라졌다.",
    message: "작은 예외와 미뤄둔 책임이 쌓이면, 결국 모두가 기댈 공간이 사라진다.",
    background: "33_BG_ConvenienceStore_ExteriorNight.png",
    discussionQuestions: [
      "처음에는 작아 보였지만 나중에 큰 위험이 된 예외는 무엇이었나요?",
      "가게의 신뢰를 회복하려면 어떤 기준부터 다시 세워야 할까요?",
    ],
  },
  ending_normal: {
    id: "ending_normal",
    title: "무사히 닫힌 자동문",
    description: "모든 선택이 완벽하지는 않았지만, 지후는 사정과 책임을 함께 바라보는 조금 더 현실적인 어른이 되었다.",
    message: "완벽하지는 않았지만, 지후는 조금 더 현실적인 어른이 되었다.",
    background: "33_BG_ConvenienceStore_ExteriorNight.png",
    cg: "81_CG_Ending_WarmStore.png",
    discussionQuestions: [
      "다시 선택한다면 가장 바꾸고 싶은 장면은 어디인가요?",
      "현실에서 법과 관계가 충돌할 때 어떤 질문부터 해야 할까요?",
    ],
  },
};
