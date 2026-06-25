import { useState } from "react";
import { endings } from "../data/endings";
import { scenes } from "../data/scenes";
import { teacherChoiceTypeLabels, teacherDiscussionQuestions, teacherLawConcepts, teacherSceneLinks } from "../data/teacher";
import type { GameFlags, GameState } from "../types/game";
import { createPlayResultText } from "../utils/report";
import { copyTextToClipboard } from "../utils/clipboard";

type Tab = "jump" | "history" | "law" | "discussion";

const flagLabels: Record<keyof GameFlags, string> = {
  contract_written: "근로계약서 작성",
  fair_sale: "공정 판매",
  minor_contract_risk: "미성년자 계약 위험",
  id_check_failed: "신분 확인 실패",
  disposal_rule_broken: "폐기 규정 위반",
  spill_cleaned: "우유 즉시 처리",
  fall_accident: "낙상 사고 발생",
  insurance_procedure: "보험 절차 진행",
  cat_care_balanced: "고양이 돌봄 균형",
  wage_deduction_accepted: "임금 공제 수용",
};

export function TeacherPanel({ state, onJump, onClose }: {
  state: GameState;
  onJump: (sceneId: string, preserveState: boolean) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("jump");
  const [preserveState, setPreserveState] = useState(true);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const ending = state.selectedEndingId ? endings[state.selectedEndingId] : null;

  const copyResult = async () => {
    const copied = await copyTextToClipboard(createPlayResultText(state));
    if (copied) {
      setCopyStatus("결과를 클립보드에 복사했습니다.");
    } else {
      setCopyStatus("브라우저에서 클립보드 권한을 허용해 주세요.");
    }
  };

  return (
    <aside className="teacher-panel" aria-label="교사용 패널">
      <div className="panel-heading"><div><span className="eyebrow">CLASSROOM MODE</span><h2>교사용 패널</h2></div><button type="button" onClick={onClose} aria-label="교사용 패널 닫기">×</button></div>
      <div className="teacher-summary">
        <span>현재 장면<strong>{scenes[state.currentSceneId]?.title ?? state.currentSceneId}</strong></span>
        <span>선택 수<strong>{state.choiceHistory.length}</strong></span>
        <span>엔딩<strong>{ending?.title ?? "진행 중"}</strong></span>
      </div>
      <nav className="teacher-tabs" aria-label="교사용 패널 메뉴">
        <button type="button" className={tab === "jump" ? "active" : ""} onClick={() => setTab("jump")}>장면·상태</button>
        <button type="button" className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>선택 기록</button>
        <button type="button" className={tab === "law" ? "active" : ""} onClick={() => setTab("law")}>법 개념</button>
        <button type="button" className={tab === "discussion" ? "active" : ""} onClick={() => setTab("discussion")}>토론</button>
      </nav>

      {tab === "jump" && (
        <div className="teacher-section">
          <label className="toggle-row compact"><span><strong>현재 상태 유지</strong><small>끄면 초기 상태에서 장면을 시연합니다.</small></span><input type="checkbox" checked={preserveState} onChange={(event) => setPreserveState(event.target.checked)} /></label>
          <div className="scene-jump-grid">
            {teacherSceneLinks.map((scene) => <button key={scene.id} type="button" onClick={() => onJump(scene.id, preserveState)}>{scene.label}</button>)}
          </div>
          <h3>내부 점수</h3>
          <div className="teacher-score-grid">
            <span>법적 안정성 <strong>{state.legalStability}</strong></span><span>관계 <strong>{state.relationship}</strong></span>
            <span>매장 신뢰 <strong>{state.storeTrust}</strong></span><span>스트레스 <strong>{state.jihuStress}</strong></span>
            <span>설명 능력 <strong>{state.explanationSkill}</strong></span><span>점장 신뢰 <strong>{state.affinity.ownerTrust}</strong></span>
            <span>수진 신뢰 <strong>{state.affinity.sujinTrust}</strong></span><span>고객 신뢰 <strong>{state.affinity.customerTrust}</strong></span>
            <span>자기 존중 <strong>{state.affinity.jihuSelfRespect}</strong></span>
          </div>
          <h3>플래그</h3>
          <div className="flag-grid">
            {(Object.keys(flagLabels) as (keyof GameFlags)[]).map((key) => <span key={key}>{flagLabels[key]} <strong>{state.flags[key] === null ? "미정" : state.flags[key] ? "예" : "아니오"}</strong></span>)}
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="teacher-section teacher-history">
          {state.choiceHistory.length ? state.choiceHistory.map((choice, index) => (
            <article key={`${choice.sceneId}-${choice.choiceId}`}>
              <span>{String(index + 1).padStart(2, "0")} · {scenes[choice.sceneId]?.title ?? choice.sceneId}</span>
              <h3>{choice.choiceLabel}</h3>
              <em>{teacherChoiceTypeLabels[choice.choiceType]}</em>
              <p>{choice.resultText}</p>
            </article>
          )) : <p className="muted">아직 선택 기록이 없습니다.</p>}
        </div>
      )}

      {tab === "law" && (
        <div className="teacher-section concept-list">
          {teacherLawConcepts.map((concept) => (
            <article key={concept.name}><span>{concept.scene}</span><h3>{concept.name}</h3><p>{concept.point.summary}</p><blockquote>{concept.point.reflectionQuestion}</blockquote></article>
          ))}
        </div>
      )}

      {tab === "discussion" && (
        <div className="teacher-section discussion-list">
          <ol>{(ending?.discussionQuestions ?? teacherDiscussionQuestions).map((question) => <li key={question}>{question}</li>)}</ol>
        </div>
      )}

      <footer className="teacher-actions"><button type="button" onClick={copyResult}>플레이 결과 복사</button>{copyStatus && <span role="status">{copyStatus}</span>}</footer>
    </aside>
  );
}
