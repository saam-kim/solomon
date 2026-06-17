import { useCallback, useEffect, useMemo, useState } from "react";
import { scenes, sceneById } from "../data/scenes";
import type { Choice, GameState } from "../types";
import { applyChoiceEffect, initialState, visibleChoices, visibleLines } from "../utils/scoring";

const STORAGE_KEY = "convenience-solomon-save";

function persist(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    try {
      return { ...initialState, ...JSON.parse(raw) } as GameState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    persist(state);
  }, [state]);

  const scene = sceneById[state.currentSceneId] ?? scenes[0];
  const lines = useMemo(() => visibleLines(scene, state), [scene, state]);
  const choices = useMemo(() => visibleChoices(scene, state), [scene, state]);
  const currentLine = state.resultQueue[0] ?? lines[state.lineIndex] ?? null;
  const atSceneEnd = state.resultQueue.length === 0 && state.lineIndex >= lines.length;
  const canShowChoices = atSceneEnd && choices.length > 0;

  const goToScene = useCallback((sceneId: string) => {
    setState((current) => ({
      ...current,
      currentSceneId: sceneId,
      visitedScenes: current.visitedScenes.includes(sceneId) ? current.visitedScenes : [...current.visitedScenes, sceneId],
      lineIndex: 0,
      resultQueue: [],
      pendingLawPointId: null,
    }));
  }, []);

  const advanceToNextScene = useCallback((currentSceneId: string, overrideNext?: string) => {
    const currentScene = sceneById[currentSceneId];
    const nextScene = overrideNext ?? currentScene?.nextScene ?? "ending";
    setState((current) => ({
      ...current,
      currentSceneId: nextScene,
      visitedScenes: current.visitedScenes.includes(nextScene) ? current.visitedScenes : [...current.visitedScenes, nextScene],
      lineIndex: 0,
      resultQueue: [],
      pendingLawPointId: null,
    }));
  }, []);

  const advance = useCallback(() => {
    setState((current) => {
      const activeScene = sceneById[current.currentSceneId];
      const activeLines = visibleLines(activeScene, current);

      if (current.resultQueue.length > 1) {
        return { ...current, resultQueue: current.resultQueue.slice(1) };
      }

      if (current.resultQueue.length === 1) {
        if (activeScene.lawPoint) {
          return { ...current, resultQueue: [], pendingLawPointId: activeScene.lawPoint.id };
        }
        const next = activeScene.nextScene ?? "ending";
        return {
          ...current,
          currentSceneId: next,
          visitedScenes: current.visitedScenes.includes(next) ? current.visitedScenes : [...current.visitedScenes, next],
          lineIndex: 0,
          resultQueue: [],
        };
      }

      if (current.lineIndex < activeLines.length - 1) {
        return { ...current, lineIndex: current.lineIndex + 1 };
      }

      const activeChoices = visibleChoices(activeScene, current);
      if (activeChoices.length > 0) {
        return { ...current, lineIndex: activeLines.length };
      }

      if (activeScene.lawPoint && current.pendingLawPointId !== activeScene.lawPoint.id) {
        return { ...current, lineIndex: activeLines.length, pendingLawPointId: activeScene.lawPoint.id };
      }

      const next = activeScene.nextScene ?? "ending";
      return {
        ...current,
        currentSceneId: next,
        visitedScenes: current.visitedScenes.includes(next) ? current.visitedScenes : [...current.visitedScenes, next],
        lineIndex: 0,
        resultQueue: [],
        pendingLawPointId: null,
      };
    });
  }, []);

  const choose = useCallback((choice: Choice) => {
    setState((current) => {
      const activeScene = sceneById[current.currentSceneId];
      const next = applyChoiceEffect(current, choice);
      return {
        ...next,
        lineIndex: visibleLines(activeScene, next).length,
        resultQueue: choice.result,
        choiceHistory: [
          ...current.choiceHistory,
          {
            sceneId: activeScene.id,
            sceneTitle: activeScene.title,
            choiceId: choice.id,
            label: choice.label,
            summary: choice.summary,
            rationale: current.reflections[activeScene.id]?.trim(),
          },
        ],
      };
    });
  }, []);

  const closeLawPoint = useCallback(() => {
    const next = scene.nextScene ?? "ending";
    setState((current) => ({
      ...current,
      pendingLawPointId: null,
      currentSceneId: next,
      visitedScenes: current.visitedScenes.includes(next) ? current.visitedScenes : [...current.visitedScenes, next],
      lineIndex: 0,
      resultQueue: [],
    }));
  }, [scene]);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  }, []);

  const load = useCallback(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    try {
      setState({ ...initialState, ...JSON.parse(raw) });
      return true;
    } catch {
      return false;
    }
  }, []);

  const save = useCallback(() => {
    persist(state);
  }, [state]);

  const setTextScale = useCallback((textScale: number) => {
    setState((current) => ({ ...current, textScale }));
  }, []);

  const toggleQuickMode = useCallback(() => {
    setState((current) => ({ ...current, quickMode: !current.quickMode }));
  }, []);

  const toggleMuted = useCallback(() => {
    setState((current) => ({ ...current, muted: !current.muted }));
  }, []);

  const setReflection = useCallback((sceneId: string, value: string) => {
    setState((current) => ({
      ...current,
      reflections: {
        ...current.reflections,
        [sceneId]: value,
      },
    }));
  }, []);

  return {
    state,
    scene,
    lines,
    choices,
    currentLine,
    canShowChoices,
    advance,
    choose,
    goToScene,
    advanceToNextScene,
    closeLawPoint,
    reset,
    save,
    load,
    setTextScale,
    toggleQuickMode,
    toggleMuted,
    setReflection,
  };
}
