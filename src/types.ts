export type FlagKey =
  | "contract_written"
  | "fair_sale"
  | "minor_contract_risk"
  | "id_check_failed"
  | "disposal_rule_broken"
  | "spill_cleaned"
  | "fall_accident"
  | "insurance_procedure"
  | "cat_care_balanced"
  | "wage_deduction_accepted";

export type Flags = Record<FlagKey, boolean | null>;

export type CharacterPlacement = {
  asset: string;
  side: "left" | "center" | "right";
  mood?: string;
  activeFor?: string[];
};

export type PropPlacement = {
  asset: string;
  side: "left" | "center" | "right";
  size?: "small" | "medium" | "large";
  closeup?: boolean;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  tone?: "normal" | "quiet" | "strong";
  focus?: string;
  propFocus?: string | string[];
  dim?: boolean;
  when?: Partial<Flags>;
  illustration?: string;
  background?: string;
  zoom?: "notice" | "center" | "left" | "right" | boolean;
};

export type ChoiceEffect = Partial<{
  legalStability: number;
  relationship: number;
  storeTrust: number;
  jihuStress: number;
  flags: Partial<Flags>;
}>;

export type Choice = {
  id: string;
  label: string;
  summary: string;
  result: DialogueLine[];
  effect: ChoiceEffect;
  nextScene?: string;
  when?: Partial<Flags>;
};

export type LawPoint = {
  id: string;
  title: string;
  body: string;
  desc?: string;
  penalty?: string;
};

export type TestimonyStatement = {
  text: string;
  speaker: string;
  isContradiction?: boolean;
  correctLaw?: string;
  illustration?: string;
  background?: string;
};

export type TestimonySuccess = {
  feedback: string;
  law: number;
  relation: number;
  profit: number;
  npcPose?: string;
  playerPose?: string;
  dialogue: DialogueLine[];
  effect?: ChoiceEffect;
};

export type Scene = {
  id: string;
  type?: "choice" | "testimony";
  title: string;
  mainIllustration: string;
  background?: string;
  characters?: CharacterPlacement[];
  props?: PropPlacement[];
  dialogue: DialogueLine[];
  choices?: Choice[];
  testimony?: TestimonyStatement[];
  success?: TestimonySuccess;
  lawPoint?: LawPoint;
  lawKey?: string;
  nextScene?: string;
  spriteClass?: string;
};

export type ChoiceRecord = {
  sceneId: string;
  sceneTitle: string;
  choiceId: string;
  label: string;
  summary: string;
  rationale?: string;
  legalStability?: number;
  relationship?: number;
  storeTrust?: number;
};

export type GameState = {
  legalStability: number;
  relationship: number;
  storeTrust: number;
  jihuStress: number;
  flags: Flags;
  currentSceneId: string;
  visitedScenes: string[];
  lineIndex: number;
  resultQueue: DialogueLine[];
  pendingLawPointId: string | null;
  choiceHistory: ChoiceRecord[];
  reflections: Record<string, string>;
  textScale: number;
  quickMode: boolean;
  muted: boolean;

  // Testimony and popup modal states
  currentTestimonyIdx: number;
  testimonyShowingSuccess: boolean;
  successDialogueIdx: number;
  unlockedLaws: string[];
  isReasoningModalOpen: boolean;
  reasoningMode: "choice" | "objection" | null;
  reasoningChoiceId: string | null;
  isRecoveryModalOpen: boolean;
  recoveryLawId: string | null;
  recoveryFeedback: string | null;
  recoveryCharClass: string | null;
  objectionActive: boolean;

  // Feedback modal states
  isFeedbackModalOpen: boolean;
  feedbackTitle: string;
  feedbackBody: string;
  feedbackLawDelta: number;
  feedbackRelationDelta: number;
  feedbackTrustDelta: number;
};

export type Ending = {
  id: string;
  title: string;
  subtitle: string;
  mainIllustration: string;
  supportingAssets: string[];
  body: string;
  diagnosis: string[];
};

