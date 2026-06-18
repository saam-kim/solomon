import type { Choice, DialogueLine, Flags, GameState, Scene } from "../types";

export const initialFlags: Flags = {
  contract_written: null,
  fair_sale: null,
  minor_contract_risk: null,
  id_check_failed: null,
  disposal_rule_broken: null,
  spill_cleaned: null,
  fall_accident: null,
  insurance_procedure: null,
  cat_care_balanced: null,
  wage_deduction_accepted: null,
};

export const initialState: GameState = {
  legalStability: 50,
  relationship: 50,
  storeTrust: 50,
  jihuStress: 0,
  flags: initialFlags,
  currentSceneId: "intro",
  visitedScenes: ["intro"],
  lineIndex: 0,
  resultQueue: [],
  pendingLawPointId: null,
  choiceHistory: [],
  reflections: {},
  textScale: 1,
  quickMode: false,
  muted: true,

  // Testimony states
  currentTestimonyIdx: 0,
  testimonyShowingSuccess: false,
  successDialogueIdx: 0,
  unlockedLaws: [],
  isReasoningModalOpen: false,
  reasoningMode: null,
  reasoningChoiceId: null,
  isRecoveryModalOpen: false,
  recoveryLawId: null,
  recoveryFeedback: null,
  recoveryCharClass: null,
  objectionActive: false,

  isFeedbackModalOpen: false,
  feedbackTitle: "",
  feedbackBody: "",
  feedbackLawDelta: 0,
  feedbackRelationDelta: 0,
  feedbackTrustDelta: 0,
};

export function matchesWhen(when: Partial<Flags> | undefined, flags: Flags) {
  if (!when) return true;
  return Object.entries(when).every(([key, value]) => flags[key as keyof Flags] === value);
}

export function visibleLines(scene: Scene, state: GameState): DialogueLine[] {
  return scene.dialogue.filter((line) => matchesWhen(line.when, state.flags));
}

export function visibleChoices(scene: Scene, state: GameState): Choice[] {
  return (scene.choices ?? []).filter((choice) => matchesWhen(choice.when, state.flags));
}

export function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function applyChoiceEffect(state: GameState, choice: Choice): GameState {
  const effect = choice.effect;
  return {
    ...state,
    legalStability: clampScore(state.legalStability + (effect.legalStability ?? 0)),
    relationship: clampScore(state.relationship + (effect.relationship ?? 0)),
    storeTrust: clampScore(state.storeTrust + (effect.storeTrust ?? 0)),
    jihuStress: clampScore(state.jihuStress + (effect.jihuStress ?? 0)),
    flags: {
      ...state.flags,
      ...(effect.flags ?? {}),
    },
  };
}
