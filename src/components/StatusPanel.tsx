import type { GameState } from "../types/game";

const scoreNames = {
  legalStability: "법적 안정성",
  relationship: "관계",
  storeTrust: "매장 신뢰",
  jihuStress: "지후 스트레스",
  explanationSkill: "설명 능력",
} as const;

export function StatusPanel({ state, onClose }: { state: GameState; onClose: () => void }) {
  const describe = (value: number) => {
    if (value >= 3) return "단단해지는 중";
    if (value > 0) return "조금씩 쌓이는 중";
    if (value <= -3) return "주의가 필요함";
    if (value < 0) return "흔들리는 중";
    return "아직 정해지지 않음";
  };

  return (
    <aside className="side-panel" aria-label="현재 상태">
      <div className="panel-heading"><h2>현재의 지후</h2><button type="button" onClick={onClose} aria-label="닫기">×</button></div>
      <div className="score-list">
        {(Object.keys(scoreNames) as (keyof typeof scoreNames)[]).map((key) => (
          <div key={key}><span>{scoreNames[key]}</span><strong>{describe(state[key])}</strong></div>
        ))}
      </div>
      <h3>관계</h3>
      <div className="score-list compact">
        <div><span>점장 신뢰</span><strong>{describe(state.affinity.ownerTrust)}</strong></div>
        <div><span>수진 신뢰</span><strong>{describe(state.affinity.sujinTrust)}</strong></div>
        <div><span>손님 신뢰</span><strong>{describe(state.affinity.customerTrust)}</strong></div>
        <div><span>자기 존중</span><strong>{describe(state.affinity.jihuSelfRespect)}</strong></div>
      </div>
      <h3>선택 기록</h3>
      {state.choiceHistory.length ? state.choiceHistory.map((item) => (
        <div className="history-item" key={`${item.sceneId}-${item.choiceId}`}><strong>{item.choiceLabel}</strong><p>{item.resultText}</p></div>
      )) : <p className="muted">아직 선택 기록이 없습니다.</p>}
    </aside>
  );
}
