import { RotateCcw } from "lucide-react";
import type { GameState } from "../types";
import { selectEnding } from "../data/endings";
import { assetUrl } from "../utils/assetMap";

type Props = {
  state: GameState;
  onReset: () => void;
};

export function EndingScreen({ state, onReset }: Props) {
  const ending = selectEnding(state);

  return (
    <main className="ending-screen">
      <img className="ending-bg" src={assetUrl(ending.mainIllustration)} alt="" />
      <section className="ending-content">
        <p className="ending-subtitle">{ending.subtitle}</p>
        <h1>{ending.title}</h1>
        <p>{ending.body}</p>
        <div className="ending-assets" aria-hidden="true">
          {ending.supportingAssets.map((asset) => (
            <img key={asset} src={assetUrl(asset)} alt="" />
          ))}
        </div>
        <div className="analysis-card">
          <h2>선택 분석</h2>
          <ul>
            {ending.diagnosis.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <dl>
            <div>
              <dt>법적 안정도</dt>
              <dd>{state.legalStability}</dd>
            </div>
            <div>
              <dt>관계 신뢰</dt>
              <dd>{state.relationship}</dd>
            </div>
            <div>
              <dt>가게 신뢰</dt>
              <dd>{state.storeTrust}</dd>
            </div>
            <div>
              <dt>지후의 부담</dt>
              <dd>{state.jihuStress}</dd>
            </div>
          </dl>
        </div>
        <button className="primary-action" onClick={onReset}>
          <RotateCcw size={18} />
          처음부터 다시
        </button>
      </section>
    </main>
  );
}
