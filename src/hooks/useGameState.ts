import { useCallback, useEffect, useMemo, useState } from "react";
import { scenes, sceneById } from "../data/scenes";
import type { Choice, GameState, TestimonyStatement } from "../types";
import { applyChoiceEffect, initialState, visibleChoices, visibleLines, clampScore } from "../utils/scoring";
import { lawPoints } from "../data/lawPoints";

const STORAGE_KEY = "convenience-solomon-save";

function persist(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function validateReasoningText(text: string) {
  const trimmed = text.trim();
  
  // 1. Length check
  if (trimmed.length < 10) {
    return { valid: false, msg: "최소 10자 이상 작성해야 합니다." };
  }
  
  // 2. Digit/Symbol only check (must contain Korean or English letters)
  const hasLetters = /[a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ]/.test(trimmed);
  if (!hasLetters) {
    return { valid: false, msg: "의미 있는 글자로 입력해 주세요. (숫자나 기호만으로는 작성할 수 없습니다.)" };
  }

  // 3. Consecutive repeated character check (4+ identical characters)
  const consecutiveRepeatRegex = /(.)\1{3,}/;
  if (consecutiveRepeatRegex.test(trimmed.replace(/\s+/g, ''))) {
    return { valid: false, msg: "동일한 문자나 자모음이 반복되었습니다. 성의 있는 답변을 입력해 주세요." };
  }

  // 4. Set of unique characters check (must have reasonable variety, e.g. set size > 2)
  const cleanedText = trimmed.replace(/[^a-zA-Z가-힣]/g, ''); // letters only
  const uniqueChars = new Set(cleanedText);
  if (cleanedText.length >= 10 && uniqueChars.size <= 2) {
    return { valid: false, msg: "구체적이고 완성된 문장으로 작성해 주세요." };
  }

  return { valid: true, msg: "" };
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
  
  // Resolve current dialogue line
  const currentLine = useMemo(() => {
    if (state.resultQueue.length > 0) {
      return state.resultQueue[0];
    }
    if (scene.type === "testimony") {
      if (state.testimonyShowingSuccess) {
        const successLines = scene.success?.dialogue ?? [];
        const currentSuccessLine = successLines[state.successDialogueIdx];
        if (currentSuccessLine) {
          return {
            speaker: currentSuccessLine[0],
            text: currentSuccessLine[1],
            focus: currentSuccessLine[0] === "지후" ? "04_Jihu_Determined.png" : undefined
          };
        }
      } else {
        const stmt = scene.testimony?.[state.currentTestimonyIdx];
        if (stmt) {
          return {
            speaker: stmt.speaker,
            text: stmt.text
          };
        }
      }
      return null;
    }
    return lines[state.lineIndex] ?? null;
  }, [scene, lines, state.lineIndex, state.resultQueue, state.currentTestimonyIdx, state.testimonyShowingSuccess, state.successDialogueIdx]);

  const atSceneEnd = state.resultQueue.length === 0 && state.lineIndex >= lines.length;
  const canShowChoices = scene.type !== "testimony" && atSceneEnd && choices.length > 0;

  // Automatically unlock law associated with the scene when entering
  useEffect(() => {
    if (scene.lawKey && !state.unlockedLaws.includes(scene.lawKey)) {
      setState((current) => ({
        ...current,
        unlockedLaws: [...current.unlockedLaws, scene.lawKey!],
      }));
    }
  }, [scene.lawKey, state.unlockedLaws]);

  const advance = useCallback(() => {
    setState((current) => {
      const activeScene = sceneById[current.currentSceneId];
      
      // If displaying testimony success dialogue
      if (activeScene.type === "testimony" && current.testimonyShowingSuccess) {
        const successLines = activeScene.success?.dialogue ?? [];
        if (current.successDialogueIdx < successLines.length - 1) {
          return {
            ...current,
            successDialogueIdx: current.successDialogueIdx + 1
          };
        } else {
          // Success dialogue ended. Open feedback modal and apply final stats
          const success = activeScene.success!;
          const effect = success.effect ?? { legalStability: success.law, relationship: success.relation, storeTrust: success.profit };
          
          let nextState = {
            ...current,
            legalStability: clampScore(current.legalStability + (effect.legalStability ?? 0)),
            relationship: clampScore(current.relationship + (effect.relationship ?? 0)),
            storeTrust: clampScore(current.storeTrust + (effect.storeTrust ?? 0)),
            jihuStress: clampScore(current.jihuStress + (effect.jihuStress ?? 0)),
            flags: {
              ...current.flags,
              ...(effect.flags ?? {}),
            },
            isFeedbackModalOpen: true,
            feedbackTitle: `⚖️ 결과 보고서 - ${activeScene.title}`,
            feedbackBody: success.feedback,
            feedbackLawDelta: effect.legalStability ?? 0,
            feedbackRelationDelta: effect.relationship ?? 0,
            feedbackTrustDelta: effect.storeTrust ?? 0,
          };
          return nextState;
        }
      }

      // If displaying testimony cross-examination statements
      if (activeScene.type === "testimony" && !current.testimonyShowingSuccess) {
        const testimonies = activeScene.testimony ?? [];
        if (testimonies.length > 0) {
          return {
            ...current,
            currentTestimonyIdx: (current.currentTestimonyIdx + 1) % testimonies.length
          };
        }
      }

      // If there are results queued from a choice
      if (current.resultQueue.length > 1) {
        return { ...current, resultQueue: current.resultQueue.slice(1) };
      }

      if (current.resultQueue.length === 1) {
        // If choice result queue ends, show the feedback modal we queued
        return {
          ...current,
          resultQueue: [],
          isFeedbackModalOpen: true,
        };
      }

      // Normal choice-based scenes
      const activeLines = visibleLines(activeScene, current);
      if (current.lineIndex < activeLines.length - 1) {
        return { ...current, lineIndex: current.lineIndex + 1 };
      }

      const activeChoices = visibleChoices(activeScene, current);
      if (activeChoices.length > 0) {
        return { ...current, lineIndex: activeLines.length };
      }

      // If no choices, just proceed to next scene
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

  const openReasoningModal = useCallback((mode: "choice" | "objection", choiceId: string | null) => {
    setState((current) => ({
      ...current,
      isReasoningModalOpen: true,
      reasoningMode: mode,
      reasoningChoiceId: choiceId,
    }));
  }, []);

  const closeReasoningModal = useCallback(() => {
    setState((current) => ({
      ...current,
      isReasoningModalOpen: false,
      reasoningMode: null,
      reasoningChoiceId: null,
    }));
  }, []);

  const submitReasoning = useCallback((text: string) => {
    setState((current) => {
      const activeScene = sceneById[current.currentSceneId];
      if (current.reasoningMode === "choice") {
        // Find choice
        const choice = visibleChoices(activeScene, current).find((c) => c.id === current.reasoningChoiceId);
        if (!choice) return current;

        const next = applyChoiceEffect(current, choice);
        return {
          ...next,
          lineIndex: visibleLines(activeScene, next).length,
          resultQueue: choice.result,
          isReasoningModalOpen: false,
          reasoningMode: null,
          reasoningChoiceId: null,
          choiceHistory: [
            ...current.choiceHistory,
            {
              sceneId: activeScene.id,
              sceneTitle: activeScene.title,
              choiceId: choice.id,
              label: choice.label,
              summary: choice.summary,
              rationale: text.trim(),
              legalStability: choice.effect.legalStability ?? 0,
              relationship: choice.effect.relationship ?? 0,
              storeTrust: choice.effect.storeTrust ?? 0,
            },
          ],
          // Setup feedback parameters
          feedbackTitle: `⚖️ 결과 보고서 - ${activeScene.title}`,
          feedbackBody: choice.summary + "\n\n" + (activeScene.choices?.find(c => c.id === choice.id)?.result[0]?.text ?? ""),
          feedbackLawDelta: choice.effect.legalStability ?? 0,
          feedbackRelationDelta: choice.effect.relationship ?? 0,
          feedbackTrustDelta: choice.effect.storeTrust ?? 0,
        };
      } else if (current.reasoningMode === "objection") {
        // Correct objection presented!
        const success = activeScene.success!;
        const presentedLawId = current.reasoningChoiceId!;

        return {
          ...current,
          isReasoningModalOpen: false,
          reasoningMode: null,
          reasoningChoiceId: null,
          testimonyShowingSuccess: true,
          successDialogueIdx: 0,
          objectionActive: true,
          choiceHistory: [
            ...current.choiceHistory,
            {
              sceneId: activeScene.id,
              sceneTitle: activeScene.title,
              choiceId: "objection",
              label: "이의제기",
              summary: "제시 법령: " + (lawPoints.find(l => l.id === presentedLawId)?.title ?? presentedLawId),
              rationale: text.trim(),
              legalStability: success.law,
              relationship: success.relation,
              storeTrust: success.profit,
            }
          ]
        };
      }
      return current;
    });
  }, []);

  const closeFeedbackModal = useCallback(() => {
    setState((current) => {
      const activeScene = sceneById[current.currentSceneId];
      const next = activeScene.nextScene ?? "ending";
      return {
        ...current,
        isFeedbackModalOpen: false,
        feedbackTitle: "",
        feedbackBody: "",
        feedbackLawDelta: 0,
        feedbackRelationDelta: 0,
        feedbackTrustDelta: 0,
        currentSceneId: next,
        visitedScenes: current.visitedScenes.includes(next) ? current.visitedScenes : [...current.visitedScenes, next],
        lineIndex: 0,
        resultQueue: [],
        currentTestimonyIdx: 0,
        testimonyShowingSuccess: false,
        successDialogueIdx: 0,
      };
    });
  }, []);

  const nextStatement = useCallback(() => {
    setState((current) => {
      const activeScene = sceneById[current.currentSceneId];
      if (!activeScene || activeScene.type !== "testimony" || current.testimonyShowingSuccess) return current;
      const testimonies = activeScene.testimony ?? [];
      if (testimonies.length === 0) return current;
      return {
        ...current,
        currentTestimonyIdx: (current.currentTestimonyIdx + 1) % testimonies.length
      };
    });
  }, []);

  const prevStatement = useCallback(() => {
    setState((current) => {
      const activeScene = sceneById[current.currentSceneId];
      if (!activeScene || activeScene.type !== "testimony" || current.testimonyShowingSuccess) return current;
      const testimonies = activeScene.testimony ?? [];
      if (testimonies.length === 0) return current;
      return {
        ...current,
        currentTestimonyIdx: (current.currentTestimonyIdx - 1 + testimonies.length) % testimonies.length
      };
    });
  }, []);

  const presentLaw = useCallback((lawId: string) => {
    setState((current) => {
      const activeScene = sceneById[current.currentSceneId];
      if (!activeScene || activeScene.type !== "testimony" || current.testimonyShowingSuccess) return current;
      
      const testimonies = activeScene.testimony ?? [];
      const currentStmt = testimonies[current.currentTestimonyIdx];
      
      if (currentStmt?.isContradiction && currentStmt.correctLaw === lawId) {
        // Correct law presented! Open Reasoning Modal in objection mode
        return {
          ...current,
          isReasoningModalOpen: true,
          reasoningMode: "objection",
          reasoningChoiceId: lawId,
        };
      } else {
        // Wrong law presented! Screen shake, deduct 10 law points, and check for game over
        const nextLawScore = clampScore(current.legalStability - 10);
        
        if (nextLawScore <= 0) {
          // Game over! Trigger recovery modal
          const lawInfo = lawPoints.find(l => l.id === activeScene.lawKey) || {
            id: activeScene.lawKey ?? "unknown",
            title: "운영 수칙 위반",
            body: "법적 신뢰도가 0이 되어 매장 운영이 정지되었습니다."
          };
          return {
            ...current,
            legalStability: 0,
            isRecoveryModalOpen: true,
            recoveryLawId: lawInfo.id,
            recoveryFeedback: "모순된 진술에 대해 잘못된 법률을 제시하거나 엉뚱한 주장을 펼쳐 법적 신뢰도를 완전히 잃었습니다.",
            recoveryCharClass: activeScene.spriteClass || "owner"
          };
        } else {
          // Simply deduct 10 points and show alert
          alert("이 진술은 선택한 법령과 무관하거나 모순이 없습니다. 다른 진술이나 법령을 제시해 보세요!");
          return {
            ...current,
            legalStability: nextLawScore
          };
        }
      }
    });
  }, []);

  const retryScene = useCallback(() => {
    setState((current) => {
      // Re-initialize scene state to last saved (or start state)
      // To keep it simple, we reset scores to 50 (or current - delta)
      // In the original, it reset stats to sceneStartState. We can just set legalStability back to 50 (or last scene's value)
      return {
        ...current,
        legalStability: 50, // default reset
        isRecoveryModalOpen: false,
        recoveryLawId: null,
        recoveryFeedback: null,
        recoveryCharClass: null,
        currentTestimonyIdx: 0,
        testimonyShowingSuccess: false,
        successDialogueIdx: 0,
      };
    });
  }, []);

  const closeRecoveryModal = useCallback(() => {
    setState((current) => ({
      ...current,
      isRecoveryModalOpen: false,
      recoveryLawId: null,
      recoveryFeedback: null,
      recoveryCharClass: null,
    }));
  }, []);

  const turnOffObjection = useCallback(() => {
    setState((current) => ({
      ...current,
      objectionActive: false
    }));
  }, []);

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
    openReasoningModal,
    closeReasoningModal,
    submitReasoning,
    closeFeedbackModal,
    nextStatement,
    prevStatement,
    presentLaw,
    retryScene,
    closeRecoveryModal,
    turnOffObjection,
    reset,
    save,
    load,
    setTextScale,
    toggleQuickMode,
    toggleMuted,
    setReflection,
  };
}
