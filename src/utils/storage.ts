import type { GameState } from "../types/game";

export const GAME_SAVE_STORAGE_KEY = "convenience-solomon-save-v1";

export const saveGame = (state: GameState) => localStorage.setItem(GAME_SAVE_STORAGE_KEY, JSON.stringify(state));

export const hasSavedGame = () => localStorage.getItem(GAME_SAVE_STORAGE_KEY) !== null;

export const loadGame = (): GameState | null => {
  const raw = localStorage.getItem(GAME_SAVE_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
};
