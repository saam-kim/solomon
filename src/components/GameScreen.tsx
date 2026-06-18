import { useEffect, useState } from "react";
import { Scale, ChevronLeft, ChevronRight, Lightbulb, AlertTriangle, RefreshCw } from "lucide-react";
import { lawPoints } from "../data/lawPoints";
import { useGameState, validateReasoningText } from "../hooks/useGameState";
import { assetUrl } from "../utils/assetMap";
import { BackgroundLayer } from "./BackgroundLayer";
import { CharacterLayer } from "./CharacterLayer";
import { ChoicePanel } from "./ChoicePanel";
import { DialogueBox } from "./DialogueBox";
import { EndingScreen } from "./EndingScreen";
import { LawbookModal } from "./LawbookModal";
import { PropLayer } from "./PropLayer";
import { SaveLoadPanel } from "./SaveLoadPanel";
import { StatusPanel } from "./StatusPanel";

const SCENE_TEACHING_GUIDES: Record<string, { tip: string; hint?: string }> = {
  first_shift: {
    tip: "첫출근인 만큼 매장 분위기와 점장님과의 관계(호감도/평판)를 우선시할지, 아니면 업무적인 신뢰감을 우선시할지 본인의 예절 기준을 토대로 서술해 보세요.",
  },
  contract: {
    tip: "근로기준법 제17조에 명시된 근로계약서 작성 시기(근무 시작 전 서면 작성)와 이를 어길 시 사업주에게 부과되는 벌칙을 언급하여 서술해 보세요.",
    hint: "점장님의 두 번째 진술('한 달 정도 일해보고 계약서를 다음 달에 쓰자')에 주목하십시오. 근로기준법 제17조는 근로 시작 전에 근로계약서를 서면으로 교부하도록 규정하고 있습니다."
  },
  limited_bread: {
    tip: "단골과의 관계 유지(호의)를 위한 예외 행동과 공평무사한 진열 규칙 준수 중 어떤 가치가 편의점 운영의 장기적 신뢰도에 기여하는지 비교해 보세요.",
  },
  id_photo: {
    tip: "청소년보호법 제28조에서 규정한 신분증 확인 의무와 스마트폰 사진의 법적 효력 유무(실물 신분증 및 공인 모바일 신분증만 허용)를 바탕으로 거절 사유를 서술해 보세요.",
    hint: "수상한 청소년의 두 번째 진술('폰에 찍어둔 신분증 사진으로 확인해 달라')에 주목하십시오. 청소년보호법상 모바일 사진이나 이미지는 법적 효력이 있는 인증 수단이 아닙니다."
  },
  disposal_food: {
    tip: "식품위생법 및 매장 청결 수칙상 유통기한이 지난 식품의 임의 취식 금지 원칙과, 정직한 태도가 점장님과의 신뢰 관계에 미치는 영향을 서술해 보세요.",
  },
  minor_contract: {
    tip: "민법 제5조에 따른 미성년자(제한능력자) 법률행위의 취소권 법리와, 부모 동의 없는 고가 거래(닌텐도 결제)를 그대로 진행했을 때 매장이 감당해야 할 환불 리스크를 서술해 보세요.",
    hint: "초등학생의 두 번째 진술('부모님 신용카드인데 그냥 결제해 달라')에 주목하십시오. 민법 제5조에 따라 미성년자의 고가 거래는 부모가 취소할 수 있으며, 취소 시 매장에 손실이 발생합니다."
  },
  spilled_milk: {
    tip: "매장 내 미끄러운 바닥 방치로 인한 안전사고 리스크(영업 책임)와 결제 대기 고객들의 대기 시간 단축 중 어떤 것이 우선적인 법적/안전 의무인지 서술해 보세요.",
  },
  fall_accident: {
    tip: "민법 제750조 불법행위 책임의 성립 요건과, 바닥 상태를 살피지 않고 넘어진 손님의 부주의 과실(과실상계 원칙)이 배상 범위에 어떻게 참작되어야 하는지 서술해 보세요.",
    hint: "회사원의 두 번째 진술('치료비와 양복값 100만 원 전액을 당장 현금으로 지급하라')에 주목하십시오. 민법 제750조에 따른 불법행위 배상 책임에는 피해자의 과실도 참작하는 과실상계 원칙이 적용됩니다."
  },
  rainy_cat: {
    tip: "감성적인 동물 보호(호의)가 편의점 위생 관리(식품위생법 제36조) 및 이웃 주민들의 민원 발생에 미칠 수 있는 장단점과 영업적 영향을 균형 있게 서술해 보세요.",
  },
  payday: {
    tip: "근로기준법 제43조 임금 전액 지급 원칙에 따라 사용자가 손해배상을 핑계로 노동자의 동의 없이 임금을 일방적으로 공제(삭감)하여 지급하는 행위의 위법성을 서술해 보세요.",
    hint: "점장님의 두 번째 진술('손님 사고 처리비 10만 원을 월급에서 미리 공제하고 보냈다')에 주목하십시오. 근로기준법 제43조에 따라 임금은 전액을 통화로 지급해야 하며 일방적 공제는 위법입니다."
  }
};

export function GameScreen() {
  const game = useGameState();
  const { state, scene, currentLine, canShowChoices, choices } = game;

  // Local state for modals and textareas
  const [isLawbookOpen, setIsLawbookOpen] = useState(false);
  const [reasoningText, setReasoningText] = useState("");
  const [reasoningError, setReasoningError] = useState("");

  // Handle objection speech bubble timer
  useEffect(() => {
    if (state.objectionActive) {
      const timer = setTimeout(() => {
        game.turnOffObjection();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [state.objectionActive, game]);

  // Sync validation error when typing reasoning
  useEffect(() => {
    if (state.isReasoningModalOpen) {
      const valResult = validateReasoningText(reasoningText);
      if (valResult.valid) {
        setReasoningError("");
      } else {
        setReasoningError(valResult.msg);
      }
    }
  }, [reasoningText, state.isReasoningModalOpen]);

  // Clear reasoning text when modal opens
  useEffect(() => {
    if (state.isReasoningModalOpen) {
      setReasoningText("");
      setReasoningError("최소 10자 이상 작성해야 합니다.");
    }
  }, [state.isReasoningModalOpen]);

  // Keyboard shortcut Space key mapping
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        // Advance only in normal dialogue states
        if (
          !canShowChoices &&
          !state.isReasoningModalOpen &&
          !state.isFeedbackModalOpen &&
          !state.isRecoveryModalOpen &&
          (scene.type !== "testimony" || state.testimonyShowingSuccess)
        ) {
          game.advance();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canShowChoices, scene.type, state.testimonyShowingSuccess, state.isReasoningModalOpen, state.isFeedbackModalOpen, state.isRecoveryModalOpen, game]);

  if (state.currentSceneId === "ending") {
    return <EndingScreen state={state} onReset={game.reset} onReflectionChange={game.setReflection} />;
  }

  const guide = SCENE_TEACHING_GUIDES[scene.id];

  const handleShowHint = () => {
    if (guide && guide.hint) {
      alert(`💡 [지후의 생각 힌트]\n\n${guide.hint}`);
    } else {
      alert("이 장면에는 힌트가 없습니다.");
    }
  };

  const handleOpenObjectionLawbook = () => {
    setIsLawbookOpen(true);
  };

  const handleReasoningSubmit = () => {
    const valResult = validateReasoningText(reasoningText);
    if (valResult.valid) {
      game.submitReasoning(reasoningText);
    }
  };

  const isTestimonyScene = scene.type === "testimony";
  const showNavAndHint = isTestimonyScene && !state.testimonyShowingSuccess;

  return (
    <main className="game-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">편의점 솔로몬</p>
          <h1>{scene.title}</h1>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button className="icon-button labeled" onClick={() => setIsLawbookOpen(true)}>
            <Scale size={18} />
            <span>법전 도감</span>
          </button>
          <SaveLoadPanel onSave={game.save} onLoad={game.load} onReset={game.reset} />
        </div>
      </header>

      <section className={`stage ${state.objectionActive ? "screen-shake flash-red" : ""}`} aria-label="게임 장면" id="game-stage">
        {/* EVENT ILLUSTRATION */}
        {scene.mainIllustration && (
          <div 
            className={`event-cg-layer ${scene.mainIllustration ? "active" : ""}`}
            style={{ backgroundImage: `url('${assetUrl(scene.mainIllustration)}')` }}
          />
        )}

        <BackgroundLayer background={scene.background} mainIllustration={scene.mainIllustration} dim={currentLine?.dim} />
        <CharacterLayer characters={scene.characters} line={currentLine} mainIllustration={scene.mainIllustration} />
        <PropLayer props={scene.props} line={currentLine} />

        {/* STATUS HUD */}
        <div className="status-hud no-print">
          <div className="stat-row">
            <span className="stat-label">⚖️ 법적 안전</span>
            <div className="stat-bar-container">
              <div className="stat-bar law" style={{ width: `${state.legalStability}%` }}></div>
            </div>
            <span className="stat-value">{state.legalStability}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">🤝 관계 평판</span>
            <div className="stat-bar-container">
              <div className="stat-bar relation" style={{ width: `${state.relationship}%` }}></div>
            </div>
            <span className="stat-value">{state.relationship}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">🪙 알바 잔고</span>
            <div className="stat-bar-container">
              <div className="stat-bar profit" style={{ width: `${state.storeTrust}%` }}></div>
            </div>
            <span className="stat-value">{state.storeTrust}%</span>
          </div>
        </div>

        {/* SCENE INDICATOR */}
        <div className="scene-indicator no-print">
          {scene.id === "intro" ? "SCENE 00 / 10" : `SCENE ${String(scenes.findIndex(s => s.id === scene.id)).padStart(2, "0")} / 10`}
        </div>

        {/* TESTIMONY HUD BANNER */}
        {showNavAndHint && (
          <div className="testimony-hud-banner active">
            <div className="testimony-hud-text">
              <AlertTriangle className="alert-icon animate-pulse" size={16} />
              상대방의 모순된 주장 단계에서 <strong>[⚖️ 법령 제시]</strong>를 열어 알맞은 조항을 제시하십시오!
            </div>
          </div>
        )}

        {/* OBJECTION FLASH OVERLAY */}
        {state.objectionActive && (
          <div className="objection-overlay active">
            <div className="objection-bubble">이의 있습니다!</div>
          </div>
        )}

        {/* CHOICES OR DIALOGUE */}
        {canShowChoices && (
          <ChoicePanel
            choices={choices}
            reflectionPrompt={guide?.tip || "이 선택을 한 합리적인 이유를 적어주세요."}
            reflectionValue={state.reflections[scene.id] ?? ""}
            onReflectionChange={(value) => game.setReflection(scene.id, value)}
            onChoose={(choice) => game.openReasoningModal("choice", choice.id)}
          />
        )}
        {!canShowChoices && (
          <div className="dialogue-box-container">
            {/* Testimony Navigation Row */}
            {showNavAndHint && (
              <div className="testimony-controls" id="testimony-controls">
                <div className="testimony-nav">
                  <button className="testimony-nav-btn" onClick={game.prevStatement}>
                    <ChevronLeft size={16} />
                    <span>이전 진술</span>
                  </button>
                  <button className="hint-btn" onClick={handleShowHint}>
                    <Lightbulb size={16} />
                    <span>💡 힌트</span>
                  </button>
                  <button className="testimony-nav-btn" onClick={game.nextStatement}>
                    <span>다음 진술</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
                <button className="objection-btn" onClick={handleOpenObjectionLawbook}>
                  <Scale size={16} />
                  <span>⚖️ 법령 제시하기</span>
                </button>
              </div>
            )}

            <DialogueBox
              line={currentLine}
              onAdvance={game.advance}
              textScale={state.textScale}
              quickMode={state.quickMode}
              isTestimony={isTestimonyScene && !state.testimonyShowingSuccess}
              currentTestimonyIdx={state.currentTestimonyIdx}
              testimonyLength={scene.testimony?.length || 0}
            />
          </div>
        )}
      </section>

      <div className="lower-panels">
        <StatusPanel
          state={state}
          scene={scene}
          lines={game.lines}
          onTextScale={game.setTextScale}
          onQuickMode={game.toggleQuickMode}
          onMuted={game.toggleMuted}
        />
      </div>

      {/* LAWBOOK MODAL */}
      <LawbookModal
        isOpen={isLawbookOpen}
        onClose={() => setIsLawbookOpen(false)}
        unlockedLaws={state.unlockedLaws}
        isTestimonyScene={showNavAndHint}
        onPresentLaw={game.presentLaw}
      />

      {/* DECISION REASONING MODAL */}
      {state.isReasoningModalOpen && (
        <div className="modal-backdrop active" onClick={game.closeReasoningModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>
                <Scale size={20} className="header-icon" />
                {state.reasoningMode === "objection" ? "이의제기 성공! 법적 근거 기술" : "선택한 이유 작성"}
              </h2>
            </header>
            <div className="modal-body">
              <p className="reasoning-prompt-text">
                {state.reasoningMode === "objection"
                  ? "상대방의 모순을 올바르게 지적했습니다! 왜 이 법령이 해당 진술과 모순되는지 법리적 근거를 설명해 주세요."
                  : "이 선택 대안을 골라 대처한 논리와 일상적/도덕적 근거를 설명해 주세요."}
              </p>
              
              <div className="reasoning-target-display">
                {state.reasoningMode === "objection"
                  ? `제시한 법령: ${lawPoints.find(l => l.id === state.reasoningChoiceId)?.title}`
                  : `선택한 대안: ${scene.choices?.find(c => c.id === state.reasoningChoiceId)?.label}`}
              </div>

              {/* Dynamic Pedagogical Tip */}
              <div className="reasoning-tip-box">
                <span className="tip-title">💡 길잡이 힌트:</span>
                <p className="tip-content">{guide?.tip || "이 선택을 한 이유를 논리적으로 적어주세요."}</p>
              </div>

              <textarea
                value={reasoningText}
                onChange={(e) => setReasoningText(e.target.value)}
                placeholder="답변을 입력하십시오. (최소 10자 이상, 단순 문자 반복은 입력이 차단됩니다.)"
                rows={4}
                className="reasoning-textarea"
                autoFocus
              />

              {reasoningError && (
                <div className="reasoning-error-msg" style={{ display: "block" }}>
                  {reasoningError}
                </div>
              )}

              <div className="reasoning-char-count">
                {reasoningText.trim().length} / 10자
              </div>
            </div>
            <footer className="modal-footer">
              <button className="secondary-action" onClick={game.closeReasoningModal}>취소</button>
              <button 
                className="primary-action" 
                disabled={!!reasoningError || reasoningText.trim().length < 10}
                onClick={handleReasoningSubmit}
              >
                확인
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* FEEDBACK RESULT REPORT MODAL */}
      {state.isFeedbackModalOpen && (
        <div className="modal-backdrop active" onClick={game.closeFeedbackModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>⚖️ 결과 보고서 - Scene {scenes.findIndex(s => s.id === scene.id)}</h2>
            </header>
            <div className="modal-body">
              <p className="feedback-body-text">{state.feedbackBody}</p>
              
              <div className="feedback-stat-changes">
                <span className={`stat-change-item ${state.feedbackLawDelta > 0 ? 'up' : state.feedbackLawDelta < 0 ? 'down' : 'zero'}`}>
                  ⚖️ 법적 안전 {state.feedbackLawDelta > 0 ? `+${state.feedbackLawDelta}%` : state.feedbackLawDelta < 0 ? `${state.feedbackLawDelta}%` : "변동없음"}
                </span>
                <span className={`stat-change-item ${state.feedbackRelationDelta > 0 ? 'up' : state.feedbackRelationDelta < 0 ? 'down' : 'zero'}`}>
                  🤝 관계 평판 {state.feedbackRelationDelta > 0 ? `+${state.feedbackRelationDelta}%` : state.feedbackRelationDelta < 0 ? `${state.feedbackRelationDelta}%` : "변동없음"}
                </span>
                <span className={`stat-change-item ${state.feedbackTrustDelta > 0 ? 'up' : state.feedbackTrustDelta < 0 ? 'down' : 'zero'}`}>
                  🪙 알바 잔고 {state.feedbackTrustDelta > 0 ? `+${state.feedbackTrustDelta}%` : state.feedbackTrustDelta < 0 ? `${state.feedbackTrustDelta}%` : "변동없음"}
                </span>
              </div>
            </div>
            <footer className="modal-footer">
              <button className="primary-action" onClick={game.closeFeedbackModal}>확인</button>
            </footer>
          </div>
        </div>
      )}

      {/* RECOVERY MODAL (BAD ENDING RETRY) */}
      {state.isRecoveryModalOpen && (
        <div className="modal-backdrop active">
          <div className="modal-content recovery" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>❌ 시뮬레이션 중단 (신뢰도 파탄)</h2>
            </header>
            <div className="modal-body" style={{ textAlign: "center" }}>
              <h3 id="recovery-law-title" style={{ color: "#dc2626", fontSize: "1.2rem", marginBottom: "12px" }}>
                {lawPoints.find(l => l.id === state.recoveryLawId)?.title}
              </h3>
              
              <p id="recovery-desc" style={{ fontSize: "0.95rem", lineHeight: "1.5", color: "#374151", marginBottom: "20px" }}>
                <strong>결과 피드백:</strong> {state.recoveryFeedback}
                <br /><br />
                <strong>법적 원칙:</strong> {lawPoints.find(l => l.id === state.recoveryLawId)?.desc}
                <br />
                <em>({lawPoints.find(l => l.id === state.recoveryLawId)?.penalty})</em>
              </p>

              <div id="recovery-char-svg" className="recovery-avatar">
                {/* Fallback visual indicator for retry avatar */}
                <AlertTriangle size={64} style={{ color: "#dc2626", margin: "0 auto" }} />
              </div>
            </div>
            <footer className="modal-footer" style={{ justifyContent: "center" }}>
              <button className="primary-action" onClick={game.retryScene}>
                <RefreshCw size={16} />
                다시 시도하기
              </button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
