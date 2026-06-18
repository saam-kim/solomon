import { useState } from "react";
import { RotateCcw, Printer, Clipboard, Check } from "lucide-react";
import type { GameState } from "../types";
import { selectEnding } from "../data/endings";
import { assetUrl } from "../utils/assetMap";
import { teacherQuestions } from "../data/lawPoints";

type Props = {
  state: GameState;
  onReset: () => void;
  onReflectionChange: (sceneId: string, value: string) => void;
};

export function EndingScreen({ state, onReset, onReflectionChange }: Props) {
  const ending = selectEnding(state);
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyReport = () => {
    const q1Val = state.reflections["q1"] || "미작성";
    const q2Val = state.reflections["q2"] || "미작성";
    const q3Val = state.reflections["q3"] || "미작성";

    let textReport = `==================================================\n`;
    textReport += `  [정치와 법 수행평가] 편의점 솔로몬 학습 성찰 리포트\n`;
    textReport += `==================================================\n\n`;
    textReport += `* 본 결과물은 학생 개인정보(이름, 학번 등)를 수집 및 기록하지 않습니다.\n\n`;
    textReport += `■ 최종 도달 스탯 결과\n`;
    textReport += `- 법적 안전도: ${state.legalStability}%\n`;
    textReport += `- 관계 평판: ${state.relationship}%\n`;
    textReport += `- 알바 잔고: ${state.storeTrust}%\n\n`;
    textReport += `■ 획득 칭호 & 평가 결과\n`;
    textReport += `- [${ending.subtitle}] ${ending.title}\n`;
    textReport += `- ${ending.body}\n\n`;
    
    textReport += `■ 10대 의사결정 추적 테이블 로그\n`;
    state.choiceHistory.forEach((h, i) => {
      textReport += `[${i + 1}단계] ${h.sceneTitle} -> 선택: ${h.label}\n`;
      textReport += `  - 선택/판단 이유: ${h.rationale || '없음'}\n`;
      textReport += `  - 지표 변동: (법률: ${h.legalStability || 0} | 관계: ${h.relationship || 0} | 경제: ${h.storeTrust || 0})\n`;
    });
    textReport += `\n`;

    textReport += `■ 주관식 탐구 에세이 답변\n`;
    textReport += `Q1. 가장 고민스러웠던 법률적 대립 장면과 실제 적용된 실정법 근거:\n`;
    textReport += `-> ${q1Val}\n\n`;
    textReport += `Q2. 호의를 위해 법률적 원칙을 양보할 때 발생할 수 있는 거시적 리스크:\n`;
    textReport += `-> ${q2Val}\n\n`;
    textReport += `Q3. 완벽하게 이기는 법적 분쟁 vs 타협해 내는 민사 합의의 정당성 비교:\n`;
    textReport += `-> ${q3Val}\n\n`;
    textReport += `==================================================\n`;

    navigator.clipboard.writeText(textReport).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }).catch(() => {
      alert("클립보드 복사에 실패했습니다. 수동으로 복사해주세요.");
    });
  };

  return (
    <main className="ending-screen printable-area">
      <img className="ending-bg no-print" src={assetUrl(ending.mainIllustration)} alt="" />
      <section className="ending-content">
        <p className="ending-subtitle no-print">{ending.subtitle}</p>
        <h1 className="ending-title-text">{ending.title}</h1>
        <p className="ending-body-text">{ending.body}</p>
        
        <div className="ending-assets no-print" aria-hidden="true">
          {ending.supportingAssets.map((asset) => (
            <img key={asset} src={assetUrl(asset)} alt="" />
          ))}
        </div>

        {/* STATS HUD */}
        <div className="analysis-card stats-card">
          <h2>최종 결과 지표</h2>
          <dl className="ending-stats-list">
            <div>
              <dt>⚖️ 법적 안전도</dt>
              <dd className="stat-val">{state.legalStability}%</dd>
            </div>
            <div>
              <dt>🤝 관계 평판</dt>
              <dd className="stat-val">{state.relationship}%</dd>
            </div>
            <div>
              <dt>🪙 알바 잔고</dt>
              <dd className="stat-val">{state.storeTrust}%</dd>
            </div>
          </dl>
        </div>

        {/* DECISIONS TABLE LOG */}
        <div className="analysis-card log-card">
          <h2>10대 의사결정 추적 테이블 로그</h2>
          <div className="table-responsive">
            <table className="archive-table">
              <thead>
                <tr>
                  <th>단계</th>
                  <th>시나리오 분류</th>
                  <th>선택 대안</th>
                  <th className="reasoning-header-cell">선택 및 판단 근거 이유</th>
                  <th>변동된 지표</th>
                </tr>
              </thead>
              <tbody>
                {state.choiceHistory.map((h, i) => {
                  const changesText = `⚖️ 법:${h.legalStability && h.legalStability > 0 ? '+' : ''}${h.legalStability || 0} | 🤝 관:${h.relationship && h.relationship > 0 ? '+' : ''}${h.relationship || 0} | 🪙 돈:${h.storeTrust && h.storeTrust > 0 ? '+' : ''}${h.storeTrust || 0}`;
                  const isObjection = h.choiceId === "objection";
                  return (
                    <tr key={h.sceneId}>
                      <td>{i + 1}단계</td>
                      <td style={{ fontWeight: 700 }}>{h.sceneTitle}</td>
                      <td>
                        <span className={`dialogue-tag ${isObjection ? 'contradict' : 'law'}`}>
                          {h.label}
                        </span>
                      </td>
                      <td className="reasoning-cell">{h.rationale || "기록 없음"}</td>
                      <td className="changes-cell">{changesText}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SUBJECTIVE ESSAYS */}
        <div className="analysis-card essay-card">
          <h2>수행평가 주관식 탐구 에세이</h2>
          <div className="essay-list">
            <div className="essay-item">
              <label htmlFor="q1">{teacherQuestions[0]}</label>
              <textarea
                id="q1"
                placeholder="답변 힌트: 미성년자 담배 판매 거절(청소년보호법 제28조), 근로계약서 서면 교부(근로기준법 제17조), 제한능력자 단독 거래(민법 제5조 취소권) 등 관련 법률 근거를 활용하여 서술해 보세요."
                value={state.reflections["q1"] || ""}
                onChange={(e) => onReflectionChange("q1", e.target.value)}
                rows={3}
              />
            </div>
            <div className="essay-item">
              <label htmlFor="q2">{teacherQuestions[1]}</label>
              <textarea
                id="q2"
                placeholder="답변 힌트: 개인의 호의가 타인에게 미치는 위생상 민원, 미성년자 판매 단속 시의 과태료 및 영업정지, 계약 무효화로 인한 가맹점 재정 손실 등 거시적 사회/경제적 리스크를 고려해 서술해 보세요."
                value={state.reflections["q2"] || ""}
                onChange={(e) => onReflectionChange("q2", e.target.value)}
                rows={3}
              />
            </div>
            <div className="essay-item">
              <label htmlFor="q3">{teacherQuestions[2]}</label>
              <textarea
                id="q3"
                placeholder="답변 힌트: 소송을 통한 권리 구제의 한계(시간, 비용, 감정 소모)와 민법 제731조에 규정된 '화해(민사 합의)'의 장단점을 갈등 조율 관점에서 비교 서술해 보세요."
                value={state.reflections["q3"] || ""}
                onChange={(e) => onReflectionChange("q3", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="ending-actions no-print">
          <button className="secondary-action" onClick={handlePrint}>
            <Printer size={18} />
            성찰지 인쇄하기
          </button>
          <button className="secondary-action" onClick={handleCopyReport}>
            {copied ? <Check size={18} /> : <Clipboard size={18} />}
            {copied ? "복사 완료!" : "결과 리포트 복사"}
          </button>
          <button className="primary-action" onClick={onReset}>
            <RotateCcw size={18} />
            처음부터 다시
          </button>
        </div>
      </section>

      {/* Copy Toast Notification */}
      {copied && (
        <div className="toast-msg show">
          성찰 리포트가 클립보드에 복사되었습니다!
        </div>
      )}
    </main>
  );
}
