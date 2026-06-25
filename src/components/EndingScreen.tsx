import { useMemo, useState } from "react";
import type { Ending, GameState } from "../types/game";
import { buildEndingAnalysis, countChoiceTypes } from "../utils/endingSelector";
import { createPlayResultText } from "../utils/report";
import { copyTextToClipboard } from "../utils/clipboard";
import { BackgroundLayer } from "./BackgroundLayer";
import { PropLayer } from "./PropLayer";

export function EndingScreen({ ending, state, onSave, onRestart }: {
  ending: Ending;
  state: GameState;
  onSave: () => void;
  onRestart: () => void;
}) {
  const analysis = useMemo(() => buildEndingAnalysis(state), [state]);
  const counts = useMemo(() => countChoiceTypes(state.choiceHistory), [state.choiceHistory]);
  const [saved, setSaved] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const growthSummary = state.affinity.jihuSelfRespect > 0
    ? "상대의 사정을 이해하면서도 자신의 권리와 책임을 말할 수 있게 되었습니다."
    : state.explanationSkill > 3
      ? "법의 문장을 상황에 맞는 말로 설명하는 힘을 키웠습니다."
      : "선택의 결과를 끝까지 마주보며 다음에는 무엇을 다르게 말할지 배웠습니다.";

  const copyResult = async () => {
    const copied = await copyTextToClipboard(createPlayResultText(state));
    if (copied) {
      setCopyStatus("결과를 복사했습니다.");
    } else {
      setCopyStatus("클립보드 권한을 확인해 주세요.");
    }
  };

  return (
    <main className={`ending-screen ${ending.id}`}>
      <div className="ending-visual">
        <BackgroundLayer background={ending.background} cg={ending.cg} />
        <PropLayer placements={ending.props?.map((propId) => ({ propId, position: "center", mode: "focus" }))} />
        <div className="stage-vignette" />
        <div className="ending-title-card">
          <span className="eyebrow">YOUR ENDING</span>
          <h1>{ending.title}</h1>
          <p>{ending.description}</p>
          <blockquote>{ending.message}</blockquote>
        </div>
      </div>

      <section className="ending-analysis" aria-label="선택 분석 카드">
        <header><span>CHOICE ANALYSIS</span><h2>지후가 한 달 동안 그은 선</h2></header>
        <div className="analysis-grid">
          <article>
            <h3>핵심 선택 3개</h3>
            <ol>{analysis.keyChoices.map((choice) => <li key={`${choice.sceneId}-${choice.choiceId}`}>{choice.choiceLabel}</li>)}</ol>
          </article>
          <article>
            <h3>법적 안정성</h3><p>{analysis.legalSummary}</p>
            <h3>관계에서 아쉬웠던 점</h3><p>{analysis.relationshipSummary}</p>
            <h3>지후가 성장한 부분</h3><p>{growthSummary}</p>
          </article>
          <article className="line-review kept"><h3>지후가 지킨 선</h3><ul>{analysis.keptLines.map((line) => <li key={line}>{line}</li>)}</ul></article>
          <article className="line-review blurred"><h3>넘기거나 흐린 선</h3><ul>{analysis.blurredLines.map((line) => <li key={line}>{line}</li>)}</ul></article>
        </div>
        <div className="choice-profile">
          <span>설명하며 지킴 {counts.lawfulExplainedCount}</span>
          <span>차갑게 지킴 {counts.lawfulColdCount}</span>
          <span>관계 우선 {counts.relationshipFirstCount}</span>
          <span>회피 {counts.avoidantCount}</span>
          <span>창의적 위험 {counts.creativeRiskCount}</span>
        </div>
        <div className="discussion-card">
          <h3>함께 이야기해 볼 질문</h3>
          <ol>{ending.discussionQuestions.map((question) => <li key={question}>{question}</li>)}</ol>
        </div>
        {historyOpen && (
          <div className="ending-history" aria-label="전체 선택 기록">
            <h3>전체 선택 기록</h3>
            <ol>{state.choiceHistory.map((choice) => <li key={`${choice.sceneId}-${choice.choiceId}`}><strong>{choice.choiceLabel}</strong><span>{choice.resultText}</span></li>)}</ol>
          </div>
        )}
        <div className="ending-actions">
          <button type="button" onClick={() => { onSave(); setSaved(true); }}>{saved ? "저장됨" : "엔딩 저장"}</button>
          <button type="button" onClick={() => setHistoryOpen((open) => !open)}>{historyOpen ? "선택 기록 닫기" : "선택 기록 보기"}</button>
          <button type="button" onClick={copyResult}>결과 복사하기</button>
          <button type="button" onClick={onRestart}>처음부터 다시</button>
        </div>
        {copyStatus && <p className="ending-copy-status" role="status">{copyStatus}</p>}
      </section>
    </main>
  );
}
