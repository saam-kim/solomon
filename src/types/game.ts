export type CharacterId =
  | "jihu"
  | "owner"
  | "sujin"
  | "child"
  | "youth"
  | "officeWorker"
  | "elder"
  | "customer"
  | "cat"
  | "narrator"
  | "notice";

export type Emotion =
  | "neutral"
  | "happy"
  | "worried"
  | "sad"
  | "angry"
  | "scared"
  | "determined"
  | "sly"
  | "embarrassed"
  | "pouting";

export type Position = "left" | "center" | "right";

export type CharacterPlacement = {
  characterId: CharacterId;
  emotion?: Emotion;
  position: Position;
  visible?: boolean;
};

export type PropPlacement = {
  propId: string;
  position?: Position;
  mode?: "inline" | "focus";
};

export type DialogueLine = {
  speaker: CharacterId;
  text: string;
  characterUpdates?: CharacterPlacement[];
  propUpdates?: PropPlacement[];
  background?: string;
  cg?: string;
  effect?: "dim" | "pause" | "emphasis" | "objection";
  textVariants?: DialogueTextVariant[];
};

export type ChoiceType =
  | "lawful_explained"
  | "lawful_cold"
  | "relationship_first"
  | "avoidant"
  | "creative_risk";

export type GameStateScores = {
  legalStability: number;
  relationship: number;
  storeTrust: number;
  jihuStress: number;
  explanationSkill: number;
};

export type CharacterAffinity = {
  ownerTrust: number;
  sujinTrust: number;
  customerTrust: number;
  jihuSelfRespect: number;
};

export type GameFlags = {
  contract_written: boolean | null;
  fair_sale: boolean | null;
  minor_contract_risk: boolean | null;
  id_check_failed: boolean | null;
  disposal_rule_broken: boolean | null;
  spill_cleaned: boolean | null;
  fall_accident: boolean | null;
  insurance_procedure: boolean | null;
  cat_care_balanced: boolean | null;
  wage_deduction_accepted: boolean | null;
};

export type Choice = {
  id: string;
  label: string;
  type: ChoiceType;
  resultText: string;
  resultAsset?: string;
  effects: Partial<GameStateScores>;
  affinityEffects?: Partial<CharacterAffinity>;
  flagUpdates?: Partial<GameFlags>;
  nextSceneId?: string;
  lawPointId?: string;
  emphasis?: boolean;
  resultCharacters?: CharacterPlacement[];
};

export type ChoiceHistoryItem = {
  sceneId: string;
  choiceId: string;
  choiceLabel: string;
  choiceType: ChoiceType;
  resultText: string;
};

export type GameState = GameStateScores & {
  affinity: CharacterAffinity;
  flags: GameFlags;
  currentSceneId: string;
  currentLineIndex: number;
  visitedScenes: string[];
  choiceHistory: ChoiceHistoryItem[];
  backlog: DialogueLine[];
  unlockedLawPoints: string[];
  resolvedSceneIds: string[];
  appliedRecallIds: string[];
  selectedEndingId: EndingId | null;
};

export type ChoiceOutcome = {
  resultText: string;
  resultAsset?: string;
  lawPointId?: string;
  emphasis?: boolean;
  characters?: CharacterPlacement[];
};

export type Scene = {
  id: string;
  title: string;
  background?: string;
  cg?: string;
  characters?: CharacterPlacement[];
  props?: PropPlacement[];
  dialogue: DialogueLine[];
  choices?: Choice[];
  lawPointId?: string;
  nextSceneId?: string;
  memoryCount?: number;
  variants?: SceneVariant[];
};

export type FlagCondition = {
  flag: keyof GameFlags;
  equals: boolean | null;
};

export type SceneVariant = {
  when: FlagCondition;
  title?: string;
  background?: string;
  cg?: string;
  characters?: CharacterPlacement[];
  props?: PropPlacement[];
  dialogue?: DialogueLine[];
  choices?: Choice[];
  lawPointId?: string;
  nextSceneId?: string;
  memoryCount?: number;
};

export type LawPoint = {
  id: string;
  title: string;
  summary: string;
  keyConcepts: string[];
  reflectionQuestion: string;
};

export type StateCondition =
  | { kind: "flag"; key: keyof GameFlags; equals: boolean | null }
  | { kind: "score"; key: keyof GameStateScores; operator: "gte" | "lte"; value: number }
  | { kind: "affinity"; key: keyof CharacterAffinity; operator: "gte" | "lte"; value: number };

export type DialogueTextVariant = {
  conditions: StateCondition[];
  text: string;
};

export type Recall = {
  id: string;
  triggerSceneId: string;
  title: string;
  text: string;
  assetKey?: string;
  conditions: StateCondition[];
  effects?: Partial<GameStateScores>;
  affinityEffects?: Partial<CharacterAffinity>;
};

export type CharacterProfile = {
  id: CharacterId;
  name: string;
};

export type EndingId =
  | "ending_happy"
  | "ending_unpaid_notice"
  | "ending_empty_counter"
  | "ending_closing"
  | "ending_normal";

export type Ending = {
  id: EndingId;
  title: string;
  description: string;
  message: string;
  background: string;
  cg?: string;
  props?: string[];
  discussionQuestions: [string, string];
};

export type ChoiceTypeCounts = {
  lawfulExplainedCount: number;
  lawfulColdCount: number;
  relationshipFirstCount: number;
  avoidantCount: number;
  creativeRiskCount: number;
};

export type EndingAnalysis = {
  keyChoices: ChoiceHistoryItem[];
  legalSummary: string;
  relationshipSummary: string;
  keptLines: string[];
  blurredLines: string[];
};
