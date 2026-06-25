import type { GameState, StateCondition } from "../types/game";

export const matchesCondition = (state: GameState, condition: StateCondition) => {
  if (condition.kind === "flag") return state.flags[condition.key] === condition.equals;
  const value = condition.kind === "score" ? state[condition.key] : state.affinity[condition.key];
  return condition.operator === "gte" ? value >= condition.value : value <= condition.value;
};

export const matchesConditions = (state: GameState, conditions: StateCondition[]) =>
  conditions.every((condition) => matchesCondition(state, condition));
