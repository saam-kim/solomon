import { scenes } from "../data/scenes";
import type { GameState, Scene } from "../types/game";
import { matchesConditions } from "./conditions";

export const getScene = (sceneId: string, state?: GameState): Scene => {
  const baseScene = scenes[sceneId] ?? scenes.intro;
  const variant = state
    ? baseScene.variants?.find(({ when }) => state.flags[when.flag] === when.equals)
    : undefined;

  const resolvedScene = variant ? { ...baseScene, ...variant, id: baseScene.id } : baseScene;
  return {
    ...resolvedScene,
    dialogue: resolvedScene.dialogue.map((line) => {
      const textVariant = state
        ? line.textVariants?.find(({ conditions }) => matchesConditions(state, conditions))
        : undefined;
      return textVariant ? { ...line, text: textVariant.text } : line;
    }),
  };
};
