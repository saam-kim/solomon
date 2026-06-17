import type { Scene } from "../types";
import { lawPoints } from "./lawPoints";

const law = (id: string) => lawPoints.find((point) => point.id === id);

export const scenes: Scene[] = [
  {
    id: "intro",
    title: "인트로 - 무거운 자동문",
    mainIllustration: "61_BG_StoreExterior_ClosingCrisis.png",
    background: "33_BG_ConvenienceStore_ExteriorNight.png",
    dialogue: [
      { speaker: "나레이션", text: "비가 그친 새벽, 편의점 간판은 아직 켜져 있었다.", dim: true },
      { speaker: "나레이션", text: "자동문 옆에는 본사 평가 안내문이 붙어 있었다." },
      { speaker: "안내문", text: "이번 달 개선 없을 시 계약 재검토", tone: "strong" },
      { speaker: "지후", text: "오늘부터 여기서 일한다.", focus: "01_Jihu_Neutral.png" },
      { speaker: "지후", text: "그냥 알바라고 생각했는데... 생각보다 무거운 문을 여는 것 같다.", focus: "03_Jihu_Worried.png" },
      { speaker: "나레이션", text: "이곳에서 지후는 배우게 된다." },
      { speaker: "나레이션", text: "법은 시험지 속 문장이 아니라, 사람과 사람이 부딪히는 순간에 필요한 선이라는 것을." },
    ],
    nextScene: "first_shift",
  },
  {
    id: "first_shift",
    title: "첫 출근 - 폐점 위기의 가게",
    mainIllustration: "62_CG_Owner_TiredWithEvaluationSheet.png",
    background: "34_CG_FirstShift_Greeting.png",
    characters: [
      { asset: "01_Jihu_Neutral.png", side: "left", activeFor: ["지후"] },
      { asset: "08_Owner_Worried.png", side: "right", activeFor: ["점장님"] },
    ],
    dialogue: [
      { speaker: "점장님", text: "지후 학생 맞죠? 오늘부터 오전 근무를 맡게 됐다고 들었어요." },
      { speaker: "지후", text: "네. 처음이라 부족하겠지만 열심히 하겠습니다." },
      { speaker: "점장님", text: "솔직히 말할게요. 우리 가게, 이번 달 본사 평가가 마지막 기회예요." },
      { speaker: "점장님", text: "민원, 사고, 매출 손실. 뭐 하나 더 터지면 정말 어렵네." },
      { speaker: "지후", text: "생각보다 상황이 안 좋네요.", focus: "03_Jihu_Worried.png" },
      { speaker: "점장님", text: "편의점 일은 단순해 보여도, 결국 사람과 규칙 사이에서 계속 판단하는 일이에요." },
    ],
    choices: [
      {
        id: "warm_start",
        label: "제가 분위기를 한번 살려보겠습니다.",
        summary: "밝은 태도로 가게 분위기를 살리겠다고 했다.",
        result: [
          { speaker: "나레이션", text: "점장님의 굳은 얼굴이 조금 풀린다. 폐점 위기 앞에서도 물러서지 않는 태도가 가게에 작은 활기를 준다." },
        ],
        effect: { relationship: 2, storeTrust: 1, jihuStress: 1 },
      },
      {
        id: "learn_rules",
        label: "먼저 규칙부터 정확히 배우겠습니다.",
        summary: "실수로 가게에 부담을 주지 않기 위해 규칙부터 배우겠다고 했다.",
        result: [
          { speaker: "나레이션", text: "점장님은 말없이 고개를 끄덕인다. 위기 상황에서 믿을 수 있는 사람이라는 첫인상을 남긴다." },
        ],
        effect: { legalStability: 1, storeTrust: 2 },
      },
    ],
    nextScene: "contract",
  },
  {
    id: "contract",
    title: "근로계약서 - 믿음과 약속 사이",
    mainIllustration: "69_CG_MobileLaborContract.png",
    background: "35_CG_LaborContract_Signing.png",
    characters: [
      { asset: "03_Jihu_Worried.png", side: "left", activeFor: ["지후", "지후 독백"] },
      { asset: "08_Owner_Worried.png", side: "right", activeFor: ["점장님"] },
    ],
    props: [{ asset: "44_Prop_LaborContract.png", side: "center", size: "medium", closeup: true }],
    dialogue: [
      { speaker: "점장님", text: "근로계약서 말인데... 본사 평가 끝나고 쓰면 어떻겠나?" },
      { speaker: "지후", text: "나중에요?" },
      { speaker: "점장님", text: "나도 자네를 믿고, 자네도 나를 믿으면 되는 거 아닌가? 우리 지금 서로 급하잖아." },
      { speaker: "지후 독백", text: "괜히 첫날부터 예민한 사람처럼 보이면 어쩌지?", dim: true },
    ],
    choices: [
      {
        id: "delay_contract",
        label: "알겠습니다. 그럼 나중에 작성하겠습니다.",
        summary: "근로계약서 작성을 뒤로 미뤘다.",
        result: [
          { speaker: "나레이션", text: "첫날 분위기는 부드럽게 넘어갔다. 하지만 지후의 마음 한쪽에는 작은 불안이 남는다." },
        ],
        effect: { relationship: 1, legalStability: -3, jihuStress: 2, flags: { contract_written: false } },
      },
      {
        id: "write_contract",
        label: "서로 믿기 때문에 더 적어두는 게 맞지 않을까요?",
        summary: "임금과 근로시간을 계약서로 남기자고 설득했다.",
        result: [
          { speaker: "지후", text: "혹시 문제가 생기면 저도 점장님도 곤란해질 것 같습니다.", focus: "04_Jihu_Determined.png" },
          { speaker: "점장님", text: "처음부터 불편한 말을 하는군." },
          { speaker: "지후", text: "네. 저도 불편합니다. 그래도 처음이라서 해야 하는 말이라고 생각합니다." },
          { speaker: "점장님", text: "...알겠네. 모바일 계약서로 지금 작성하지." },
        ],
        effect: { legalStability: 3, storeTrust: 2, relationship: -1, flags: { contract_written: true } },
      },
    ],
    lawPoint: law("labor_contract"),
    nextScene: "limited_bread",
  },
  {
    id: "limited_bread",
    title: "한정판 빵 - 호의와 공정성",
    mainIllustration: "63_CG_Jihu_LimitedBread_Dilemma.png",
    background: "36_CG_LimitedBread_Discovery.png",
    characters: [
      { asset: "03_Jihu_Worried.png", side: "left", activeFor: ["지후", "지후 독백"] },
      { asset: "10_Sujin_Neutral.png", side: "right", activeFor: ["수진"] },
    ],
    props: [{ asset: "45_Prop_LimitedBread.png", side: "center", size: "small", closeup: true }],
    dialogue: [
      { speaker: "수진", text: "지후 오빠, 저 빵 하나 들어온 거 맞죠?" },
      { speaker: "지후", text: "응. 오늘 하나 들어왔어." },
      { speaker: "수진", text: "엄마가 병원 다녀오면서 이 빵 먹고 싶다고 했거든요. 오늘만 몰래 빼두면 안 돼요?" },
      { speaker: "뒤쪽 손님", text: "저도 그 빵 사려고 왔는데요. 애가 아침부터 부탁해서요." },
      { speaker: "지후 독백", text: "둘 다 이해된다. 한 사람을 도와주면 다른 사람은 억울해진다.", dim: true },
    ],
    choices: [
      {
        id: "reserve_bread",
        label: "수진아, 오늘만 특별히 빼둘게.",
        summary: "단골 수진을 위해 한정판 빵을 빼두었다.",
        result: [
          { speaker: "나레이션", text: "수진이는 활짝 웃지만 뒤쪽 손님은 빈 매대를 바라보다 조용히 나간다." },
          { speaker: "나레이션", text: "한 사람에게는 호의였지만, 다른 사람에게는 불공정이었다." },
        ],
        effect: { relationship: 2, storeTrust: -2, legalStability: -1, flags: { fair_sale: false } },
      },
      {
        id: "fair_display",
        label: "먼저 온 사람이 살 수 있게 진열 판매할게.",
        summary: "한정 상품은 공정하게 진열 판매하기로 했다.",
        result: [
          { speaker: "수진", text: "오빠 너무 원칙적인 거 아니에요?", focus: "12_Sujin_Sad.png" },
          { speaker: "지후", text: "나도 미안해. 대신 다음 입고 시간은 알려줄게. 그때는 네가 직접 와서 사." },
          { speaker: "나레이션", text: "규칙이 사람마다 달라지지 않는다는 신뢰가 남는다." },
        ],
        effect: { legalStability: 1, storeTrust: 2, relationship: -1, flags: { fair_sale: true } },
      },
    ],
    nextScene: "minor_contract",
  },
  {
    id: "minor_contract",
    title: "부모 카드와 게임기 - 미성년자의 계약",
    mainIllustration: "71_CG_Child_ParentCard_GameConsole.png",
    background: "39_CG_Child_NintendoPayment.png",
    characters: [
      { asset: "03_Jihu_Worried.png", side: "left", activeFor: ["지후", "지후 독백"] },
      { asset: "17_Child_Happy.png", side: "right", activeFor: ["초등학생"] },
    ],
    props: [
      { asset: "48_Prop_NintendoBox.png", side: "center", size: "medium", closeup: true },
      { asset: "49_Prop_ParentCreditCard.png", side: "right", size: "small" },
    ],
    dialogue: [
      { speaker: "초등학생", text: "저기요! 저 게임기 주세요. 오늘 꼭 사야 해요." },
      { speaker: "지후", text: "이거 꽤 비싼데? 부모님이 허락하셨어?" },
      { speaker: "초등학생", text: "네. 이거 부모님 카드예요. 엄마 심부름으로 온 거라 그냥 결제하면 돼요." },
      { speaker: "지후 독백", text: "팔면 매출은 오른다. 근데 정말 허락받은 걸까?", dim: true },
    ],
    choices: [
      {
        id: "sell_console",
        label: "부모님 카드이고 심부름이라면 결제해도 되겠지.",
        summary: "부모 동의를 직접 확인하지 않고 고가 게임기를 판매했다.",
        result: [
          { speaker: "나레이션", text: "게임기는 판매되었다. 매출은 올랐지만 지후는 영수증을 보며 찜찜함을 느낀다." },
        ],
        effect: { storeTrust: -2, legalStability: -3, jihuStress: 2, flags: { minor_contract_risk: true } },
      },
      {
        id: "confirm_guardian",
        label: "부모님 확인 없이 이 금액은 결제하기 어려워.",
        summary: "부모 확인 전에는 고가 거래를 거절했다.",
        result: [
          { speaker: "초등학생", text: "아... 그럼 오늘은 그냥 갈게요.", focus: "18_Child_Scared.png" },
          { speaker: "나레이션", text: "매출 기회는 사라졌다. 하지만 지후는 나중에 취소될 수 있는 거래를 막았다." },
        ],
        effect: { legalStability: 3, storeTrust: 1, relationship: -1, flags: { minor_contract_risk: false } },
      },
    ],
    lawPoint: law("minor_contract"),
    nextScene: "id_photo",
  },
  {
    id: "id_photo",
    title: "신분증 사진 - 매출과 책임",
    mainIllustration: "70_CG_Youth_ShowsPhoneID.png",
    background: "37_CG_IDPhoto_Check.png",
    characters: [
      { asset: "04_Jihu_Determined.png", side: "left", activeFor: ["지후"] },
      { asset: "13_Youth_Sly.png", side: "right", activeFor: ["청소년"] },
    ],
    props: [{ asset: "46_Prop_MobileIDPhoto.png", side: "center", size: "medium", closeup: true }],
    dialogue: [
      { speaker: "청소년", text: "담배 한 갑 주세요." },
      { speaker: "지후", text: "신분증 확인하겠습니다." },
      { speaker: "청소년", text: "실물은 집에 두고 왔는데요. 여기 폰에 찍어둔 주민등록증 사진 있어요." },
      { speaker: "청소년", text: "사장님들 다 이렇게 해주시던데요. 여기만 안 해주면 리뷰에 그대로 씁니다?" },
      { speaker: "지후 독백", text: "이 한 갑 때문에 가게가 문을 닫을 수도 있다.", dim: true },
    ],
    choices: [
      {
        id: "accept_photo_id",
        label: "사진과 얼굴이 같아 보이니 이번엔 판매한다.",
        summary: "신분증 사진만 보고 담배를 판매했다.",
        result: [
          { speaker: "나레이션", text: "청소년은 담배를 받아 빠르게 나간다. 매출은 올랐지만 지후의 손끝은 차가워진다." },
        ],
        effect: { legalStability: -4, storeTrust: -3, jihuStress: 3, flags: { id_check_failed: true } },
      },
      {
        id: "require_real_id",
        label: "사진으로는 판매할 수 없습니다.",
        summary: "실물 신분증 또는 인정되는 모바일 신분증을 요구했다.",
        result: [
          { speaker: "청소년", text: "진짜 너무 깐깐하시네. 됐어요, 다른 데 갈게요.", focus: "14_Youth_Worried.png" },
          { speaker: "지후", text: "매출 하나는 놓쳤다. 하지만 이 한 갑 때문에 가게 문을 닫을 수는 없다." },
        ],
        effect: { legalStability: 4, storeTrust: 2, relationship: -1, flags: { id_check_failed: false } },
      },
    ],
    lawPoint: law("id_check"),
    nextScene: "disposal_food",
  },
  {
    id: "disposal_food",
    title: "폐기 음식과 CCTV - 관행의 유혹",
    mainIllustration: "64_CG_CCTVView_BackroomTension.png",
    background: "29_BG_Storage_Night.png",
    characters: [
      { asset: "03_Jihu_Worried.png", side: "left", activeFor: ["지후", "지후 독백"] },
      { asset: "08_Owner_Worried.png", side: "right", activeFor: ["점장님"] },
    ],
    props: [{ asset: "47_Prop_DisposalFood.png", side: "center", size: "medium", closeup: true }],
    dialogue: [
      { speaker: "지후", text: "점심시간은 밀렸고 손은 떨린다." },
      { speaker: "점장님", text: "그거? 예전 알바들은 그냥 먹기도 했어. 규정상으론 안 되지만 어차피 버릴 거니까." },
      { speaker: "지후 독백", text: "다들 한다고 괜찮은 걸까? 하지만 CCTV는 조용히 모든 장면을 보고 있다.", dim: true },
    ],
    choices: [
      {
        id: "eat_disposal",
        label: "점장님도 괜찮다 했으니 폐기 등록 후 먹는다.",
        summary: "관행이라는 이유로 폐기 음식을 먹었다.",
        result: [
          { speaker: "나레이션", text: "배고픔은 사라졌지만 마음이 불편하다. 작은 예외 하나가 오늘 쌓아온 신뢰를 흔든다." },
        ],
        effect: { legalStability: -2, storeTrust: -3, jihuStress: 1, flags: { disposal_rule_broken: true } },
      },
      {
        id: "buy_food",
        label: "기한이 넉넉한 컵라면을 내 카드로 계산해 먹는다.",
        summary: "배고팠지만 직접 결제하고 식사했다.",
        result: [
          { speaker: "지후", text: "제 월급에서 나갔습니다. 조금 아프네요." },
          { speaker: "점장님", text: "그런 아픔은 오래 가게를 살린다네." },
        ],
        effect: { legalStability: 2, storeTrust: 3, jihuStress: 1, flags: { disposal_rule_broken: false } },
      },
    ],
    lawPoint: law("disposal_food"),
    nextScene: "spilled_milk",
  },
  {
    id: "spilled_milk",
    title: "쏟아진 우유 - 보이는 매출, 보이지 않는 위험",
    mainIllustration: "65_CG_SpilledMilk_LongQueue.png",
    background: "31_BG_StoreFloor_SpilledMilk.png",
    characters: [
      { asset: "05_Jihu_Scared.png", side: "left", activeFor: ["지후", "지후 독백"] },
      { asset: "23_Elder_Worried.png", side: "right", activeFor: ["손님 1", "손님 2"] },
    ],
    props: [
      { asset: "51_Prop_SpilledMilk.png", side: "center", size: "medium", closeup: true },
      { asset: "50_Prop_WetFloorSign.png", side: "right", size: "small" },
    ],
    dialogue: [
      { speaker: "지후", text: "아이들이 우유 코너 앞에서 초코우유를 엎지르고 사라졌다." },
      { speaker: "손님 1", text: "학생, 계산 좀 빨리 해줘요." },
      { speaker: "손님 2", text: "바닥에 뭐 흘린 것 같은데요?" },
      { speaker: "지후 독백", text: "본사 평가표에는 대기 시간도 있고, 안전 사고도 있다. 지금 무엇을 먼저 해야 하지?", dim: true },
    ],
    choices: [
      {
        id: "clean_first",
        label: "먼저 바닥을 닦고 미끄럼 주의 표지판을 세우겠습니다.",
        summary: "대기 줄보다 바닥 안전 조치를 먼저 했다.",
        result: [
          { speaker: "나레이션", text: "대기 줄에서 작은 불평이 나온다. 하지만 바닥을 닦고 표지판을 세우자 어르신들이 조심히 지나간다." },
        ],
        effect: { legalStability: 2, storeTrust: 2, relationship: -1, flags: { spill_cleaned: true } },
      },
      {
        id: "cashier_first",
        label: "계산부터 빨리 처리하자.",
        summary: "줄을 먼저 줄이고 바닥 처리를 미뤘다.",
        result: [
          { speaker: "나레이션", text: "계산 줄은 빠르게 줄어든다. 하지만 바닥 한가운데 남은 초코우유는 조용히 다음 문제를 기다린다." },
        ],
        effect: { relationship: 1, storeTrust: -1, legalStability: -2, flags: { spill_cleaned: false } },
      },
    ],
    nextScene: "fall_accident",
  },
  {
    id: "fall_accident",
    title: "낙상 사고와 보험 - 책임을 정확히 정하는 법",
    mainIllustration: "66_CG_OfficeWorker_InsuranceProcessing.png",
    background: "41_CG_OfficeWorker_SlipFall.png",
    characters: [
      { asset: "04_Jihu_Determined.png", side: "left", activeFor: ["지후"] },
      { asset: "20_OfficeWorker_Angry.png", side: "right", activeFor: ["회사원"] },
    ],
    dialogue: [
      { speaker: "회사원", text: "아이고, 놀랐네. 표지판이 있어서 그나마 피했습니다.", when: { spill_cleaned: true } },
      { speaker: "지후", text: "괜찮으세요?", when: { spill_cleaned: true } },
      { speaker: "회사원", text: "괜찮습니다. 바닥 바로 치운 건 잘했네요.", when: { spill_cleaned: true } },
      { speaker: "나레이션", text: "사고는 일어나지 않았다. 보이지 않는 위험을 먼저 본 선택이 가게를 지켰다.", when: { spill_cleaned: true } },
      { speaker: "회사원", text: "아이고 허리야! 편의점 바닥에 초코우유가 있었는데 왜 그대로 둔 겁니까?", when: { spill_cleaned: false } },
      { speaker: "회사원", text: "가게 잘못이니까 치료비랑 양복값 100만 원 전액을 지금 현금으로 보내세요.", when: { spill_cleaned: false } },
      { speaker: "지후 독백", text: "아까 그 우유다. 잠깐 미뤘던 일이 지금 돌아왔다.", dim: true, when: { spill_cleaned: false } },
    ],
    choices: [
      {
        id: "cash_compensation",
        label: "바로 현금으로 보상하겠습니다.",
        summary: "사고 범위를 확인하지 않고 즉시 현금 보상을 약속했다.",
        when: { spill_cleaned: false },
        result: [
          { speaker: "나레이션", text: "당장의 갈등은 줄어든다. 하지만 사고 원인, 손해 범위, 책임 비율은 확인되지 않았다." },
        ],
        effect: { legalStability: -2, storeTrust: -2, jihuStress: 2, flags: { fall_accident: true, insurance_procedure: false } },
      },
      {
        id: "insurance_process",
        label: "CCTV와 사고 기록을 남기고 공식 보험 절차로 처리하겠습니다.",
        summary: "책임 회피가 아니라 공식 절차로 손해 범위를 확인하자고 했다.",
        when: { spill_cleaned: false },
        result: [
          { speaker: "지후", text: "아닙니다. 책임을 정확히 정하자는 뜻입니다.", focus: "04_Jihu_Determined.png" },
          { speaker: "회사원", text: "...좋습니다. 접수번호 주세요. 대신 대충 넘기면 문제 삼겠습니다." },
          { speaker: "나레이션", text: "법은 싸우기 위한 말이 아니라, 더 크게 무너지지 않기 위한 절차였다." },
        ],
        effect: { legalStability: 3, storeTrust: 1, jihuStress: 1, flags: { fall_accident: true, insurance_procedure: true } },
      },
    ],
    lawPoint: law("damage_compensation"),
    nextScene: "rainy_cat",
  },
  {
    id: "rainy_cat",
    title: "비 오는 밤의 고양이 - 법이 답을 다 주지는 않는다",
    mainIllustration: "67_CG_RainyNight_CatUnderTable.png",
    background: "32_BG_OutdoorTable_RainyNight.png",
    characters: [
      { asset: "03_Jihu_Worried.png", side: "left", activeFor: ["지후", "지후 독백"] },
      { asset: "25_Cat_Scared.png", side: "right", activeFor: ["고양이"] },
    ],
    dialogue: [
      { speaker: "고양이", text: "야옹..." },
      { speaker: "지후", text: "비가 굵어지는 밤, 야외 테이블 밑에서 작은 고양이가 떨고 있다." },
      { speaker: "지후 독백", text: "연민은 좋은 마음이다. 하지만 좋은 마음이 항상 책임 있는 행동은 아닐 수도 있다.", dim: true },
    ],
    choices: [
      {
        id: "feed_cat",
        label: "폐기 예정 소시지와 물을 야외 테이블 밑에 놓아준다.",
        summary: "폐기 예정 음식을 고양이에게 주었다.",
        result: [
          { speaker: "나레이션", text: "주민들은 따뜻하다며 사진을 찍는다. 하지만 다음 날 테이블 주변 위생 민원이 들어온다." },
        ],
        effect: { relationship: 2, storeTrust: -2, legalStability: -1, flags: { cat_care_balanced: false } },
      },
      {
        id: "guide_cat",
        label: "먹이는 주지 않고 안전한 지붕 아래로 유도한다.",
        summary: "매장 위생을 지키면서 고양이를 영업 공간 밖 안전한 곳으로 유도했다.",
        result: [
          { speaker: "지후", text: "미안해. 대신 비는 피하게 해줄게." },
          { speaker: "나레이션", text: "법이 모든 답을 주지는 않는다. 그래서 사람은 더 조심스럽게 선택해야 한다." },
        ],
        effect: { legalStability: 1, storeTrust: 2, relationship: 1, flags: { cat_care_balanced: true } },
      },
    ],
    nextScene: "payday",
  },
  {
    id: "payday",
    title: "월급날 - 마지막 선",
    mainIllustration: "68_CG_Payday_CounterConfrontation.png",
    background: "43_CG_Payday_DeductionNotice.png",
    characters: [
      { asset: "03_Jihu_Worried.png", side: "left", activeFor: ["지후", "지후 독백"] },
      { asset: "08_Owner_Worried.png", side: "right", activeFor: ["점장님"] },
    ],
    props: [
      { asset: "52_Prop_PayStatement.png", side: "center", size: "medium", closeup: true },
      { asset: "53_Prop_BankingApp_Deduction.png", side: "right", size: "small" },
    ],
    dialogue: [
      { speaker: "점장님", text: "지후 군, 이번 한 달 정말 버거웠지." },
      { speaker: "지후", text: "네. 처음엔 그냥 계산만 하면 되는 일인 줄 알았습니다." },
      { speaker: "점장님", text: "그래도 본사 평가표가 예전보다는 나아졌네. 여기 월급 보낸 내역 확인해보게." },
      { speaker: "지후", text: "...점장님, 금액이 조금 적은 것 같습니다." },
      { speaker: "점장님", text: "저번 낙상 사고 처리하면서 가게 돈이 좀 나갔네. 자네도 그날 근무자였으니 10만 원만 월급에서 미리 뺐네." },
      { speaker: "지후 독백", text: "그냥 넘어가면 편하다. 하지만 이 선을 넘으면, 다음에는 어디까지 물러서게 될까?", dim: true },
    ],
    choices: [
      {
        id: "accept_deduction",
        label: "알겠습니다. 이번에는 그냥 넘어가겠습니다.",
        summary: "월급 공제를 받아들였다.",
        result: [
          { speaker: "나레이션", text: "갈등은 피했다. 하지만 지후는 집으로 돌아가는 길에 계속 월급 내역을 다시 열어본다." },
        ],
        effect: { relationship: 1, legalStability: -4, jihuStress: 3, flags: { wage_deduction_accepted: true } },
      },
      {
        id: "object_wage",
        label: "이번에는, 이의 있습니다.",
        summary: "임금 전액 지급 원칙을 근거로 공제에 이의를 제기했다.",
        result: [
          { speaker: "지후", text: "이번에는, 이의 있습니다.", tone: "strong", focus: "04_Jihu_Determined.png" },
          { speaker: "지후", text: "임금은 임금대로 전액 지급되어야 하고, 손해배상 문제는 별도 절차로 다뤄야 한다고 배웠습니다." },
          { speaker: "점장님", text: "...그래. 내가 선을 넘었네. 방금 10만 원 다시 보냈네." },
          { speaker: "지후", text: "오늘 제가 지킨 건 돈만이 아니었습니다. 앞으로 이 가게에서 서로를 대하는 기준이었습니다." },
        ],
        effect: { legalStability: 4, storeTrust: 2, relationship: -1, flags: { wage_deduction_accepted: false } },
      },
    ],
    lawPoint: law("wage_full_payment"),
    nextScene: "ending",
  },
];

export const sceneById = Object.fromEntries(scenes.map((scene) => [scene.id, scene])) as Record<string, Scene>;
