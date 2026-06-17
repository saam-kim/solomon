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
  legalStability: 0,
  relationship: 0,
  storeTrust: 0,
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
  return Math.max(-12, Math.min(18, value));
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
