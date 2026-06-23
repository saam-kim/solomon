import type { Scene } from "../types";
import { lawPoints } from "./lawPoints";

const law = (id: string) => lawPoints.find((point) => point.id === id);

export const scenes: Scene[] = [
  {
    id: "intro",
    title: "인트로 - 무거운 자동문",
    mainIllustration: "33_BG_ConvenienceStore_ExteriorNight.png",
    background: "33_BG_ConvenienceStore_ExteriorNight.png",
    dialogue: [
      { speaker: "나레이션", text: "비가 그친 새벽, 편의점 간판은 아직 켜져 있었다.", dim: true, illustration: "33_BG_ConvenienceStore_ExteriorNight.png" },
      { speaker: "나레이션", text: "자동문 옆에는 본사 평가 안내문이 붙어 있었다." },
      { speaker: "안내문", text: "이번 달 개선 없을 시 계약 재검토", tone: "strong", illustration: "61_BG_StoreExterior_ClosingCrisis.png", zoom: "notice" },
      { speaker: "지후", text: "오늘부터 여기서 일한다.", focus: "01_Jihu_Neutral.png", illustration: "33_BG_ConvenienceStore_ExteriorNight.png" },
      { speaker: "지후", text: "그냥 알바라고 생각했는데... 생각보다 무거운 문을 여는 것 같다.", focus: "03_Jihu_Worried.png" },
      { speaker: "나레이션", text: "이곳에서 지후는 배우게 된다." },
      { speaker: "나레이션", text: "법은 시험지 속 문장이 아니라, 사람과 사람이 부딪히는 순간에 필요한 선이라는 것을." },
    ],
    nextScene: "first_shift",
  },
  {
    id: "first_shift",
    type: "choice",
    title: "[프롤로그] 폐점 위기의 첫 출근",
    mainIllustration: "34_CG_FirstShift_Greeting.png",
    background: "34_CG_FirstShift_Greeting.png",
    characters: [
      { asset: "01_Jihu_Neutral.png", side: "left", activeFor: ["지후"] },
      { asset: "08_Owner_Worried.png", side: "right", activeFor: ["점장님"] },
    ],
    dialogue: [
      { speaker: "점장님", text: "자, 지후 학생이었나? 오늘부터 우리 편의점 오전 알바를 맡게 되었군.", illustration: "34_CG_FirstShift_Greeting.png" },
      { speaker: "점장님", text: "솔직히 말하자면 이번 달 본사 평가가 마지막 기회일세. 민원도, 사고도, 매출 손실도 더는 안 돼.", illustration: "62_CG_Owner_TiredWithEvaluationSheet.png" },
      { speaker: "점장님", text: "자네가 이 가게의 분위기를 바꿔줘야 하네.", illustration: "62_CG_Owner_TiredWithEvaluationSheet.png" },
    ],
    choices: [
      {
        id: "warm_start",
        label: "안녕하세요, 점장님! 오늘부터 제가 이 가게 분위기를 살려보겠습니다. 힘 있게 인사한다.",
        summary: "밝은 태도로 가게 분위기를 살리겠다고 했다.",
        result: [
          { speaker: "나레이션", text: "점장님의 굳은 얼굴이 조금 풀립니다. 과한 자신감이긴 하지만, 폐점 이야기를 들은 뒤에도 도망치지 않는 태도가 가게에 활기를 불어넣습니다." },
        ],
        effect: { relationship: 15, storeTrust: 0, legalStability: 0 },
      },
      {
        id: "learn_rules",
        label: "먼저 규칙부터 정확히 배우겠습니다. 실수로 가게에 부담을 주고 싶지 않습니다. 차분하게 답한다.",
        summary: "실수로 가게에 부담을 주지 않기 위해 규칙부터 배우겠다고 했다.",
        result: [
          { speaker: "나레이션", text: "점장님이 말없이 고개를 끄덕입니다. 당장 분위기는 뜨겁지 않지만, 위기 상황에서 믿고 맡길 수 있는 사람이라는 첫인상을 남겼습니다." },
        ],
        effect: { legalStability: 0, relationship: 5, storeTrust: 5 },
      },
    ],
    nextScene: "contract",
  },
  {
    id: "contract",
    type: "testimony",
    title: "[법률] 첫 약속의 무게 (근로기준법)",
    mainIllustration: "26_BG_ConvenienceCounter_Morning.png",
    background: "26_BG_ConvenienceCounter_Morning.png",
    characters: [
      { asset: "03_Jihu_Worried.png", side: "left", activeFor: ["지후", "지후 독백"] },
      { asset: "08_Owner_Worried.png", side: "right", activeFor: ["점장님"] },
    ],
    dialogue: [],
    testimony: [
      { text: "자, 지후 군. 편의점 일이라는 게 생각보다 어렵지 않아. 바코드 찍고 결제하면 되지.", speaker: "점장님" },
      { text: "아, 참! 근로계약서 말인데... 본사 평가가 끝날 때까지만 미뤄두자. 서류 하나 잘못 쓰면 괜히 더 복잡해져.", speaker: "점장님", isContradiction: true, correctLaw: "labor_17" },
      { text: "나도 자네를 믿고, 자네도 나를 믿으면 되는 거 아닌가? 우리 지금 서로 급하잖아.", speaker: "점장님" }
    ],
    success: {
      feedback: "점장님은 당황하지만, 가게의 첫 단추가 잘못 끼워지는 일을 막았습니다. 근로기준법 제17조에 따라 근로조건은 체결 시점에 서면 또는 전자문서로 명시하고 교부해야 합니다.",
      law: 25, relation: -10, profit: 5,
      npcPose: "09_Owner_Angry.png",
      playerPose: "04_Jihu_Determined.png",
      dialogue: [
        { speaker: "지후", text: "점장님! 이의 있습니다!", focus: "04_Jihu_Determined.png" },
        { speaker: "지후", text: "근로기준법 제17조에 따르면 근로계약은 체결 시점에 임금, 근로시간, 주휴일 등 핵심 조건을 서면으로 명시해 교부해야 합니다!", focus: "04_Jihu_Determined.png" },
        { speaker: "지후", text: "한 달 뒤에 쓰겠다는 것은 명백한 위법이며, 위반 시 500만 원 이하의 벌금이 부과될 수 있습니다!", focus: "04_Jihu_Determined.png" },
        { speaker: "점장님", text: "으윽... 지금은 서류보다 손님이 더 급한데 말이지.", focus: "09_Owner_Angry.png" },
        { speaker: "지후", text: "그래서 더 지금 해야 합니다. 나중에 문제가 터지면 손님보다 서류가 먼저 우리 발목을 잡을 테니까요.", focus: "04_Jihu_Determined.png" },
        { speaker: "점장님", text: "알았네. 모바일 계약서라도 지금 작성하지. 자네 말대로, 무너지는 가게일수록 기본부터 지켜야겠군.", focus: "08_Owner_Worried.png", illustration: "35_CG_LaborContract_Signing.png" },
        { speaker: "지후", text: "첫날부터 불편한 말을 꺼냈지만, 이 가게에서 내 권리도 책임도 분명해졌다.", focus: "04_Jihu_Determined.png", illustration: "69_CG_MobileLaborContract.png" }
      ],
      effect: { legalStability: 25, storeTrust: 5, relationship: -10, flags: { contract_written: true } }
    },
    lawKey: "labor_17",
    nextScene: "limited_bread",
  },
  {
    id: "limited_bread",
    type: "choice",
    title: "[일상] 단골의 부탁, 줄 서 있던 마음",
    mainIllustration: "36_CG_LimitedBread_Discovery.png",
    background: "36_CG_LimitedBread_Discovery.png",
    characters: [
      { asset: "03_Jihu_Worried.png", side: "left", activeFor: ["지후", "지후 독백", "나 (지후)"] },
      { asset: "10_Sujin_Neutral.png", side: "right", activeFor: ["수진", "수진이"] },
    ],
    props: [{ asset: "45_Prop_LimitedBread.png", side: "center", closeup: true }],
    dialogue: [
      { speaker: "수진이", text: "오빠, 저기 매대 뒤에 들어온 한정판 빵 딱 하나 있죠? 어제부터 기다렸어요. 저 단골인 거 알잖아요. 오늘만 몰래 빼두면 안 돼요? 부탁 하나 들어주면 친구들한테 여기 좋다고 소문낼게요.", illustration: "36_CG_LimitedBread_Discovery.png" },
      { speaker: "나 (지후)", text: "(단골 손님의 사적인 부탁과 모두에게 공평하게 판매해야 하는 편의점 원칙 사이에서 고민이 시작된다. 수진이의 서운해할 표정과 본사 평가의 공정성, 어떤 선택을 해야 할까?)", illustration: "63_CG_Jihu_LimitedBread_Dilemma.png" },
    ],
    choices: [
      {
        id: "reserve_bread",
        label: "오늘만 특별히 뒤로 빼서 수진이에게 판매한다.",
        summary: "단골 수진을 위해 한정판 빵을 빼두었다.",
        result: [
          { speaker: "나레이션", text: "수진이는 활짝 웃으며 인증 사진을 올립니다. 하지만 잠시 뒤 같은 빵을 사려고 뛰어온 다른 손님이 빈 매대를 보고 실망합니다. 한 사람의 호의가 다른 사람에게는 불공정으로 보이기 시작합니다.", illustration: "36_CG_LimitedBread_Discovery.png" },
        ],
        effect: { relationship: 20, storeTrust: -5, legalStability: 0, flags: { fair_sale: false } },
      },
      {
        id: "fair_display",
        label: "한정판 상품은 선착순 진열 판매가 원칙이라고 설명한다.",
        summary: "한정 상품은 공정하게 진열 판매하기로 했다.",
        result: [
          { speaker: "수진이", text: "오빠 너무 원칙적인 거 아니에요?", focus: "12_Sujin_Sad.png", illustration: "63_CG_Jihu_LimitedBread_Dilemma.png" },
          { speaker: "지후", text: "나도 미안해. 대신 다음 입고 시간은 알려줄게. 그때는 네가 직접 와서 사.", focus: "04_Jihu_Determined.png", illustration: "36_CG_LimitedBread_Discovery.png" },
          { speaker: "나레이션", text: "수진이는 서운한 표정으로 물러납니다. 그래도 매대 앞에 있던 손님들이 조용히 고개를 끄덕입니다. 단골을 잃을 위험을 감수했지만, 가게의 규칙이 사람마다 달라지지 않는다는 신뢰를 남겼습니다.", illustration: "36_CG_LimitedBread_Discovery.png" },
        ],
        effect: { legalStability: 0, relationship: -5, storeTrust: 10, flags: { fair_sale: true } },
      },
    ],
    nextScene: "minor_contract",
  },
  {
    id: "minor_contract",
    type: "testimony",
    title: "[법률] 아이의 카드, 어른의 책임",
    mainIllustration: "39_CG_Child_NintendoPayment.png",
    background: "39_CG_Child_NintendoPayment.png",
    characters: [
      { asset: "03_Jihu_Worried.png", side: "left", activeFor: ["지후", "지후 독백"] },
      { asset: "17_Child_Happy.png", side: "right", activeFor: ["초등학생"] },
    ],
    props: [
      { asset: "48_Prop_NintendoBox.png", side: "center", closeup: true },
      { asset: "49_Prop_ParentCreditCard.png", side: "right", size: "small" },
    ],
    dialogue: [],
    testimony: [
      { text: "아저씨! 저기 진열된 25만 원짜리 게임기 주세요. 오늘 꼭 사야 해요.", speaker: "초등학생", illustration: "39_CG_Child_NintendoPayment.png" },
      { text: "이거 부모님 카드인데, 엄마 심부름으로 대신 사러 온 거라 그냥 긁어주시면 돼요.", speaker: "초등학생", isContradiction: true, correctLaw: "civil_5", illustration: "71_CG_Child_ParentCard_GameConsole.png" },
      { text: "진짜 허락받았어요. 근데 지금 전화하면 엄마 회의 중이라 혼나요. 빨리 해주세요.", speaker: "초등학생", illustration: "71_CG_Child_ParentCard_GameConsole.png" }
    ],
    success: {
      feedback: "아이는 눈치를 보다가 카드를 챙겨 나갑니다. 미성년자의 고가 거래는 법정대리인의 동의가 없으면 취소될 수 있으므로, 순간 매출보다 뒤늦은 환불 분쟁을 막는 판단이 필요했습니다.",
      law: 25, relation: -5, profit: 10,
      npcPose: "18_Child_Scared.png",
      playerPose: "04_Jihu_Determined.png",
      dialogue: [
        { speaker: "지후", text: "잠깐 기다려! 이의 있습니다!", focus: "04_Jihu_Determined.png", illustration: "71_CG_Child_ParentCard_GameConsole.png" },
        { speaker: "지후", text: "민법 제5조에 따르면 미성년자와 같은 제한능력자의 고가 거래 행위는 법정대리인의 동의가 필요하며, 동의 없는 거래는 부모가 언제든 취소할 수 있습니다!", focus: "04_Jihu_Determined.png", illustration: "71_CG_Child_ParentCard_GameConsole.png" },
        { speaker: "지후", text: "부모님의 직접 확인 없이 결제했다가 나중에 기기를 뜯어 오면 매장은 고스란히 중고 손실을 떠안아야 합니다. 부모님 통화가 필수입니다!", focus: "04_Jihu_Determined.png", illustration: "71_CG_Child_ParentCard_GameConsole.png" },
        { speaker: "초등학생", text: "엄마한테 전화요? 어... 그러면 오늘은 그냥 갈게요.", focus: "18_Child_Scared.png", illustration: "39_CG_Child_NintendoPayment.png" },
        { speaker: "지후", text: "아이가 나가자 매대 위 게임기가 다시 조용해졌다. 팔지 않은 물건 하나가 오히려 가게를 지킨 셈이다.", focus: "04_Jihu_Determined.png", illustration: "39_CG_Child_NintendoPayment.png" }
      ],
      effect: { legalStability: 25, storeTrust: 10, relationship: -5, flags: { minor_contract_risk: false } }
    },
    lawKey: "civil_5",
    nextScene: "id_photo",
  },
  {
    id: "id_photo",
    type: "testimony",
    title: "[법률] 사진 한 장의 위험 (청소년보호법)",
    mainIllustration: "37_CG_IDPhoto_Check.png",
    background: "37_CG_IDPhoto_Check.png",
    characters: [
      { asset: "04_Jihu_Determined.png", side: "left", activeFor: ["지후"] },
      { asset: "13_Youth_Sly.png", side: "right", activeFor: ["수상한 청소년", "청소년"] },
    ],
    props: [{ asset: "46_Prop_MobileIDPhoto.png", side: "center", closeup: true }],
    dialogue: [],
    testimony: [
      { text: "담배 한 갑 주세요. 신분증 실물은 집에 두고 왔는데요...", speaker: "수상한 청소년", illustration: "37_CG_IDPhoto_Check.png" },
      { text: "여기 폰에 찍어둔 주민등록증 사진 있어요. 얼굴 똑같죠? 이 정도면 확인된 거잖아요.", speaker: "수상한 청소년", isContradiction: true, correctLaw: "youth_28", illustration: "70_CG_Youth_ShowsPhoneID.png" },
      { text: "사장님들 다 이렇게 해주시던데요. 여기만 안 해주면 제가 리뷰에 그대로 씁니다?", speaker: "수상한 청소년", illustration: "70_CG_Youth_ShowsPhoneID.png" }
    ],
    success: {
      feedback: "청소년은 불만을 남기고 나가지만, 더 큰 위험을 막았습니다. 단순 사진은 위조와 도용 가능성이 있어 확실한 연령 확인 수단으로 보기 어렵고, 판매자는 그 책임을 피하기 어렵습니다.",
      law: 30, relation: -10, profit: -5,
      npcPose: "14_Youth_Worried.png",
      playerPose: "04_Jihu_Determined.png",
      dialogue: [
        { speaker: "지후", text: "잠깐! 이의 있습니다!", focus: "04_Jihu_Determined.png", illustration: "70_CG_Youth_ShowsPhoneID.png" },
        { speaker: "지후", text: "청소년보호법 제28조에 따르면 청소년유해매체물 판매 시 구매자의 연령을 실물 신분증 또는 행정앱 모바일 신분증으로 엄격히 확인해야 합니다!", focus: "04_Jihu_Determined.png", illustration: "70_CG_Youth_ShowsPhoneID.png" },
        { speaker: "지후", text: "단순히 스마트폰에 저장된 신분증 사진이나 이미지는 법적 효력이 있는 인증 수단이 될 수 없습니다!", focus: "04_Jihu_Determined.png", illustration: "70_CG_Youth_ShowsPhoneID.png" },
        { speaker: "수상한 청소년", text: "진짜 너무 깐깐하시네. 됐어요, 다른 데 갈게요.", focus: "14_Youth_Worried.png", illustration: "37_CG_IDPhoto_Check.png" },
        { speaker: "지후", text: "청소년이 궁얼거리며 나가자, 매대 뒤에서 긴장했던 손가락이 조금 풀렸다. 이 한 갑의 매출보다 가게의 존립이 더 무겁다.", focus: "04_Jihu_Determined.png", illustration: "37_CG_IDPhoto_Check.png" }
      ],
      effect: { legalStability: 30, storeTrust: -5, relationship: -10, flags: { id_check_failed: false } }
    },
    lawKey: "youth_28",
    nextScene: "disposal_food",
  },
  {
    id: "disposal_food",
    type: "choice",
    title: "[일상] 배고픔과 CCTV 사이",
    mainIllustration: "29_BG_Storage_Night.png",
    background: "29_BG_Storage_Night.png",
    characters: [
      { asset: "03_Jihu_Worried.png", side: "left", activeFor: ["지후", "지후 독백", "나 (지후)"] },
      { asset: "08_Owner_Worried.png", side: "right", activeFor: ["점장님"] },
    ],
    props: [{ asset: "47_Prop_DisposalFood.png", side: "center", closeup: true }],
    dialogue: [
      { speaker: "나 (지후)", text: "(점심시간은 한참 밀렸고 손은 덜덜 떨린다. 창고 선반 구석에 유통기한이 막 지난 만두와 삼각김밥이 보였다.)", illustration: "29_BG_Storage_Night.png" },
      { speaker: "나 (지후)", text: "(CCTV로 감시받는 느낌과 지갑의 텅 빈 잔고 사이에서 갈등한다. 먹어도 될까, 아니면 참아야 할까?)", illustration: "64_CG_CCTVView_BackroomTension.png" },
    ],
    choices: [
      {
        id: "eat_disposal",
        label: "폐기 등록만 띄워두고 창고에서 얼른 먹는다.",
        summary: "관행이라는 이유로 폐기 음식을 먹었다.",
        result: [
          { speaker: "나레이션", text: "배고픔은 사라졌지만 마음이 불편합니다. CCTV 화면을 확인한 점장님은 아무 말 없이 폐기 기록을 다시 열어봅니다. 작은 예외 하나가 오늘 쌓아온 신뢰를 흔듭니다.", illustration: "38_CG_DisposalFood_CCTV.png" },
        ],
        effect: { legalStability: -5, relationship: 5, storeTrust: 15, flags: { disposal_rule_broken: true } },
      },
      {
        id: "buy_food",
        label: "기한이 넉넉한 컵라면을 내 카드로 정직하게 계산해 당당하게 먹는다.",
        summary: "배고팠지만 직접 결제하고식사했다.",
        result: [
          { speaker: "나레이션", text: "잔고는 줄었지만, 계산 영수증을 주머니에 넣는 순간 마음이 편해집니다. 점장님은 CCTV를 보다가 짧게 웃습니다. 위기의 가게에서 믿음은 이런 작은 장면으로 쌓입니다.", illustration: "26_BG_ConvenienceCounter_Morning.png" },
        ],
        effect: { legalStability: 10, relationship: 10, storeTrust: -10, flags: { disposal_rule_broken: false } },
      },
    ],
    nextScene: "spilled_milk",
  },
  {
    id: "spilled_milk",
    type: "choice",
    title: "[일상] 매출 줄과 미끄러운 바닥",
    mainIllustration: "31_BG_StoreFloor_SpilledMilk.png",
    background: "31_BG_StoreFloor_SpilledMilk.png",
    characters: [
      { asset: "05_Jihu_Scared.png", side: "left", activeFor: ["지후", "지후 독백", "나 (지후)"] },
      { asset: "23_Elder_Worried.png", side: "right", activeFor: ["손님 1", "손님 2"] },
    ],
    props: [
      { asset: "51_Prop_SpilledMilk.png", side: "center", closeup: true },
      { asset: "50_Prop_WetFloorSign.png", side: "right", size: "small" },
    ],
    dialogue: [
      { speaker: "나 (지후)", text: "(아까 뛰어나간 아이들이 우유 코너 앞에서 초코우유를 엎지르고 사라졌다. 허옇게 퍼진 우유가 바닥을 흥건히 적시고 있다.)", illustration: "31_BG_StoreFloor_SpilledMilk.png" },
      { speaker: "나 (지후)", text: "(바닥은 미끄럽고, 그 와중에 계산대 앞의 대기 줄은 점점 길어진다. 본사 평가의 '대기 시간 단축'과 '안전 사고 방지' 중 무엇이 먼저일까?)", illustration: "65_CG_SpilledMilk_LongQueue.png" },
    ],
    choices: [
      {
        id: "clean_first",
        label: "바로 물기를 닦고 미끄럼 주의 표지판을 세운다.",
        summary: "대기 줄보다 바닥 안전 조치를 먼저 했다.",
        result: [
          { speaker: "나레이션", text: "대기 줄에서 작은 불평이 나오지만, 바닥을 닦고 표지판을 세우자 어르신들이 조심히 지나갑니다. 매출은 잠깐 느려졌지만, 사고가 나지 않는 평온함의 가치가 드러납니다.", illustration: "40_CG_SpilledMilk_WarningSign.png" },
        ],
        effect: { legalStability: 10, relationship: 10, storeTrust: -5, flags: { spill_cleaned: true } },
      },
      {
        id: "cashier_first",
        label: "계산 대기 줄을 먼저 처리하고 바닥은 잠시 뒤 치운다.",
        summary: "줄을 먼저 줄이고 바닥 처리를 미뤘다.",
        result: [
          { speaker: "나레이션", text: "계산 줄은 빨리 줄어듭니다. 하지만 바닥 한가운데 남은 초코우유는 조용히 다음 문제를 기다립니다. 숫자로 보이는 매출을 지키느라 보이지 않는 위험을 키웠습니다.", illustration: "65_CG_SpilledMilk_LongQueue.png" },
        ],
        effect: { legalStability: -15, relationship: -5, storeTrust: 15, flags: { spill_cleaned: false } },
      },
    ],
    nextScene: "fall_accident",
  },
  {
    id: "fall_accident",
    type: "testimony",
    title: "[법률] 넘어짐 뒤에 남은 책임",
    mainIllustration: "41_CG_OfficeWorker_SlipFall.png",
    background: "41_CG_OfficeWorker_SlipFall.png",
    characters: [
      { asset: "04_Jihu_Determined.png", side: "left", activeFor: ["지후", "지후 독백"] },
      { asset: "20_OfficeWorker_Angry.png", side: "right", activeFor: ["다친 회사원", "회사원"] },
    ],
    dialogue: [],
    testimony: [
      { text: "아이고 허리야! 편의점 바닥에 초코우유가 있었는데 왜 그대로 둔 겁니까?", speaker: "다친 회사원", illustration: "41_CG_OfficeWorker_SlipFall.png" },
      { text: "가게 잘못이니까 치료비랑 양복값 100만 원 전액을 지금 현금으로 보내세요. 보험 말고 바로요.", speaker: "다친 회사원", isContradiction: true, correctLaw: "civil_750", illustration: "41_CG_OfficeWorker_SlipFall.png" },
      { text: "안 그럴 거면 리뷰, 신고, 소송까지 전부 갑니다. 본사 평가 중이라면서요?", speaker: "다친 회사원", illustration: "41_CG_OfficeWorker_SlipFall.png" }
    ],
    success: {
      feedback: "손님은 여전히 화가 나 있지만, 현장에서 즉시 전액 현금 보상하라는 요구는 조정되었습니다. 민법 제750조의 손해배상 책임은 사고 경위와 피해자의 주의 정도를 함께 보아야 하며, 공식 보험 절차가 필요합니다.",
      law: 20, relation: -10, profit: 15,
      npcPose: "20_OfficeWorker_Angry.png",
      playerPose: "04_Jihu_Determined.png",
      dialogue: [
        { speaker: "지후", text: "손님, 진정하십시오! 이의 있습니다!", focus: "04_Jihu_Determined.png", illustration: "41_CG_OfficeWorker_SlipFall.png" },
        { speaker: "지후", text: "민법 제750조 및 불법행위 책임에 따르면 피해자의 과실도 손해배상 범위에 참작하는 과실상계 원칙이 적용됩니다!", focus: "04_Jihu_Determined.png", illustration: "41_CG_OfficeWorker_SlipFall.png" },
        { speaker: "지후", text: "바닥을 잘 살피지 않은 손님의 주의 의무 위반도 공동 과실로 산정되므로, 현장에서 100% 무조건 전액을 보상하라는 요구는 법리적으로 타당하지 않습니다. 공식 보험 절차를 거치겠습니다!", focus: "04_Jihu_Determined.png", illustration: "41_CG_OfficeWorker_SlipFall.png" },
        { speaker: "다친 회사원", text: "보험 접수라... 바로 돈을 주진 않겠다는 거군요.", focus: "20_OfficeWorker_Angry.png", illustration: "66_CG_OfficeWorker_InsuranceProcessing.png" },
        { speaker: "지후", text: "책임을 피하겠다는 뜻이 아닙니다. 책임을 정확히 정하자는 뜻입니다. 사고 기록과 CCTV를 남기고 절차대로 처리하겠습니다.", focus: "04_Jihu_Determined.png", illustration: "66_CG_OfficeWorker_InsuranceProcessing.png" },
        { speaker: "다친 회사원", text: "좋습니다. 접수번호 주세요. 대신 대충 넘기면 그때는 진짜 문제 삼겠습니다.", focus: "19_OfficeWorker_Neutral.png", illustration: "66_CG_OfficeWorker_InsuranceProcessing.png" },
        { speaker: "지후", text: "가게의 잘못을 인정할 부분과 부당한 요구를 거절할 부분을 나눠야 한다. 법은 싸우기 위한 말이 아니라, 더 크게 무너지지 않기 위한 선이었다.", focus: "04_Jihu_Determined.png", illustration: "66_CG_OfficeWorker_InsuranceProcessing.png" }
      ],
      effect: { legalStability: 20, storeTrust: 15, relationship: -10, flags: { fall_accident: true, insurance_procedure: true } }
    },
    lawKey: "civil_750",
    nextScene: "rainy_cat",
  },
  {
    id: "rainy_cat",
    type: "choice",
    title: "[일상] 비 오는 밤의 작은 생명",
    mainIllustration: "42_CG_RainyKitten_UnderTable.png",
    background: "42_CG_RainyKitten_UnderTable.png",
    characters: [
      { asset: "03_Jihu_Worried.png", side: "left", activeFor: ["지후", "지후 독백", "나 (지후)"] },
      { asset: "25_Cat_Scared.png", side: "right", activeFor: ["치즈 고양이", "고양이"] },
    ],
    dialogue: [
      { speaker: "치즈 고양이", text: "야옹... (빗줄기가 점점 거세지는 깊은 밤, 매장 앞 야외 테이블 밑에서 젖은 새끼 고양이 한 마리가 오들오들 떨고 있다.)", illustration: "42_CG_RainyKitten_UnderTable.png" },
      { speaker: "나 (지후)", text: "(매대 구석에 포장이 뜯겨 폐기 예정인 소시지가 있다. 위생 규정 준수와 생명에 대한 연민 사이에서 고민이 시작된다.)", illustration: "67_CG_RainyNight_CatUnderTable.png" }
    ],
    choices: [
      {
        id: "feed_cat",
        label: "폐기 예정 소시지를 잘라 물과 함께 야외 테이블 밑에 놓아준다.",
        summary: "폐기 예정 음식을 고양이에게 주었다.",
        result: [
          { speaker: "나레이션", text: "지나가던 주민들은 따뜻하다며 사진을 찍습니다. 하지만 먹이를 둔 자리에 다른 동물들이 모이고, 다음 날 테이블 주변 민원이 들어옵니다. 선의가 관리되지 않으면 또 다른 책임이 됩니다.", illustration: "67_CG_RainyNight_CatUnderTable.png" },
        ],
        effect: { relationship: 25, storeTrust: -5, legalStability: -5, flags: { cat_care_balanced: false } },
      },
      {
        id: "guide_cat",
        label: "먹이를 주지 않고, 우산으로 비를 막아 근처 골목의 안전한 지붕 아래로 유도한다.",
        summary: "매장 위생을 지키면서 고양이를 영업 공간 밖 안전한 곳으로 유도했다.",
        result: [
          { speaker: "나레이션", text: "마음은 무겁지만 매장 안팎의 위생 기준을 지켰습니다. 단순히 쫓아낸 것이 아니라 위험한 영업 공간 밖으로 이동시켜, 연민과 책임 사이의 최소한의 균형을 찾았습니다.", illustration: "32_BG_OutdoorTable_RainyNight.png" },
        ],
        effect: { legalStability: 10, relationship: -5, storeTrust: 15, flags: { cat_care_balanced: true } },
      },
    ],
    nextScene: "payday",
  },
  {
    id: "payday",
    type: "testimony",
    title: "[클라이맥스] 월급날의 마지막 선 (근로기준법)",
    mainIllustration: "43_CG_Payday_DeductionNotice.png",
    background: "43_CG_Payday_DeductionNotice.png",
    characters: [
      { asset: "03_Jihu_Worried.png", side: "left", activeFor: ["지후", "지후 독백"] },
      { asset: "08_Owner_Worried.png", side: "right", activeFor: ["점장님"] },
    ],
    props: [
      { asset: "52_Prop_PayStatement.png", side: "center", closeup: true },
      { asset: "53_Prop_BankingApp_Deduction.png", side: "right", size: "small" },
    ],
    dialogue: [],
    testimony: [
      { text: "지후 군, 이번 한 달 정말 버거웠지. 그래도 본사 평가표가 예전보다는 나아졌네. 여기 월급 보낸 내역 확인해보게.", speaker: "점장님", illustration: "43_CG_Payday_DeductionNotice.png" },
      { text: "아, 저번 낙상 사고 처리비 10만 원은 월급에서 미리 뺐네. 자네도 그날 근무자였으니 서로 책임을 나누는 걸로 하세.", speaker: "점장님", isContradiction: true, correctLaw: "labor_43", illustration: "43_CG_Payday_DeductionNotice.png" },
      { text: "우리 둘 다 이 가게 살리려고 고생했잖아. 법으로만 따지면 너무 차갑지 않나?", speaker: "점장님", illustration: "43_CG_Payday_DeductionNotice.png" }
    ],
    success: {
      feedback: "점장님은 잠시 침묵하다가 공제한 금액을 다시 보냅니다. 근로기준법 제43조에 따라 임금은 전액 지급되어야 하며, 손해배상 문제는 별도 절차로 다루어야 합니다.",
      law: 30, relation: -10, profit: 30,
      npcPose: "08_Owner_Worried.png",
      playerPose: "04_Jihu_Determined.png",
      dialogue: [
        { speaker: "지후", text: "점장님! 이의 있습니다!", focus: "04_Jihu_Determined.png", illustration: "43_CG_Payday_DeductionNotice.png" },
        { speaker: "지후", text: "근로기준법 제43조 임금 지급 원칙에 따르면 임금은 직접 근로자에게 그 전액을 지급해야 합니다!", focus: "04_Jihu_Determined.png", illustration: "43_CG_Payday_DeductionNotice.png" },
        { speaker: "지후", text: "고용주가 손해배상 청구권 등을 이유로 근로자의 동의 없이 임금을 일방적으로 삭감하고 이체하는 행위는 엄격히 금지됩니다! 별도로 청구하셔야 합니다!", focus: "04_Jihu_Determined.png", illustration: "43_CG_Payday_DeductionNotice.png" },
        { speaker: "점장님", text: "자네 말은 늘 맞는데, 가끔은 참 아프게 맞는군.", focus: "08_Owner_Worried.png", illustration: "68_CG_Payday_CounterConfrontation.png" },
        { speaker: "지후", text: "저도 압니다. 하지만 제 월급을 지키는 일이 점장님을 공격하는 일은 아니라고 생각합니다.", focus: "04_Jihu_Determined.png", illustration: "68_CG_Payday_CounterConfrontation.png" },
        { speaker: "점장님", text: "그래. 내가 선을 넘었네. 방금 10만 원 다시 보냈네. 가게가 힘들다고 사람의 몫까지 흐리면 안 되지.", focus: "07_Owner_Happy.png", illustration: "68_CG_Payday_CounterConfrontation.png" },
        { speaker: "지후", text: "오늘 내가 지킨 것은 돈만이 아니었다. 앞으로 이 가게에서 서로를 대하는 기준이었다.", focus: "04_Jihu_Determined.png", illustration: "72_CG_HappyEnding_GroupShot.png" }
      ],
      effect: { legalStability: 30, storeTrust: 30, relationship: -10, flags: { wage_deduction_accepted: false } }
    },
    lawKey: "labor_43",
    nextScene: "ending",
  },
];

export const sceneById = Object.fromEntries(scenes.map((scene) => [scene.id, scene])) as Record<string, Scene>;
