import { useCallback, useMemo, useState } from "react";
import { getScene } from "../utils/sceneResolver";
import { applyChoiceEffects, applyRecallEffects } from "../utils/scoring";
import { loadGame, saveGame } from "../utils/storage";
import { recalls } from "../data/recalls";
import { matchesConditions } from "../utils/conditions";
import { selectEndingId } from "../utils/endingSelector";
import type { Choice, ChoiceOutcome, DialogueLine, GameState, Recall } from "../types/game";

export const initialGameState: GameState = {
  legalStability: 0,
  relationship: 0,
  storeTrust: 0,
  jihuStress: 0,
  explanationSkill: 0,
  affinity: { ownerTrust: 0, sujinTrust: 0, customerTrust: 0, jihuSelfRespect: 0 },
  flags: {
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
  },
  currentSceneId: "intro",
  currentLineIndex: 0,
  visitedScenes: [],
  choiceHistory: [],
  backlog: [],
  unlockedLawPoints: [],
  resolvedSceneIds: [],
  appliedRecallIds: [],
  selectedEndingId: null,
};

const addLineToBacklog = (backlog: DialogueLine[], line: DialogueLine) => {
  const last = backlog.at(-1);
  return last === line ? backlog : [...backlog, line];
};

export const useGameState = () => {
  const [state, setState] = useState<GameState>(initialGameState);
  const [lastOutcome, setLastOutcome] = useState<ChoiceOutcome | null>(null);
  const [pendingSceneId, setPendingSceneId] = useState<string | null>(null);
  const scene = useMemo(() => getScene(state.currentSceneId, state), [state]);
  const line = scene.dialogue[state.currentLineIndex] ?? scene.dialogue.at(-1);
  const isAtLastLine = state.currentLineIndex >= scene.dialogue.length - 1;
  const isPastLastLine = state.currentLineIndex >= scene.dialogue.length;
  const sceneResolved = state.resolvedSceneIds.includes(scene.id);
  const showChoices = isPastLastLine && Boolean(scene.choices?.length) && !sceneResolved;
  const isDemoComplete = isPastLastLine && (!scene.choices?.length || sceneResolved) && !scene.nextSceneId;
  const pendingRecall = useMemo(() => recalls.find((recall) =>
    recall.triggerSceneId === state.currentSceneId
    && !state.appliedRecallIds.includes(recall.id)
    && matchesConditions(state, recall.conditions)), [state]);

  const moveToScene = useCallback((sceneId: string, baseState?: GameState) => {
    setState((current) => {
      const source = baseState ?? current;
      return {
        ...source,
        currentSceneId: sceneId,
        currentLineIndex: 0,
        visitedScenes: source.visitedScenes.includes(sceneId)
          ? source.visitedScenes
          : [...source.visitedScenes, sceneId],
      };
    });
  }, []);

  const advance = useCallback(() => {
    if (showChoices || isDemoComplete || !line) return;
    setLastOutcome(null);
    if (!isAtLastLine) {
      setState((current) => ({
        ...current,
        currentLineIndex: current.currentLineIndex + 1,
        backlog: addLineToBacklog(current.backlog, line),
      }));
      return;
    }
    if (scene.choices?.length && !sceneResolved) {
      setState((current) => ({
        ...current,
        currentLineIndex: scene.dialogue.length,
        backlog: addLineToBacklog(current.backlog, line),
      }));
      return;
    }
    if (scene.nextSceneId) {
      setState((current) => ({
        ...current,
        currentSceneId: scene.nextSceneId!,
        currentLineIndex: 0,
        backlog: addLineToBacklog(current.backlog, line),
        visitedScenes: current.visitedScenes.includes(scene.nextSceneId!)
          ? current.visitedScenes
          : [...current.visitedScenes, scene.nextSceneId!],
      }));
      return;
    }
    setState((current) => ({
      ...current,
      currentLineIndex: scene.dialogue.length,
      backlog: addLineToBacklog(current.backlog, line),
    }));
  }, [isAtLastLine, isDemoComplete, line, scene.choices, scene.dialogue.length, scene.nextSceneId, sceneResolved, showChoices]);

  const choose = useCallback((choice: Choice) => {
    setState((current) => {
      const applied = applyChoiceEffects(current, choice);
      const lawPoints = choice.lawPointId && !applied.unlockedLawPoints.includes(choice.lawPointId)
        ? [...applied.unlockedLawPoints, choice.lawPointId]
        : applied.unlockedLawPoints;
      const nextState: GameState = {
        ...applied,
        currentSceneId: current.currentSceneId,
        currentLineIndex: current.currentLineIndex,
        choiceHistory: [...applied.choiceHistory, {
          sceneId: current.currentSceneId,
          choiceId: choice.id,
          choiceLabel: choice.label,
          choiceType: choice.type,
          resultText: choice.resultText,
        }],
        backlog: line ? addLineToBacklog(current.backlog, line) : current.backlog,
        unlockedLawPoints: lawPoints,
        resolvedSceneIds: applied.resolvedSceneIds.includes(current.currentSceneId)
          ? applied.resolvedSceneIds
          : [...applied.resolvedSceneIds, current.currentSceneId],
        visitedScenes: current.visitedScenes,
      };
      return nextState;
    });
    setPendingSceneId(choice.nextSceneId ?? null);
    setLastOutcome({
      resultText: choice.resultText,
      resultAsset: choice.resultAsset,
      lawPointId: choice.lawPointId,
      emphasis: choice.emphasis,
      characters: choice.resultCharacters,
    });
  }, [line]);

  const restart = useCallback(() => {
    setState(initialGameState);
    setLastOutcome(null);
    setPendingSceneId(null);
  }, []);

  const save = useCallback(() => saveGame(state), [state]);
  const load = useCallback(() => {
    const saved = loadGame();
    if (saved) {
      setState({
        ...initialGameState,
        ...saved,
        affinity: { ...initialGameState.affinity, ...saved.affinity },
        flags: { ...initialGameState.flags, ...saved.flags },
        resolvedSceneIds: saved.resolvedSceneIds ?? [],
        appliedRecallIds: saved.appliedRecallIds ?? [],
        selectedEndingId: saved.selectedEndingId
          ?? (saved.currentSceneId === "ending" ? selectEndingId({ ...initialGameState, ...saved }) : null),
      });
      setLastOutcome(null);
      setPendingSceneId(null);
      return true;
    }
    return false;
  }, []);

  const clearOutcome = useCallback(() => setLastOutcome(null), []);

  const completeChoiceTransition = useCallback(() => {
    if (!pendingSceneId) return;
    setState((current) => {
      const nextState: GameState = {
        ...current,
        currentSceneId: pendingSceneId,
        currentLineIndex: 0,
        visitedScenes: current.visitedScenes.includes(pendingSceneId)
          ? current.visitedScenes
          : [...current.visitedScenes, pendingSceneId],
      };
      return pendingSceneId === "ending"
        ? { ...nextState, selectedEndingId: selectEndingId(nextState) }
        : nextState;
    });
    setPendingSceneId(null);
  }, [pendingSceneId]);

  const applyRecall = useCallback((recall: Recall) => {
    setState((current) => {
      const applied = applyRecallEffects(current, recall);
      return {
        ...applied,
        appliedRecallIds: applied.appliedRecallIds.includes(recall.id)
          ? applied.appliedRecallIds
          : [...applied.appliedRecallIds, recall.id],
      };
    });
  }, []);

  const jumpToScene = useCallback((sceneId: string, preserveState: boolean) => {
    setState((current) => {
      const source = preserveState ? current : initialGameState;
      const nextState: GameState = {
        ...source,
        affinity: { ...source.affinity },
        flags: { ...source.flags },
        currentSceneId: sceneId,
        currentLineIndex: 0,
        resolvedSceneIds: source.resolvedSceneIds.filter((id) => id !== sceneId),
        visitedScenes: source.visitedScenes.includes(sceneId) ? source.visitedScenes : [...source.visitedScenes, sceneId],
        selectedEndingId: null,
      };
      return sceneId === "ending" ? { ...nextState, selectedEndingId: selectEndingId(nextState) } : nextState;
    });
    setLastOutcome(null);
    setPendingSceneId(null);
  }, []);

  return {
    state,
    scene,
    line,
    showChoices,
    isDemoComplete,
    lastOutcome,
    pendingRecall,
    pendingSceneId,
    advance,
    choose,
    clearOutcome,
    completeChoiceTransition,
    applyRecall,
    jumpToScene,
    restart,
    save,
    load,
    moveToScene,
  };
};
