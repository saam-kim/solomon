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
};

export type Scene = {
  id: string;
  title: string;
  mainIllustration: string;
  background?: string;
  characters?: CharacterPlacement[];
  props?: PropPlacement[];
  dialogue: DialogueLine[];
  choices?: Choice[];
  lawPoint?: LawPoint;
  nextScene?: string;
};

export type ChoiceRecord = {
  sceneId: string;
  sceneTitle: string;
  choiceId: string;
  label: string;
  summary: string;
  rationale?: string;
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
