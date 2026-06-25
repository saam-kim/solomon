import type { CharacterAffinity, Choice, GameState, GameStateScores, Recall } from "../types/game";

const scoreKeys: (keyof GameStateScores)[] = [
  "legalStability",
  "relationship",
  "storeTrust",
  "jihuStress",
  "explanationSkill",
];

export const applyChoiceEffects = (state: GameState, choice: Choice): GameState => {
  const next = { ...state, affinity: { ...state.affinity }, flags: { ...state.flags } };

  scoreKeys.forEach((key) => {
    next[key] += choice.effects[key] ?? 0;
  });

  (Object.keys(choice.affinityEffects ?? {}) as (keyof CharacterAffinity)[]).forEach((key) => {
    next.affinity[key] += choice.affinityEffects?.[key] ?? 0;
  });

  next.flags = { ...next.flags, ...choice.flagUpdates };
  return next;
};

export const applyRecallEffects = (state: GameState, recall: Recall): GameState => {
  const next = { ...state, affinity: { ...state.affinity } };
  scoreKeys.forEach((key) => {
    next[key] += recall.effects?.[key] ?? 0;
  });
  (Object.keys(recall.affinityEffects ?? {}) as (keyof CharacterAffinity)[]).forEach((key) => {
    next.affinity[key] += recall.affinityEffects?.[key] ?? 0;
  });
  return next;
};
