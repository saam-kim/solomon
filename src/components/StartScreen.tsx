import { useState, useEffect } from "react";
import { Scale, Play, RotateCcw } from "lucide-react";
import { assetUrl } from "../utils/assetMap";

type Props = {
  onStart: () => void;
  onContinue: () => void;
};

export function StartScreen({ onStart, onContinue }: Props) {
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    setHasSave(localStorage.getItem("convenience-solomon-save") !== null);
  }, []);

  return (
    <div className="start-screen-container">
      {/* Background illustration with blur */}
      <div 
        className="start-screen-bg"
        style={{ backgroundImage: `url('${assetUrl("61_BG_StoreExterior_ClosingCrisis.png")}')` }}
      />
      
      <div className="start-screen-overlay" />

      <div className="start-screen-content">
        <header className="start-header">
          <div className="start-title-logo">
            <Scale size={42} className="logo-icon" />
            <span className="logo-text">편의점 솔로몬</span>
          </div>
          <p className="start-subtitle">생활밀착형 법률 교육 시뮬레이션</p>
        </header>

        <main className="start-menu-box">
          <h2 className="start-menu-title">법률과 인간성 사이, 당신의 선택은?</h2>
          <p className="start-menu-desc">
            폐점 위기의 편의점에서 첫 근무를 시작하게 된 알바생 '지후'.
            <br />
            매장을 찾은 각양각색의 손님들, 그리고 깐깐한 규정 사이에서 
            <br />
            조항 속 딱딱한 문장이 아닌 사람을 위한 '선의 기준'을 찾아내야 합니다.
          </p>

          <div className="start-buttons">
            <button className="start-btn primary" onClick={onStart}>
              <Play size={20} />
              <span>새로운 근무 시작 (처음부터)</span>
            </button>
            {hasSave && (
              <button className="start-btn secondary" onClick={onContinue}>
                <RotateCcw size={20} />
                <span>근무 이어하기 (불러오기)</span>
              </button>
            )}
          </div>
        </main>

        <footer className="start-footer">
          <p>© 2026 Convenience Store Solomon. All rights reserved.</p>
          <p>근로기준법 · 민법 · 청소년보호법 · 식품위생법 교육 콘텐츠</p>
        </footer>
      </div>
    </div>
  );
}
