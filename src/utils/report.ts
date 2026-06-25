import { endings } from "../data/endings";
import { scenes } from "../data/scenes";
import { teacherChoiceTypeLabels } from "../data/teacher";
import type { GameState } from "../types/game";
import { buildEndingAnalysis, countChoiceTypes } from "./endingSelector";

export const createPlayResultText = (state: GameState) => {
  const ending = state.selectedEndingId ? endings[state.selectedEndingId] : null;
  const analysis = buildEndingAnalysis(state);
  const counts = countChoiceTypes(state.choiceHistory);
  const countRows = [
    [teacherChoiceTypeLabels.lawful_explained, counts.lawfulExplainedCount],
    [teacherChoiceTypeLabels.lawful_cold, counts.lawfulColdCount],
    [teacherChoiceTypeLabels.relationship_first, counts.relationshipFirstCount],
    [teacherChoiceTypeLabels.avoidant, counts.avoidantCount],
    [teacherChoiceTypeLabels.creative_risk, counts.creativeRiskCount],
  ];

  return [
    "[편의점 솔로몬 플레이 결과]",
    `엔딩: ${ending?.title ?? "플레이 진행 중"}`,
    "",
    "핵심 선택:",
    ...analysis.keyChoices.map((choice, index) => `${index + 1}. ${scenes[choice.sceneId]?.title ?? choice.sceneId}: ${choice.choiceLabel}`),
    "",
    "선택 경향:",
    ...countRows.map(([label, count]) => `- ${label}: ${count}회`),
    "",
    "지킨 선:",
    ...analysis.keptLines.map((line) => `- ${line}`),
    "",
    "흐린 선:",
    ...analysis.blurredLines.map((line) => `- ${line}`),
    "",
    "토론 질문:",
    ...(ending?.discussionQuestions ?? ["법을 지키는 말투도 중요할까?"]),
  ].join("\n");
};
